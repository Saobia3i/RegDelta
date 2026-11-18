import { lazy, Suspense, useState, type ChangeEvent } from "react";
import { api, hasToken } from "../api";
import { go, useMe } from "../ui";
import "./regulatory-changes.css";

const RegulatoryAnalyticsCharts = lazy(() => import("./RegulatoryAnalyticsCharts"));

type Citation = { page: number; quote: string; supports: string };
type Action = { action: string; owner_suggestion: string };
type Summary = { summary: string; bangla_summary: string; key_actions: Action[]; citations: Citation[]; needs_human_review: boolean };
type ModelRun = { provider: string; model: string; request_id: string | null; input_tokens: number; output_tokens: number; cost_usd: number | null; latency_ms: number };
type AnalyzeResponse = { result: Summary; run: ModelRun; source: { file_name: string; source_label: string; document_type: string; page_count: number; extracted_characters: number; sha256: string } };

export default function RegulatoryChanges() {
  const me = useMe();
  const tenants = me.memberships.filter((membership) => membership.permissions.includes("ai.run"));
  const needsLogin = !hasToken();
  const [tenantId, setTenantId] = useState(tenants[0]?.tenant_id || "");
  const [file, setFile] = useState<File | null>(null);
  const [sourceLabel, setSourceLabel] = useState<"Sample Public Data" | "User original file">("Sample Public Data");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const next = event.currentTarget.files?.[0] ?? null;
    setFile(next); setResult(null); setError(null);
  }

  async function analyze() {
    if (!file) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("tenant_id", tenantId);
      form.append("source_label", sourceLabel === "Sample Public Data" ? "sample_public_data" : "user_original");
      setResult(await api.form<AnalyzeResponse>("/v1/regulatory/analyze-upload", form));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Document analysis failed. No result was generated.");
    } finally { setBusy(false); }
  }

  return <div className="regdelta-workbench">
    <header className="rd-hero-header">
      <div><div className="rd-eyebrow">REGDELTA · DOCUMENT REVIEW</div><h1>Upload a source document</h1>
        <p>Gemini extracts and summarizes the uploaded document, drafts action items in Bangla, and cites exact page text.</p></div>
      <div className="rd-hero-badges"><span className="rd-chip"><i className="rd-dot green" />{sourceLabel.toUpperCase()}</span><span className="rd-chip"><i className="rd-dot amber" />LIVE GEMINI REQUEST</span></div>
    </header>

    <section className="rd-hero-input card">
      <div className="rd-hero-input-head"><div><span className="rd-kicker">INPUT · SELECT YOUR REAL FILE</span><h2>Source document</h2></div><span className="rd-sample-label">NO SAMPLE ANSWER</span></div>
      <label className="rd-upload-drop">
        <input type="file" accept=".pdf,application/pdf,.txt,.md,text/plain,text/markdown" onChange={chooseFile} disabled={busy} />
        <span className="rd-upload-icon">↑</span><b>{file ? file.name : "Choose a PDF, TXT, or Markdown file"}</b>
        <small>{file ? `${(file.size / 1024).toFixed(1)} KB · ${file.type || "file"}` : "Text-based PDF supported · maximum 12 MB · scanned-image OCR is not included"}</small>
      </label>
      <fieldset className="rd-source-kind"><legend>Source label for the recording</legend>
        <label><input type="radio" name="source-label" checked={sourceLabel === "Sample Public Data"} onChange={() => setSourceLabel("Sample Public Data")} /> Sample Public Data</label>
        <label><input type="radio" name="source-label" checked={sourceLabel === "User original file"} onChange={() => setSourceLabel("User original file")} /> My original file</label>
      </fieldset>
      <label className="rd-tenant-select">Client workspace
        <select value={tenantId} onChange={(event) => setTenantId(event.target.value)} disabled={busy || tenants.length === 0}>
          {tenants.length === 0 && <option value="">{needsLogin ? "Sign in to load your workspaces" : "No workspace with AI run permission"}</option>}
          {tenants.map((tenant) => <option key={tenant.tenant_id} value={tenant.tenant_id}>{tenant.tenant_name}</option>)}
        </select>
      </label>
      {needsLogin && <div className="rd-auth-required" role="status"><span>Local reviewer mode is for navigation only. Sign in to use the FastAPI upload and AI flow.</span><button className="btn sm" onClick={() => go("/login")}>Sign in</button></div>}
      {!needsLogin && tenants.length === 0 && <div className="rd-auth-required" role="status">Your account has no workspace with AI run permission. Ask a workspace administrator to grant access.</div>}
      <div className="rd-upload-privacy">The FastAPI backend parses the selected file in memory and sends extracted text to the configured AI provider. The source file is not saved; the backend records a tenant-scoped run with SHA-256 and usage metadata. Use only documents approved for this model.</div>
      <div className="rd-submit-row"><span>Output is generated only after the model call; failed calls show no draft.</span>
        <button className="btn primary" disabled={busy || !file || !tenantId} onClick={analyze}>{busy ? "Uploading and analyzing…" : "Analyze original document"}</button></div>
      {error && <div className="rd-ai-error" role="alert"><b>No AI result generated.</b> {error}</div>}
    </section>

    {result && <section className="rd-ai-result" aria-live="polite">
      <div className="rd-ai-result-head"><div><span className="rd-kicker">OUTPUT · REAL MODEL RESPONSE</span><h2>Document summary <span className="rd-draft-pill">DRAFT · HUMAN REVIEW REQUIRED</span></h2></div>
        <span className={`rd-impact-status ${result.result.needs_human_review ? "needs_human_review" : "evidence_found"}`}>{result.result.needs_human_review ? "Needs human review" : "Review before use"}</span></div>
      <div className="rd-doc-source"><b>{result.source.file_name} · {result.source.source_label}</b><span>{result.source.document_type} · {result.source.page_count} page(s) · {result.source.extracted_characters.toLocaleString()} extracted characters</span><code>SHA-256 {result.source.sha256}</code></div>
      <div className="rd-run-kpis" aria-label="This run metrics">
        <article><small>PAGES EXTRACTED</small><b>{result.source.page_count}</b></article>
        <article><small>ACTIONS DRAFTED</small><b>{result.result.key_actions.length}</b></article>
        <article><small>PAGE CITATIONS VERIFIED</small><b>{result.result.citations.length}/{result.result.citations.length} · 100%</b></article>
        <article><small>MODEL LATENCY</small><b>{(result.run.latency_ms / 1000).toFixed(2)} s</b></article>
        <article><small>REPORTED MODEL COST</small><b>{result.run.cost_usd == null ? "Not reported" : `$${result.run.cost_usd.toFixed(4)}`}</b></article>
      </div>
      <Suspense fallback={<div className="rd-chart-loading">Loading run analytics…</div>}>
        <RegulatoryAnalyticsCharts citations={result.result.citations} actions={result.result.key_actions}
          inputTokens={result.run.input_tokens} outputTokens={result.run.output_tokens} />
      </Suspense>
      <div className="rd-result-grid">
        <article className="rd-result-card"><span className="rd-kicker">ENGLISH SUMMARY · DRAFT</span><p>{result.result.summary}</p></article>
        <article className="rd-result-card rd-bangla-card"><span className="rd-kicker">বাংলা সারাংশ · DRAFT</span><p lang="bn">{result.result.bangla_summary}</p><small>Bangla teammate review required before use.</small></article>
        <article className="rd-result-card rd-actions-card"><span className="rd-kicker">ACTION PLAN · DRAFT</span><ol>{result.result.key_actions.map((item, index) => <li key={index}><b>{item.action}</b><small>Suggested owner: {item.owner_suggestion || "Human assignment required"}</small></li>)}</ol></article>
      </div>
      <article className="rd-citations-card"><div className="rd-citation-title"><span className="rd-kicker">CODE-VERIFIED SOURCE CITATIONS</span><b>Quotes are checked against the cited page with PDF line wraps, whitespace, and Unicode typography normalized. Near-verbatim quotes are replaced with an exact extracted source excerpt.</b></div>
        {result.result.citations.map((citation, index) => <div className="rd-citation" key={`${citation.page}-${index}`}>
          <span className="rd-verified-badge">PAGE {citation.page} · VERIFIED</span><div><b>{citation.supports}</b><blockquote>{citation.quote}</blockquote></div>
        </div>)}
      </article>
      <div className="rd-model-run"><span>Live run · {result.run.provider} / {result.run.model}</span><span>{result.run.input_tokens} input · {result.run.output_tokens} output tokens</span>
        <span>{result.run.latency_ms.toLocaleString()} ms</span><span>{result.run.cost_usd == null ? "Provider cost not reported" : `$${result.run.cost_usd.toFixed(6)}`}</span>
        {result.run.request_id && <code>{result.run.request_id}</code>}</div>
    </section>}
    {!result && !error && <div className="rd-empty-result"><b>Upload your original document to begin.</b><span>No prewritten summary, placeholder citation, or sample output is loaded.</span></div>}
  </div>;
}
