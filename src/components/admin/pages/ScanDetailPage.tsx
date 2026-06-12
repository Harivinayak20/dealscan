"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { adminStore } from "@/lib/admin-store";
import type { ScanStatus } from "@/lib/admin-types";
import { statusLabel } from "@/lib/admin-types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { ArrowLeft, CarFront, Gauge, Save } from "lucide-react";
import Link from "next/link";

const statusOptions: ScanStatus[] = ["good_deal", "fair_deal", "risky_deal", "needs_review"];

export default function ScanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [scan] = useState(() => adminStore.getScan(id));
  const [selectedStatus, setSelectedStatus] = useState<ScanStatus>(scan?.status ?? "needs_review");
  const [notes, setNotes] = useState(scan?.internalNotes ?? "");
  const [saved, setSaved] = useState(false);

  if (!scan) {
    return (
      <div>
        <Link
          href="/admin/scans"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--text-body)] transition hover:text-[var(--graphite)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to scans
        </Link>
        <EmptyState
          title="Scan not found"
          description="This scan may have been deleted or the ID is invalid."
        />
      </div>
    );
  }

  function handleSave() {
    if (!scan) return;
    adminStore.updateScanStatus(id, selectedStatus, notes);
    adminStore.addAuditEntry({
      action: "Status Update",
      adminEmail: "admin@dealscan.dev",
      details: `Changed scan "${scan.vehicleTitle}" status to ${statusLabel(selectedStatus)}.`,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <Link
        href="/admin/scans"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-body)] transition hover:text-[var(--graphite)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to scans
      </Link>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(201,168,106,0.12)]">
              <CarFront className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[var(--graphite)]">{scan.vehicleTitle}</h1>
              <p className="mt-1 text-sm text-[var(--text-body)]">
                Scanned on {new Date(scan.createdAt).toLocaleDateString()} · {scan.confidence} confidence
              </p>
            </div>
          </div>
          <StatusBadge status={scan.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
          <p className="text-sm font-bold text-[var(--text-body)]">Deal Score</p>
          <p className={`mt-1 text-3xl font-black ${
            scan.score >= 80 ? "text-[var(--success)]" : scan.score >= 60 ? "text-[var(--warning)]" : "text-[var(--danger)]"
          }`}>
            <Gauge className="mr-2 inline h-6 w-6" aria-hidden="true" />
            {scan.score}/100
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
          <p className="text-sm font-bold text-[var(--text-body)]">Verdict</p>
          <p className="mt-1 text-xl font-black text-[var(--graphite)]">{scan.verdict}</p>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
          <p className="text-sm font-bold text-[var(--text-body)]">Source</p>
          <p className="mt-1 text-sm font-bold text-[var(--graphite)]">
            {scan.sourceUrl ? (
              <a href={scan.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--champagne)] underline">
                View listing
              </a>
            ) : (
              "Pasted text"
            )}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <h2 className="text-lg font-black text-[var(--graphite)]">Listing Text</h2>
        <p className="mt-3 whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-7 text-[var(--text-body)]">
          {scan.listingTextSnippet || "No listing text available."}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
        <h2 className="text-lg font-black text-[var(--graphite)]">Internal Review</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label htmlFor="scan-status" className="text-sm font-bold text-[var(--text-body)]">Status</label>
            <select
              id="scan-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as ScanStatus)}
              className="mt-1 min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] px-3 text-sm text-[var(--graphite)] outline-none focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="scan-notes" className="text-sm font-bold text-[var(--text-body)]">Internal Notes</label>
            <textarea
              id="scan-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this scan..."
              className="mt-1 min-h-24 w-full resize-y rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] p-3 text-sm leading-6 text-[var(--graphite)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.20)]"
            />
          </div>
          <button
            onClick={handleSave}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--graphite)] px-5 text-sm font-black text-white transition hover:bg-[var(--charcoal)]"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
