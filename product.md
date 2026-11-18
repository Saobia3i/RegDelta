# RegDelta Product Plan

> Working product specification and phased delivery plan. Treat this file as the source of truth for what the team intends to build. Keep implementation status in [`product_update.md`](product_update.md); do not mark a phase complete here just because its code exists.

## 1. Product in one sentence

RegDelta detects changes between versions of a regulation or framework, shows what each change means for a client’s policies, drafts policy updates and technical fix tasks with source evidence, verifies every quoted source passage in code, and waits for a person to approve before anything becomes final or causes an external action.

## 2. Problem and users

Compliance consultants repeatedly read long regulatory updates, identify changed requirements, compare them with each client’s policies, and prepare policy edits and remediation work. This work consumes time and can miss changes. A general-purpose chatbot is not sufficient because it can invent requirement identifiers, source text, and citations.

- **Primary users and buyers:** compliance consultancies and agencies.
- **Client users:** client-company staff who receive approved policy drafts and fix tasks.
- **Primary user value:** reduce repeated manual comparison and drafting while keeping the evidence and human decision visible.
- **Product boundary:** RegDelta supports review and preparation. It does not certify compliance, give an audit opinion, or replace qualified human judgment.

## 3. Product outcome and success measures

The end-to-end demo must take a real old/new framework pair and a clearly labelled synthetic client policy through the seven workflow steps. It must show traceable results, honest uncertainty, and a human approval gate.

Report measured results with the sample size and method. Do not invent or estimate results.

- Change-detection precision and recall against the official NIST CSF 1.1→2.0 crosswalk.
- Quote verification rate: passed source quotes divided by all quotes checked.
- Abstention rate and a review of whether abstentions were appropriate.
- Mapping and draft quality from human review.
- Run duration and model/hosting cost per run, with the pricing date and calculation.
- A real consultant’s baseline time per framework update, if one is obtained; otherwise mark it “to be validated.”

## 4. Scope and release boundaries

### Initial demonstrated scope

- NIST Cybersecurity Framework (CSF) 1.1 (2018) compared with CSF 2.0 (2024).
- Score detected changes against NIST’s official transition crosswalk.
- Synthetic, visibly labelled sample client policies; no real client data without written consent.
- Bangla action-plan summary, reviewed by a Bangla-speaking team member. Source quotations remain in their original language.
- A second jurisdiction: Bangladesh Bank material only if it is legally usable and parses cleanly. Otherwise show it as the next planned source pack, not as a completed demo.

### Roadmap only

- ISO 27001, ISO 42001, and SOC 2 are not part of the initial measured results. Their text is copyrighted/licensed; do not ingest or reproduce it without a valid licence. The system is designed to support future framework-specific source and section-splitting modules.
- Other jurisdictions and frameworks, multilingual embeddings, and further integrations follow only after the core workflow is reliable and legally usable sources are available.

### Explicit non-goals

- Claiming that a client is “compliant” or issuing certification/audit reports.
- Automatically publishing or applying policy changes.
- Creating external tickets before a human approves the associated fix task.
- Using an AI agent framework or giving the model tools during drafting.
- Using real client data in a demo without written consent.

## 5. User workflow and product behavior

1. **Detect and ingest (code):** Check a watched public source on a schedule or on demand. Hash each file (SHA-256), compare with the last known version, quarantine and validate new files, scan them, parse sections and retain page/offset provenance. Use OCR only for scanned documents and record that OCR was used.
2. **Compare (code, with model only for unclear cases):** Match old and new sections by stable identifier, then text similarity. Classify each change as Added, Removed, Changed, Reworded, Renumbered, Split, or Merged. Persist the reason and whether code or a model supplied the label.
3. **Map (model, schema-checked by code):** Retrieve candidate client-policy sections for each real change. Assign exactly one status: Evidence found, Evidence missing, Conflict, or Needs human review. Abstain when confidence is low or evidence is absent.
4. **Draft (model):** Use the approved mapping and a small client profile (industry, tone, language) to draft policy text and technical fix tasks. Produce a Bangla action-plan summary. Mark all generated content **DRAFT**.
5. **Verify (code only):** Check each cited regulation quote against the exact cited source section. Failed quotes are removed. If no valid source quote remains, the item becomes Needs human review. Also validate that citations refer only to text supplied to the model and validate every model response against a schema.
6. **Approve (human):** A consultant can approve, edit, or reject each draft. Edits are re-validated; a rejection requires a comment and returns the item for revision. Record who decided, when, and what changed.
7. **Act (code, after approval):** Create one GitHub issue per approved fix task when integration is configured. If it is unavailable, show an exportable action list. Never act on an unapproved draft.

Every model call must have a run record with prompt/schema version, model/provider, token counts, cost, latency, and outcome. Retries are bounded and per-job/per-workspace cost budgets apply.

## 6. Change and impact vocabulary

| Change type | Meaning |
|---|---|
| Added | A new requirement has no old counterpart. |
| Removed | An old requirement has no new counterpart. |
| Changed | A corresponding requirement has meaningfully different content. |
| Reworded | Wording changed but the meaning is judged the same; normally low priority and no action. |
| Renumbered | The same requirement moved to a new identifier. |
| Split | One old requirement became several new requirements. |
| Merged | Several old requirements became one new requirement. |

| Impact status | Meaning and user-facing result |
|---|---|
| Evidence found | A client policy section already covers the change; show quotes from the regulation and policy, with an edit suggestion if useful. |
| Evidence missing | No client policy section covers the change; draft new policy text and fix tasks. |
| Conflict | Client policy text contradicts the new requirement; draft replacement text and fix tasks. |
| Needs human review | The system is unsure or cannot verify evidence; do not present a ready draft. |

## 7. Trust, safety, privacy, and licensing requirements

- **Quote or it did not happen:** every factual claim about a requirement includes an exact quote and its document, version, section, and page/offset location.
- **Deterministic quote check:** plain code checks source quotes word for word. This proves the quote exists; it does not prove the draft is legally correct.
- **Abstain rather than guess:** missing evidence, low confidence, parse problems, and unsupported cases go to human review.
- **Safe language:** say “evidence found,” “evidence missing,” or “conflict”; never claim “compliant.”
- **Human control:** every generated item is visibly DRAFT until approval. No external action runs before approval.
- **Model boundaries:** fixed-order Python orchestration; no agent framework; no model tools during drafting; strict output schemas; only provide retrieved source text; bounded retries and cost limits.
- **Tenant separation:** workspace-scoped data and row-level security; clients see only their own approved output. Keep jobs, run records, approvals, and audit history traceable and append-only where appropriate.
- **Data sovereignty:** store source name, jurisdiction, URL, retrieval time, SHA-256, licence note, parser/OCR details, and section provenance. Do not ingest ISO/SOC 2 copyrighted text without a licence.
- **Demo data:** synthetic/sample policies must be labelled SAMPLE in data and UI.
- **Bangla:** preserve original-language quotations; have a Bangla-speaking reviewer check Bangla output before use. Use a Bengali-capable font in the UI.
- **Accessibility and transparency:** dark/light modes; accessible colour choices; status never conveyed by colour alone; chart titles, text labels, tooltips, and sample-size notes for measured data. Show the model provider and AI-use log.

## 8. Target architecture and data concepts

Build a modular, fixed-order pipeline. New framework support should add a source configuration and, where needed, a section parser; it should not require changing the core compare, map, verify, and approval rules.

Core records identified by the product report:

- `regulation`, `regulation_version`, `regulation_section`
- `run` / job and model-call records
- `change_item`
- `workspace` / `client`, `client_profile`, `policy`, `policy_section`
- `mapping`, `draft`, `fix_task`, `quote_check`
- `approval`, audit events, and `eval_run`

Store durable IDs and relationships, SHA-256 source hashes, version labels, retrieval timestamps, section identifiers, text, page and offset, change type/reason, mapping status/confidence/rationale, draft version/state, exact quotes and verification result, approval decision/comment/time, and evaluation sample size/results. Keep the schema consistent with the security and deletion/retention plan adopted by the team.

The report proposes Python for orchestration and backend work, a relational database with row-level security, a web UI, and a GitHub integration for approved tasks. The exact libraries and deployment choices should be confirmed in Phase 0 and recorded in `product_update.md` rather than assumed here.

## 9. Phased delivery plan

Work on one phase at a time. Each phase has a concrete completion gate. A phase is complete only when its acceptance criteria are demonstrated and its work is recorded in [`product_update.md`](product_update.md). Later phases may be split into small pull requests/tasks, but do not start a dependent phase while its required gate is unmet.

### Phase 0 — Align scope and establish a trustworthy baseline

**Purpose:** make sure the team is building the RegDelta product described here and can run the repository.

**Work:** inventory the repository and current behavior; identify the current application/framework/database; compare it with this specification; agree on source documents, licences, demo client data, deployment, model provider, ownership, and a target schedule; define a minimum end-to-end vertical slice and task owners. Do not silently treat the existing Tensor Operations Console as RegDelta functionality.

**Complete when:** the agreed architecture and scope are recorded; each phase has an owner; the app starts from documented steps; source/data licensing decisions and the demo boundary are recorded; repository gaps and any reuse/replacement decision are explicit.

### Phase 1 — Source registry, ingestion, and section parsing

**Purpose:** ingest versioned public sources with provenance.

**Work:** register NIST CSF 1.1 and 2.0 sources; implement on-demand “Check now” first, then scheduling if needed; download/hash/quarantine/validate/scan; parse functions, categories, and subcategories with stable IDs and page/offset provenance; track parser errors. Use OCR only for scanned sources. Keep Bangladesh Bank conditional on legal usability and parsing quality.

**Complete when:** both NIST versions can be ingested reproducibly, hashes and provenance are stored, sections can be inspected, and malformed/unsupported inputs fail safely with useful errors.

### Phase 2 — Deterministic comparison and change evaluation

**Purpose:** create an explainable change list before adding client-specific AI work.

**Work:** match stable identifiers, then text similarity; implement the seven change types; keep Reworded separate from meaning changes; send only ambiguous cases for model labeling; persist reason, confidence/similarity, and label source; compare results with NIST’s official crosswalk.

**Complete when:** a reviewer can inspect the full CSF 1.1→2.0 change list and its provenance; precision and recall are computed on a documented sample against the crosswalk, with sample size; no result is fabricated.

### Phase 3 — Workspace, client profile, policy ingestion, and retrieval

**Purpose:** safely compare changes with one client’s policy material.

**Work:** create workspace/client/profile boundaries; ingest synthetic sample policies and split them into traceable policy sections; implement retrieval of candidate policy sections; enforce workspace access in API and storage; clearly label SAMPLE data.

**Complete when:** a user can select a sample client and inspect retrieved policy passages with source locations; an isolation review confirms data is scoped correctly; no real client data is needed for the demo.

### Phase 4 — Evidence mapping and abstention

**Purpose:** classify the impact of each real change on retrieved client policy sections.

**Work:** define a strict response schema; map each change to exactly one of the four impact statuses; include confidence and rationale; reject malformed responses; abstain on low confidence or missing support; log prompt/model/cost/latency.

**Complete when:** representative cases cover all four statuses; unsupported and low-confidence cases reliably become Needs human review; logs and schema validation are inspectable.

### Phase 5 — Policy drafts, fix tasks, and Bangla summary

**Purpose:** turn approved mappings into reviewable proposed work.

**Work:** draft updated/new policy text and technical fix tasks from the client profile; generate a Bangla action-plan summary; preserve language and quote provenance; label all outputs DRAFT; use synthetic client examples.

**Complete when:** each draft is linked to its change and source/policy evidence; client profile demonstrably changes tone/language; Bangla output has a recorded review by a Bangla-speaking teammate; no draft appears final.

### Phase 6 — Quote verifier and trust safeguards

**Purpose:** prevent unsupported quotations from reaching approval as evidence-backed claims.

**Work:** implement exact quote checks against the cited source section; drop failed quotes; convert items with no valid regulation quote to Needs human review; validate citations were in model context; enforce schema, bounded retries, cost limits, safe wording, and model-call logging.

**Complete when:** tests/examples demonstrate valid quotes pass, altered/nonexistent quotes fail, and failed evidence cannot be shown as verified; report the verify rate on a stated sample. The verifier must not be described as validating legal correctness.

### Phase 7 — Human review, approval, and audit history

**Purpose:** ensure a person decides what becomes final.

**Work:** build review views showing change, impact, client policy, source quotes, draft, and verification outcome together; allow approve/edit/reject; re-verify edits; require a rejection comment; record who/when/decision and retain revision history.

**Complete when:** end-to-end manual walkthrough proves no item becomes approved without an explicit user decision; rejected items return for revision; edited drafts pass the same checks; approval history is visible.

### Phase 8 — Approved actions and safe fallback

**Purpose:** make approved fixes actionable without allowing unapproved side effects.

**Work:** integrate GitHub with least necessary permissions; create one issue per approved fix task; store the issue link and action result; provide a clear exportable action list when integration is unavailable; make retries/idempotency safe.

**Complete when:** an approved task creates or links to exactly one issue in a controlled demo; an unapproved task creates none; fallback output works without GitHub credentials.

### Phase 9 — Product UI and integrated demonstration

**Purpose:** make the full flow understandable to a consultant and client.

**Work:** connect ingestion through approval/action; show the seven steps and progress; provide readable change, impact, evidence, draft, and action views; display provider and run details; add Bangla summary display, accessible statuses, dark/light mode, and SAMPLE labels.

**Complete when:** a teammate can run the demo using documented instructions without developer intervention; users can trace every draft to its source and approval; accessibility and language review issues are recorded and resolved or explicitly deferred.

### Phase 10 — Evaluation, demo hardening, and handoff

**Purpose:** present truthful measured results and a reproducible handoff.

**Work:** freeze the evaluation sample; run and record precision, recall, quote verify rate, abstention review, human mapping/draft quality, runtime, and cost; capture limitations; confirm source licences and hashes; prepare demo data, setup guide, AI-use log, and presentation/report updates.

**Complete when:** all reported numbers come from logged runs and state sample sizes; placeholders are removed or clearly marked unavailable; limitations and roadmap are honest; another teammate can reproduce the demo from the handoff.

## 10. Team coordination and ownership

The attached report lists the working team; the user later confirmed the current role assignments below. Confirm availability and phase ownership during Phase 0. Keep one accountable owner per phase and name reviewers for sensitive gates (security, licensing, evaluation, Bangla).

| Person / role in report | Suggested focus (confirm in Phase 0) |
|---|---|
| Saobia Islam — Team Lead & AI/ML Engineer | Scope, schedule, model behavior, review gates, final coordination. |
| Saobia Islam — Business Analyst (also Team Lead & AI/ML Engineer) | User research, workflow requirements, baseline/KPI sources, and business framing. |
| Rafat Abdullah Pantho — Backend Developer | Ingestion, API, persistence, integrations. |
| Rafat Abdullah Pantho — Presentation Lead | Presentation, demo narration/captions, and submission packaging. |
| Farhana Rahman — UI/UX Designer & Frontend Developer | Review workflow, evidence display, accessibility, Bangla UI. |
| Sadman Saqib — AI Engineer | Model behavior, prompts, schemas, evaluation, and run metrics. |
| MD Sahariaj Hosen — Full-stack Developer | End-to-end integration, product flow, demo reliability. |
| M Rahman Amit — NRB Advisor | Architecture review with a written, dated contribution; advisor does not make product approval decisions for users. |

The names and roles above reflect the team's current user-confirmed roster, except the advisor's exact contribution/date, which remain unknown. Saobia holds Team Lead, AI/ML Engineer, and Business Analyst roles; Rafat holds Backend Developer and Presentation Lead roles. The team lead should record actual phase owners, reviewers, availability, and due dates in `product_update.md`.

### Team working rules from the handbook

- Work in short, reviewable increments; share a working demo regularly and write down what changed.
- Keep the schedule, owner, next action, and blockers visible to the whole team.
- Review code, data, safeguards, and measured results before claiming a phase is done.
- Use the phase gates in this document as the project’s acceptance checklist. If priorities or dates change, record the decision and reason in `product_update.md`.

## 11. How to maintain these product documents

After completing **each** phase, the phase owner (or team lead) must update `product_update.md` before starting the next dependent phase:

1. Change the phase status and record completion date and owner.
2. Summarize what was built/decided and the product context it supports.
3. List changed files/features, evidence that each acceptance criterion passed, and any verification performed. Do not claim checks were run if they were not.
4. Record measured results with sample size, decisions/deviations, known gaps, risks, and deferred items.
5. Set the next phase’s status and immediate next action. Keep this `product.md` in sync only when scope or requirements actually change; record why.

At the end of the phase, tell the team the phase is complete, what it enables, what remains, and the next phase to begin. Do not silently advance phases or mark incomplete acceptance criteria as done.

## 12. Source documents and interpretation

This specification was prepared from:

- `RegDelta — Project Plan and Team Handbook.pdf` (provided in `D:\User\Downloads`): team process, working agreements, phased planning guidance, and handbook material.
- `RegDelta_Project_Report (1).pdf` (provided in `D:\User\Downloads`): product workflow, technical design, safeguards, demo scope, evaluation, roadmap, team roles, and limitations.
- The repository’s root `README.md`: current concise product statement.

**Interpretation rule:** Statements above under “Product requirements” and “Source documents” summarize project-plan/report intent. The user’s additional request is the operating instruction to split delivery into phases and update `product_update.md` after every completed phase. The detailed phase breakdown and acceptance gates in this file are an implementation plan derived from that intent; the team may revise them through a recorded scope decision.

When the PDFs and this file differ, do not silently choose. Record the discrepancy in `product_update.md`, ask the team lead to decide, and then update the relevant requirement and its rationale.
