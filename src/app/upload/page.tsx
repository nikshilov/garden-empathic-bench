"use client";

import { useEffect, useState } from "react";
import { getVariance } from "@/lib/data";
import { UploadValidator } from "@/components/UploadValidator";
import type { VarianceData } from "@/lib/types";

export default function UploadPage() {
  const [variance, setVariance] = useState<VarianceData | null>(null);

  useEffect(() => {
    getVariance("en").then(setVariance);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Upload Results</h1>
      <p className="mt-2 text-muted-foreground">
        Run the bench yourself and compare your results against our baseline.
      </p>

      <div className="mt-8">
        {variance ? (
          <UploadValidator baseline={variance} />
        ) : (
          <div className="text-muted-foreground">Loading baseline data...</div>
        )}
      </div>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-semibold">How to Run</h2>
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`git clone https://github.com/nicshilov/garden-empathic-bench
cd garden-empathic-bench
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
python bench.py --lang en`}</code>
          </pre>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          The bench outputs a JSON file in <code className="text-foreground">results/</code>.
          Drop it here to compare.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-semibold">Download Baseline</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Download our raw results for offline comparison.
        </p>
        <div className="mt-3 flex gap-3">
          <a href="/data/runs/en-001.json" download
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
            EN Run 1
          </a>
          <a href="/data/variance-en.json" download
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
            Variance (EN)
          </a>
        </div>
      </section>
    </div>
  );
}
