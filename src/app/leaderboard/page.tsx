"use client";

import { useEffect, useState } from "react";
import { getMeta, getVariance } from "@/lib/data";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import type { BenchMeta, VarianceData } from "@/lib/types";

export default function LeaderboardPage() {
  const [meta, setMeta] = useState<BenchMeta | null>(null);
  const [variance, setVariance] = useState<VarianceData | null>(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    getMeta().then(setMeta);
  }, []);

  useEffect(() => {
    getVariance(lang).then(setVariance).catch(() => setVariance(null));
  }, [lang]);

  if (!meta || !variance) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold">Leaderboard</h1>
        <div className="flex gap-2">
          {(meta.languages || ["en"]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                lang === l
                  ? "bg-gradient-to-r from-[#f9a88e] via-[#e07058] to-[#b85dab] text-white shadow-md shadow-primary/20"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-lg text-muted-foreground">
        {variance.n_runs} runs &middot; {meta.judges.length} judges from{" "}
        {new Set(meta.judges.map((j) => j.provider)).size} companies &middot;
        Mean &plusmn; std across runs
      </p>

      <section className="mt-10 glass rounded-2xl p-6">
        <StackedBarChart systems={variance.systems} />
      </section>

      <section className="mt-10 glass rounded-2xl overflow-hidden">
        <LeaderboardTable variance={variance} meta={meta} />
      </section>
    </div>
  );
}
