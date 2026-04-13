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
        <PolarGrid stroke="rgba(224,112,88,0.15)" />
        <PolarAngleAxis
          dataKey="judge"
          tick={{ fill: "#9a8576", fontSize: 11 }}
        />
        <PolarRadiusAxis
          domain={[0, 30]}
          tick={{ fill: "#9a8576", fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Radar
          dataKey="total"
          stroke="#e07058"
          fill="#e07058"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </ReRadar>
    </ResponsiveContainer>
  );
}
