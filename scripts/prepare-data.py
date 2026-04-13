#!/usr/bin/env python3
"""Transform bench results into webapp-ready static JSON files."""

import json
import os
import sys
import statistics
from pathlib import Path
from collections import defaultdict

BENCH_DIR = Path(__file__).resolve().parent.parent.parent  # bench/
RESULTS_DIR = BENCH_DIR / "results"
CORPUS_FILE = BENCH_DIR / "datasets" / "empathic-memory-corpus.json"
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "data"

# System descriptions (code -> description + category)
SYSTEM_INFO = {
    "G": {"description": "Sentiment-weighted scoring with anchors, decay, and user flags", "category": "domain-scored"},
    "H": {"description": "Neo4j knowledge graph with temporal edges", "category": "graph"},
    "I": {"description": "OpenMemory platform with Qdrant vector store", "category": "hybrid"},
    "A": {"description": "sqlite-vec with hierarchical palace/room/item structure", "category": "embedding-only"},
    "B": {"description": "sqlite-vec with OpenAI text-embedding-3-large", "category": "embedding-only"},
    "D": {"description": "Sentence Transformers with OpenAI embeddings", "category": "embedding-only"},
    "C": {"description": "Sentence Transformers with local all-MiniLM-L6-v2", "category": "embedding-only"},
    "E": {"description": "Arkhon memory platform", "category": "hybrid"},
    "F": {"description": "emogie emotional memory tagging", "category": "hybrid"},
    "J": {"description": "LLM-extracted facts (gpt-4o-mini) + Qdrant + OpenAI embeddings", "category": "llm-extracted"},
    "K": {"description": "Letta (formerly MemGPT) agent memory", "category": "llm-extracted"},
    "L": {"description": "LangChain LangMem with OpenAI embeddings", "category": "embedding-only"},
    "M": {"description": "LlamaIndex vector store memory", "category": "embedding-only"},
    "N": {"description": "Knowledge graph + LLM entity extraction + vector search", "category": "graph"},
    "O": {"description": "Weaviate vector database with OpenAI embeddings", "category": "embedding-only"},
}


def load_results(lang: str, version: int = 3, min_systems: int = 10):
    """Load all valid bench result files for given language/version."""
    runs = []
    for f in sorted(RESULTS_DIR.glob("empathic-memory-*.json")):
        if "partial" in f.name:
            continue
        try:
            with open(f) as fh:
                d = json.load(fh)
            meta = d.get("meta", {})
            if meta.get("version") != version:
                continue
            if meta.get("judge_prompt_language", "en") != lang:
                continue
            if len(meta.get("systems", {})) < min_systems:
                continue
            runs.append((f.name, d))
        except (json.JSONDecodeError, KeyError):
            continue
    return runs


def compute_variance(runs: list) -> dict:
    """Compute mean +/- std across runs for each system."""
    if not runs:
        return {}

    all_systems = {}
    for fname, d in runs:
        for code, name in d["meta"]["systems"].items():
            all_systems[code] = name

    system_totals = defaultdict(lambda: {"rel": [], "spec": [], "act": [], "total": [], "ranks": []})

    for fname, d in runs:
        scores = d["summary"]["overall"]["scores"]
        ranked = sorted(scores.items(), key=lambda x: x[1]["total"], reverse=True)
        rank_map = {code: i + 1 for i, (code, _) in enumerate(ranked)}
        for code, sc in scores.items():
            system_totals[code]["rel"].append(sc["rel"])
            system_totals[code]["spec"].append(sc["spec"])
            system_totals[code]["act"].append(sc["act"])
            system_totals[code]["total"].append(sc["total"])
            system_totals[code]["ranks"].append(rank_map[code])

    systems = []
    for code in sorted(system_totals.keys(), key=lambda c: -statistics.mean(system_totals[c]["total"])):
        st = system_totals[code]
        n = len(st["total"])
        entry = {
            "code": code,
            "name": all_systems.get(code, code),
            "total": {"mean": round(statistics.mean(st["total"]), 2),
                      "std": round(statistics.stdev(st["total"]), 2) if n > 1 else 0},
            "rel": {"mean": round(statistics.mean(st["rel"]), 2),
                    "std": round(statistics.stdev(st["rel"]), 2) if n > 1 else 0},
            "spec": {"mean": round(statistics.mean(st["spec"]), 2),
                     "std": round(statistics.stdev(st["spec"]), 2) if n > 1 else 0},
            "act": {"mean": round(statistics.mean(st["act"]), 2),
                    "std": round(statistics.stdev(st["act"]), 2) if n > 1 else 0},
            "ranks_per_run": st["ranks"],
        }
        systems.append(entry)

    # Garden per-judge stability
    garden_per_judge = []
    judges_seen = {}
    for fname, d in runs:
        for jid, jdata in d["summary"]["by_judge"].items():
            if jid not in judges_seen:
                judge_meta = next((j for j in d["meta"]["judges"] if j["id"] == jid), {})
                judges_seen[jid] = judge_meta
            g_scores = jdata["scores"].get("G", {})
            if g_scores:
                garden_per_judge.append({"judge_id": jid, "total": g_scores["total"]})

    judge_totals = defaultdict(list)
    for entry in garden_per_judge:
        judge_totals[entry["judge_id"]].append(entry["total"])

    garden_judges = []
    for jid, totals in judge_totals.items():
        jmeta = judges_seen.get(jid, {})
        garden_judges.append({
            "judge": jmeta.get("label", jid),
            "provider": jmeta.get("provider", "unknown"),
            "mean": round(statistics.mean(totals), 2),
            "std": round(statistics.stdev(totals), 2) if len(totals) > 1 else 0,
        })

    # Gap to second
    if len(systems) >= 2:
        gaps = []
        for fname, d in runs:
            scores = d["summary"]["overall"]["scores"]
            ranked = sorted(scores.values(), key=lambda x: x["total"], reverse=True)
            if len(ranked) >= 2:
                gaps.append(ranked[0]["total"] - ranked[1]["total"])
        gap = {"mean": round(statistics.mean(gaps), 2),
               "std": round(statistics.stdev(gaps), 2) if len(gaps) > 1 else 0}
    else:
        gap = {"mean": 0, "std": 0}

    return {
        "n_runs": len(runs),
        "run_files": [fname for fname, _ in runs],
        "systems": systems,
        "garden_per_judge": garden_judges,
        "gap_to_second": gap,
    }


def build_run_data(fname: str, d: dict) -> dict:
    """Extract webapp-relevant fields from a single bench run."""
    tests = []
    for t in d["tests"]:
        test_entry = {
            "test_id": t["test_id"],
            "test_name": t["test_name"],
            "query": t["query"],
            "ideal_event_ids": t.get("ideal_event_ids", []),
            "blind_mapping": t.get("blind_mapping", {}),
            "results": {},
            "verdicts": {},
        }
        for sys_code, memories in t.get("results", {}).items():
            test_entry["results"][sys_code] = memories

        for judge_id, verdict in t.get("verdicts", {}).items():
            scores = {}
            for sys_code in d["meta"]["systems"]:
                rel = verdict.get(f"{sys_code}_rel")
                spec = verdict.get(f"{sys_code}_spec")
                act = verdict.get(f"{sys_code}_act")
                if rel is not None:
                    scores[sys_code] = {"rel": rel, "spec": spec, "act": act,
                                        "total": (rel or 0) + (spec or 0) + (act or 0)}
            test_entry["verdicts"][judge_id] = {
                "scores": scores,
                "winner": verdict.get("winner", ""),
                "note": verdict.get("note", ""),
            }
        tests.append(test_entry)

    return {
        "meta": d["meta"],
        "tests": tests,
        "summary": d["summary"],
    }


def main():
    os.makedirs(OUT_DIR / "runs", exist_ok=True)

    en_runs = load_results("en")
    ru_runs = load_results("ru")

    if not en_runs:
        print("ERROR: No valid EN results found")
        sys.exit(1)

    latest = en_runs[-1][1]
    meta = {
        "version": latest["meta"]["version"],
        "languages": ["en"] + (["ru"] if ru_runs else []),
        "systems": {},
        "judges": latest["meta"]["judges"],
        "tests": [],
        "scoring_dimensions": {},
    }

    for code, name in latest["meta"]["systems"].items():
        info = SYSTEM_INFO.get(code, {"description": "", "category": "unknown"})
        meta["systems"][code] = {
            "code": code,
            "name": name,
            "description": info["description"],
            "category": info["category"],
        }

    with open(CORPUS_FILE) as f:
        corpus = json.load(f)

    for ct in corpus["tests"]:
        meta["tests"].append({
            "id": ct["id"],
            "name": ct["name"],
            "query": ct["user_query"],
            "what_it_tests": ct["what_it_tests"],
            "ideal_event_ids": ct.get("ideal_event_ids", ct.get("ideal_top_3_event_ids", [])),
        })

    meta["scoring_dimensions"] = corpus.get("scoring_dimensions", {})

    with open(OUT_DIR / "meta.json", "w") as f:
        json.dump(meta, f, indent=2)
    print(f"Wrote meta.json ({len(meta['systems'])} systems, {len(meta['judges'])} judges)")

    for lang, runs in [("en", en_runs), ("ru", ru_runs)]:
        if not runs:
            continue
        variance = compute_variance(runs)
        variance["language"] = lang
        with open(OUT_DIR / f"variance-{lang}.json", "w") as f:
            json.dump(variance, f, indent=2)
        print(f"Wrote variance-{lang}.json ({variance['n_runs']} runs)")

    corpus_out = {
        "events": corpus["events"],
        "tests": corpus["tests"],
        "scoring_dimensions": corpus.get("scoring_dimensions", {}),
    }
    with open(OUT_DIR / "corpus.json", "w") as f:
        json.dump(corpus_out, f, indent=2)
    print(f"Wrote corpus.json ({len(corpus['events'])} events)")

    for lang, runs in [("en", en_runs), ("ru", ru_runs)]:
        for i, (fname, d) in enumerate(runs, 1):
            run_data = build_run_data(fname, d)
            out_name = f"{lang}-{i:03d}.json"
            with open(OUT_DIR / "runs" / out_name, "w") as f:
                json.dump(run_data, f, indent=2)
            print(f"Wrote runs/{out_name} ({fname})")

    print("\nDone!")


if __name__ == "__main__":
    main()
