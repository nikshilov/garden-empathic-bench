"use client";

import { useState, Fragment } from "react";
import type { SystemVariance, BenchMeta, VarianceData } from "@/lib/types";
import { SystemDetail } from "@/components/SystemDetail";
import { formatMeanStd } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortKey = "total" | "rel" | "spec" | "act";

interface Props {
  variance: VarianceData;
  meta: BenchMeta;
}

export function LeaderboardTable({ variance, meta }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...variance.systems].sort(
    (a, b) => b[sortBy].mean - a[sortBy].mean
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>System</TableHead>
          <TableHead className="cursor-pointer text-right hover:text-foreground" onClick={() => setSortBy("total")}>
            Total / 30 {sortBy === "total" && "▼"}
          </TableHead>
          <TableHead className="cursor-pointer text-right hover:text-foreground hidden sm:table-cell" onClick={() => setSortBy("rel")}>
            Rel {sortBy === "rel" && "▼"}
          </TableHead>
          <TableHead className="cursor-pointer text-right hover:text-foreground hidden sm:table-cell" onClick={() => setSortBy("spec")}>
            Spec {sortBy === "spec" && "▼"}
          </TableHead>
          <TableHead className="cursor-pointer text-right hover:text-foreground hidden sm:table-cell" onClick={() => setSortBy("act")}>
            Act {sortBy === "act" && "▼"}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((system, i) => (
          <Fragment key={system.code}>
            <TableRow
              className={`cursor-pointer transition-colors hover:bg-secondary ${
                system.code === "G" ? "bg-gold/5" : ""
              }`}
              onClick={() => setExpanded(expanded === system.code ? null : system.code)}
            >
              <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
              <TableCell className="font-medium">
                {system.code === "G" && <span className="mr-1 text-gold">&#9733;</span>}
                {system.name}
              </TableCell>
              <TableCell className="text-right font-mono">{formatMeanStd(system.total.mean, system.total.std)}</TableCell>
              <TableCell className="text-right font-mono hidden sm:table-cell">{formatMeanStd(system.rel.mean, system.rel.std)}</TableCell>
              <TableCell className="text-right font-mono hidden sm:table-cell">{formatMeanStd(system.spec.mean, system.spec.std)}</TableCell>
              <TableCell className="text-right font-mono hidden sm:table-cell">{formatMeanStd(system.act.mean, system.act.std)}</TableCell>
            </TableRow>
            {expanded === system.code && (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <SystemDetail system={system} meta={meta} variance={variance} />
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
