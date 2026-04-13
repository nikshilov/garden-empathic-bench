"use client";

import {
  RadarChart as ReRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ScoreSet, JudgeInfo } from "@/lib/types";
import { formatScore } from "@/lib/utils";

interface Props {
  scores: Record<string, ScoreSet>;
  judges: JudgeInfo[];
}

export function JudgeRadarChart({ scores, judges }: Props) {
  const data = judges.map((j) => {
    const s = scores[j.id];
    return {
      judge: j.label,
      total: s?.total ?? 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReRadar cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#262626" />
        <PolarAngleAxis dataKey="judge" tick={{ fill: "#a1a1a1", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 30]} tick={{ fill: "#a1a1a1", fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#141414", border: "1px solid #262626", borderRadius: 8 }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Radar dataKey="total" stroke="#d4a843" fill="#d4a843" fillOpacity={0.3} />
      </ReRadar>
    </ResponsiveContainer>
  );
}
