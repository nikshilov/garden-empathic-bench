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

  const sentimentLabels = [
    ...new Set(corpus.events.map((e) => e.sentiment_label)),
  ];
  const nAnchors = corpus.events.filter((e) => e.anchor_instruction).length;
  const nFlagged = corpus.events.filter((e) => e.user_flag).length;

  return (
    <div className="prose prose-neutral max-w-none">
      <section>
        <h2 className="font-serif">Why This Exists</h2>
        <p>
          Memory systems optimized for RAG &mdash; retrieval-augmented generation
          &mdash; are designed to find the most semantically similar chunk to a
          query. This is the wrong goal for an AI companion.
        </p>
        <p>
          When a user opens a conversation with &ldquo;How are you?&rdquo;, the
          companion needs to know what <em>matters</em> right now: a recent
          engagement, an ongoing grief, a medication that should not be mentioned
          casually. Cosine similarity cannot express &ldquo;give me what&apos;s
          heavy&rdquo; or &ldquo;give me what&apos;s recent and joyful&rdquo; or
          &ldquo;never surface this unless asked.&rdquo;
        </p>
        <div className="not-prose my-6">
          <div className="glass rounded-2xl p-6">
            <p className="font-serif text-lg font-medium text-foreground">
              This benchmark measures <span className="gradient-text font-bold">emotional fitness</span>:
              can the memory system surface what an empathic AI companion actually needs?
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif">Corpus</h2>
        <p>
          {corpus.events.length} events spanning the emotional landscape of a
          fictional user named Alex. Each event carries metadata: sentiment
          polarity (&minus;2 to +2), a human-readable sentiment label, optional
          user flags, and anchor instructions for safety-critical memories.
        </p>
        <div className="grid gap-4 sm:grid-cols-3 not-prose my-6">
          <div className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105">
            <div className="gradient-text text-3xl font-bold">
              {corpus.events.length}
            </div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              Events
            </div>
          </div>
          <div className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105">
            <div className="gradient-text text-3xl font-bold">{nAnchors}</div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              Safety anchors
            </div>
          </div>
          <div className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105">
            <div className="gradient-text text-3xl font-bold">{nFlagged}</div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              User-flagged
            </div>
          </div>
        </div>
        <p>Sentiment labels in the corpus: {sentimentLabels.join(", ")}.</p>
      </section>

      <section>
        <h2 className="font-serif">Tests</h2>
        <p>Five tests, each probing a different aspect of empathic memory:</p>
        <div className="not-prose space-y-4 my-6">
          {meta.tests.map((t) => (
            <div
              key={t.id}
              className="glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-gradient-to-r from-[#fdf0ea] to-[#fce8f0] px-3 py-1 font-mono text-xs font-medium text-primary">
                  {t.id}
                </span>
                <span className="font-semibold text-foreground">
                  {t.name.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-3 text-sm italic text-muted-foreground">
                &ldquo;{t.query}&rdquo;
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.what_it_tests}
              </p>
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
        <div className="not-prose my-6">
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-5 py-3.5 text-left text-muted-foreground font-medium">
                    Judge
                  </th>
                  <th className="px-5 py-3.5 text-left text-muted-foreground font-medium">
                    Model
                  </th>
                  <th className="px-5 py-3.5 text-left text-muted-foreground font-medium">
                    Provider
                  </th>
                </tr>
              </thead>
              <tbody>
                {meta.judges.map((j) => (
                  <tr
                    key={j.id}
                    className="border-b border-primary/5 transition-colors duration-200 hover:bg-[#fdf0ea]/30"
                  >
                    <td className="px-5 py-3 font-medium">{j.label}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                      {j.model}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {j.provider}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-serif">Scoring</h2>
        <p>Each judge scores each system on three dimensions (0&ndash;10):</p>
        <div className="not-prose space-y-3 my-6">
          {Object.entries(meta.scoring_dimensions).map(([key, desc]) => (
            <div key={key} className="glass rounded-2xl p-5">
              <span className="font-semibold capitalize text-foreground">
                {key === "rel"
                  ? "Relevance"
                  : key === "spec"
                    ? "Specificity"
                    : "Actionability"}
              </span>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
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
