"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { SystemVariance } from "@/lib/types";
import { DIMENSION_COLORS, formatScore } from "@/lib/utils";

export function StackedBarChart({ systems }: { systems: SystemVariance[] }) {
  const data = systems.map((s) => ({
    name: s.name,
    rel: s.rel.mean,
    spec: s.spec.mean,
    act: s.act.mean,
    isGarden: s.code === "G",
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(400, systems.length * 32)}>
      <BarChart data={data} layout="vertical" margin={{ left: 100, right: 20, top: 5, bottom: 5 }}>
        <XAxis type="number" domain={[0, 30]} tick={{ fill: "#8b7355", fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#1a0f0a", fontSize: 12 }} width={95} />
        <Tooltip
          contentStyle={{ background: "#ffffff", border: "1px solid #f0e6dc", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          labelStyle={{ color: "#1a0f0a" }}
          formatter={(value, name) => {
            const num = typeof value === "number" ? value : 0;
            const label =
              name === "rel" ? "Relevance" : name === "spec" ? "Specificity" : "Actionability";
            return [formatScore(num), label];
          }}
        />
        <Legend
          formatter={(value) =>
            value === "rel" ? "Relevance" : value === "spec" ? "Specificity" : "Actionability"
          }
        />
        <Bar dataKey="rel" stackId="score" fill={DIMENSION_COLORS.rel} />
        <Bar dataKey="spec" stackId="score" fill={DIMENSION_COLORS.spec} />
        <Bar dataKey="act" stackId="score" fill={DIMENSION_COLORS.act} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
