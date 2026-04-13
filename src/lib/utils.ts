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
  "domain-scored": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "embedding-only": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "graph": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "llm-extracted": "bg-green-500/20 text-green-400 border-green-500/30",
  "hybrid": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "unknown": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
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
  rel: "#3b82f6",
  spec: "#22c55e",
  act: "#f59e0b",
};
