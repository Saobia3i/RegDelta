# RegDelta — 60-Second Demo Video Script

**Target length:** 50–60 seconds · **Resolution:** 1920×1080 (Full HD) · **Voiceover:** Clear, professional pace

---

## Preflight Checklist
1. **Backend:** Running on `http://127.0.0.1:8001` (`run-local.ps1 -ApiPort 8001`)
2. **Frontend:** Running on `http://localhost:5173` (`npm run dev`)
3. **Sample File:** Select `frontend/public/recording-input/NIST-CSF-2.0.pdf` (or paste sample policy)

---

## Script & Storyboard (5 Short Shots)

| # | Time | Screen Action | Voiceover Script |
|---|---|---|---|
| **1** | **00:00–00:10** | **Upload & Ingest:** Open `http://localhost:5173/#/regulatory`. Drag & drop `NIST-CSF-2.0.pdf`. Highlight instant SHA-256 hash and parsed subcategories. | *"Welcome to RegDelta. When a regulatory standard updates, we ingest the document, hash its provenance, and extract every requirement."* |
| **2** | **00:10–00:22** | **Deterministic Code Compare:** Scroll through the code comparison metrics and click an unclear pair (e.g. `PR.AC-1 → PR.AA-01`) showing word-level diffs. | *"Before invoking AI, our deterministic code engine aligns versions using Hungarian matching and token overlap—flagging ambiguous shifts for human review."* |
| **3** | **00:22–00:35** | **Live AI Analysis:** Click **Generate AI summary & action plan**. Show the live response powered by Gemini. | *"Next, Gemini analyzes the operational impact, delivering an executive summary and a localized Bangla action plan for regional delivery teams."* |
| **4** | **00:35–00:48** | **Quote Verification & DRAFT Safety:** Hover over a verified quote tag and status badge (*Evidence found / Needs human review*). | *"Every finding is bound by strict guardrails: source quotes must match page text verbatim, outputs are labeled DRAFT, and we never claim legal compliance."* |
| **5** | **00:48–01:00** | **Audit Telemetry & Human Gate:** Show the analytics charts (token usage, citations by page) and the run telemetry badge. | *"With full token telemetry, latency tracking, and expert sign-off gates, RegDelta turns regulatory chaos into audit-ready clarity."* |

---

## Strict Guardrail Reminders
- **Safe vocabulary only:** Use *Evidence found*, *Evidence missing*, *Conflict*, or *Needs human review*. Never state or imply the organization is legally "compliant".
- **Real run:** Show the live Gemini provider badge, token count, and latency in the telemetry footer.
