# AGENTS.md — RegDelta Operational Guide for Codex

# Project Context & Token Efficiency Protocol

## 1. Mandatory Context Files
Before starting any task, read these files in order:

1. `AGENTS.md` - project instructions and working rules.
2. `product.md` - product overview, features, architecture, business logic, and core technical context.
3. `product_update.md` - latest project changes, decisions, implementation context, known issues, and current state.

These files are the primary source of project context. Use them to understand the project without unnecessarily re-analyzing the entire codebase.

## 2. Avoid Unnecessary Repository Analysis
- DO NOT scan, read, or analyze the entire repository at the beginning of every task.
- DO NOT recursively inspect all directories or read every source file unless the task genuinely requires it.
- DO NOT re-read files whose relevant context is already documented in `product.md` or `product_update.md`, unless verification is necessary.
- Start by understanding the requested task using the context files.
- Identify the specific modules, components, functions, APIs, or files relevant to the task.
- Inspect only those relevant files and their dependencies.
- Expand the investigation only when required to understand dependencies, unexpected behavior, or potential impact.
- Use targeted search instead of opening large numbers of files.
- Avoid repeating analysis or rediscovering architectural decisions already documented.

## 3. Context Priority
Use the following priority when understanding the project:

1. Current task instructions from the user.
2. `AGENTS.md` instructions.
3. Actual source code and configuration (for implementation truth).
4. `product.md` (documented product and architecture context).
5. `product_update.md` (historical changes, reasoning, and latest implementation context).

Documentation may become outdated. If documentation conflicts with actual implementation, verify the relevant code, resolve the discrepancy, and update the documentation when appropriate.

## 4. Mandatory Documentation After Changes
Whenever you modify, create, delete, refactor, fix, or configure anything in the project, you MUST update `product_update.md` before completing the task.

Document every meaningful change, including:
- Features added or modified
- Bugs fixed
- Code refactoring
- API, database, schema, or architecture changes
- UI/UX changes
- Configuration or dependency changes
- Security, performance, or optimization changes
- Removed functionality
- Important implementation decisions

## 5. Change Documentation Format
For each task, document:

### Task / Change Title
- Date:
- Status:

### Context
What problem existed? What was the user request or requirement?

### Changes Made
What exactly was implemented, modified, added, or removed?

### Reasoning
Why was this approach chosen? What alternatives or considerations mattered?

### Files Affected
List the relevant files and briefly describe their modifications.

### Technical Details
Document important implementation details, logic, dependencies, APIs, data flow, configuration, or behavior that another agent needs to understand.

### Impact
What behavior changed? What other modules or features may be affected?

### Verification
What checks, tests, builds, or validations were performed? Clearly mention anything not verified.

### Remaining Issues / Next Steps
Document unresolved issues, limitations, or follow-up work, if any.

## 6. Documentation Quality
- Write concise but technically meaningful documentation.
- Preserve important context so future agents do not need to rediscover why a change was made.
- Do not document every trivial line of code.
- Focus on decisions, implementation logic, dependencies, affected areas, constraints, and things that are easy to misunderstand.
- Do not overwrite previous important history.
- Add new entries chronologically.
- If an existing entry becomes outdated, update the current-state summary while preserving relevant historical information.

## 7. Task Completion Workflow
For every task:

1. Read the mandatory context files.
2. Understand the existing documented architecture and recent changes.
3. Investigate only the files relevant to the requested task.
4. Implement the requested change.
5. Run relevant tests, checks, or validation where possible.
6. Update `product_update.md` with the changes and their context.
7. Verify that the documentation accurately reflects the code.
8. Report a concise summary of the implementation, verification, and documentation update.

## 8. Do Not Finish Without Updating the Context
If project files were modified, updating `product_update.md` is mandatory.

If the task did not modify any project files, do not create a fake change-log entry. If new architectural information or a discovered issue is important for future tasks, document it appropriately.

If you cannot update `product_update.md`, explicitly state why and provide the documentation entry that should be added.


> **Quick Context:** **RegDelta** (*Detect · Verify · Comply*) is TensorInfoSec's regulatory change intelligence & audit-readiness platform. Implementation package: `backend/tensor_ops` (`RegDelta_ops` is a compatibility shim). Inspect actual files before making changes. Do not guess APIs, schemas, or metrics.

---

## 1. Seven-Step Regulatory Workflow: Status & Reality

| Step | Status | Codebase Reality | Planned / Unbuilt |
|---|---|---|---|
| **1. Detect & Ingest** | **Partial** | Authenticated upload (`/v1/regulatory/analyze-upload`) parses PDF/TXT/MD in memory with page tracking; SHA-256 byte hashing. Bundled 211-row NIST CSF crosswalk. | Autonomous source crawler/watcher; scheduled background jobs; scanned PDF OCR. |
| **2. Compare** | **Built (Baseline)** | Deterministic code comparison (`services/regulatory_compare.py`): Hungarian matching + token-set overlap + NFKC. Classifies 7 change types. | LLM labeling for ambiguous mid-band (`unclear`) matches. |
| **3. Map** | **Partial** | Candidate shortlisting (top 12 from 211 crosswalk rows). Model classifies impact: *Evidence found*, *Evidence missing*, *Conflict*, *Needs human review* (`/v1/regulatory/analyze-impact`). | Persistent DB tables for regulation versions, changes, and candidate maps. |
| **4. Draft** | **Built (API)** | LLM drafts policy amendments, technical fix tasks, and bilingual action summaries (English + Bangla in `Noto Sans Bengali` at 1.75× line-height). Tagged **DRAFT**. | Client profile-driven tone/industry customization. |
| **5. Verify** | **Built** | Code-only exact-quote verifier in Python. Strips unverified quotes; drops to *Needs human review* if none verify. Normalizes line-wraps and typography; aligns near-verbatim quotes. | Legal interpretation correctness validation. |
| **6. Approve** | **Partial / Planned**| Built for legacy evidence review queue (`/v1/work/reviews/{id}/decision`). Regulatory findings have a visual UI gate only. | DB persistence of regulatory approval decisions and revision history. |
| **7. Act** | **Planned** | UI displays action preview and export list. Legacy GitHub connector is read-only (2FA/branch snapshots). | Automated external GitHub issue creation from approved fix tasks. |

---

## 2. Role Mapping & Authentication Truth

### Role Mapping Table
| Codebase Role (`security/authz.py`) | Report Persona / Role | Core Permissions & Capabilities |
|---|---|---|
| `delivery_lead` | Consultant Admin / Platform Admin | Full tenant management, engagements, report release, deletion approval, sign-off. |
| `compliance_specialist` | Reviewer / Lead Auditor | Control assessment, evidence review, AI review, named expert sign-off, snapshots. |
| `security_engineer` | Technical Consultant | Control assessment, technical evidence review, connector management. |
| `quality_reviewer` | QA Reviewer | AI output review, review queue decisions, metrics inspection, report approval. |
| `client_admin` | Client Admin | Upload evidence, policy approval, connector approval, remediation task progress. |
| `client_contributor` | Client Contributor | Upload evidence, view policy drafts, update assigned remediation tasks. |
| `auditor` | Client Viewer / Auditor | Scoped read-only access restricted strictly to *approved* evidence and released reports. |
| `partner_admin` | Partner vCISO | Scoped read access across managed client tenants with partner branding. |

### Auth & MFA Reality
* **OIDC & Dev Login:** Production uses enterprise OIDC (RS256/ES256 JWKS). Dev uses `/v1/dev/login` (HS256, issues `mfa=True`). Self-registration and invite links are **Planned**; users are pre-provisioned in PostgreSQL.
* **Demo Auth & Sign-off:** Gated by `RegDelta_DEMO_AUTH_ENABLED=true` (`/v1/auth/login`), issuing tokens with `mfa=False`. Privileged operations (`signoff.create`, `report.release`, `deletion.approve`) require MFA when `RegDelta_REQUIRE_MFA=true`. For recorded demos needing sign-offs, use `/v1/dev/login` or set `RegDelta_REQUIRE_MFA=false`.
* **Tenant Isolation:** Deny-by-default RBAC. Non-members get **404 Not Found** (prevents IDOR leaks). DB sessions connect as `RegDelta_app` and set `app.tenant_ids` for PostgreSQL Row-Level Security (RLS) across 24 tables.

---

## 3. Strict Rules & Guardrails

1. **Never Say "Compliant":** AI and code outputs must use safe vocabulary: *Evidence found*, *Evidence missing*, *Conflict*, or *Needs human review*. Never state or imply that an organization is legally "compliant" or certified.
2. **Deterministic Quote Verification:** The verifier in Python strips unverified quotes. Quotes must be verbatim extracts from claimed source pages.
3. **No Tools for Models:** AI models receive no tools during evidence analysis or drafting; all outputs are schema-constrained JSON.
4. **No Free Models / No Mock in Recorded Demos:** Never use `:free` endpoints (rate limits, weaker privacy) or `mock` in recorded demos. Use funded, paid endpoints (`anthropic` or `openrouter`). The UI must show the active provider badge.
5. **Score Contamination Prevention:** The 211-row NIST CSF crosswalk is the evaluation gold standard; it must **NEVER** be input into the comparison algorithm being evaluated.
6. **No Invented Numbers:** Placeholders stay marked "to be validated" until verified runs generate measured figures.
7. **Scope Clarification (ISO / SOC 2):** Control library mappings (35 controls in `content/library.py`) are TensorInfoSec's original readiness paraphrases, **NOT** automated change detection on copyrighted standard texts (roadmap only).
8. **Chart Policy:** **Apache ECharts** (`echarts`, lazy-loaded) is the single standard for all new dynamic analytical/regulatory charts. Legacy SVG components (`charts.tsx`) are retained strictly for static engagement gauges.
9. **Append-Only Immutability:** Never bypass DB trigger `RegDelta_block_mutation()` protecting `audit_events`, `signoffs`, and `review_decisions`.
10. **Working Rules:** `main` must always run the working demo (`npm run build` and backend green). Keep tests green. Scope freeze during demo recording.

---

## 4. Key Commands & Baselines

```powershell
# Run backend API (port 8001, auto-loads .env) & worker
cd backend; .\run-local.ps1 -ApiPort 8001
cd backend; .\.venv\Scripts\python.exe -m RegDelta_ops.jobs.worker

# Run frontend (port 5173, proxies /v1 to 8001) & build
cd frontend; npm run dev
cd frontend; npm run build

# Run migrations & seed demo data
cd backend; .\migrate-local.ps1 -SeedDemo

# Run backend tests & AI safety evals
cd backend; .\.venv\Scripts\python.exe -m pytest tests -q
cd backend; .\.venv\Scripts\python.exe -m evals.run_evals

# Exact Lexical Baseline Scoring Command (155 gold NIST OLIR relationships, 11,448 pairs)
cd backend; .\.venv\Scripts\python.exe -c "import json, sys; sys.path.insert(0, '.'); from tensor_ops.services.regulatory_compare import compare_frameworks; ds=json.load(open('../frontend/src/data/nistRegulatoryData.json', encoding='utf-8')); print(compare_frameworks(ds)['metrics'])"
# Ground truth baseline: Precision: 56.0% (28 TP, 22 FP), Recall: 18.06% (127 FN), Unclear: 14, Predicted: 50
```

---

## 5. Key Environment Variables & References

* **Database:** `RegDelta_DATABASE_URL` (app role `RegDelta_app`), `RegDelta_ADMIN_DATABASE_URL` (owner role `RegDelta_owner`; aliases: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`).
* **Auth:** `RegDelta_ENV` (`local` / `production`), `RegDelta_DEV_JWT_SECRET`, `RegDelta_DEMO_AUTH_ENABLED`, `RegDelta_DEMO_CREDENTIALS`, `RegDelta_REQUIRE_MFA` (`true`/`false`).
* **AI Provider:** `RegDelta_AI_PROVIDER` (`mock`/`anthropic`/`openrouter`; alias: `TENSOR_AI_PROVIDER`), `RegDelta_AI_MODEL` (alias: `TENSOR_AI_MODEL`), `RegDelta_OPENROUTER_API_KEY` (aliases: `TENSOR_OPENROUTER_API`, `RegDelta_OPENROUTER_API`), `RegDelta_ANTHROPIC_API_KEY`.
* **Storage & Security:** `RegDelta_STORAGE_DIR`, `RegDelta_SCANNER` (`dev`/`clamav`), `RegDelta_SECRETS_KEY`.
* **Deep Architecture References:**
  * ADRs: [`docs/adr/ADR.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/docs/adr/ADR.md)
  * Design System & Tokens: [`design.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/design.md)
  * Product Roadmap & Phases: [`product.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/product.md) & [`product_update.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/product_update.md)
  * Runbooks & Threat Model: [`docs/RUNBOOKS.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/docs/RUNBOOKS.md) & [`docs/THREAT_MODEL.md`](file:///e:/vs%20code%20projects/RegDelta/RegDelta/docs/THREAT_MODEL.md)
