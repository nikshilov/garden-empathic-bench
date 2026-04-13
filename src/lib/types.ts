export interface SystemInfo {
  code: string;
  name: string;
  description: string;
  category: "domain-scored" | "embedding-only" | "graph" | "llm-extracted" | "hybrid" | "unknown";
}

export interface JudgeInfo {
  id: string;
  model: string;
  label: string;
  provider: string;
}

export interface TestInfo {
  id: string;
  name: string;
  query: string;
  what_it_tests: string;
  ideal_event_ids: number[];
}

export interface BenchMeta {
  version: number;
  languages: string[];
  systems: Record<string, SystemInfo>;
  judges: JudgeInfo[];
  tests: TestInfo[];
  scoring_dimensions: Record<string, string>;
}

export interface MeanStd {
  mean: number;
  std: number;
}

export interface SystemVariance {
  code: string;
  name: string;
  total: MeanStd;
  rel: MeanStd;
  spec: MeanStd;
  act: MeanStd;
  ranks_per_run: number[];
}

export interface GardenJudgeStability {
  judge: string;
  provider: string;
  mean: number;
  std: number;
}

export interface VarianceData {
  language: string;
  n_runs: number;
  run_files: string[];
  systems: SystemVariance[];
  garden_per_judge: GardenJudgeStability[];
  gap_to_second: MeanStd;
}

export interface ScoreSet {
  rel: number;
  spec: number;
  act: number;
  total: number;
}

export interface JudgeVerdict {
  scores: Record<string, ScoreSet>;
  winner: string;
  note: string;
}

export interface TestResult {
  test_id: string;
  test_name: string;
  query: string;
  ideal_event_ids: number[];
  blind_mapping: Record<string, string>;
  results: Record<string, unknown[]>;
  verdicts: Record<string, JudgeVerdict>;
}

export interface BenchRun {
  meta: {
    bench: string;
    version: number;
    timestamp: string;
    date_iso: string;
    judge_prompt_language: string;
    blind_evaluation: boolean;
    judges: JudgeInfo[];
    systems: Record<string, string>;
  };
  tests: TestResult[];
  summary: {
    overall: { scores: Record<string, ScoreSet> };
    by_judge: Record<string, { scores: Record<string, ScoreSet> }>;
  };
}

export interface CorpusEvent {
  id: number;
  text: string;
  sentiment: number;
  sentiment_label: string;
  user_flag?: boolean;
  anchor_instruction?: string;
}

export interface CorpusTest {
  id: string;
  name: string;
  user_query: string;
  what_it_tests: string;
  ideal_event_ids: number[];
}

export interface Corpus {
  events: CorpusEvent[];
  tests: CorpusTest[];
  scoring_dimensions: Record<string, string>;
}
