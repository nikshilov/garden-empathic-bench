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
    <ResponsiveContainer
      width="100%"
      height={Math.max(400, systems.length * 32)}
    >
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 100, right: 20, top: 5, bottom: 5 }}
      >
        <XAxis
          type="number"
          domain={[0, 30]}
          tick={{ fill: "#9a8576", fontSize: 12 }}
          axisLine={{ stroke: "rgba(224,112,88,0.15)" }}
          tickLine={{ stroke: "rgba(224,112,88,0.15)" }}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#2d1f14", fontSize: 12 }}
          width={95}
          axisLine={false}
          tickLine={false}
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
          labelStyle={{ color: "#2d1f14", fontWeight: 600 }}
          formatter={(value, name) => {
            const num = typeof value === "number" ? value : 0;
            const label =
              name === "rel"
                ? "Relevance"
                : name === "spec"
                  ? "Specificity"
                  : "Actionability";
            return [formatScore(num), label];
          }}
        />
        <Legend
          formatter={(value) =>
            value === "rel"
              ? "Relevance"
              : value === "spec"
                ? "Specificity"
                : "Actionability"
          }
        />
        <Bar dataKey="rel" stackId="score" fill={DIMENSION_COLORS.rel} />
        <Bar dataKey="spec" stackId="score" fill={DIMENSION_COLORS.spec} />
        <Bar
          dataKey="act"
          stackId="score"
          fill={DIMENSION_COLORS.act}
          radius={[0, 8, 8, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
