# NIST regulatory source files

The initial RegDelta regulatory workspace uses public NIST source material. The data-generation script computes SHA-256 digests and emits `src/data/nistRegulatoryData.json`.

| File | Source | Use |
|---|---|---|
| `nist-csf-1.1-core.xlsx` | [NIST CSF 1.1 archive](https://www.nist.gov/cyberframework/csf-11-archive) | CSF 1.1 subcategory text. |
| `nist-csf-1.1-to-2.0-crosswalk.xlsx` | [NIST CSF 2.0 publication page](https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final) | Transition overview; supplies 1.1 to 2.0 IDs, descriptions, and change notes. |
| `nist-csf-1.1-to-2.0-olir-crosswalk.xlsx` | [NIST OLIR spreadsheet](https://csrc.nist.gov/csrc/media/Projects/olir/documents/submissions/CSFv1.1_to_CSFv2.0_CROSSWALK_20240220.xlsx) | Relationship reference set used for the lexical pair-matching baseline. |

The NIST-hosted OLIR includes third-party mappings that NIST does not correctness-test. Treat these pairs as a reference set, not independently adjudicated ground truth. Lexical precision and recall are a local baseline only; they are not model performance or change-detection precision and recall.

The CSF 2.0 Reference Tool export downloaded during development was a 2023 draft and is intentionally excluded. Final-version descriptions come from the NIST transition workbook. NIST states that CSF 1.1 had 108 subcategories and CSF 2.0 has 106; see [NIST's CSF FAQ](https://www.nist.gov/cyberframework/faqs).

Any client policy material shown in the local workspace is synthetic and must be labelled SAMPLE. No real client information is included.
