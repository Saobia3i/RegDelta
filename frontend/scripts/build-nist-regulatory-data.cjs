const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const XLSX = require("xlsx");

const root = path.resolve(__dirname, "..");
const rawDir = path.join(root, "public", "regulatory-sources");
const outDir = path.join(root, "src", "data");
const sources = {
  transition: {
    file: "nist-csf-1.1-to-2.0-crosswalk.xlsx",
    url: "https://www.nist.gov/document/csf-11-csf-20-core-transition-changes",
    version: "CSF 1.1 to CSF 2.0 Core Transition Changes Overview",
  },
  olir: {
    file: "nist-csf-1.1-to-2.0-olir-crosswalk.xlsx",
    url: "https://csrc.nist.gov/csrc/media/Projects/olir/documents/submissions/CSFv1.1_to_CSFv2.0_CROSSWALK_20240220.xlsx",
    version: "NIST OLIR relationship crosswalk, 2024-02-20",
  },
  csf11: {
    file: "nist-csf-1.1-core.xlsx",
    url: "https://www.nist.gov/document/2018-04-16frameworkv11core1xlsx",
    version: "CSF 1.1 Core, April 2018",
  },
};

function readSheet(source, sheetName, range) {
  const workbook = XLSX.readFile(path.join(rawDir, source.file));
  const sheet = workbook.Sheets[sheetName || workbook.SheetNames.at(-1)];
  return XLSX.utils.sheet_to_json(sheet, { defval: "", blankrows: false, range });
}
function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(rawDir, file))).digest("hex");
}
function clean(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

const rows = readSheet(sources.transition, "Change Analysis CSF 1.1-2.0").map((r, index) => {
  const oldId = clean(r["CSF 1.1 Identifier"]);
  const newId = clean(r["CSF 2.0 Identifier"]);
  const oldText = clean(r["CSF 1.1 Description"]);
  const newText = clean(r["CSF 2.0 Description"]);
  const modifications = clean(r["Noteworthy Modifications"]);
  const relocation = clean(r.Relocation);
  const isNew = clean(r["New in CSF 2.0"]).toUpperCase() === "Y";
  const goldPositive = isNew || /^Y\b/i.test(relocation) || (modifications !== "" && modifications !== "N/A");
  const predictedPositive = !oldId || !newId || oldId !== newId || oldText !== newText;
  let type = "Unchanged";
  if (!oldId && newId) type = "Added";
  else if (oldId && !newId) type = "Removed / incorporated";
  else if (oldId !== newId && oldText === newText) type = "Renumbered / relocated";
  else if (oldId !== newId && oldText !== newText) type = "Changed / relocated";
  else if (oldText !== newText) type = "Changed";
  return {
    rowId: `nist-transition-${index + 1}`,
    oldId, oldText, newId, newText, relocation, modifications,
    newInCsf20: isNew, type, goldPositive, predictedPositive,
  };
}).filter((r) => r.oldId || r.newId);

const changes = rows.filter((r) => r.predictedPositive);
const olirRows = readSheet(sources.olir, "Relationships").map((r) => ({
  csf20Id: clean(r["Focal Document\r\nElement"] || r["Focal Document Element"]),
  csf20Text: clean(r["Focal Document Element Description"]),
  csf11Id: clean(r["Reference Document\r\nElement"] || r["Reference Document Element"]),
  csf11Text: clean(r["Reference Document\r\nElement Description\r\n(Optional)"]),
  comment: clean(r["Comments\r\n(Optional)"]),
  strength: clean(r["Strength of\r\nRelationship\r\n(Optional)" ]),
})).filter((r) => r.csf11Id && r.csf20Id);

const csf11Rows = readSheet(sources.csf11, "Sheet1");
function getSubcategories(raw) {
  const entries = new Map();
  for (const r of raw) {
    const text = clean(r.Subcategory);
    const m = text.match(/^([A-Z]{2}\.[A-Z]{2}-\d+):\s*(.*)$/);
    if (m) entries.set(m[1], m[2]);
  }
  return entries;
}
const csf11 = getSubcategories(csf11Rows);
const csf20 = new Map();
for (const r of rows) {
  if (/^[A-Z]{2}\.[A-Z]{2}-\d+$/.test(r.newId)) csf20.set(r.newId, r.newText);
}

// Fixed lexical baseline: predict a pair if the IDs match or description-token
// Jaccard is >= .30. NIST OLIR relationship pairs provide the reference labels.
const stop = new Set("the a an and or of to in for with is are be by on as from that this their its within through into based organization organizations must should can may have has been being".split(" "));
function tokens(text) {
  return new Set(clean(text).toLowerCase().replace(/[^a-z0-9. -]/g, " ").split(/\s+/).filter((x) => x.length > 2 && !stop.has(x)));
}
function jaccard(a, b) {
  const x = tokens(a), y = tokens(b);
  const intersection = [...x].filter((t) => y.has(t)).length;
  const union = new Set([...x, ...y]).size;
  return union ? intersection / union : 0;
}
const goldPairs = new Set(olirRows.filter((r) => csf11.has(r.csf11Id) && csf20.has(r.csf20Id)).map((r) => `${r.csf11Id}|${r.csf20Id}`));
const predictedPairs = new Set();
for (const [oldId, oldText] of csf11) for (const [newId, newText] of csf20) {
  if (oldId === newId || jaccard(oldText, newText) >= 0.3) predictedPairs.add(`${oldId}|${newId}`);
}
const tp = [...predictedPairs].filter((p) => goldPairs.has(p)).length;
const fp = predictedPairs.size - tp;
const fn = [...goldPairs].filter((p) => !predictedPairs.has(p)).length;
const metrics = {
  label: "Candidate relationship detection; lexical baseline, not model quality",
  method: "For every CSF 1.1/2.0 subcategory pair, predict a relationship when identifiers match or description-token Jaccard similarity is at least 0.30. Compare with NIST OLIR relationship pairs present in both source cores.",
  threshold: 0.3,
  sampleSize: csf11.size * csf20.size,
  goldRelationships: goldPairs.size,
  predictedRelationships: predictedPairs.size,
  truePositive: tp, falsePositive: fp, falseNegative: fn,
  precision: tp + fp ? tp / (tp + fp) : 0,
  recall: tp + fn ? tp / (tp + fn) : 0,
};

const output = {
  title: "NIST CSF 1.1 → 2.0 demo dataset",
  generatedAt: new Date().toISOString(),
  sources: Object.values(sources).map((s) => ({ ...s, sha256: sha256(s.file) })),
  sourceRowCounts: { csf11Subcategories: csf11.size, csf20Subcategories: csf20.size, olirRelationships: olirRows.length },
  frameworkSubcategories: {
    csf11: [...csf11.entries()].map(([id, text]) => ({ id, text })).sort((a, b) => a.id.localeCompare(b.id)),
    csf20: [...csf20.entries()].map(([id, text]) => ({ id, text })).sort((a, b) => a.id.localeCompare(b.id)),
  },
  metrics,
  olirRelationships: olirRows,
  transitions: rows,
  demoCaseId: "PR.AC-1-to-PR.AA-01",
};
fs.mkdirSync(outDir, { recursive: true });
const serialized = JSON.stringify(output, null, 2) + "\n";
fs.writeFileSync(path.join(outDir, "nistRegulatoryData.json"), serialized);
const backendData = path.resolve(root, "../backend/tensor_ops/content/regulatory/nist_csf_11_20_crosswalk.json");
if (fs.existsSync(path.dirname(backendData))) {
  fs.writeFileSync(backendData, serialized);
}
console.log(JSON.stringify({ rows: rows.length, changes: changes.length, metrics, demoCase: rows.find((r) => r.oldId === "PR.AC-1" && r.newId === "PR.AA-01") }, null, 2));
