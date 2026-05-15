"use client";

import { AuditLogTable } from "@/components/admin/AuditLogTable";

export default function AdminAudit() {
  return (
    <div className="grid gap-6">
      <p className="text-sm leading-6 text-neutral-600">
        All admin actions are logged here for accountability and debugging.
      </p>
      <AuditLogTable />
    </div>
  );
}
