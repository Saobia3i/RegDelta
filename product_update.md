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

### Original-file upload hero flow — 2026-11-18 (public-source walkthrough verified; user-original upload ready)

- **User direction:** submission only needs one real end-to-end flow; avoid prewritten/hardcoded output and use the team's original file with AI summary, Bangla summary, and citations.
- **Implemented in existing app:** replaced the earlier selected-NIST-row/synthetic-policy screen with a real-file upload page at `#/regulatory`. It accepts text-based PDF, TXT, and Markdown (12 MB maximum). PDF text is extracted with PDF.js while retaining page numbers; PDF byte SHA-256 is calculated; the file is held in memory and is not stored by the local endpoint.
- **Live processing:** local Vite server middleware receives the uploaded file, extracts text, sends only that text and source metadata to OpenRouter Gemini (`google/gemini-3-flash-preview`), and returns English summary, Bangla summary, action items, request usage/cost/latency, and page-level quotations. No prefilled result exists.
- **Citation control:** response is schema-constrained and the local API independently requires every citation quote to be an exact substring of text extracted from the claimed page. A mismatch or malformed response returns an error and no summary.
- **Runtime config:** checked `.env` variable names without printing values; the active `RegDelta_AI_PROVIDER`, Gemini model, and OpenRouter key are loaded. A no-file request returned the expected `400 Choose a file` without making a model call. Frontend root returned HTTP 200. PDF.js Node import resolved. Full TypeScript/Vite build passed.
- **Recording input provided:** added the official NIST CSF 2.0 public PDF at `frontend/public/recording-input/NIST-CSF-2.0.pdf` (1,518,858 bytes; [official NIST publication page](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)). The file picker can load it directly from `E:\vs code projects\RegDelta\RegDelta\frontend\public\recording-input\NIST-CSF-2.0.pdf`, or from the running site at `/recording-input/NIST-CSF-2.0.pdf`. Label it **Sample Public Data**.
- **Live end-to-end run on the actual PDF:** uploaded `NIST-CSF-2.0.pdf` to the local API, extracted 32/32 pages and 68,280 characters, sent the extracted document to OpenRouter Gemini, and received an English summary, Bangla summary, four draft actions, and four citations. Model: `google/gemini-3-flash-preview`; 13,703 input tokens; 777 output tokens; reported cost `$0.0091825`; latency 8,126 ms; request ID `gen-1795014641-e7oINasdFaHH9V0k9McY`. The model response marked `needs_human_review=false`; UI still labels generated material as DRAFT / human review. This is one smoke run, not an accuracy evaluation.
- **Citation verification:** API exact-page quote validation passed; an independent second extraction using PDF.js confirmed all four output quotations occur on the claimed PDF pages: 8, 11, 12, and 22. This verifies quote presence and page provenance, not that the model's interpretation/action suggestions are substantively correct.
- **Runtime now:** local Vite page is HTTP 200 at `http://127.0.0.1:5173/#/regulatory`; the PDF is served at HTTP 200 from `/recording-input/NIST-CSF-2.0.pdf`; OpenRouter settings were present. The browser picker can now use the supplied PDF for the recording.
- **Still limited:** the local route accepts text-based/selectable PDF or TXT/Markdown; scanned PDF OCR is unsupported. Python FastAPI/PostgreSQL are unavailable and remain off; the recordable hero API is the local Node/Vite middleware, not the production API. The local endpoint does not persist the uploaded file or run history. Do not present this as a deployed or persistent workflow.
- **Key handling:** user explicitly requested reuse of the already configured key after earlier exposure and re-added it under the `RegDelta_*` environment names. The app supports that name family. The secret was not printed or included in source during this implementation; rotation remains recommended after the recording.

### Citation rejection troubleshooting — 2026-11-18

- **Observed:** user's upload request returned HTTP 502 because Gemini produced a citation from PDF page 6 whose punctuation spacing differed from PDF.js extracted text (`CSF Core ,` in extracted text vs `CSF Core,` in the quote). The verifier correctly rejected the entire result at first.
- **Fix:** citation comparison now normalizes Unicode compatibility forms, smart quotes, dash characters, whitespace, and spacing around punctuation/brackets before substring comparison. It does not ignore or remove words. The UI discloses this comparison rule.
- **Recheck:** uploaded the same actual `NIST-CSF-2.0.pdf` again. HTTP 200; Gemini returned English summary, Bangla summary, four actions, and four citations (pages 6, 8, 12, 18); all passed the server-side normalized page-text verifier. Model `google/gemini-3-flash-preview`; 13,703 input tokens; 754 output tokens; reported cost `$0.0038629`; latency 7,193 ms; request ID `gen-1795015153-D69VZSxXEIqYh7cp1sbZ`.
- **Build/runtime:** frontend build passed after the fix. Local page and PDF source both returned HTTP 200.

### Per-run analytics dashboard with Apache ECharts — 2026-11-18

- **User request:** present each completed upload/AI run in an analytics dashboard with charts/graphs using ECharts.
- **Delivered:** added Apache ECharts 6.1 using the official tree-shakeable API and lazy-loaded the chart module. After a real model response, the page now displays run KPI cards (pages, draft action count, verified citation rate, latency, provider-reported cost) and three interactive charts: verified citations by PDF page, generated actions grouped by model-suggested owner, and provider-reported input/output token usage. Summary, Bangla summary, actions, source citations, file hash, provider/model, and request metrics remain visible.
- **Data integrity:** all chart series derive from the current API response for the actual uploaded document. No chart has hardcoded values. Captions explicitly say this is one-run output, not a quality/compliance/system-wide score. The displayed 100% citation rate counts only responses the server returned after every citation passed normalized exact-source-page text verification; failed calls still render no dashboard.
- **Verification:** `npm.cmd run build` passed with ECharts split into a lazy chunk; no bundle-size warning. Local page and chart module returned HTTP 200. The user must run/upload a document again to populate charts in their browser; previous live result is not persisted.

### Existing application routes and product inventory restored — 2026-11-18

- **User report:** the app appeared to contain only the Regulatory changes page, and `product.md` did not name the existing Tensor modules.
- **Cause:** the unauthenticated local reviewer shell was special-cased only for `#/regulatory`. Clicking another staff route returned to Login. The previous feature components and route handlers were still in `frontend/src/pages` and `frontend/src/main.tsx`; they had not been deleted. API-backed pages nevertheless need FastAPI and PostgreSQL to load their data.
- **Fix:** local Vite development now renders the same staff shell and existing route component for all non-login routes when there is no token. This is a navigation/UI development convenience only; backend endpoints remain protected and may return unavailable/401 errors when the API/database are not running. The bypass is gated by `import.meta.env.DEV` and does not apply to production.
- **Product documentation:** added an “Existing application baseline and reuse” inventory to `product.md`, covering Dashboard, review queue, engagements, assurance/testing/import, evidence, remediation, questionnaires/AI drafting, policies, reports, connectors, audit/time economics, snapshots, library, and analytics. It explicitly distinguishes legacy functionality from the new regulatory workflow and records that the new page does not replace existing modules.
- **Next runtime check:** frontend build and direct navigation smoke checks; full data flow remains dependent on starting PostgreSQL and the Python API.

### Original-file analysis moved into the existing FastAPI backend — 2026-11-18 (implementation complete; backend runtime unverified)

- **Reason:** user correctly asked whether the upload flow was only frontend work. Before this change, a Vite development middleware parsed uploads and called OpenRouter directly; the existing FastAPI application and its authorization/persistence were bypassed.
- **Backend implementation:** added authenticated `POST /v1/regulatory/analyze-upload` at `backend/tensor_ops/api/routers/regulatory.py` and registered it in the existing FastAPI application. It checks the caller's `ai.run` membership in the selected tenant, applies per-user rate limiting and the existing AI per-job/tenant budget checks, accepts PDF/TXT/Markdown with size/page/text bounds, extracts in memory, and calls the configured provider through the existing `get_provider()` abstraction.
- **Trust and run history:** provider output must satisfy the structured schema and every page citation must match normalized text from that exact source page. Invalid citations fail closed. Successful and provider/validation-failed calls create tenant-scoped `AIRun` records with provider/model, tokens, cost, latency, request ID, status, and a SHA-256 reference; an audit event records safe source metadata. Uploaded bytes and document text are not persisted.
- **Frontend integration:** upload now uses the shared bearer-token API client, sends the selected file/source label/workspace to `/v1/regulatory/analyze-upload`, and only offers workspaces where the authenticated user has `ai.run`. The former `frontend/scripts/regulatory-ai-dev-api.ts` Vite middleware has been removed. Vite proxies `/v1` to the FastAPI server.
- **Credential compatibility:** backend configuration and Compose now accept the existing `TENSOR_OPENROUTER_API` key name alongside RegDelta/OpenRouter aliases, and accept `TENSOR_AI_PROVIDER`/`TENSOR_AI_MODEL` aliases. This preserves the user's existing credential setting without exposing its value to the browser.
- **Verification:** `npm.cmd run build` passed after switching the frontend to the FastAPI route (TypeScript check and production Vite build; ECharts remains lazy-loaded). Backend runtime could not be started or smoke-tested here: Python has no installed interpreter, Docker is unavailable, and PostgreSQL/API ports are not listening. No live FastAPI request or database write is claimed.
- **Current recording requirement:** sign in through the existing local-dev login backed by a running API/database, select a tenant with `ai.run`, upload the actual PDF, then record the returned dashboard. The unauthenticated development navigation shell has no tenant/auth context and is not sufficient for this upload flow.
- **Status boundary:** this completes the upload flow's backend integration in code, not the full RegDelta product phases. NIST framework-change detection, crosswalk-scored precision/recall, approval workflow, GitHub issue creation, and measured abstention remain separate work. The prior Vite live-call entries document historical behavior before the middleware was removed; they are not the current upload API architecture.

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

### 2026-11-18 — Temporary email/password sign-in for demo

- **User request:** replace the confusing disabled-development-sign-in message with an ordinary email/password screen, supporting different existing account roles and a Render demo deployment.
- **Delivered:** `frontend/src/pages/Login.tsx` now submits email/password to `POST /v1/auth/login`. The backend validates the email against `RegDelta_DEMO_CREDENTIALS` using constant-time comparison, loads the active account from PostgreSQL, and derives role and tenant permissions from existing database memberships. The client cannot select or escalate its own role.
- **Deployment gate:** `RegDelta_DEMO_AUTH_ENABLED=true` explicitly enables this temporary password mode outside local/test. Production OIDC remains the default whenever that flag is false. Production demo mode requires a 32+ character `RegDelta_DEV_JWT_SECRET`, a non-empty JSON `RegDelta_DEMO_CREDENTIALS` map, and the existing production `RegDelta_SECRETS_KEY`; it does not claim MFA and issues tokens with MFA false. Use only for the prototype; replace it with a real OIDC identity provider before client use.
- **Local demo accounts:** synthetic database users are mapped in the ignored local `.env`; a shared local-only demo password is configured there. The value is intentionally omitted from this tracked report. Roles remain database-owned.
- **Port:** `backend/run-local.ps1 -ApiPort 8001` starts the API on 8001; Vite proxies API requests to that port. Port 8000 was occupied by an earlier stale local process.
- **Acceptance evidence:** Neon query `select 1` succeeded. API `/healthz`, `/readyz`, `/v1/dev/users` returned 200. Password login succeeded for a staff delivery lead (`is_staff=true`, four memberships) and client account (`is_staff=false`, `client_admin` membership). `/v1/me` returned correct role context; bearer token was not printed. Backend `compileall` passed. Frontend TypeScript/Vite production build passed (632 modules; exit code 0).
- **Limitations:** the temporary demo password flow is not MFA or production identity management. On Render, add the explicitly gated variables as secret environment variables; do not commit them. Staff token has `mfa=false`, so MFA-protected privileged actions remain blocked.
- **Next:** deploy API and frontend, configure Render secrets for temporary demo auth (or OIDC), and run the original document upload flow after deployment.

### 2026-11-18 — Citation verification recovery for PDF uploads

- **Issue reproduced:** the real Gemini upload of the public NIST CSF 2.0 PDF returned HTTP 502 because a generated quotation on page 8 did not match extracted page text. The server correctly refused to show an unverified result.
- **Fix:** `backend/tensor_ops/api/routers/regulatory.py` now preserves PDF line breaks and normalizes line-wrap hyphenation and Unicode typography. If a model quote is still near-verbatim, the verifier may align it only to the matching contiguous token window (minimum 10 tokens, at least 72% contiguous anchor, at least 94% token similarity) and replaces the model quote with the exact source substring. A clearly different/fabricated quote is still rejected. On citation mismatch, the backend makes at most one budget-checked Gemini repair call using only that page text plus the prior draft; the final full result is revalidated. Combined tokens, latency, request IDs, and cost are recorded for the AI run.
- **UI disclosure:** citation panel now explains line-wrap normalization and that repaired quotes are exact extracted source excerpts.
- **Live acceptance:** uploaded `NIST-CSF-2.0.pdf` as Sample Public Data through FastAPI with the real `google/gemini-3-flash-preview` provider. Result returned HTTP 200 with 32 extracted pages, 4 verified citations, English and Bangla summaries, 11,676 ms latency, reported cost `$0.007635`. Content and auth token were not printed. The output is still marked DRAFT / human review.
- **Verifier checks:** reproduced a wrapped-word PDF source (`high-` + newline + `level`), confirmed a one-token quote typo is corrected to an exact extracted substring, and confirmed a fabricated citation is rejected.
- **Build:** Python compile passed; frontend production build passed (632 modules, exit 0).
- **Limitation:** citation text verification proves the quote appears in the cited page; it does not independently prove that the model's `supports` explanation is semantically correct. Human review remains required.

### 2026-11-18 — Restore the RegDelta change-to-policy impact workflow

- **Product correction:** the single-document summarizer did not implement the product plan's main problem/solution. The target is to compare the NIST CSF 1.1→2.0 change crosswalk with a client policy and show what is covered, missing, potentially conflicting, and what an agency can fix. The regulatory page now follows this flow.
- **Implemented:** the backend loads the bundled public NIST transition crosswalk (211 rows), deterministically ranks up to 12 policy-relevant candidates, and sends those real before/after requirements plus uploaded/pasted policy text to the configured live model. Model results include `Evidence found`, `Evidence missing`, `Potential conflict`, or `Needs human review`, a rationale, confidence, draft policy change, remediation task, and Bangla work summary. All are clearly drafts.
- **Evidence behavior:** NIST old/new requirement text comes from the source crosswalk. Policy quotes are verified against the uploaded/pasted policy; an invalid/missing quote downgrades that finding to Needs human review, while the rest of the analysis remains visible. It no longer fails the entire analysis because one citation is unverifiable. No compliance conclusion is produced.
- **Input/UI:** added a clearly labeled synthetic access policy at `frontend/public/recording-input/Sample-Client-Access-Policy.md`; the Regulatory changes page can load it or accept an authorized client policy PDF/TXT/Markdown. It shows a per-run ECharts status/change-type dashboard, before/after requirements, evidence, proposed policy updates, and agency tasks. The shortlist count is visible (e.g. 12/211); it is not represented as full recall.
- **Deployment sources:** copied the crosswalk into `backend/tensor_ops/content/regulatory/nist_csf_11_20_crosswalk.json` so FastAPI does not depend on frontend imports. Source references and hashes remain in the data file.
- **Verification:** Python compile passed, TypeScript/Vite production build passed (633 modules, exit 0), FastAPI OpenAPI exposes `/v1/regulatory/analyze-impact`, frontend and synthetic-policy URL returned HTTP 200.
- **Live-model status:** a real attempt with the sample policy was rejected by OpenRouter with HTTP 402 (billing/credit limit). No AI result was fabricated. Provider errors now distinguish HTTP 402 billing/credits from a citation-verification issue. Re-run after the OpenRouter account has available credits to verify the new impact schema end-to-end.
- **Known scope limit:** this prototype assesses the 12 highest lexical-relevance candidates from 211 crosswalk rows in one call. It does not claim to have mapped all 211 or measured recall. Full pagination/batch review and human approve/edit/reject remain later product phases.

### 2026-11-18 — Show the seven-step workflow in the Regulatory changes page

- **Delivered:** replaced the generic in-memory upload/privacy paragraphs with an always-visible, numbered seven-step workflow panel. The panel updates based on whether an analysis result exists.
- **Truthful run status:** Detect/ingest displays source/policy readiness; Compare displays the current policy-relevance shortlist (12 of 211) as partial; Map, Draft, and Verify show run outcomes; Human approval is explicitly pending/not connected to these findings; Act is explicitly not triggered because approved GitHub issue creation is not connected.
- **Trust boundary:** UI explicitly says all output is DRAFT, does not claim all seven steps are implemented, and explains that step 6–7 remain human-controlled gates. This follows `product.md`; it avoids claiming approval or external issue creation that the current workflow has not completed.
- **Verification:** frontend build passed (633 modules, exit 0); backend compile passed.

### 2026-11-18 — Clarify policy input and workspace selector

- Collapsed the optional paste-policy editor by default; policy-file upload is the primary input. The synthetic sample action opens the editor after loading so the sample text can be inspected/edited. Added explicit “Or paste policy text instead” language.
- Applied theme tokens to the policy textarea so dark mode no longer renders a bright white field.
- The prior single-workspace dropdown was not a role selector; it scoped the analysis to one tenant. Replaced it with a read-only workspace scope label when there is exactly one accessible workspace; the selector appears only when the user has multiple workspaces.
- Frontend production build passed (633 modules, exit 0).
