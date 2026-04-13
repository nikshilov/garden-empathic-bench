import { MethodologyContent } from "@/components/MethodologyContent";

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-serif text-3xl font-bold">Methodology</h1>
      <p className="mt-2 text-muted-foreground">
        How the Empathic Memory Bench works &mdash; corpus, tests, judges, and scoring.
      </p>
      <div className="mt-8">
        <MethodologyContent />
      </div>
    </div>
  );
}
