# RegDelta Product Updates

> Living phase log. Update this file at the end of every phase as required by [`product.md`](product.md). Preserve earlier entries; add new dated entries rather than replacing context.

## Current status

- **Product:** RegDelta — regulatory change detection, evidence-backed policy drafting, and human-approved fix tasks.
- **Current phase:** Phase 0 — Align scope and establish a trustworthy baseline.
- **Overall delivery status:** Planning and baseline alignment; no phase is recorded as complete yet.
- **Last updated:** 2026-11-18.
- **Source context:** Project plan/team handbook and project report PDFs supplied by the user; see `product.md` §12.

## Phase tracker

| Phase | Status | Owner | Completion date | Notes |
|---|---|---|---|---|
| 0 — Align scope and baseline | In progress | To assign | — | Confirm current repo/application, architecture, owners, schedule, source licensing, and demo boundary. |
| 1 — Ingestion and parsing | Not started | To assign | — | NIST CSF 1.1 and 2.0 source versions with provenance. |
| 2 — Comparison and evaluation | Not started | To assign | — | Seven change types; score against NIST crosswalk. |
| 3 — Workspace, policies, retrieval | Not started | To assign | — | Synthetic client policies and tenant isolation. |
| 4 — Mapping and abstention | Not started | To assign | — | Four impact statuses; schema and model logs. |
| 5 — Drafting and Bangla summary | Not started | To assign | — | DRAFT policy updates, fix tasks, reviewed Bangla summary. |
| 6 — Quote verifier and safeguards | Not started | To assign | — | Code-only exact quote check and safe failure behavior. |
| 7 — Human review and audit | Not started | To assign | — | Approve/edit/reject with re-validation and history. |
| 8 — Approved actions | Not started | To assign | — | GitHub issues only after approval; safe fallback. |
| 9 — UI and integrated demo | Not started | To assign | — | Traceable end-to-end consultant workflow. |
| 10 — Evaluation and handoff | Not started | To assign | — | Reproducible measured results, demo, and documentation. |

## Starting context and baseline findings

- The product report defines a seven-step pipeline: Detect, Compare, Map, Draft, Verify, Approve, Act.
- Initial measured framework pair: NIST CSF 1.1 (2018) to CSF 2.0 (2024), scored against the official crosswalk.
- Bangladesh Bank is conditional on legal usability and successful parsing. ISO 27001, ISO 42001, and SOC 2 are roadmap items only unless licensed text becomes available.
- The safety boundary is strict: exact source quotes verified by code; abstain when uncertain; drafts stay DRAFT until a human approves; no “compliant” claim; no external action before approval.
- Demo policy data should be synthetic and labelled SAMPLE. The Bangla action-plan summary needs a Bangla-speaking reviewer.
- The repository root README and frontend branding say RegDelta, but the current root source tree (`backend/`, `frontend/`, `docker-compose.yml`) is still structured and described as a Tensor Operations Console/compliance delivery platform. Its relationship to the regulatory-change product in this plan has not yet been verified. Do not count its features as implementation of the planned regulatory-change workflow until Phase 0 establishes what can be reused, replaced, or isolated.
- Confirm actual runtime, framework, persistence, deployment, model provider, source licences, due dates, team availability, and phase owners during Phase 0. Do not assume the old application’s stack is the intended RegDelta architecture.

## Decisions and open items

| Item | State | Owner | Decision / next step |
|---|---|---|---|
| Existing Tensor Operations Console code | Open | Phase 0 owner | Inventory it and decide reuse/replacement/isolation; document the reason. |
| Target schedule and demo date | Open | Team Lead | Confirm against competition schedule and team availability. |
| Architecture and deployment | Open | Team Lead + backend/full-stack | Agree after repository baseline review. |
| NIST source locations, hashes, and licence notes | Open | Ingestion owner | Record exact source metadata before ingesting. |
| Bangladesh Bank source and licence | Conditional | Team Lead | Include only if legally usable and parse quality is acceptable. |
| Model provider, model, and pricing date | Open | AI/ML owner | Record before any measured run. |

### Phase 0 investigation note — 2026-11-18 (partial; phase remains in progress)

- **Observed:** project metadata and visible login/navigation branding use RegDelta, while the README and backend routes describe the older compliance-delivery product. This does not demonstrate that the planned regulation-version comparison workflow is implemented.
- **Environment:** Node 22 is available. Docker and a Python runtime are not available in this environment, so the documented full-stack startup path could not be run.
- **Frontend check:** `npm ci` could not complete because the package registry was unavailable; an offline retry failed because Vite was not in the local npm cache. A build attempt therefore stopped with `tsc` unavailable. The partial `node_modules` created by the attempt was removed.
- **Follow-up check:** with approved registry access, `npm ci --no-audit --no-fund` installed 71 frontend packages and `npm run build` completed successfully (TypeScript check and Vite production build; 42 modules transformed).
- **Result:** frontend production build is verified. Full application runtime and backend startup are **not verified**: Python 3.13, PostgreSQL 16, and Docker are not available here. Repository inspection also found no implementation or data for the requested NIST CSF comparison, NIST crosswalk evaluation, or Bangla summary, so the specified 9-shot demo and its metrics cannot be produced from the current prototype.
- **Model setting:** current backend configuration defaults to the offline `mock` provider (`mock-keyword-v1`). This is not a recorded RegDelta regulatory-change evaluation and must not be presented as a measured NIST result.
- **Next step:** Phase 0 owner should reconcile the actual product scope and source tree, then run the backend and database in a fully provisioned development environment. Phases 1–10 must be implemented before the requested regulatory-change demo can be recorded honestly.
| Real consultant baseline hours | Open | Business/presentation owner | Obtain a sourced statement or mark “to be validated.” |
| Competition role: Business Analyst | Assigned | Saobia Islam | User confirmed they are Saobia Islam. |
| Competition role: Presentation Lead | Assigned | Rafat Abdullah Pantho | User confirmed this assignment. |
| Advisor contribution/date | Open | M Rahman Amit | Report says architecture review only; exact items reviewed/changed and date still needed. |

### Team roster confirmation — 2026-11-18

The user confirmed this roster for the project/submission:

- **Team Lead & AI/ML Engineer:** Saobia Islam
- **Backend Developer:** Rafat Abdullah Pantho
- **UI/UX Designer / Frontend Developer:** Farhana Rahman
- **AI Engineer:** Sadman Saqib
- **Full-Stack Developer:** MD Sahariaj Hosen
- **NRB Advisor:** M Rahman Amit (exact contribution and review date still unconfirmed)

For the competition's five declared roles: Leader — Saobia Islam; Business Analyst — Saobia Islam; UI/UX — Farhana Rahman; Backend — Rafat Abdullah Pantho; Presentation Lead — Rafat Abdullah Pantho. Saobia and Rafat each hold two declared roles. Sadman Saqib and MD Sahariaj Hosen remain additional technical roles. The advisor's exact contribution and review date are still unconfirmed.

## Phase completion log

No phases have been completed yet.

### Entry template — copy for each completed phase

#### Phase N — [phase name]

- **Status:** Complete / Partial / Blocked
- **Owner:** [name]
- **Completed on:** [YYYY-MM-DD]
- **Context:** [why this phase matters to the RegDelta workflow]
- **Delivered:** [features, decisions, and changed files]
- **Acceptance evidence:** [criterion → concrete evidence/result]
- **Verification performed:** [commands/manual walkthroughs and outcomes; state “not run” when applicable]
- **Measurements:** [value, sample size, method, pricing date if relevant]
- **Decisions/deviations:** [what changed from product.md and why]
- **Known gaps/risks:** [remaining work and owner]
- **Next phase:** [phase and immediate next action]
- **Product spec changed?:** [No / Yes — summarize and update product.md]
