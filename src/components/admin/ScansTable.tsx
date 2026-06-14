"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { EmptyState } from "@/components/admin/EmptyState";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import { adminStore } from "@/lib/admin-store";
import type { StoredScan } from "@/lib/admin-types";
import { ArrowUpDown, ChevronRight, Trash2 } from "lucide-react";

type SortField = "createdAt" | "score" | "vehicleTitle";
type SortDir = "asc" | "desc";

export function ScansTable() {
  const [scans, setScans] = useState<StoredScan[]>(() => adminStore.getScans());
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = scans
    .filter((s) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.vehicleTitle.toLowerCase().includes(q) ||
        s.verdict.toLowerCase().includes(q) ||
        s.listingTextSnippet.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "score") return (a.score - b.score) * dir;
      if (sortField === "vehicleTitle") return a.vehicleTitle.localeCompare(b.vehicleTitle) * dir;
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    });

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function handleDelete(id: string) {
    adminStore.deleteScan(id);
    setScans(adminStore.getScans());
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
        <SearchFilter value={search} onChange={setSearch} placeholder="Search by vehicle, verdict, or text..." />
        <CsvExportButton
          data={filtered}
          filename="dealscan-scans"
          headers={["Vehicle", "Score", "Verdict", "Status", "Confidence", "Date", "Snippet"]}
          mapper={(row) => [
            String(row.vehicleTitle ?? ""),
            String(row.score ?? ""),
            String(row.verdict ?? ""),
            String(row.status ?? ""),
            String(row.confidence ?? ""),
            String(row.createdAt ?? ""),
            String(row.listingTextSnippet ?? ""),
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-black uppercase tracking-[0.08em] text-[var(--text-body)]">
              <th className="px-4 py-3">
                <button onClick={() => toggleSort("vehicleTitle")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Vehicle <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button onClick={() => toggleSort("score")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Score <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th className="hidden px-4 py-3 md:table-cell">Verdict</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 sm:table-cell">Confidence</th>
              <th className="hidden px-4 py-3 lg:table-cell">
                <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 hover:text-[var(--graphite)]">
                  Date <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                </button>
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((scan) => (
              <tr key={scan.id} className="border-b border-neutral-100 transition hover:bg-neutral-50">
                <td className="px-4 py-3 font-bold text-[var(--graphite)]">{scan.vehicleTitle}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-black ${
                      scan.score >= 80
                        ? "text-[var(--success)]"
                        : scan.score >= 60
                          ? "text-[var(--warning)]"
                          : "text-[var(--danger)]"
                    }`}
                  >
                    {scan.score}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] md:table-cell">{scan.verdict}</td>
                <td className="px-4 py-3"><StatusBadge status={scan.status} /></td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className={`font-bold ${
                    scan.confidence === "High" ? "text-[var(--success)]" : scan.confidence === "Medium" ? "text-[var(--warning)]" : "text-[var(--danger)]"
                  }`}>
                    {scan.confidence}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] lg:table-cell">
                  {new Date(scan.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/scans/${scan.id}`}
                      className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[var(--champagne)] transition hover:bg-[rgba(169,130,83,0.10)]"
                    >
                      View <ChevronRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                    <button
                      onClick={() => handleDelete(scan.id)}
                      className="rounded-lg p-1 text-neutral-400 transition hover:bg-red-50 hover:text-[var(--danger)]"
                      aria-label={`Delete ${scan.vehicleTitle}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
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
