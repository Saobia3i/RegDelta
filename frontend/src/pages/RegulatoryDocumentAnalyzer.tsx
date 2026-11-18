import { useEffect, useState, type ChangeEvent } from "react";
import { api, hasToken } from "../api";
import { go, useMe } from "../ui";
import "./regulatory-changes.css";

type Section = { id: string; text: string };
type Diff = { op: string; old_text: string; new_text: string };
type DetectedChange = {
  old_sections: Section[];
  new_sections: Section[];
  change_type: string;
  similarity: number;
  reason: string;
  classification_source: string;
  unclear_for_review: boolean;
  word_diff: Diff[];
};
type FrameworkComparison = {
  algorithm: string;
  reference: string;
  metrics: {
    old_sections: number;
    new_sections: number;
    gold_relationships: number;
    predicted_relationships: number;
    true_positive: number;
    false_positive: number;
    false_negative: number;
    precision: number;
    recall: number;
    unclear_count: number;
  };
  counts: Record<string, number>;
  changes: DetectedChange[];
  input: {
    file_name: string;
    document_type: string;
    sha256: string;
    page_count: number;
    parsed_sections: number;
  };
  old_version_source: { file: string; url: string; version: string; sha256: string } | null;
};
type DocumentResult = {
  result: {
    summary: string;
    bangla_summary: string;
    key_actions: { action: string; owner_suggestion: string }[];
    citations: { page: number; quote: string; supports: string }[];
    needs_human_review: boolean;
  };
  run: {
    provider: string;
    model: string;
    request_id: string | null;
    input_tokens: number;
    output_tokens: number;
    cost_usd: number | null;
    latency_ms: number;
  };
  source: {
    file_name: string;
    source_label: string;
    document_type: string;
    page_count: number;
    extracted_characters: number;
    sha256: string;
  };
};

export default function RegulatoryDocumentAnalyzer() {
  const me = useMe();
  const tenants = me.memberships.filter((m) => m.permissions.includes("ai.run"));
  const needsLogin = !hasToken();
  const [tenantId, setTenantId] = useState(tenants[0]?.tenant_id || "");
  const [file, setFile] = useState<File | null>(null);
  const [comparison, setComparison] = useState<FrameworkComparison | null>(null);
  const [comparisonBusy, setComparisonBusy] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllDiff, setShowAllDiff] = useState(false);

  useEffect(() => {
    if (!tenantId && tenants.length) setTenantId(tenants[0].tenant_id);
  }, [tenantId, tenants]);

  async function compareUpload(upload: File, workspace: string) {
    setComparisonBusy(true);
    setError(null);
    const form = new FormData();
    form.append("tenant_id", workspace);
    form.append("file", upload);
    try {
      const response = await api.form<FrameworkComparison>("/v1/regulatory/compare-framework-upload", form);
      setComparison(response);
    } catch (e) {
      setComparison(null);
      setError(e instanceof Error ? e.message : "Uploaded document could not be compared.");
    } finally {
      setComparisonBusy(false);
    }
  }

  useEffect(() => {
    if (file && tenantId && !comparison && !comparisonBusy && !error) {
      void compareUpload(file, tenantId);
    }
  }, [file, tenantId, comparison, comparisonBusy, error]);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.currentTarget.files?.[0] || null;
    setFile(selected);
    setComparison(null);
    setAnalysis(null);
    setError(null);
    setShowAllDiff(false);
  }

  async function analyzeDocument() {
    if (!file || !tenantId) return;
    setBusy(true);
    setError(null);
    setAnalysis(null);
    const form = new FormData();
    form.append("tenant_id", tenantId);
    form.append("source_label", "user_original");
    form.append("file", file);
    try {
      const response = await api.form<DocumentResult>("/v1/regulatory/analyze-upload", form);
      setAnalysis(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : "AI analysis failed. No result was created.");
    } finally {
      setBusy(false);
    }
  }

  const hasInput = !!file;
  const shownChanges = comparison?.changes.slice(0, showAllDiff ? comparison.changes.length : 8) || [];
  const verifiedCitations = analysis?.result.citations.length || 0;
  const pipeline = [
    {
      n: "01",
      title: "Read uploaded PDF",
      state: comparison ? "done" : hasInput ? "partial" : "ready",
      badge: comparison ? comparison.input.parsed_sections + " sections parsed from upload" : hasInput ? "Reading your file" : "Waiting for PDF",
      body: comparison ? "Section IDs and descriptions were extracted from the selected PDF." : "The workflow starts only after you select a source PDF.",
    },
    {
      n: "02",
      title: "Compare versions (code)",
      state: comparison ? "done" : "pending",
      badge: comparison ? comparison.changes.length + " input-derived findings" : "After PDF parsing",
      body: comparison ? "Uploaded CSF 2.0 text is compared with the public CSF 1.1 reference." : "No comparison is shown until the uploaded PDF is parsed.",
    },
    {
      n: "03",
      title: "AI summary",
      state: analysis ? "done" : "pending",
      badge: analysis ? "Live model response" : "Awaiting successful model call",
      body: analysis ? "The summary was generated from the uploaded PDF text." : "A rate-limited or failed request creates no summary.",
    },
    {
      n: "04",
      title: "Draft action items",
      state: analysis ? "done" : "pending",
      badge: analysis ? analysis.result.key_actions.length + " draft actions" : "After AI response",
      body: "Actions are proposed from the uploaded document and remain drafts.",
    },
    {
      n: "05",
      title: "Verify citations",
      state: analysis ? "done" : "pending",
      badge: analysis ? verifiedCitations + " verified quotes" : "After AI response",
      body: "The backend checks each quote against its exact extracted PDF page.",
    },
    {
      n: "06",
      title: "Human review",
      state: "gate",
      badge: "Reviewer required",
      body: "Review the summary, Bangla, actions, and source quotations before use.",
    },
    {
      n: "07",
      title: "External action",
      state: "gate",
      badge: "Not triggered",
      body: "This workflow does not create or publish external actions.",
    },
  ];

  return (
    <div className="regdelta-workbench">
      <header className="rd-hero-header">
        <div>
          <div className="rd-eyebrow">REGDELTA · REGULATORY DOCUMENT ANALYSIS</div>
          <h1>Analyze the uploaded framework</h1>
        </div>
      </header>

      <section className="rd-hero-input card">
        <div className="rd-hero-input-head">
          <div>
            <span className="rd-kicker">INPUT · YOUR SELECTED PDF</span>
            <h2>Upload NIST CSF 2.0</h2>
          </div>
        </div>

        <p className="rd-code-method">
          The code comparison reads CSF 2.0 sections from the file you select. It uses the official CSF 1.1 core as the previous-version reference; it does not display comparison results before parsing your PDF.
        </p>

        <label className="rd-upload-drop">
          <input type="file" accept=".pdf,application/pdf" onChange={chooseFile} disabled={busy} />
          <span className="rd-upload-icon">↑</span>
          <b>{file ? file.name : "Choose the NIST CSF 2.0 PDF"}</b>
          <small>{file ? (file.size / 1024).toFixed(1) + " KB · selected from your device" : "Text-based PDF · up to 12 MB · the selected file is parsed by FastAPI"}</small>
        </label>

        {tenants.length === 1 && (
          <div className="rd-workspace-scope">
            <small>WORKSPACE FOR THIS RUN · ACCESS SCOPED</small>
            <b>{tenants[0].tenant_name || "Client workspace"}</b>
          </div>
        )}
        {tenants.length > 1 && (
          <label className="rd-tenant-select">
            Choose workspace for this run
            <select value={tenantId} onChange={(event) => { setTenantId(event.target.value); setComparison(null); setAnalysis(null); setError(null); }}>
              <option value="">Select a workspace</option>
              {tenants.map((tenant) => <option key={tenant.tenant_id} value={tenant.tenant_id}>{tenant.tenant_name}</option>)}
            </select>
          </label>
        )}
        {needsLogin && (
          <div className="rd-auth-required" role="status">
            <span>Sign in to run the FastAPI code comparison and configured AI model.</span>
            <button className="btn sm" onClick={() => go("/login")}>Sign in</button>
          </div>
        )}
        {!needsLogin && tenants.length === 0 && (
          <div className="rd-auth-required" role="status">This account has no workspace permission to analyze documents.</div>
        )}

        {comparisonBusy && <div className="rd-code-method" role="status">Reading the selected PDF and extracting CSF 2.0 sections…</div>}
        {comparison && (
          <section className="rd-code-detection" aria-label="Comparison derived from uploaded PDF">
            <div className="rd-dashboard-heading">
              <div><span className="rd-kicker">CODE COMPARISON · DERIVED FROM THIS PDF</span><h3>Framework change detection</h3></div>
              <span>{comparison.metrics.old_sections} old sections · {comparison.metrics.new_sections} sections from uploaded PDF</span>
            </div>
            <div className="rd-doc-source">
              <b>Uploaded input · {comparison.input.file_name}</b>
              <span>{comparison.input.page_count} pages · {comparison.input.parsed_sections} CSF sections parsed from file</span>
              <code>SHA-256 {comparison.input.sha256}</code>
            </div>
            <p className="rd-code-method">
              {comparison.algorithm}. Prior-version reference: {comparison.old_version_source?.version || "NIST CSF 1.1 Core"}. The new-version text comes from the uploaded PDF.
            </p>
            <div className="rd-code-metrics">
              <article><small>PRECISION VS NIST OLIR</small><b>{(comparison.metrics.precision * 100).toFixed(1)}%</b></article>
              <article><small>RECALL VS NIST OLIR</small><b>{(comparison.metrics.recall * 100).toFixed(1)}%</b></article>
              <article><small>GOLD RELATIONSHIPS</small><b>{comparison.metrics.gold_relationships}</b></article>
              <article><small>UNCLEAR MATCHES</small><b>{comparison.metrics.unclear_count}</b></article>
            </div>
            <div className="rd-code-counts">
              {Object.entries(comparison.counts).map(([name, count]) => <span key={name}><b>{count}</b> {name}</span>)}
            </div>
            <small className="rd-code-caveat">
              Evaluated against NIST OLIR relationships on this version pair; n={comparison.metrics.old_sections * comparison.metrics.new_sections} possible section pairs. Precision/recall describe this comparison run, not a universal guarantee.
            </small>
            <details className="rd-code-table">
              <summary>Inspect uploaded-PDF changes and word-level diff ({comparison.changes.length})</summary>
              <div className="rd-code-table-scroll">
                <table>
                  <thead><tr><th>CSF 1.1 ID</th><th>Uploaded CSF 2.0 ID</th><th>Code classification</th><th>Similarity</th><th>Word diff</th></tr></thead>
                  <tbody>
                    {shownChanges.map((item, index) => (
                      <tr key={item.old_sections.map((section) => section.id).join("+") + "-" + item.new_sections.map((section) => section.id).join("+") + "-" + index}>
                        <td>{item.old_sections.map((section) => section.id).join(" + ") || "—"}</td>
                        <td>{item.new_sections.map((section) => section.id).join(" + ") || "—"}</td>
                        <td><b>{item.change_type}</b><small>{item.classification_source === "model" ? "Model reviewed borderline" : "Code"}</small><small>{item.reason}</small></td>
                        <td>{(item.similarity * 100).toFixed(1)}%</td>
                        <td><details><summary>View diff</summary>{item.word_diff.length ? item.word_diff.map((diff, i) => <span className="rd-word-diff" data-op={diff.op} key={i}>{diff.old_text && <del>{diff.old_text}</del>}{diff.new_text && <ins>{diff.new_text}</ins>}</span>) : <span>No wording changes.</span>}</details></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {comparison.changes.length > 8 && <button className="btn sm" type="button" onClick={() => setShowAllDiff((value) => !value)}>{showAllDiff ? "Show first 8" : "Show all changes"}</button>}
            </details>
          </section>
        )}

        <section className="rd-pipeline" aria-label="Seven-step document workflow">
          <div className="rd-pipeline-head">
            <div><span className="rd-kicker">REGDELTA · 7-STEP WORKFLOW</span><h3>From uploaded source to reviewed summary</h3></div>
            <span>Live status · this run</span>
          </div>
          <ol className="rd-pipeline-grid">
            {pipeline.map((step) => <li className="rd-pipeline-step" data-state={step.state} key={step.n}><span className="rd-pipeline-number">{step.n}</span><div><b>{step.title}</b><small>{step.body}</small></div><em>{step.badge}</em></li>)}
          </ol>
          <p className="rd-pipeline-note">Human review is required. No external action is taken by this document-analysis flow.</p>
        </section>

        <div className="rd-submit-row">
          <span>Code compares extracted source sections. The AI summary only appears after a successful live model call.</span>
          <button className="btn primary" disabled={busy || !tenantId || !file} onClick={analyzeDocument}>{busy ? "Reading and analyzing your PDF…" : "Generate AI summary and action plan"}</button>
        </div>
        {error && <div className="rd-ai-error" role="alert"><b>Analysis did not complete.</b> {error}</div>}
      </section>

      {analysis && (
        <section className="rd-ai-result" aria-live="polite">
          <div className="rd-ai-result-head">
            <div><span className="rd-kicker">OUTPUT · LIVE MODEL RESPONSE</span><h2>Document summary and action plan <span className="rd-draft-pill">DRAFT · HUMAN REVIEW REQUIRED</span></h2></div>
            <span className={"rd-impact-status " + (analysis.result.needs_human_review ? "needs_human_review" : "evidence_found")}>{analysis.result.needs_human_review ? "Human review required" : "Draft ready for review"}</span>
          </div>
          <div className="rd-doc-source">
            <b>{analysis.source.file_name}</b>
            <span>{analysis.source.document_type} · {analysis.source.page_count} pages · {analysis.source.extracted_characters.toLocaleString()} characters</span>
            <code>SHA-256 {analysis.source.sha256}</code>
          </div>
          <div className="rd-run-kpis">
            <article><small>VERIFIED CITATIONS</small><b>{analysis.result.citations.length}</b></article>
            <article><small>DRAFT ACTIONS</small><b>{analysis.result.key_actions.length}</b></article>
            <article><small>MODEL LATENCY</small><b>{(analysis.run.latency_ms / 1000).toFixed(2)} s</b></article>
            <article><small>HUMAN REVIEW</small><b>{analysis.result.needs_human_review ? "Required" : "Recommended"}</b></article>
          </div>
          <div className="rd-result-grid">
            <article className="rd-result-card"><span className="rd-kicker">SOURCE SUMMARY · DRAFT</span><p>{analysis.result.summary}</p></article>
            <article className="rd-result-card rd-bangla-card"><span className="rd-kicker">BANGLA SUMMARY · DRAFT</span><p lang="bn">{analysis.result.bangla_summary}</p><small>Bangla reviewer approval is required before client use.</small></article>
          </div>
          <div className="rd-fix-grid">
            {analysis.result.key_actions.map((action, index) => <section key={index}><span className="rd-kicker">DRAFT ACTION {index + 1}</span><p>{action.action}</p><small>Suggested owner: {action.owner_suggestion}</small></section>)}
          </div>
          <div className="rd-change-list">
            {analysis.result.citations.map((citation, index) => <article className="rd-change-card" key={index}><header><div><span className="rd-kicker">SOURCE CITATION {index + 1} · PAGE {citation.page}</span><h3>Verified against uploaded PDF</h3></div><span className="rd-impact-status evidence_found">Exact quote verified</span></header><blockquote>{citation.quote}</blockquote><small>{citation.supports}</small></article>)}
          </div>
          <p className="rd-chart-note">Exact quote checks prove that each quotation appears on the stated extracted PDF page. They do not prove legal interpretation or action quality.</p>
          <div className="rd-model-run">
            <span>Live run · {analysis.run.provider} / {analysis.run.model}</span>
            <span>{analysis.run.input_tokens} input · {analysis.run.output_tokens} output tokens</span>
            <span>{analysis.run.latency_ms.toLocaleString()} ms</span>
            <span>{analysis.run.cost_usd == null ? "Cost not reported" : "$" + analysis.run.cost_usd.toFixed(6)}</span>
            {analysis.run.request_id && <code>{analysis.run.request_id}</code>}
          </div>
        </section>
      )}
    </div>
  );
}