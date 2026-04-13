"use client";

import type { SystemVariance, BenchMeta, VarianceData } from "@/lib/types";
import { JudgeRadarChart } from "@/components/charts/RadarChart";
import { formatScore, CATEGORY_COLORS, CATEGORY_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Props {
  system: SystemVariance;
  meta: BenchMeta;
  variance: VarianceData;
}

export function SystemDetail({ system, meta, variance }: Props) {
  const info = meta.systems[system.code];

  const judgeScores: Record<
    string,
    { rel: number; spec: number; act: number; total: number }
  > = {};
  if (system.code === "G") {
    for (const gj of variance.garden_per_judge) {
      const judge = meta.judges.find((j) => j.label === gj.judge);
      if (judge) {
        judgeScores[judge.id] = { rel: 0, spec: 0, act: 0, total: gj.mean };
      }
    }
  }

  return (
    <div className="glass-subtle space-y-5 rounded-2xl p-6 m-2">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={CATEGORY_COLORS[info?.category ?? "unknown"]}
        >
          {CATEGORY_LABELS[info?.category ?? "unknown"]}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {info?.description}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105">
          <div className="text-sm font-medium text-muted-foreground">
            Relevance
          </div>
          <div className="mt-1 font-mono text-xl font-semibold">
            {formatScore(system.rel.mean)}{" "}
            <span className="text-xs text-muted-foreground">
              &plusmn; {formatScore(system.rel.std)}
            </span>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105">
          <div className="text-sm font-medium text-muted-foreground">
            Specificity
          </div>
          <div className="mt-1 font-mono text-xl font-semibold">
            {formatScore(system.spec.mean)}{" "}
            <span className="text-xs text-muted-foreground">
              &plusmn; {formatScore(system.spec.std)}
            </span>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 text-center transition-all duration-300 hover:scale-105">
          <div className="text-sm font-medium text-muted-foreground">
            Actionability
          </div>
          <div className="mt-1 font-mono text-xl font-semibold">
            {formatScore(system.act.mean)}{" "}
            <span className="text-xs text-muted-foreground">
              &plusmn; {formatScore(system.act.std)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-muted-foreground">
          Rank across runs
        </div>
        <div className="mt-2 flex gap-2">
          {system.ranks_per_run.map((r, i) => (
            <span
              key={i}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                r === 1
                  ? "bg-gradient-to-br from-[#f9a88e] via-[#e07058] to-[#b85dab] text-white shadow-md shadow-primary/20"
                  : "glass text-muted-foreground"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {system.code === "G" && Object.keys(judgeScores).length > 0 && (
        <div>
          <div className="mb-3 text-sm font-semibold">Per-Judge Scores</div>
          <JudgeRadarChart scores={judgeScores} judges={meta.judges} />
        </div>
      )}
    </div>
  );
}
