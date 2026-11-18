# RegDelta — Real PDF Analysis Walkthrough (English)

**Target length:** 85 seconds · **Capture:** 1920×1080, MP4, no desktop audio required.

## Recording preflight

1. Start the FastAPI backend and Vite frontend. Open `http://127.0.0.1:5173` and sign in.
2. Upload the real NIST Cybersecurity Framework (CSF) 2.0 PDF. The repository includes `frontend/public/recording-input/NIST-CSF-2.0.pdf` (32 pages, 106 subcategories); select it in the file picker. It is not preloaded into the page.
3. Wait for FastAPI to extract the PDF. Confirm the displayed filename, SHA-256, page count, and parsed section count match the selected file.
4. The code engine compares the uploaded CSF 2.0 section text to the bundled public CSF 1.1 core. Precision and recall are measured against NIST OLIR relationships for this version pair only.
5. Click **Generate AI summary and action plan**. The latest observed OpenRouter response was HTTP 429. Record the AI portions below only after a real request succeeds and the result plus quote verification are visible. Do not use a canned response.

## Nine shots · 1:25 total

| Shot / time | Screen action | Voiceover |
|---|---|---|
| **1 · 00:00–00:08 · Detect** | Show Regulatory Document Analysis before file selection; the comparison panel is empty. | “This is RegDelta’s document analysis flow. No change list or AI answer is shown before I provide a source file.” |
| **2 · 00:08–00:18 · Ingest** | Select `NIST-CSF-2.0.pdf`. Wait for parsing, then show the actual name, page count, extracted sections, and file hash. | “I’m uploading the NIST Cybersecurity Framework 2.0 PDF. FastAPI reads this file and displays its fingerprint and the sections it extracted.” |
| **3 · 00:18–00:28 · Change list** | Show the uploaded-file label, section counts, code comparison metrics, and detected-change totals. | “The code engine compares the uploaded CSF 2.0 text with the public CSF 1.1 core. These results appear only after the upload has been parsed.” |
| **4 · 00:28–00:38 · Inspect a change** | Open a row and its word-level diff. Show `PR.AC-1 → PR.AA-01` only if that pair appears in this run. | “Here I can inspect the matched sections and the exact wording differences. An unclear match is flagged for review rather than presented as a certain relationship.” |
| **5 · 00:38–00:47 · Start AI processing** | Click **Generate AI summary and action plan** and show the live loading state. | “Now I’m sending this same uploaded PDF to the configured model for a summary, Bangla action plan, draft recommendations, and source quotations.” |
| **6 · 00:47–00:52 · DRAFT and verifier** | On success, show actual draft actions and one returned citation marked as verified. On error, keep the error visible and do not claim a draft or verified quote. | “RegDelta checks each returned quote against the extracted text on its stated page. These recommendations remain drafts for human review.” |
| **7 · 00:52–00:57 · Bangla summary, first view** | Show the actual generated Bangla summary for five seconds. | “This is the Bangla summary generated from the uploaded document.” |
| **8 · 00:57–01:12 · Human and external-action gates** | Show the complete result, including the Bangla summary again at **01:02–01:07**. Then show the human-review and external-action workflow gates. | “The Bangla summary is shown again inside the full result. Approval and GitHub issue creation are not connected to this workflow, so all output stays a draft and no external action is taken.” |
| **9 · 01:12–01:25 · Run log and scope** | Show the actual provider/model, latency, token counts, cost if reported, then the workflow gate. | “This run log shows the actual provider and usage metadata. This flow compares framework text; it does not yet produce a client-policy impact map or create GitHub issues.” |

## If OpenRouter still returns HTTP 429

Show the real rate-limit error after the live request. Do not narrate or display a generated English summary, Bangla summary, draft action, or citation unless that result actually exists. You can still record the successful file ingestion and code comparison, but a video that needs to prove AI-generated Bangla output is not complete until a real model request succeeds.

## Accuracy notes

- The repository's public recording PDF has 32 pages and 106 CSF 2.0 subcategories. Other files can have different counts and must pass backend validation.
- Do not narrate fixed findings, metrics, or a specific section pair unless it is visible in the current uploaded-file result.
- Precision/recall are comparison-run measurements against NIST OLIR relationships for this source pair, not universal model quality or client-policy recall.
- Exact-quote verification proves that text appears on the stated extracted page. It does not validate legal interpretation or recommendation quality.
- The current flow has no connected approve/edit/reject action for these findings, no client-policy impact map, and no GitHub issue creation.
