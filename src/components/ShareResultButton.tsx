"use client";

import { useState } from "react";
import { ClipboardCheck, Link2, LoaderCircle } from "lucide-react";
import type { AnalysisMode, AnalyzeListingResult } from "@/lib/analyzer-types";

type CreatedShare = {
  token: string;
  deletionSecret: string;
  expiresAt: number;
  shareUrl: string;
};

export function ShareResultButton({
  result,
  analysisMode,
  vehicleTitle,
  askingPrice,
  mileage,
}: {
  result: AnalyzeListingResult;
  analysisMode: AnalysisMode;
  vehicleTitle: string;
  askingPrice: number | null;
  mileage: number | null;
}) {
  const [share, setShare] = useState<CreatedShare | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  async function createPublicShare() {
    setIsCreating(true);
    setError("");

    const reasons = [...result.redFlags, ...result.greenFlags, ...result.categories.map((category) => category.note)]
      .filter((reason, index, all) => Boolean(reason) && all.indexOf(reason) === index)
      .slice(0, 3)
      .map((reason) => reason.slice(0, 120));

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          score: result.score,
          verdict: result.verdict,
          vehicle: vehicleTitle.slice(0, 100),
          summary: result.summary.slice(0, 240),
          reasons,
          analysisMode,
          askingPrice,
          fairValueLow: result.estimatedFairValueRange.low,
          fairValueHigh: result.estimatedFairValueRange.high,
          suggestedOfferLow: result.suggestedOfferRange.low,
          suggestedOfferHigh: result.suggestedOfferRange.high,
          mileage,
        }),
      });
      const data = (await response.json()) as CreatedShare & { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not create the share link.");

      try {
        localStorage.setItem(`dealscan:share-delete:${data.token}`, data.deletionSecret);
      } catch {
        // The public link still works when browser storage is unavailable.
      }
      setShare(data);
      try {
        await copyUrl(data.shareUrl);
      } catch {
        // Keep the visible link available for manual copying.
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the share link.");
    } finally {
      setIsCreating(false);
    }
  }

  if (share) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-[rgba(63,138,91,0.35)] bg-[rgba(63,138,91,0.08)] p-3 sm:flex-row sm:items-center">
        <a href={share.shareUrl} className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--graphite)] underline" target="_blank" rel="noreferrer">
          {share.shareUrl}
        </a>
        <button type="button" onClick={() => void copyUrl(share.shareUrl)} className="btn-secondary shrink-0">
          <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => void createPublicShare()} disabled={isCreating} className="btn-secondary">
        {isCreating ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Link2 className="h-5 w-5" aria-hidden="true" />}
        {isCreating ? "Creating link..." : "Share result"}
      </button>
      {error ? <p className="mt-2 text-xs font-bold text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
