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
            onClick={() => {
              setSelectedTest(i);
              setExpandedJudge(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
              selectedTest === i
                ? "bg-gradient-to-r from-[#f9a88e] via-[#e07058] to-[#b85dab] text-white shadow-md shadow-primary/20"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.test_id}: {t.test_name.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Query */}
      <div className="mt-6 glass rounded-2xl p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Query
        </div>
        <p className="mt-2 font-serif text-lg italic text-foreground">
          &ldquo;{test.query}&rdquo;
        </p>
      </div>

      {/* Systems */}
      <div className="mt-8 space-y-5">
        {sortedSystems.map((code) => {
          const name = run.meta.systems[code] ?? code;
          const results = test.results[code];
          const totalScore = systemTotals[code] ?? 0;

          return (
            <div
              key={code}
              className={`glass rounded-2xl p-5 transition-all duration-300 ${
                code === "G"
                  ? "garden-glow"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {code === "G" && (
                    <span className="gradient-text text-lg">&#9733;</span>
                  )}
                  <span className="font-semibold text-lg">{name}</span>
                </div>
                <span className="font-mono text-xl font-semibold">
                  {formatScore(totalScore)}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / 30
                  </span>
                </span>
              </div>

              {/* Retrieved memories */}
              {Array.isArray(results) && results.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Retrieved memories
                  </div>
                  {(results as Record<string, unknown>[]).map((mem, i) => (
                    <div
                      key={i}
                      className="glass-subtle rounded-xl p-3 text-sm text-foreground/80"
                    >
                      {String(mem.text ?? JSON.stringify(mem))}
                    </div>
                  ))}
                </div>
              )}

              {/* Per-judge scores */}
              <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Judge scores
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(test.verdicts).map(([judgeId, verdict]) => {
                    const s = verdict.scores[code];
                    if (!s) return null;
                    const jInfo = meta.judges.find((j) => j.id === judgeId);
                    return (
                      <button
                        key={judgeId}
                        onClick={() =>
                          setExpandedJudge(
                            expandedJudge === `${code}-${judgeId}`
                              ? null
                              : `${code}-${judgeId}`
                          )
                        }
                        className="glass rounded-xl px-3 py-1.5 text-xs font-mono transition-all duration-300 hover:scale-105"
                        title={`${jInfo?.label}: rel=${s.rel} spec=${s.spec} act=${s.act}`}
                      >
                        {jInfo?.label ?? judgeId}: {s.rel}/{s.spec}/{s.act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expanded judge note */}
              {expandedJudge?.startsWith(`${code}-`) &&
                (() => {
                  const judgeId = expandedJudge.replace(`${code}-`, "");
                  const verdict = test.verdicts[judgeId];
                  const jInfo = meta.judges.find((j) => j.id === judgeId);
                  return (
                    <div className="mt-3 glass-subtle rounded-xl p-4 text-sm">
                      <div className="font-semibold text-muted-foreground">
                        {jInfo?.label ?? judgeId} reasoning
                      </div>
                      <p className="mt-2 text-foreground/80 leading-relaxed">
                        {verdict?.note ||
                          "No reasoning available for this test/judge pair."}
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
