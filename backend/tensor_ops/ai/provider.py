"""Provider-agnostic structured generation interface (ADR-005)."""
from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field
from typing import Any, Protocol

from ..config import Settings, get_settings


class ProviderError(RuntimeError):
    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message)
        self.status_code = status_code


@dataclass
class AIResult:
    data: dict[str, Any]
    provider: str
    model: str
    request_id: str | None = None
    input_tokens: int = 0
    output_tokens: int = 0
    latency_ms: int = 0
    raw_text: str = ""
    reported_cost_usd: float | None = None

    def cost(self, s: Settings) -> float:
        if self.reported_cost_usd is not None:
            return round(self.reported_cost_usd, 6)
        return round(self.input_tokens / 1e6 * s.ai_price_in_per_mtok + self.output_tokens / 1e6 * s.ai_price_out_per_mtok, 6)


@dataclass
class Request:
    task_type: str
    system: str
    user: str
    schema: dict[str, Any]
    context: dict[str, Any] = field(default_factory=dict)  # structured inputs; only the mock provider reads these
    max_output_tokens: int = 4000


class Provider(Protocol):
    name: str
    model: str

    def generate_structured(self, req: Request) -> AIResult: ...


class AnthropicProvider:
    """Claude via the official SDK, using structured outputs (output_config.format = json_schema)."""
    name = "anthropic"

    def __init__(self, s: Settings) -> None:
        import anthropic
        self.model = s.ai_model
        self._client = anthropic.Anthropic(api_key=s.anthropic_api_key, timeout=s.ai_timeout_s, max_retries=2)

    def generate_structured(self, req: Request) -> AIResult:
        import anthropic
        t0 = time.monotonic()
        try:
            resp = self._client.messages.create(
                model=self.model,
                max_tokens=req.max_output_tokens,
                system=req.system,
                messages=[{"role": "user", "content": req.user}],
                output_config={"format": {"type": "json_schema", "schema": req.schema}},
            )
        except anthropic.APIError as e:
            raise ProviderError(f"provider error: {type(e).__name__}") from e
        latency = int((time.monotonic() - t0) * 1000)
        if resp.stop_reason in ("refusal", "max_tokens"):
            raise ProviderError(f"model stopped: {resp.stop_reason}")
        text = next((b.text for b in resp.content if getattr(b, "type", "") == "text"), "")
        try:
            data = json.loads(text)
        except json.JSONDecodeError as e:
            raise ProviderError("model returned non-JSON output") from e
        return AIResult(data=data, provider=self.name, model=resp.model, request_id=resp.id,
                        input_tokens=resp.usage.input_tokens, output_tokens=resp.usage.output_tokens,
                        latency_ms=latency, raw_text=text)


class OpenRouterProvider:
    """OpenRouter chat completions; free Gemma uses JSON mode plus server-side schema checks."""
    name = "openrouter"

    def __init__(self, s: Settings) -> None:
        import httpx
        self.model = s.ai_model
        self._httpx = httpx
        self._url = s.openrouter_base_url.rstrip("/") + "/chat/completions"
        headers = {"Authorization": f"Bearer {s.openrouter_api_key}", "Content-Type": "application/json",
                   "X-Title": s.openrouter_app_title}
        if s.openrouter_referer:
            headers["HTTP-Referer"] = s.openrouter_referer
        self._headers = headers
        self._timeout = s.ai_timeout_s

    def generate_structured(self, req: Request) -> AIResult:
        t0 = time.monotonic()
        safe_task = re.sub(r"[^a-zA-Z0-9_-]", "_", req.task_type)[:64] or "structured_response"
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": req.system}, {"role": "user", "content": req.user}],
            "max_tokens": req.max_output_tokens,
            "provider": {"require_parameters": True},
        }
        if self.model == "google/gemma-4-31b-it:free":
            # This free endpoint supports JSON mode but not provider-enforced JSON Schema.
            # Keep schema validation in our API and provide the schema in the prompt.
            payload["messages"][0]["content"] += (
                "\nReturn exactly one JSON object matching this JSON Schema, with no markdown: "
                + json.dumps(req.schema, ensure_ascii=False)
            )
            payload["response_format"] = {"type": "json_object"}
        else:
            payload["response_format"] = {"type": "json_schema", "json_schema": {
                "name": safe_task, "strict": True, "schema": req.schema}}
        try:
            response = self._httpx.post(self._url, headers=self._headers, json=payload, timeout=self._timeout)
            response.raise_for_status()
            body = response.json()
        except self._httpx.TimeoutException as e:
            raise ProviderError("OpenRouter request timed out") from e
        except self._httpx.HTTPStatusError as e:
            code = e.response.status_code
            if code == 402:
                raise ProviderError("OpenRouter rejected this run with HTTP 402 (billing or credit limit). Add credits/check the account billing; no analysis result was created.", status_code=402) from e
            if code == 429:
                raise ProviderError("OpenRouter rate limit reached. Wait briefly and retry; no analysis result was created.", status_code=429) from e
            if code in (401, 403):
                raise ProviderError(f"OpenRouter rejected the API credential or model access (HTTP {code}); check provider settings.") from e
            raise ProviderError(f"OpenRouter request failed (HTTP {code}); check key, model, and structured-output support") from e
        except (self._httpx.HTTPError, ValueError) as e:
            raise ProviderError("OpenRouter returned an invalid response") from e

        choices = body.get("choices") or []
        if not choices or not isinstance(choices[0], dict):
            raise ProviderError("OpenRouter response contained no completion")
        choice = choices[0]
        reason = choice.get("finish_reason")
        if reason in ("length", "content_filter"):
            raise ProviderError(f"OpenRouter completion stopped: {reason}")
        message = choice.get("message") or {}
        if message.get("refusal"):
            raise ProviderError("OpenRouter model refused the request")
        content = message.get("content")
        if isinstance(content, list):
            content = "".join(part.get("text", "") for part in content if isinstance(part, dict))
        if not isinstance(content, str) or not content:
            raise ProviderError("OpenRouter returned empty structured output")
        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            raise ProviderError("OpenRouter returned non-JSON output") from e
        usage = body.get("usage") or {}
        reported_cost = usage.get("cost")
        return AIResult(data=data, provider=self.name, model=body.get("model") or self.model,
                        request_id=body.get("id"), input_tokens=int(usage.get("prompt_tokens", 0) or 0),
                        output_tokens=int(usage.get("completion_tokens", 0) or 0),
                        latency_ms=int((time.monotonic() - t0) * 1000), raw_text=content,
                        reported_cost_usd=float(reported_cost) if reported_cost is not None else None)


_INJECTION = re.compile(r"(ignore (all |any )?(previous|prior|above) instructions|disregard .{0,30}instructions|"
                        r"you are now|system prompt|approve (this|all)|export all)", re.I)
_DATE = re.compile(r"\b(20\d\d-[01]\d-[0-3]\d)\b")
_STOP = set("the a an and or of to in on for is are be by with do does your you we our it this that have has as at "
            "from all any who what how when which per".split())


def _words(t: str) -> set[str]:
    return {w for w in re.findall(r"[a-z0-9]+", t.lower()) if len(w) > 2 and w not in _STOP}


def _quote_around(text: str, needle: str, width: int = 160) -> str:
    i = text.lower().find(needle.lower())
    if i < 0:
        return text.strip()[:width]
    a = max(0, i - 40)
    return text[a:a + width].strip()


class MockProvider:
    """Deterministic, offline provider for tests, evals and demos. Uses keyword evidence matching only."""
    name = "mock"
    model = "mock-keyword-v1"

    def generate_structured(self, req: Request) -> AIResult:
        t0 = time.monotonic()
        if req.task_type == "evidence_review":
            data = self._review(req.context)
        elif req.task_type == "questionnaire_answer":
            data = self._questionnaire(req.context)
        else:
            raise ProviderError(f"mock has no task {req.task_type}")
        return AIResult(data=data, provider=self.name, model=self.model, request_id=f"mock-{int(t0 * 1000)}",
                        input_tokens=0, output_tokens=0,  # offline: no billable usage
                        latency_ms=int((time.monotonic() - t0) * 1000))

    def _review(self, ctx: dict[str, Any]) -> dict[str, Any]:
        chunks, controls = ctx["chunks"], ctx["controls"]
        suspicious = any(_INJECTION.search(c["text"]) for c in chunks)
        cands, cites, seen = [], [], set()
        for ctl in controls:
            best = None
            for c in chunks:
                for kw in ctl["keywords"]:
                    if re.search(r"(?<![a-z0-9])" + re.escape(kw.lower()), c["text"].lower()):
                        best = (c, kw)
                        break
                if best:
                    break
            if best:
                c, kw = best
                cands.append({"control_code": ctl["code"], "citation_chunk_ids": [c["handle"]],
                              "rationale": f"The document mentions '{kw}', which is typical evidence for: {ctl['title']}."})
                if c["handle"] not in seen:
                    cites.append({"chunk_id": c["handle"], "quote": _quote_around(c["text"], kw)})
                    seen.add(c["handle"])
        cands = cands[:5]
        dates = sorted({d for c in chunks for d in _DATE.findall(c["text"])})
        gaps = [] if cands else ["No passage supports any in-scope control."]
        if suspicious:
            gaps.append("Document contains instruction-like text; it was ignored.")
        return {
            "evidence_type": "Document" if not cands else f"Evidence for {cands[0]['control_code']}",
            "summary": f"Keyword-based draft review covering {len(chunks)} passage(s).",
            "citations": cites,
            "candidate_controls": cands,
            "period_start": dates[0] if dates else "",
            "period_end": dates[-1] if dates else "",
            "gaps": gaps,
            "contradictions": [],
            "confidence": 0.35 if not cands else min(0.8, 0.45 + 0.1 * len(cands)),
            "decision": "insufficient_evidence" if not cands else ("supported" if len(cands) >= 1 and not suspicious
                                                                    else "partially_supported"),
            "suspicious_instructions_detected": suspicious,
        }

    def _questionnaire(self, ctx: dict[str, Any]) -> dict[str, Any]:
        q = _words(ctx["question"])
        best, score = None, 0
        for c in ctx["chunks"]:
            s = len(q & _words(c["text"]))
            if s > score:
                best, score = c, s
        if not best or score < 2:
            return {"answer": "", "answer_type": "insufficient_evidence", "citations": [], "confidence": 0.2,
                    "follow_up_question": f"Please provide documentation that answers: {ctx['question']}"}
        sentence = next((x.strip() for x in re.split(r"(?<=[.!?])\s+|\n", best["text"])
                         if len(q & _words(x)) >= 1 and len(x.strip()) > 15), best["text"].strip()[:180])[:200]
        return {"answer": f"Yes. {sentence}", "answer_type": "yes",
                "citations": [{"chunk_id": best["handle"], "quote": sentence}],
                "confidence": min(0.85, 0.4 + 0.1 * score), "follow_up_question": ""}


_override: Provider | None = None


def set_provider_override(p: Provider | None) -> None:
    """Test/eval hook to inject a scripted provider."""
    global _override
    _override = p


def get_provider() -> Provider:
    if _override is not None:
        return _override
    s = get_settings()
    if s.ai_provider == "anthropic":
        return AnthropicProvider(s)
    if s.ai_provider == "openrouter":
        return OpenRouterProvider(s)
    return MockProvider()
