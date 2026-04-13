"use client";

import { useEffect, useState } from "react";
import { getMeta, getCorpus } from "@/lib/data";
import type { BenchMeta, Corpus } from "@/lib/types";

export function MethodologyContent() {
  const [meta, setMeta] = useState<BenchMeta | null>(null);
  const [corpus, setCorpus] = useState<Corpus | null>(null);

  useEffect(() => {
    getMeta().then(setMeta);
    getCorpus().then(setCorpus);
  }, []);

  if (!meta || !corpus) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const sentimentLabels = [...new Set(corpus.events.map((e) => e.sentiment_label))];
  const nAnchors = corpus.events.filter((e) => e.anchor_instruction).length;
  const nFlagged = corpus.events.filter((e) => e.user_flag).length;

  return (
    <div className="prose prose-invert max-w-none">
      <section>
        <h2 className="font-serif">Why This Exists</h2>
        <p>
          Memory systems optimized for RAG &mdash; retrieval-augmented generation &mdash;
          are designed to find the most semantically similar chunk to a query. This is
          the wrong goal for an AI companion.
        </p>
        <p>
          When a user opens a conversation with &ldquo;How are you?&rdquo;, the companion
          needs to know what <em>matters</em> right now: a recent engagement, an ongoing
          grief, a medication that should not be mentioned casually. Cosine similarity
          cannot express &ldquo;give me what&apos;s heavy&rdquo; or &ldquo;give me what&apos;s
          recent and joyful&rdquo; or &ldquo;never surface this unless asked.&rdquo;
        </p>
        <p>
          This benchmark measures <strong>emotional fitness</strong>: can the memory
          system surface what an empathic AI companion actually needs?
        </p>
      </section>

      <section>
        <h2 className="font-serif">Corpus</h2>
        <p>
          {corpus.events.length} events spanning the emotional landscape of a
          fictional user named Alex. Each event carries metadata: sentiment polarity
          (&minus;2 to +2), a human-readable sentiment label, optional user flags,
          and anchor instructions for safety-critical memories.
        </p>
        <div className="grid gap-3 sm:grid-cols-3 not-prose my-4">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-gold">{corpus.events.length}</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-gold">{nAnchors}</div>
            <div className="text-sm text-muted-foreground">Safety anchors</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <div className="text-2xl font-bold text-gold">{nFlagged}</div>
            <div className="text-sm text-muted-foreground">User-flagged</div>
          </div>
        </div>
        <p>Sentiment labels in the corpus: {sentimentLabels.join(", ")}.</p>
      </section>

      <section>
        <h2 className="font-serif">Tests</h2>
        <p>Five tests, each probing a different aspect of empathic memory:</p>
        <div className="not-prose space-y-3 my-4">
          {meta.tests.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {t.id}
                </span>
                <span className="font-medium">{t.name.replace(/_/g, " ")}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground italic">
                &ldquo;{t.query}&rdquo;
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{t.what_it_tests}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif">Judges</h2>
        <p>
          {meta.judges.length} LLMs from{" "}
          {new Set(meta.judges.map((j) => j.provider)).size} companies evaluate
          every system on every test. Diversity prevents single-vendor bias.
        </p>
        <div className="not-prose my-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2 text-left">Judge</th>
                <th className="py-2 text-left">Model</th>
                <th className="py-2 text-left">Provider</th>
              </tr>
            </thead>
            <tbody>
              {meta.judges.map((j) => (
                <tr key={j.id} className="border-b border-border/50">
                  <td className="py-2">{j.label}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">{j.model}</td>
                  <td className="py-2 text-muted-foreground">{j.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif">Scoring</h2>
        <p>Each judge scores each system on three dimensions (0&ndash;10):</p>
        <div className="not-prose space-y-2 my-4">
          {Object.entries(meta.scoring_dimensions).map(([key, desc]) => (
            <div key={key} className="rounded-lg border border-border bg-card p-3">
              <span className="font-medium capitalize">{key === "rel" ? "Relevance" : key === "spec" ? "Specificity" : "Actionability"}</span>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        <p>
          Total score per system = sum of three dimensions, averaged across all
          judges and tests. Maximum: 30.
        </p>
      </section>

      <section>
        <h2 className="font-serif">Blind Evaluation</h2>
        <p>
          Judges never see system names. Each system is assigned a random code
          (S01&ndash;S15) that changes per test. This prevents name-recognition
          bias and ensures judges evaluate purely on retrieval quality.
        </p>
      </section>

      <section>
        <h2 className="font-serif">What We Do Not Measure</h2>
        <ul>
          <li>Ingestion speed or latency</li>
          <li>Storage efficiency or memory footprint</li>
          <li>API cost</li>
          <li>Scalability to millions of memories</li>
          <li>Write performance or concurrent access</li>
        </ul>
        <p>
          This is deliberate. An empathic AI companion may store hundreds to
          thousands of memories per user &mdash; not millions. What matters is
          not how fast you can retrieve, but <em>what</em> you retrieve.
        </p>
      </section>
    </div>
  );
}
