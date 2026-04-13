import type { BenchMeta, VarianceData, BenchRun, Corpus } from "./types";

const BASE = "/data";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export async function getMeta(): Promise<BenchMeta> {
  return fetchJson<BenchMeta>("meta.json");
}

export async function getVariance(lang: string = "en"): Promise<VarianceData> {
  return fetchJson<VarianceData>(`variance-${lang}.json`);
}

export async function getCorpus(): Promise<Corpus> {
  return fetchJson<Corpus>("corpus.json");
}

export async function getRun(lang: string, index: number): Promise<BenchRun> {
  const padded = String(index).padStart(3, "0");
  return fetchJson<BenchRun>(`runs/${lang}-${padded}.json`);
}

export async function listRuns(lang: string): Promise<string[]> {
  const v = await getVariance(lang);
  return v.run_files;
}
