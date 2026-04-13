"use client";

import { useState } from "react";
import type { BenchRun, BenchMeta } from "@/lib/types";
import { formatScore } from "@/lib/utils";

interface Props {
  run: BenchRun;
  meta: BenchMeta;
}

export function TestExplorer({ run, meta }: Props) {
  const [selectedTest, setSelectedTest] = useState(0);
  const [expandedJudge, setExpandedJudge] = useState<string | null>(null);

  const test = run.tests[selectedTest];
  if (!test) return null;

  const systemCodes = Object.keys(run.meta.systems);

  // Calculate total per system for this test
  const systemTotals: Record<string, number> = {};
  for (const code of systemCodes) {
    let sum = 0;
    let count = 0;
    for (const [, verdict] of Object.entries(test.verdicts)) {
      const s = verdict.scores[code];
      if (s) {
        sum += s.total;
        count++;
      }
    }
    systemTotals[code] = count > 0 ? sum / count : 0;
  }

  const sortedSystems = [...systemCodes].sort(
    (a, b) => (systemTotals[b] ?? 0) - (systemTotals[a] ?? 0)
  );

  return (
    <div>
      {/* Test selector */}
      <div className="flex flex-wrap gap-2">
        {run.tests.map((t, i) => (
          <button
            key={t.test_id}
            onClick={() => { setSelectedTest(i); setExpandedJudge(null); }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedTest === i
                ? "bg-gold text-background"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.test_id}: {t.test_name.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Query */}
      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">Query</div>
        <p className="mt-1 italic">&ldquo;{test.query}&rdquo;</p>
      </div>

      {/* Systems */}
      <div className="mt-6 space-y-4">
        {sortedSystems.map((code) => {
          const name = run.meta.systems[code] ?? code;
          const results = test.results[code];
          const totalScore = systemTotals[code] ?? 0;

          return (
            <div
              key={code}
              className={`rounded-lg border bg-card p-4 ${
                code === "G" ? "border-gold/30" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {code === "G" && <span className="text-gold">&#9733;</span>}
                  <span className="font-medium">{name}</span>
                </div>
                <span className="font-mono text-lg">
                  {formatScore(totalScore)} <span className="text-sm text-muted-foreground">/ 30</span>
                </span>
              </div>

              {/* Retrieved memories */}
              {Array.isArray(results) && results.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Retrieved memories
                  </div>
                  {(results as Record<string, unknown>[]).map((mem, i) => (
                    <div key={i} className="rounded border border-border/50 bg-background p-2 text-sm">
                      {String(mem.text ?? JSON.stringify(mem))}
                    </div>
                  ))}
                </div>
              )}

              {/* Per-judge scores */}
              <div className="mt-3">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Judge scores
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {Object.entries(test.verdicts).map(([judgeId, verdict]) => {
                    const s = verdict.scores[code];
                    if (!s) return null;
                    const jInfo = meta.judges.find((j) => j.id === judgeId);
                    return (
                      <button
                        key={judgeId}
                        onClick={() =>
                          setExpandedJudge(
                            expandedJudge === `${code}-${judgeId}` ? null : `${code}-${judgeId}`
                          )
                        }
                        className="rounded bg-secondary px-2 py-1 text-xs font-mono hover:bg-secondary/80 transition-colors"
                        title={`${jInfo?.label}: rel=${s.rel} spec=${s.spec} act=${s.act}`}
                      >
                        {jInfo?.label ?? judgeId}: {s.rel}/{s.spec}/{s.act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expanded judge note */}
              {expandedJudge?.startsWith(`${code}-`) && (() => {
                const judgeId = expandedJudge.replace(`${code}-`, "");
                const verdict = test.verdicts[judgeId];
                const jInfo = meta.judges.find((j) => j.id === judgeId);
                return (
                  <div className="mt-2 rounded border border-border/50 bg-background p-3 text-sm">
                    <div className="font-medium text-muted-foreground">
                      {jInfo?.label ?? judgeId} reasoning
                    </div>
                    <p className="mt-1">
                      {verdict?.note || "No reasoning available for this test/judge pair."}
                    </p>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
