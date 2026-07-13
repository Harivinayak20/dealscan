"use client";

import { useState } from "react";
import { SearchFilter } from "@/components/admin/SearchFilter";
import { EmptyState } from "@/components/admin/EmptyState";
import { CsvExportButton } from "@/components/admin/CsvExportButton";
import type { SubscriberRow } from "@/lib/analytics";

export function SubscribersTable({ subscribers }: { subscribers: SubscriberRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = subscribers.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.email.toLowerCase().includes(q) || (s.source ?? "").toLowerCase().includes(q);
  });

  if (subscribers.length === 0) {
    return (
      <EmptyState
        title="No subscribers yet"
        description="Signups from the footer and guide forms will appear here."
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchFilter value={search} onChange={setSearch} placeholder="Search by email or source..." />
        <CsvExportButton
          data={filtered.map((s) => ({ ...s, source: s.source ?? undefined, unsubscribed_at: s.unsubscribed_at ?? undefined }))}
          filename="dealscan-subscribers"
          headers={["Email", "Source", "Signed up", "Unsubscribed"]}
          mapper={(row) => [
            String(row.email ?? ""),
            String(row.source ?? ""),
            row.created_at ? new Date(Number(row.created_at)).toISOString() : "",
            row.unsubscribed_at ? new Date(Number(row.unsubscribed_at)).toISOString() : "",
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-black uppercase tracking-[0.08em] text-[var(--text-body)]">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="hidden px-4 py-3 sm:table-cell">Signed up</th>
              <th className="hidden px-4 py-3 md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-neutral-100 transition hover:bg-neutral-50">
                <td className="px-4 py-3 font-bold text-[var(--graphite)]">{s.email}</td>
                <td className="px-4 py-3 text-[var(--text-body)]">{s.source ?? ""}</td>
                <td className="hidden px-4 py-3 text-[var(--text-body)] sm:table-cell">{new Date(s.created_at).toLocaleString()}</td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {s.unsubscribed_at ? (
                    <span className="inline-flex rounded-md bg-red-50 px-2 py-0.5 text-xs font-black text-[var(--danger)]">Unsubscribed</span>
                  ) : (
                    <span className="inline-flex rounded-md bg-[rgba(124,169,130,0.14)] px-2 py-0.5 text-xs font-black text-[var(--racing-green)]">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[var(--text-muted)]">
        Showing {filtered.length} of {subscribers.length} subscribers
      </p>
    </div>
  );
}
