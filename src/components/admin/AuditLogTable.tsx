"use client";

import { useState } from "react";
import { adminStore } from "@/lib/admin-store";
import { EmptyState } from "@/components/admin/EmptyState";
import { History } from "lucide-react";

export function AuditLogTable() {
  const [entries] = useState(() => adminStore.getAuditLog());

  if (entries.length === 0) {
    return (
      <EmptyState
        title="No audit entries"
        description="Audit entries will appear here as admin actions are taken."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50 text-xs font-black uppercase tracking-[0.08em] text-neutral-600">
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Action</th>
            <th className="hidden px-4 py-3 md:table-cell">Admin</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-neutral-100 transition hover:bg-neutral-50">
              <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                {new Date(entry.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 font-bold text-[var(--graphite)]">
                  <History className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
                  {entry.action}
                </span>
              </td>
              <td className="hidden px-4 py-3 text-neutral-700 md:table-cell">{entry.adminEmail}</td>
              <td className="px-4 py-3 text-neutral-600">{entry.details}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="border-t border-neutral-100 px-4 py-3 text-sm text-neutral-500">
        {entries.length} entr{entries.length === 1 ? "y" : "ies"}
      </p>
    </div>
  );
}
