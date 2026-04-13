import { MethodologyContent } from "@/components/MethodologyContent";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold">Methodology</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        How the Empathic Memory Bench works &mdash; corpus, tests, judges, and scoring.
      </p>
      <div className="mt-10">
        <MethodologyContent />
      </div>
    </div>
  );
}
