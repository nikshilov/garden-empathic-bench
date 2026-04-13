import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScore(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

export function formatMeanStd(mean: number, std: number): string {
  if (std === 0) return formatScore(mean);
  return `${formatScore(mean)} \u00b1 ${formatScore(std)}`;
}

export const CATEGORY_COLORS: Record<string, string> = {
  "domain-scored": "bg-rose-50 text-rose-700 border-rose-200",
  "embedding-only": "bg-sky-50 text-sky-700 border-sky-200",
  "graph": "bg-violet-50 text-violet-700 border-violet-200",
  "llm-extracted": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "hybrid": "bg-amber-50 text-amber-700 border-amber-200",
  "unknown": "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export const CATEGORY_LABELS: Record<string, string> = {
  "domain-scored": "Domain-scored",
  "embedding-only": "Embedding",
  "graph": "Graph",
  "llm-extracted": "LLM-extracted",
  "hybrid": "Hybrid",
  "unknown": "Unknown",
};

export const DIMENSION_COLORS = {
  rel: "#e07058",
  spec: "#b85dab",
  act: "#f9a88e",
};
