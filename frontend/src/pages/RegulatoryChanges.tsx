import { useMemo, useState } from "react";
import dataset from "../data/nistRegulatoryData.json";
import "./regulatory-changes.css";

type Citation = { kind: "regulation" | "policy"; source_id: string; quote: string };
type Analysis = {
  impact_status: "evidence_found" | "evidence_missing" | "conflict" | "needs_human_review";
  rationale: string;
  draft_policy_update: string;
  remediation_task: string;
  bangla_summary: string;
  confidence: number;
  needs_human_review: boolean;
  citations: Citation[];
};
type ModelRun = { provider: string; model: string; request_id: string | null; input_tokens: number; output_tokens: number; cost_usd: number | null; latency_ms: number };
type AnalyzeResponse = { result: Analysis; run: ModelRun; source: { framework: string; version: string; requirement_id: string; row_id: string } };

const eligibleTransitions = dataset.transitions.filter((row) => row.newId && row.newText);
const initialChange = eligibleTransitions.find((row) => row.oldId === "PR.AC-1" && row.newId === "PR.AA-01") ?? eligibleTransitions[0];
const samplePolicy = "Access to company systems is granted to named employees. Managers review employee access every quarter.";
const impactLabels: Record<Analysis["impact_status"], string> = {
  evidence_found: "Evidence found", evidence_missing: "Evidence missing", conflict: "Potential conflict", needs_human_review: "Needs human review",
};

export default function RegulatoryChanges() {
  const [selectedId, setSelectedId] = useState(initialChange.rowId);
  const [policy, setPolicy] = useState(samplePolicy);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selected = useMemo(() => eligibleTransitions.find((row) => row.rowId === selectedId) ?? initialChange, [selectedId]);

  async function analyze() {
    setBusy(true); setError(null); setResult(null);
    try {
      const response = await fetch("/api/regulatory/analyze", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ row_id: selected.rowId, policy_text: policy }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || `Request failed (${response.status})`);
      setResult(payload as AnalyzeResponse);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The AI request failed. No result was generated.");
    } finally { setBusy(false); }
  }

  return <div className="regdelta-workbench">
    <header className="rd-hero-header">
      <div><div className="rd-eyebrow">REGDELTA · REGULATORY CHANGE REVIEW</div><h1>Review a framework change</h1>
        <p>Compare one NIST change with a sample policy, then ask OpenRouter for a cited draft action plan.</p></div>
      <div className="rd-hero-badges"><span className="rd-chip"><i className="rd-dot green" />SAMPLE PUBLIC DATA</span><span className="rd-chip"><i className="rd-dot amber" />REAL MODEL CALL ON SUBMIT</span></div>
    </header>

    <section className="rd-hero-input card">
      <div className="rd-hero-input-head"><div><span className="rd-kicker">STEP 1 · SELECT A PUBLIC REQUIREMENT CHANGE</span><h2>NIST CSF 1.1 → CSF 2.0</h2></div><span className="rd-sample-label">SAMPLE PUBLIC DATA</span></div>
      <div className="rd-hero-form-grid">
        <label className="rd-field"><span>Transition example</span><select value={selectedId} onChange={(event) => { setSelectedId(event.target.value); setResult(null); }}>
          {eligibleTransitions.map((row) => <option key={row.rowId} value={row.rowId}>{row.oldId || "New"} → {row.newId} · {row.type}</option>)}
        </select></label>
        <div className="rd-regulation-quote"><span className="rd-kicker">NIST CSF 2.0 · {selected.newId || "New requirement"}</span><p>{selected.newText || "No current-version text in this crosswalk row."}</p>
          <small>CSF 1.1 {selected.oldId || "—"} → CSF 2.0 {selected.newId || "—"} · {selected.type}</small></div>
      </div>
      <label className="rd-field rd-policy-input"><span>Client policy text <b className="rd-sample-label">SYNTHETIC SAMPLE · NOT REAL CLIENT DATA</b></span>
        <textarea value={policy} onChange={(event) => { setPolicy(event.target.value); setResult(null); }} maxLength={8000} rows={4} />
      </label>
      <div className="rd-submit-row"><span>Only selected NIST data and this policy text are sent to OpenRouter. Use synthetic data only; do not paste real client information.</span>
        <button className="btn primary" disabled={busy || policy.trim().length < 30} onClick={analyze}>{busy ? "Calling OpenRouter…" : "Analyze with OpenRouter"}</button></div>
      {error && <div className="rd-ai-error" role="alert"><b>No AI result generated.</b> {error}</div>}
    </section>

    {result && <section className="rd-ai-result" aria-live="polite">
      <div className="rd-ai-result-head"><div><span className="rd-kicker">STEP 2 · LIVE MODEL OUTPUT</span><h2>AI-assisted impact review <span className="rd-draft-pill">DRAFT · HUMAN REVIEW REQUIRED</span></h2></div>
        <span className={`rd-impact-status ${result.result.impact_status}`}>{impactLabels[result.result.impact_status]}</span></div>
      <div className="rd-result-grid">
        <article className="rd-result-card"><span className="rd-kicker">ASSESSMENT</span><p>{result.result.rationale}</p><small>Model confidence: {Math.round(result.result.confidence * 100)}% · {result.result.needs_human_review ? "Human review required" : "Review before approval"}</small></article>
        <article className="rd-result-card"><span className="rd-kicker">PROPOSED POLICY UPDATE · DRAFT</span><p>{result.result.draft_policy_update}</p></article>
        <article className="rd-result-card"><span className="rd-kicker">REMEDIATION ACTION · DRAFT</span><p>{result.result.remediation_task}</p></article>
        <article className="rd-result-card rd-bangla-card"><span className="rd-kicker">বাংলা কর্মপরিকল্পনা · DRAFT</span><p lang="bn">{result.result.bangla_summary}</p><small>Bangla teammate review required before use.</small></article>
      </div>
      <article className="rd-citations-card"><div className="rd-citation-title"><span className="rd-kicker">STEP 3 · CODE-VERIFIED CITATIONS</span><b>All returned quotes matched their supplied source text.</b></div>
        {result.result.citations.map((citation, index) => <div className="rd-citation" key={`${citation.kind}-${index}`}>
          <span className="rd-verified-badge">VERIFIED</span><div><b>{citation.kind === "regulation" ? `NIST CSF ${result.source.version} · ${citation.source_id}` : "Synthetic sample policy · SAMPLE-POLICY-1"}</b><blockquote>{citation.quote}</blockquote></div>
        </div>)}
      </article>
      <div className="rd-model-run"><span>Real run · {result.run.provider} / {result.run.model}</span><span>{result.run.input_tokens} input · {result.run.output_tokens} output tokens</span>
        <span>{result.run.latency_ms.toLocaleString()} ms</span><span>{result.run.cost_usd == null ? "Provider cost not reported" : `$${result.run.cost_usd.toFixed(6)}`}</span>
        {result.run.request_id && <code>{result.run.request_id}</code>}</div>
    </section>}
    {!result && !error && <div className="rd-empty-result"><b>Output appears here after a real model call.</b><span>No sample answer is prefilled. Failed calls leave this area empty.</span></div>}
  </div>;
}
