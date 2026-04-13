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
        <PolarGrid stroke="#f0e6dc" />
        <PolarAngleAxis dataKey="judge" tick={{ fill: "#8b7355", fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 30]} tick={{ fill: "#8b7355", fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: "#ffffff", border: "1px solid #f0e6dc", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Radar dataKey="total" stroke="#e86c5f" fill="#e86c5f" fillOpacity={0.3} />
      </ReRadar>
    </ResponsiveContainer>
  );
}
