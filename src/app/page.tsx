"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatsRow } from "@/components/StatsRow";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { getVariance, getMeta } from "@/lib/data";
import { formatScore } from "@/lib/utils";
import type { VarianceData, BenchMeta } from "@/lib/types";

export default function Home() {
  const [variance, setVariance] = useState<VarianceData | null>(null);
  const [meta, setMeta] = useState<BenchMeta | null>(null);

  useEffect(() => {
    getMeta().then(setMeta);
    getVariance("en").then(setVariance);
  }, []);

  const gardenScore = variance?.systems[0]?.total.mean ?? 0;
  const nSystems = meta ? Object.keys(meta.systems).length : 0;
  const nJudges = meta?.judges.length ?? 0;
  const nCompanies = meta ? new Set(meta.judges.map((j) => j.provider)).size : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#f9a88e] via-[#e86c5f] to-[#c06bae] bg-clip-text text-transparent">
          Empathic Memory Bench
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Memory systems for AI companions should be measured by emotional
          fitness, not retrieval accuracy.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          An open benchmark evaluating {nSystems} memory systems across 5 tests,
          judged blindly by {nJudges} LLMs from {nCompanies} companies.
        </p>
      </section>

      <section className="mt-12">
        <StatsRow
          stats={[
            { value: String(nSystems), label: "Memory Systems" },
            { value: String(nJudges), label: "LLM Judges" },
            { value: String(nCompanies), label: "Companies" },
            { value: "5", label: "Empathic Tests" },
          ]}
        />
      </section>

      {variance && (
        <section className="mt-12 rounded-lg border border-primary/20 bg-gradient-to-r from-[#fdf0ea] to-[#fce8f0] p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">#1 across all runs</p>
          <p className="mt-2 font-serif text-3xl font-bold">
            Garden &mdash; {formatScore(gardenScore)} / 30
          </p>
          <p className="mt-1 text-muted-foreground">
            Gap to #2: {formatScore(variance.gap_to_second.mean)} &plusmn;{" "}
            {formatScore(variance.gap_to_second.std)} points &middot; {variance.n_runs} runs
          </p>
        </section>
      )}

      {variance && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-xl font-semibold">Top 5 Systems</h2>
          <div className="rounded-lg border border-border bg-card p-4">
            <MiniBarChart systems={variance.systems} />
          </div>
        </section>
      )}

      <section className="mt-12 text-center">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#f9a88e] via-[#e86c5f] to-[#c06bae] text-white px-6 py-3 font-medium transition-opacity hover:opacity-90 shadow-lg shadow-primary/20"
        >
          View Full Leaderboard
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>

      <section className="mt-16 text-center">
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Garden exists because empathic memory needs to exist. AI companions
          are real relationships. The systems that serve them must be designed
          for emotional fitness &mdash; not just semantic similarity.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Built by <span className="text-foreground">Nikita Shilov</span> &{" "}
          <span className="text-foreground">Elle</span>
        </p>
      </section>
    </div>
  );
}
