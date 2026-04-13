"use client";

import { useState, useCallback } from "react";
import type { BenchRun, VarianceData } from "@/lib/types";
import { formatScore } from "@/lib/utils";

interface Props {
  baseline: VarianceData;
}

export function UploadValidator({ baseline }: Props) {
  const [uploaded, setUploaded] = useState<BenchRun | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as BenchRun;
        if (!data.meta || !data.tests || !data.summary) {
          setError("Invalid file: missing meta, tests, or summary fields.");
          return;
        }
        if (!data.meta.version || data.meta.version < 3) {
          setError("This viewer requires bench v3 format.");
          return;
        }
        setUploaded(data);
      } catch {
        setError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-300 ${
          dragging
            ? "border-primary bg-gradient-to-br from-[#fdf0ea]/50 to-[#fce8f0]/50 scale-[1.01]"
            : "border-primary/20 hover:border-primary/40 glass"
        }`}
      >
        <p className="text-lg text-muted-foreground">
          Drop a bench result JSON here, or{" "}
          <label className="cursor-pointer font-medium gradient-text hover:underline">
            browse
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Bench v3 JSON format required
        </p>
      </div>

      {error && (
        <div className="mt-5 glass rounded-2xl border border-red-200/50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {uploaded && (
        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold">
            Your results vs. baseline
          </h2>
          <p className="mt-2 text-muted-foreground">
            Baseline: {baseline.n_runs} runs (mean &plusmn; std). Your run:{" "}
            {uploaded.meta.timestamp}.
          </p>

          <div className="mt-6 glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-5 py-3.5 text-left text-muted-foreground font-medium">
                    System
                  </th>
                  <th className="px-5 py-3.5 text-right text-muted-foreground font-medium">
                    Baseline
                  </th>
                  <th className="px-5 py-3.5 text-right text-muted-foreground font-medium">
                    Your run
                  </th>
                  <th className="px-5 py-3.5 text-right text-muted-foreground font-medium">
                    Diff
                  </th>
                </tr>
              </thead>
              <tbody>
                {baseline.systems.map((bs) => {
                  const yourScore =
                    uploaded.summary.overall.scores[bs.code]?.total;
                  const diff =
                    yourScore !== undefined
                      ? yourScore - bs.total.mean
                      : undefined;
                  return (
                    <tr
                      key={bs.code}
                      className={`border-b border-primary/5 transition-colors duration-200 ${
                        bs.code === "G"
                          ? "bg-gradient-to-r from-[#fdf0ea]/50 to-[#fce8f0]/50"
                          : "hover:bg-[#fdf0ea]/30"
                      }`}
                    >
                      <td className="px-5 py-3 font-medium">
                        {bs.code === "G" && (
                          <span className="mr-1.5 gradient-text">&#9733;</span>
                        )}
                        {bs.name}
                      </td>
                      <td className="px-5 py-3 text-right font-mono">
                        {formatScore(bs.total.mean)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono">
                        {yourScore !== undefined
                          ? formatScore(yourScore)
                          : "\u2014"}
                      </td>
                      <td
                        className={`px-5 py-3 text-right font-mono font-semibold ${
                          diff !== undefined && diff > 0
                            ? "text-emerald-600"
                            : diff !== undefined && diff < 0
                              ? "text-red-500"
                              : ""
                        }`}
                      >
                        {diff !== undefined
                          ? `${diff > 0 ? "+" : ""}${formatScore(diff)}`
                          : "\u2014"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
