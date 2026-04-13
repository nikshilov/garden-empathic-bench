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
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
        <XAxis type="number" domain={[0, 30]} tick={{ fill: "#8b7355", fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#1a0f0a", fontSize: 13 }} width={75} />
        <Tooltip
          contentStyle={{ background: "#ffffff", border: "1px solid #f0e6dc", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          labelStyle={{ color: "#1a0f0a" }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isGarden ? "#e86c5f" : "#c4b5a4"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
