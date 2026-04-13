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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Upload Results</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Run the bench yourself and compare your results against our baseline.
      </p>

      <div className="mt-10">
        {variance ? (
          <UploadValidator baseline={variance} />
        ) : (
          <div className="text-muted-foreground">Loading baseline data...</div>
        )}
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold">How to Run</h2>
        <div className="mt-5 glass rounded-2xl p-6">
          <pre className="overflow-x-auto text-sm font-mono leading-relaxed text-foreground/80">
            <code>{`git clone https://github.com/nicshilov/garden-empathic-bench
cd garden-empathic-bench
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
python bench.py --lang en`}</code>
          </pre>
        </div>
        <p className="mt-4 text-muted-foreground">
          The bench outputs a JSON file in{" "}
          <code className="rounded-lg bg-primary/5 px-2 py-0.5 font-mono text-sm text-foreground">
            results/
          </code>
          . Drop it here to compare.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold">Download Baseline</h2>
        <p className="mt-3 text-muted-foreground">
          Download our raw results for offline comparison.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="/data/runs/en-001.json"
            download
            className="glass rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            EN Run 1
          </a>
          <a
            href="/data/variance-en.json"
            download
            className="glass rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            Variance (EN)
          </a>
        </div>
      </section>
    </div>
  );
}
