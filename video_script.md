# RegDelta — Required Submission Video Script (English)

**Target recording:** 1:30 (within the required 1:00–2:00). **Capture:** 1920×1080, MP4, no desktop audio needed.
**Required insert:** show the Bangla-summary screen from **00:52–00:57** for five seconds, then show that same real summary again inside the full demo result near the end.

## Nine-shot storyboard

| # / Time | Screen action | Voiceover |
|---|---|---|
| **1 · 00:00–00:08 · Detect source** | Open Regulation Sources. Show the actual public source and click **Check now**. Show CSF 2.0 detected only after the fetch/version check returns. Keep **Sample Public Data** visible for sample material. | “RegDelta checks the public framework source and detects a new version. This walkthrough uses clearly labelled Sample Public Data.” |
| **2 · 00:08–00:17 · Change list** | Show the CSF 1.1 → 2.0 code comparison. Open `PR.AC-1` beside `PR.AA-01` only if that pair appears in this actual run; show its classification and word diff. | “The code engine compares the old and new sections, then shows the source wording and the detected change.” |
| **3 · 00:17–00:29 · Policy impact map** | Upload the sample client policy. Confirm **Sample Public Data** is visible. Start a real model analysis and show only its returned impact statuses. | “We compare the selected changes with this sample client policy. These impact statuses come from the live analysis and remain subject to consultant review.” |
| **4 · 00:29–00:38 · DRAFT and source quotes** | Open one actual DRAFT finding with its quote and page location. | “This finding is a draft. Its quotation includes a source location so the reviewer can inspect the original text.” |
| **5 · 00:38–00:47 · Verifier** | Show each quote’s real verifier outcome: **Found** or **Dropped**. Do not leave an unverified quote displayed as evidence. | “The verifier checks each quotation against its source. A quote that fails verification is dropped and sent for review.” |
| **6 · 00:47–00:52 · Transition to Bangla** | Keep the verified result visible, then move to the Bangla summary view. | “Next is the action plan in Bangla, generated from this same analysis.” |
| **7 · 00:52–00:57 · Bangla insert (5 seconds)** | Hold on the actual Bangla summary for five seconds. | “This is the Bangla action plan for the sample analysis.” |
| **8 · 00:57–01:14 · Human decision and GitHub** | Show three real review decisions: approve one, edit one, reject one with a comment. Show GitHub issues only after the approved tasks actually create them; display the issue links. | “A reviewer approves, edits, or rejects each draft. Only approved tasks are sent to GitHub, and each created issue is linked back to its finding.” |
| **9 · 01:14–01:30 · Run log and repeated summary** | Show the same Bangla summary again inside the full result at **01:14–01:19**, then the actual run log: model, tokens, cost if reported, duration, and run ID. | “The Bangla summary is part of the full result as well. The run log reports the model and measured usage for this analysis.” |

## Required results card · 02:22

Show actual measured values only. Until enough successful, logged runs exist, keep each value in a dashed amber box marked **TBA — pending measured runs**.

| Measure | Value to show |
|---|---|
| AI provider and exact model name | TBA |
| Logged successful runs, n | TBA |
| Change-detection precision / recall vs NIST crosswalk | TBA — include evaluation sample and method |
| Citation verification rate | TBA — verified quotes ÷ quotes checked |
| Abstention rate | TBA — define the denominator and review rule |
| Cost per run | TBA — use provider-reported or configured cost and state which |
| Time per run | TBA — measured end-to-end latency |

## Baseline → target KPI card · 02:30

Keep all unvalidated values in dashed amber **TBA** boxes; do not invent consultant-hour, recall, or cost savings.

| KPI | Manual baseline | RegDelta target |
|---|---|---|
| Consultant hours per client per framework update | TBA — collect baseline | TBA — validate with timed workflow |
| Change-detection recall | TBA — evaluate manual review on the same gold set | TBA — measure against the same NIST crosswalk |
| Cost per update per client | TBA — include labor and source costs | TBA — include labor, model, and infrastructure costs |

## Bangla tagline review

Proposed text: **শনাক্ত করুন • যাচাই করুন • মেনে চলুন**. Mark **Bangla-speaker review: pending** until a Bangla-speaking teammate confirms the wording and tone. Do not label it approved before that check.

## Recording gate — current implementation status

This storyboard is the required target, but the current app is **not ready to record these nine shots as a completed workflow**. The running regulatory page currently supports uploading a CSF 2.0 PDF, code-based comparison, and a separate live document-summary request. The following storyboard steps still need implementation or configuration:

- **1:** On-demand public-source check/detection is not connected; the current flow starts from a user-selected PDF.
- **3:** The prior policy-impact API exists, but the current upload screen does not provide this sample-policy impact-map flow. The free OpenRouter endpoint has returned HTTP 429, so it has not produced a current live result.
- **4–6:** Exact quote verification code exists, and the API can return Bangla and draft actions after a successful model call. The current model rate limit prevents a real output to record.
- **8:** Regulatory finding approve/edit/reject and GitHub issue creation are not connected to this workflow. Do not simulate these steps or show placeholder issues as completed.
- **9:** Successful-run telemetry is returned by the API, but it must come from the actual run shown; do not fill in tokens, cost, model, or latency from estimates.

Record the final demo only when each shown state is produced by a real backend run and the full path is operational. Until then, use the storyboard as a production checklist, not as evidence that these features ran.
