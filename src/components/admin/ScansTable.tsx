"use client";

import { useState } from "react";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { EmptyState } from "@/components/admin/EmptyState";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import type { ScanRow } from "@/lib/analytics";
import { ArrowUpDown } from "lucide-react";

type SortField = "ts" | "score" | "vehicle_title";
type SortDir = "asc" | "desc";

const VERDICT_LABEL: Record<string, { label: string; className: string }> = {
  good_deal: { label: "Good deal", className: "bg-[rgba(124,169,130,0.14)] text-[var(--racing-green)]" },
  fair_deal: { label: "Fair deal", className: "bg-[rgba(169,130,83,0.14)] text-[#7a5615]" },
  risky_deal: { label: "Caution", className: "bg-[rgba(245,158,11,0.14)] text-[#7a5615]" },
  avoid: { label: "Avoid", className: "bg-red-50 text-[var(--danger)]" },
};

function verdictBadge(verdict: string | null) {
  const meta = verdict ? VERDICT_LABEL[verdict] : null;
  if (!meta) return <span className="text-[var(--text-muted)]">{verdict ?? "?"}</span>;
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-black ${meta.className}`}>{meta.label}</span>;
}

export function ScansTable({ scans }: { scans: ScanRow[] }) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("ts");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = scans
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        (s.vehicle_title ?? "").toLowerCase().includes(q) ||
        (s.verdict ?? "").toLowerCase().includes(q) ||
        (s.input_type ?? "").toLowerCase().includes(q) ||
        (s.source ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "score") return ((a.score ?? -1) - (b.score ?? -1)) * dir;
      if (sortField === "vehicle_title") return (a.vehicle_title ?? "").localeCompare(b.vehicle_title ?? "") * dir;
      return (a.ts - b.ts) * dir;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  if (scans.length === 0) {
    return (
      <EmptyState
        title="No deal scans yet"
        description="Scans will appear here after users analyze listings."
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search by vehicle, verdict, input, source..." />
        <CsvExportButton
          data={filtered.map((s) => ({
            id: s.id,
            ts: s.ts,
            vehicle_title: s.vehicle_title ?? undefined,
            score: s.score ?? undefined,
            verdict: s.verdict ?? undefined,
            confidence: s.confidence ?? undefined,
            input_type: s.input_type ?? undefined,
            source: s.source ?? undefined,
          }))}
          filename="dealscan-scans"
          headers={["Vehicle", "Score", "Verdict", "Confidence", "Input", "Source", "Date"]}
          mapper={(row) => [
            String(row.vehicle_title ?? ""),
            String(row.score ?? ""),
            String(row.verdict ?? ""),
            String(row.confidence ?? ""),
            String(row.input_type ?? ""),
            String(row.source ?? ""),
            row.ts ? new Date(Number(row.ts)).toISOString() : "",
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-black uppercase tracking-[0.08em] text-[var(--text-body)]">
              <th className="px-4 py-3">
                <button onClick={() => toggleSort("vehicle_title")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Vehicle <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Score <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th className="px-4 py-3">Verdict</th>
              <th className="hidden px-4 py-3 sm:table-cell">Confidence</th>
              <th className="hidden px-4 py-3 md:table-cell">Input</th>
              <th className="hidden px-4 py-3 md:table-cell">Source</th>
              <th className="hidden px-4 py-3 lg:table-cell">
                <button onClick={() => toggleSort("ts")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Date <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scan) => (
              <tr key={scan.id} className="border-b border-neutral-100 transition hover:bg-neutral-50">
                <td className="px-4 py-3 font-bold text-[var(--graphite)]">{scan.vehicle_title ?? "Untitled scan"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-black ${
                      (scan.score ?? 0) >= 80
                        ? "text-[var(--success)]"
                        : (scan.score ?? 0) >= 60
                          ? "text-[var(--warning)]"
                          : "text-[var(--danger)]"
                    }`}
                  >
                    {scan.score ?? "?"}
                  </span>
                </td>
                <td className="px-4 py-3">{verdictBadge(scan.verdict)}</td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`font-bold ${
                    scan.confidence === "High" ? "text-[var(--success)]" : scan.confidence === "Medium" ? "text-[var(--warning)]" : "text-[var(--danger)]"
                  }`}>
                    {scan.confidence ?? "?"}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] md:table-cell">{scan.input_type ?? ""}</td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] md:table-cell">{scan.source ?? ""}</td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] lg:table-cell">
                  {new Date(scan.ts).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[var(--text-muted)]">
        Showing {filtered.length} of {scans.length} scans
      </p>
    </div>
  );
}
