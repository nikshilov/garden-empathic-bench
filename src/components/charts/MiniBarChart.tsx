"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SystemVariance } from "@/lib/types";
import { formatScore } from "@/lib/utils";

export function MiniBarChart({ systems }: { systems: SystemVariance[] }) {
  const top5 = systems.slice(0, 5);
  const data = top5.map((s) => ({
    name: s.name,
    total: s.total.mean,
    isGarden: s.code === "G",
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 80, right: 20, top: 5, bottom: 5 }}
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
          tick={{ fill: "#2d1f14", fontSize: 13 }}
          width={75}
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
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Bar dataKey="total" radius={[0, 8, 8, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isGarden ? "#e07058" : "#d4c8bc"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
