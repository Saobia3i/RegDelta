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
- The repository root README and frontend branding say RegDelta, but the current root source tree (`backend/`, `frontend/`, `docker-compose.yml`) is still structured and described as a RegDelta Operations Console/compliance delivery platform. Its relationship to the regulatory-change product in this plan has not yet been verified. Do not count its features as implementation of the planned regulatory-change workflow until Phase 0 establishes what can be reused, replaced, or isolated.
- Confirm actual runtime, framework, persistence, deployment, model provider, source licences, due dates, team availability, and phase owners during Phase 0. Do not assume the old application’s stack is the intended RegDelta architecture.

## Decisions and open items

| Item | State | Owner | Decision / next step |
|---|---|---|---|
| Existing RegDelta Operations Console code | Open | Phase 0 owner | Inventory it and decide reuse/replacement/isolation; document the reason. |
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

## Urgent demo vertical-slice progress — 2026-11-18 (not phase completion)

This work began after the user asked to run the project and demonstrate the video flow. It is a browser-only vertical slice; it does not mean the formal phases below are complete.

- **Sources:** downloaded the public NIST CSF 1.1 Core, NIST CSF 1.1→2.0 transition overview, and NIST OLIR relationship workbook into `frontend/public/demo/`. `frontend/scripts/build-demo-data.cjs` hashes the sources and generates `frontend/src/data/nistDemoData.json`. The example `PR.AC-1 → PR.AA-01` is present in the actual NIST transition rows. The historical 2023 draft CSF 2.0 export was excluded after inspection; final-version descriptions come from the NIST transition workbook.
- **Demo UI:** added an unauthenticated local route `#/demo` with nine navigable shots: detect, change list, impact map, DRAFT and quotes, verifier, Bangla summary, local approve/edit/reject, GitHub issue preview/action-list export, and run log. Bangla summary is also pinned in the sidebar and shown on the draft screen.
- **Prototype behavior:** change list uses source workbook rows; sample impact result is deterministic keyword matching; draft is a local template; two exact quote checks are calculated in the browser; decisions and run logs persist in browser localStorage. GitHub panel is preview only; it creates no external issue. Bangla text is a draft and has not been reviewed by a named Bangla-speaking teammate.
- **AI and metrics:** this demo route makes zero AI calls. It must not be presented as an AI-generated result. NIST change-detection precision/recall, abstention rate, model cost, and model runtime are not measured. The separate fixed lexical candidate-relationship baseline has 31 TP, 10 FP, and 124 FN over 11,448 possible CSF subcategory pairs against 155 OLIR reference pairs: precision 75.6%, recall 20.0%. This is not change-detection performance; the NIST-hosted OLIR includes third-party relationships that NIST does not correctness-test.
- **Build:** frontend dependency install succeeded with registry access. `npm run build` passed after adding the demo route and data generator (TypeScript check plus Vite production build; 45 modules transformed).
- **Runtime:** only the Vite frontend demo can run locally in the present environment. The Python backend, PostgreSQL, and Docker runtime remain unavailable here. No screen recording or MP4 has been created.
- **Next step:** use the running browser demo for a transparent prototype walkthrough, then complete backend integration, model-backed mapping/drafting, measured change evaluation, real GitHub integration, and human Bangla review before calling the submission fully submittable.

### OpenRouter provider integration — 2026-11-18 (implementation added; live call not verified)

- **Delivered:** added `OpenRouterProvider` to the existing provider-agnostic backend, using OpenRouter's `/chat/completions` API with JSON Schema response format and parameter-capable provider routing. The integration captures provider/model, response ID, token usage, reported cost when supplied by OpenRouter, and latency for existing AI task-run logging.
- **Configuration:** `.env.example` documents `RegDelta_AI_PROVIDER=openrouter`, `RegDelta_OPENROUTER_API_KEY`, and the required `RegDelta_AI_MODEL` model ID. The key is read server-side and is never part of frontend configuration. Optional attribution headers and a configurable API base URL are supported.
- **Safety/validation:** requests require schema-capable routing; returned content is parsed as JSON, and timeout, refusal, truncation, HTTP, and malformed-response cases produce provider errors without printing credentials or response bodies. Existing task validation remains responsible for checking task-specific output. If OpenRouter omits reported cost, existing configured per-token prices are used as an estimate and should be updated for the selected model.
- **Verification:** not run against OpenRouter. This environment has no Python runtime and no OpenRouter API key; the backend cannot be live-tested here. The provider remains `mock` by default until the local environment is configured.
- **Demo status:** the browser-only `#/demo` NIST walkthrough still makes no model calls. This provider adds AI for the backend's existing evidence-review/questionnaire tasks; connecting it to regulatory-change impact and drafting is a separate implementation step.

### Existing RegDelta app integration — 2026-11-18 (partial; no phase completion)

- **Correction:** the earlier NIST walkthrough was mounted as a separate `/demo` route. That was not the requested product integration. It has now been moved into the existing authenticated React application as the staff-only **Regulatory changes** workspace at `#/regulatory`; the separate `/demo` route and login shortcut are removed.
- **Existing app retained:** this change uses the existing React shell, staff authorization context, navigation, API client conventions, build pipeline, backend, and database architecture. It does not replace the RegDelta application with a new app.
- **Branding:** copied the user-provided RegDelta shielded-delta logo to `frontend/public/regdelta-logo.png`, applied it to the shared signed-in shell and login, and updated the document title.
- **Source organization:** renamed the NIST data generator and generated data for regulatory-source usage; public reference workbooks now live in `frontend/public/regulatory-sources/`.
- **Current functional boundary:** the regulatory workspace is still an in-browser preview built from bundled NIST reference data. Run records and approve/edit/reject state are browser-local; impact mapping is a keyword illustration; draft text is static; quote checks only verify exact substrings in bundled text; the GitHub panel does not create issues. No server-side regulation, change, policy, draft, approval, or run records have been added yet. The page explicitly says the initial source-list action does not execute change detection.
- **Verification:** frontend production build passed after mounting the workspace into the existing shell and reorganizing the source data. Full app login/runtime remains unverified because this environment does not have the Python/PostgreSQL backend runtime available.
- **Next engineering step:** implement durable source/version/change/run records and workspace-scoped APIs using the existing SQLAlchemy/FastAPI patterns, then replace browser-only preview behavior one product phase at a time. Do not mark Phase 1 or the product demonstration complete based on this shell integration.

### One live AI hero flow — 2026-11-18 (local development slice; production API/persistence pending)

- **Product flow:** replaced the static nine-screen walkthrough with one working hero flow in the existing RegDelta staff shell: select an official NIST CSF 1.1→2.0 transition row (default `PR.AC-1 → PR.AA-01`) and clearly labelled synthetic policy text; call OpenRouter; render an AI impact review, proposed policy draft, remediation task, Bangla summary, and exact source quotes.
- **Provider/model:** OpenRouter using `google/gemini-3-flash-preview`. The local development endpoint accepts the server-side `TENSOR_OPENROUTER_API` setting; the key is never included in frontend code or responses. The OpenRouter Gemini listing reports JSON Schema output support; the endpoint sends `require_parameters: true` and independently validates output. It rejects citations unless the exact quote occurs in the supplied NIST source or synthetic policy. [OpenRouter model listing](https://openrouter.ai/google/gemini-3-flash-preview)
- **Development access:** local Vite dev mode provides a local reviewer shell for `#/regulatory` when API/database login is unavailable. This bypass exists only when `import.meta.env.DEV` is true. `/api/regulatory/analyze` is Vite dev middleware, not a production FastAPI route. Do not expose the dev server beyond localhost.
- **Real-call verification:** two live OpenRouter requests returned successfully and passed both exact-quote checks. One captured run: `needs_human_review`; 2 citations verified (NIST `PR.AA-01` and `SAMPLE-POLICY-1`); 719 input tokens; 349 output tokens; reported cost `$0.0014065`; latency 2,711 ms; draft and Bangla summary present. This is one smoke example, not an evaluation result.
- **Credential incident/containment:** the user-provided OpenRouter key was accidentally emitted while inspecting `.env`. Its local `.env` value was cleared and Vite servers stopped. Revoke/rotate the key in OpenRouter and place the replacement in the ignored project `.env` before restarting. No credential value is stored in this update or source files.
- **Known gaps:** no persistent backend run record; no evaluation of change-detection precision/recall; no final Bangla human review; no approval persistence; no GitHub issue creation. The UI labels generated content DRAFT and warns against real client data.
- **Verification:** frontend TypeScript/Vite production build passed. Live endpoint smoke requests passed before credential containment. The app is currently stopped; restart after rotating the key.

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
