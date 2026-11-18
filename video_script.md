# RegDelta Prototype Walkthrough — 90-second recording script

**Format:** 90 seconds, 1920×1080, MP4, English captions, optional English voiceover. Keep the browser and result readable; do not show `.env`, passwords, API tokens, or private client data.

## Before recording

1. Open RegDelta at `http://127.0.0.1:5173`, sign in, and open **Regulatory changes**.
2. Confirm OpenRouter has enough credit for a real request. The last attempt returned HTTP 402; if that still happens, add provider credit and run again. Do not present a generated result unless the request succeeds.
3. Click **Load synthetic sample policy**. It is labeled SAMPLE and safe for recording. If using another policy, use only a file approved for the configured AI provider.
4. Choose a workspace only if the account has more than one. It is a data scope, not a role.
5. Click **Analyze policy impact** and wait for a successful Gemini result before recording.
6. Use the actual IDs, statuses, quotes, model, latency, and cost displayed by this run. The current prototype assesses the 12 most relevant candidates from 211 crosswalk rows. Do not claim full recall or a specific pair such as `PR.AC-1 → PR.AA-01` unless that pair is visible in the result.

## Nine shots · 1:30 total

| Shot / time | Screen action | Voiceover |
|---|---|---|
| **1 · 00:00–00:08 · Detect** | Open the Regulatory changes page; frame RegDelta and the NIST CSF 1.1 → 2.0 source pack. | “RegDelta connects regulatory framework changes to client policies and agency actions.” |
| **2 · 00:08–00:18 · Change list** | Show the NIST source link and 211-row crosswalk count. | “This prototype uses the public NIST CSF 1.1 to 2.0 transition crosswalk.” |
| **3 · 00:18–00:30 · Input / live processing** | Load the labeled synthetic policy, show its label, select a workspace only if needed, click **Analyze policy impact**, and show the real loading state. | “I’m providing a synthetic client policy. Gemini assesses it against the framework changes.” |
| **4 · 00:30–00:41 · Impact map** | Show the dashboard, `assessed / 211` count, status chart, then an actual returned change and status. | “This run assesses the 12 changes most relevant to the policy. This shortlist does not represent full framework recall.” |
| **5 · 00:41–00:52 · DRAFT and verifier** | Open a result card. Show its actual before/after requirement, rationale, proposed policy change, remediation task, and verified quote—or Needs human review if no quote verified. | “Each finding includes its rationale and a proposed fix. An unverified quote is not shown as evidence.” |
| **6 · 00:52–01:07 · Bangla summary, shown twice** | **00:52–00:57:** zoom the Bangla summary for five seconds. **00:57–01:02:** show the English DRAFT recommendation. **01:02–01:07:** show the Bangla summary again inside the full result. | **00:52:** “This is the Bangla action-plan summary for the agency.” **00:57:** “All recommendations are drafts, not final compliance decisions.” **01:02:** “The Bangla action plan briefly explains the gaps and suggested work.” |
| **7 · 01:07–01:14 · Approve / edit / reject gate** | Show workflow step 6: **Human approval — Consultant required**. Do not imply the buttons are implemented for these findings. | “Approve, edit, and reject are not yet connected to this workflow, so findings remain drafts for review.” |
| **8 · 01:14–01:20 · GitHub action gate** | Show workflow step 7: **Act after approval — Not triggered**. Do not show a fake issue. | “GitHub issue creation is not connected yet, and no external action has been taken.” |
| **9 · 01:20–01:30 · Run log** | Show the actual provider/model, latency, cost, and request ID at the bottom of the result. | “These are the model and usage details for this live run. All output is for human review.” |

## Keep the claims accurate

- The app assesses up to 12 relevant candidates from the 211-row public crosswalk; it does not map all rows in this prototype.
- Say “evidence found/missing,” “potential conflict,” or “needs human review.” Never say a client is compliant.
- Approval and GitHub actions are visible as gated workflow steps, but are not connected to these findings yet.
- If OpenRouter returns an error (including HTTP 402), stop and fix the provider account before recording. Do not replace the result with sample or hardcoded output.
