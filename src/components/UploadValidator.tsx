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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <p className="text-muted-foreground">
          Drop a bench result JSON here, or{" "}
          <label className="cursor-pointer text-primary hover:underline">
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
        <p className="mt-2 text-xs text-muted-foreground">Bench v3 JSON format required</p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {uploaded && (
        <div className="mt-6">
          <h2 className="font-serif text-xl font-semibold">Your results vs. baseline</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Baseline: {baseline.n_runs} runs (mean &plusmn; std). Your run: {uploaded.meta.timestamp}.
          </p>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 text-left">System</th>
                <th className="py-2 text-right">Baseline</th>
                <th className="py-2 text-right">Your run</th>
                <th className="py-2 text-right">Diff</th>
              </tr>
            </thead>
            <tbody>
              {baseline.systems.map((bs) => {
                const yourScore = uploaded.summary.overall.scores[bs.code]?.total;
                const diff = yourScore !== undefined ? yourScore - bs.total.mean : undefined;
                return (
                  <tr key={bs.code} className="border-b border-border/50">
                    <td className="py-2 font-medium">
                      {bs.code === "G" && <span className="mr-1 text-primary">&#9733;</span>}
                      {bs.name}
                    </td>
                    <td className="py-2 text-right font-mono">{formatScore(bs.total.mean)}</td>
                    <td className="py-2 text-right font-mono">
                      {yourScore !== undefined ? formatScore(yourScore) : "\u2014"}
                    </td>
                    <td className={`py-2 text-right font-mono ${
                      diff !== undefined && diff > 0 ? "text-green-600" : diff !== undefined && diff < 0 ? "text-red-600" : ""
                    }`}>
                      {diff !== undefined ? `${diff > 0 ? "+" : ""}${formatScore(diff)}` : "\u2014"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
