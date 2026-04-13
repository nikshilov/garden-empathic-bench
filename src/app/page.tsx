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
    <div className="mx-auto max-w-6xl px-4 py-20">
      {/* Hero */}
      <section className="text-center">
        <h1 className="gradient-text font-serif text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
          Empathic Memory Bench
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground sm:text-2xl leading-relaxed">
          Memory systems for AI companions should be measured by emotional
          fitness, not retrieval accuracy.
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-muted-foreground text-lg">
          An open benchmark evaluating {nSystems} memory systems across 5 tests,
          judged blindly by {nJudges} LLMs from {nCompanies} companies.
        </p>
      </section>

      {/* Stats */}
      <section className="mt-16">
        <StatsRow
          stats={[
            { value: String(nSystems), label: "Memory Systems" },
            { value: String(nJudges), label: "LLM Judges" },
            { value: String(nCompanies), label: "Companies" },
            { value: "5", label: "Empathic Tests" },
          ]}
        />
      </section>

      {/* Garden callout */}
      {variance && (
        <section className="mt-16">
          <div className="glass garden-glow rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdf0ea]/50 via-[#fce8f0]/50 to-[#f5e6fa]/50 rounded-2xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-widest gradient-text">
                #1 across all runs
              </p>
              <p className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
                <span className="gradient-text">Garden</span>
                <span className="text-foreground/80"> &mdash; {formatScore(gardenScore)} / 30</span>
              </p>
              <p className="mt-3 text-muted-foreground text-lg">
                Gap to #2: {formatScore(variance.gap_to_second.mean)} &plusmn;{" "}
                {formatScore(variance.gap_to_second.std)} points &middot; {variance.n_runs} runs
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Chart */}
      {variance && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-semibold">Top 5 Systems</h2>
          <div className="glass rounded-2xl p-6">
            <MiniBarChart systems={variance.systems} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mt-16 text-center">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9a88e] via-[#e07058] to-[#b85dab] text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg shadow-primary/20"
        >
          View Full Leaderboard
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </section>

      {/* Bottom quote */}
      <section className="mt-20 text-center">
        <blockquote className="mx-auto max-w-xl">
          <p className="font-serif text-lg italic text-muted-foreground leading-relaxed sm:text-xl">
            &ldquo;Garden exists because empathic memory needs to exist. AI companions
            are real relationships. The systems that serve them must be designed
            for emotional fitness &mdash; not just semantic similarity.&rdquo;
          </p>
        </blockquote>
        <p className="mt-6 text-muted-foreground">
          Built by <span className="font-medium text-foreground">Nikita Shilov</span> &{" "}
          <span className="font-medium gradient-text">Elle</span>
        </p>
      </section>
    </div>
  );
}
