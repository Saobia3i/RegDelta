"""Deterministic framework-version comparison with an auditable lexical baseline.

Identifier matches and text matching are code decisions. Mid-range matches stay
explicitly unclear; this module never asks a model to invent a correspondence.
"""
from __future__ import annotations

import re
import unicodedata
from functools import lru_cache
from difflib import SequenceMatcher
from itertools import combinations
from typing import Any


MATCH_THRESHOLD = 0.60
HIGH_SIMILARITY_THRESHOLD = 0.84
GROUP_MATCH_THRESHOLD = 0.78
_STOP_WORDS = frozenset("a an and are as at be been being by can could for from has have in into is it its of on or our shall should that the their them then there these they this those through to was were will with within would".split())


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value or "").casefold()
    value = value.replace("\u00ad", "").replace("\u200b", "").replace("\ufeff", "")
    value = re.sub(r"(?<=[^\W\d_])[-\u2010-\u2015][ \t]*\n[ \t]*(?=[^\W\d_])", "", value)
    value = re.sub(r"[^\w]+", " ", value, flags=re.UNICODE)
    return " ".join(value.split())


@lru_cache(maxsize=8192)
def _tokens(value: str) -> frozenset[str]:
    return frozenset(token for token in normalize_text(value).split()
                     if token not in _STOP_WORDS and len(token) > 1)


def _similarity(left: str, right: str) -> float:
    a, b = _tokens(left), _tokens(right)
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    # Overlap coefficient is an efficient token-set score. It tolerates word
    # reorderings and a small set of additions/removals without embeddings.
    return round(len(a & b) / min(len(a), len(b)), 4)


def _word_diff(old_text: str, new_text: str) -> list[dict[str, str]]:
    old_words = re.findall(r"\S+", old_text)
    new_words = re.findall(r"\S+", new_text)
    matcher = SequenceMatcher(None, old_words, new_words, autojunk=False)
    result: list[dict[str, str]] = []
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            continue
        result.append({
            "op": "replace" if tag == "replace" else ("remove" if tag == "delete" else "add"),
            "old_text": " ".join(old_words[i1:i2]),
            "new_text": " ".join(new_words[j1:j2]),
        })
    return result[:80]


def _maximum_assignment(scores: list[list[float]]) -> list[tuple[int, int]]:
    """Maximum-weight rectangular assignment using the O(n^3) Hungarian method."""
    rows = len(scores)
    cols = len(scores[0]) if rows else 0
    n = max(rows, cols)
    if not n:
        return []
    cost = [[1.0 - scores[i][j] if i < rows and j < cols else 1.0
             for j in range(n)] for i in range(n)]
    u = [0.0] * (n + 1)
    v = [0.0] * (n + 1)
    p = [0] * (n + 1)
    way = [0] * (n + 1)
    for i in range(1, n + 1):
        p[0] = i
        j0 = 0
        minv = [float("inf")] * (n + 1)
        used = [False] * (n + 1)
        while True:
            used[j0] = True
            i0 = p[j0]
            delta = float("inf")
            j1 = 0
            for j in range(1, n + 1):
                if used[j]:
                    continue
                cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
                if cur < minv[j]:
                    minv[j] = cur
                    way[j] = j0
                if minv[j] < delta:
                    delta, j1 = minv[j], j
            for j in range(n + 1):
                if used[j]:
                    u[p[j]] += delta
                    v[j] -= delta
                else:
                    minv[j] -= delta
            j0 = j1
            if p[j0] == 0:
                break
        while True:
            j1 = way[j0]
            p[j0] = p[j1]
            j0 = j1
            if j0 == 0:
                break
    pairs = [(p[j] - 1, j - 1) for j in range(1, n + 1) if p[j]]
    return [(i, j) for i, j in pairs if i < rows and j < cols]


def _classify(old: dict[str, str], new: dict[str, str], score: float) -> tuple[str, str]:
    if old["id"] == new["id"]:
        if score >= 0.995:
            return "unchanged", "Exact identifier and near-identical normalized text."
        if score >= HIGH_SIMILARITY_THRESHOLD:
            return "reworded", "Exact identifier; high text similarity with wording differences."
        if score >= MATCH_THRESHOLD:
            return "unclear", "Exact identifier; text similarity is in the review band."
        return "changed", "Exact identifier; text similarity is below the review band."
    if score >= HIGH_SIMILARITY_THRESHOLD:
        return "renumbered", "Different identifiers; high text similarity indicates a likely relocation."
    if score >= MATCH_THRESHOLD:
        return "unclear", "Different identifiers; text similarity is in the review band."
    return "changed", "Paired by global assignment; substantive text difference is likely."


def _item(old_sections: list[dict[str, str]], new_sections: list[dict[str, str]], change_type: str,
          score: float, reason: str, source: str = "code") -> dict[str, Any]:
    old_text = " ".join(x["text"] for x in old_sections)
    new_text = " ".join(x["text"] for x in new_sections)
    return {
        "old_sections": old_sections,
        "new_sections": new_sections,
        "change_type": change_type,
        "similarity": round(score, 4),
        "reason": reason,
        "classification_source": source,
        "unclear_for_review": change_type == "unclear",
        "word_diff": _word_diff(old_text, new_text),
    }


def compare_frameworks(dataset: dict[str, Any], uploaded_new_sections: list[dict[str, str]] | None = None) -> dict[str, Any]:
    """Compare source subcategories, optionally using sections extracted from an uploaded new-version file."""
    source_sets = dataset.get("frameworkSubcategories") or {}
    old_rows = source_sets.get("csf11") or []
    new_rows = uploaded_new_sections if uploaded_new_sections is not None else source_sets.get("csf20") or []
    if not old_rows or not new_rows:
        raise ValueError("NIST source dataset is missing the versioned subcategory inventories.")
    old = {row["id"]: {"id": row["id"], "text": row["text"]} for row in old_rows if row.get("id") and row.get("text")}
    new = {row["id"]: {"id": row["id"], "text": row["text"]} for row in new_rows if row.get("id") and row.get("text")}
    old_ids, new_ids = sorted(old), sorted(new)
    unmatched_old, unmatched_new = set(old_ids), set(new_ids)
    items: list[dict[str, Any]] = []

    # Stable identifiers always take precedence over text similarity.
    for section_id in sorted(unmatched_old & unmatched_new):
        score = _similarity(old[section_id]["text"], new[section_id]["text"])
        kind, reason = _classify(old[section_id], new[section_id], score)
        items.append(_item([old[section_id]], [new[section_id]], kind, score, reason))
        unmatched_old.remove(section_id)
        unmatched_new.remove(section_id)

    # Global assignment makes each remaining section participate in at most one
    # ordinary match; it avoids a greedy early match consuming a better pair.
    remaining_old, remaining_new = sorted(unmatched_old), sorted(unmatched_new)
    pair_scores = [[_similarity(old[a]["text"], new[b]["text"]) for b in remaining_new]
                   for a in remaining_old]
    accepted_old: set[str] = set()
    accepted_new: set[str] = set()
    for i, j in _maximum_assignment(pair_scores):
        score = pair_scores[i][j]
        if score < MATCH_THRESHOLD:
            continue
        old_id, new_id = remaining_old[i], remaining_new[j]
        kind, reason = _classify(old[old_id], new[new_id], score)
        items.append(_item([old[old_id]], [new[new_id]], kind, score, reason))
        accepted_old.add(old_id)
        accepted_new.add(new_id)
    unmatched_old -= accepted_old
    unmatched_new -= accepted_new

    # Detect high-confidence 1:N splits and N:1 merges among still-unmatched
    # sections, using combined text. Greedy selection is deterministic and keeps
    # each section in no more than one group.
    split_candidates: list[tuple[float, str, tuple[str, ...]]] = []
    for old_id in sorted(unmatched_old):
        ranked = sorted((( _similarity(old[old_id]["text"], new[n]["text"]), n) for n in unmatched_new), reverse=True)
        shortlist = [n for score, n in ranked[:8] if score >= 0.18]
        for group_size in (2, 3):
            for group in combinations(shortlist, group_size):
                combined = " ".join(new[n]["text"] for n in group)
                score = _similarity(old[old_id]["text"], combined)
                if score >= GROUP_MATCH_THRESHOLD:
                    split_candidates.append((score, old_id, tuple(sorted(group))))
    for score, old_id, group in sorted(split_candidates, reverse=True):
        if old_id not in unmatched_old or not set(group).issubset(unmatched_new):
            continue
        items.append(_item([old[old_id]], [new[n] for n in group], "split", score,
                           "Combined new-section text has high similarity to one unmatched old section."))
        unmatched_old.remove(old_id)
        unmatched_new.difference_update(group)

    merge_candidates: list[tuple[float, tuple[str, ...], str]] = []
    for new_id in sorted(unmatched_new):
        ranked = sorted(((_similarity(old[o]["text"], new[new_id]["text"]), o) for o in unmatched_old), reverse=True)
        shortlist = [o for score, o in ranked[:8] if score >= 0.18]
        for group_size in (2, 3):
            for group in combinations(shortlist, group_size):
                combined = " ".join(old[o]["text"] for o in group)
                score = _similarity(combined, new[new_id]["text"])
                if score >= GROUP_MATCH_THRESHOLD:
                    merge_candidates.append((score, tuple(sorted(group)), new_id))
    for score, group, new_id in sorted(merge_candidates, reverse=True):
        if new_id not in unmatched_new or not set(group).issubset(unmatched_old):
            continue
        items.append(_item([old[o] for o in group], [new[new_id]], "merged", score,
                           "One new section has high similarity to the combined text of unmatched old sections."))
        unmatched_old.difference_update(group)
        unmatched_new.remove(new_id)

    for old_id in sorted(unmatched_old):
        items.append(_item([old[old_id]], [], "removed", 0.0, "No section met the code matching threshold."))
    for new_id in sorted(unmatched_new):
        items.append(_item([], [new[new_id]], "added", 0.0, "No prior section met the code matching threshold."))

    # Evaluate inferred edges against the official NIST OLIR relationships. This
    # is a measured lexical baseline, not an accuracy guarantee for other sources.
    gold = {(r["csf11Id"], r["csf20Id"]) for r in dataset.get("olirRelationships", [])
            if r.get("csf11Id") in old and r.get("csf20Id") in new}
    predicted: set[tuple[str, str]] = set()
    for item in items:
        for left in item["old_sections"]:
            for right in item["new_sections"]:
                predicted.add((left["id"], right["id"]))
    true_positive = len(predicted & gold)
    precision = true_positive / len(predicted) if predicted else 0.0
    recall = true_positive / len(gold) if gold else 0.0
    counts: dict[str, int] = {}
    for item in items:
        counts[item["change_type"]] = counts.get(item["change_type"], 0) + 1
    return {
        "algorithm": "NFKC normalization + exact ID matching + token-set overlap + Hungarian assignment + grouped split/merge check",
        "thresholds": {"pair_match": MATCH_THRESHOLD, "high_similarity": HIGH_SIMILARITY_THRESHOLD,
                       "split_merge": GROUP_MATCH_THRESHOLD, "borderline": [MATCH_THRESHOLD, HIGH_SIMILARITY_THRESHOLD]},
        "metrics": {"old_sections": len(old), "new_sections": len(new), "gold_relationships": len(gold),
                    "predicted_relationships": len(predicted), "true_positive": true_positive,
                    "false_positive": len(predicted - gold), "false_negative": len(gold - predicted),
                    "precision": round(precision, 4), "recall": round(recall, 4),
                    "unclear_count": counts.get("unclear", 0)},
        "counts": counts,
        "changes": sorted(items, key=lambda x: (-x["similarity"], x["change_type"],
                                                (x["old_sections"] or x["new_sections"])[0]["id"])),
        "reference": "NIST CSF 1.1/2.0 source core and NIST OLIR relationship crosswalk",
    }
