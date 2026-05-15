"use client";

import { ScansTable } from "@/components/admin/ScansTable";

export default function AdminScans() {
  return (
    <div className="grid gap-6">
      <p className="text-sm leading-6 text-neutral-600">
        Review, filter, and manage all deal scans submitted through the analyzer.
      </p>
      <ScansTable />
    </div>
  );
}
