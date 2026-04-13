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

  const judgeScores: Record<string, { rel: number; spec: number; act: number; total: number }> = {};
  if (system.code === "G") {
    for (const gj of variance.garden_per_judge) {
      const judge = meta.judges.find((j) => j.label === gj.judge);
      if (judge) {
        judgeScores[judge.id] = { rel: 0, spec: 0, act: 0, total: gj.mean };
      }
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={CATEGORY_COLORS[info?.category ?? "unknown"]}>
          {CATEGORY_LABELS[info?.category ?? "unknown"]}
        </Badge>
        <span className="text-sm text-muted-foreground">{info?.description}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Relevance</div>
          <div className="font-mono text-lg">{formatScore(system.rel.mean)} <span className="text-xs text-muted-foreground">&plusmn; {formatScore(system.rel.std)}</span></div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Specificity</div>
          <div className="font-mono text-lg">{formatScore(system.spec.mean)} <span className="text-xs text-muted-foreground">&plusmn; {formatScore(system.spec.std)}</span></div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Actionability</div>
          <div className="font-mono text-lg">{formatScore(system.act.mean)} <span className="text-xs text-muted-foreground">&plusmn; {formatScore(system.act.std)}</span></div>
        </div>
      </div>

      <div>
        <div className="text-sm text-muted-foreground">Rank across runs</div>
        <div className="mt-1 flex gap-2">
          {system.ranks_per_run.map((r, i) => (
            <span
              key={i}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                r === 1 ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"
              }`}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      {system.code === "G" && Object.keys(judgeScores).length > 0 && (
        <div>
          <div className="mb-2 text-sm font-medium">Per-Judge Scores</div>
          <JudgeRadarChart scores={judgeScores} judges={meta.judges} />
        </div>
      )}
    </div>
  );
}
