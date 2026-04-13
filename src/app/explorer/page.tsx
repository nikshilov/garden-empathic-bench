"use client";

import { useEffect, useState } from "react";
import { getMeta, getVariance, getRun } from "@/lib/data";
import { TestExplorer } from "@/components/TestExplorer";
import type { BenchMeta, BenchRun, VarianceData } from "@/lib/types";

export default function ExplorerPage() {
  const [meta, setMeta] = useState<BenchMeta | null>(null);
  const [variance, setVariance] = useState<VarianceData | null>(null);
  const [run, setRun] = useState<BenchRun | null>(null);
  const [lang, setLang] = useState("en");
  const [runIndex, setRunIndex] = useState(1);

  useEffect(() => {
    getMeta().then(setMeta);
  }, []);

  useEffect(() => {
    getVariance(lang).then(setVariance).catch(() => setVariance(null));
  }, [lang]);

  useEffect(() => {
    getRun(lang, runIndex).then(setRun).catch(() => setRun(null));
  }, [lang, runIndex]);

  if (!meta || !run) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Test Explorer</h1>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {(meta.languages || ["en"]).map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setRunIndex(1); }}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  lang === l
                    ? "bg-gold text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {variance && variance.n_runs > 1 && (
            <select
              value={runIndex}
              onChange={(e) => setRunIndex(Number(e.target.value))}
              className="rounded-md border border-border bg-card px-3 py-1 text-sm"
            >
              {Array.from({ length: variance.n_runs }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Run {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <p className="mt-2 text-muted-foreground">
        Drill into what each system retrieved and how each judge scored it.
      </p>

      <div className="mt-6">
        <TestExplorer run={run} meta={meta} />
      </div>
    </div>
  );
}
