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
        <XAxis type="number" domain={[0, 30]} tick={{ fill: "#a1a1a1", fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#fafafa", fontSize: 13 }} width={75} />
        <Tooltip
          contentStyle={{ background: "#141414", border: "1px solid #262626", borderRadius: 8 }}
          labelStyle={{ color: "#fafafa" }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : 0;
            return [formatScore(num) + " / 30", "Score"];
          }}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.isGarden ? "#d4a843" : "#3b82f6"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
