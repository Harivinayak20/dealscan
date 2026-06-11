"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Gauge, OctagonAlert, RotateCcw, Search, ShieldCheck, Share2 } from "lucide-react";
import type { ComparisonResult } from "@/lib/compare-listings";
import { scoreTone } from "@/components/ScoreRing";
import { loadSavedComparisons, saveSavedComparisons, isDuplicateComparison } from "@/lib/comparison-storage";

type ComparisonResultViewProps = {
  comparison: ComparisonResult;
  onBack: () => void;
};

function formatCurrency(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function ScoreBadge({ score, label }: { score: number | null; label: string }) {
  if (score === null) return <span className="text-sm text-neutral-400">No score</span>;
  const tone = scoreTone(score);
  return (
    <div className="flex items-center gap-2">
      <div className="relative grid h-16 w-16 shrink-0 place-items-center">
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ background: `conic-gradient(${tone.ring} ${score * 3.6}deg, #e5e7eb 0deg)` }}
        />
        <div className="relative grid h-12 w-12 place-items-center rounded-full bg-white">
          <span className="text-lg font-black" style={{ color: tone.ring }}>{score}</span>
        </div>
      </div>
      <div>
        <div className="text-lg font-black text-[var(--graphite)]">{label}</div>
        <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-black ${tone.soft}`}>
          <tone.icon className="h-3 w-3" />
          {tone.label}
        </div>
      </div>
    </div>
  );
}

export function ComparisonResultView({ comparison, onBack }: ComparisonResultViewProps) {
  const { listingA, listingB, winner, winnerLabel, winnerReason, priceDelta, scoreDelta, riskDelta, missingInfoComparison, recommendedNextStep } = comparison;
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

    const handleSave = async () => {
      setIsSaving(true);
      try {
        const existing = loadSavedComparisons();
        if (isDuplicateComparison(existing, comparison)) {
          setNotice("This comparison is already saved.");
          setTimeout(() => setNotice(null), 3000);
          setIsSaving(false);
          setHasSaved(true);
          return;
        }
        const updated = [
          ...existing,
          { ...comparison, savedAt: new Date().toISOString() },
        ];
        const didSave = saveSavedComparisons(updated);
        if (didSave) {
          setHasSaved(true);
          setNotice("Comparison saved!");
        } else {
          setNotice("Could not save. Browser storage may be full or disabled.");
        }
        setTimeout(() => setNotice(null), 3000);
      } catch {
        setNotice("Failed to save comparison.");
        setTimeout(() => setNotice(null), 3000);
      } finally {
        setIsSaving(false);
      }
    };

    const handleShare = async () => {
      setIsSharing(true);
      try {
        const text = [
          `DealScan Comparison: ${comparison.aTitle} vs ${comparison.bTitle}`,
          `Winner: ${comparison.winnerLabel}`,
          `Score Delta: ${comparison.scoreDelta > 0 ? "+" : ""}${comparison.scoreDelta}`,
          `Price Difference: ${comparison.priceDelta}`,
          `Risk: ${comparison.riskDelta}`,
          `Next Step: ${comparison.recommendedNextStep}`,
          "",
          "View more at: https://dealscan.pages.dev",
        ].join("\n");

        if (navigator.share) {
          await navigator.share({
            title: "DealScan Comparison",
            text: text,
          });
          setNotice("Comparison shared!");
          setTimeout(() => setNotice(null), 3000);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          setNotice("Comparison copied to clipboard!");
          setTimeout(() => setNotice(null), 3000);
        } else {
          setNotice("Sharing not available. Copy the URL from your address bar.");
          setTimeout(() => setNotice(null), 4000);
        }
      } catch {
        setNotice("Could not access clipboard. Copy the URL from your address bar instead.");
        setTimeout(() => setNotice(null), 4000);
      } finally {
        setIsSharing(false);
      }
    };

  const winnerTone = winner === "tie" ? { ring: "#d6a84f", soft: "border-amber-200 bg-amber-50 text-amber-700" }
    : { ring: "#123d33", soft: "border-green-200 bg-green-50 text-green-800" };

  return (
    <section className="min-h-screen bg-[rgba(244,240,232,0.94)]">
      {notice ? (
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
          <div className="flex items-center bg-[var(--accent-2)] text-white px-4 py-2 rounded-md">
            {notice}
          </div>
        </div>
      ) : null}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,13,16,0.90)] text-[var(--ivory)] backdrop-blur-xl">
       <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
         <button
           type="button"
           onClick={onBack}
           className="inline-flex items-center gap-2 text-sm font-bold text-[var(--silver)] transition hover:text-[var(--champagne)]"
         >
           <ArrowLeft className="h-4 w-4" aria-hidden="true" />
           Back
         </button>
         <div className="flex items-center gap-3">
           <div className="flex gap-2">
             <button
               type="button"
               onClick={onBack}
               className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/70 transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
             >
               <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
               New compare
             </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || hasSaved}
                className={`inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/70 transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:text-[var(--champagne)] ${isSaving || hasSaved ? "opacity-50" : ""}`}
              >
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {hasSaved ? "Saved" : isSaving ? "Saving..." : "Save"}
              </button>
             <button
               type="button"
               onClick={handleShare}
               disabled={isSharing}
               className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-white/70 transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
             >
               <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
               Share
             </button>
           </div>
         </div>
       </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className={`rounded-2xl border p-5 sm:p-6 ${winnerTone.soft}`}>
          <div className="flex items-center gap-3">
            {winner === "A" || winner === "B" ? (
              <CheckCircle2 className="h-8 w-8 text-green-700" aria-hidden="true" />
            ) : (
              <Gauge className="h-8 w-8 text-amber-600" aria-hidden="true" />
            )}
            <div>
              <div className="text-2xl font-black">{winnerLabel}</div>
              <p className="mt-1 text-sm leading-6 opacity-80">{winnerReason}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] leading-4 text-neutral-400">
          Informational only &mdash; verify VIN, title, and inspection yourself.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <ScoreBadge score={listingA?.score ?? null} label={comparison.aTitle} />
            {listingA ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Price</div>
                  <div className="mt-1 text-lg font-black text-[var(--graphite)]">
                    {formatCurrency(extractPrice(listingA))}
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Fair Range</div>
                  <div className="mt-1 text-sm font-black text-[var(--graphite)]">
                    {listingA.estimatedFairValueRange.low !== null
                      ? `${formatCurrency(listingA.estimatedFairValueRange.low)} – ${formatCurrency(listingA.estimatedFairValueRange.high)}`
                      : "Unknown"}
                  </div>
                </div>
              </div>
            ) : null}
            {listingA ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {listingA.greenFlags.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {listingA.greenFlags.length} green
                  </span>
                )}
                {listingA.redFlags.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                    <OctagonAlert className="h-3 w-3" />
                    {listingA.redFlags.length} red
                  </span>
                )}
                {listingA.missingInfo.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <Search className="h-3 w-3" />
                    {listingA.missingInfo.length} missing
                  </span>
                )}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <ScoreBadge score={listingB?.score ?? null} label={comparison.bTitle} />
            {listingB ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-neutral-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Price</div>
                  <div className="mt-1 text-lg font-black text-[var(--graphite)]">
                    {formatCurrency(extractPrice(listingB))}
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <div className="text-[10px] font-bold uppercase text-neutral-500">Fair Range</div>
                  <div className="mt-1 text-sm font-black text-[var(--graphite)]">
                    {listingB.estimatedFairValueRange.low !== null
                      ? `${formatCurrency(listingB.estimatedFairValueRange.low)} – ${formatCurrency(listingB.estimatedFairValueRange.high)}`
                      : "Unknown"}
                  </div>
                </div>
              </div>
            ) : null}
            {listingB ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {listingB.greenFlags.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {listingB.greenFlags.length} green
                  </span>
                )}
                {listingB.redFlags.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                    <OctagonAlert className="h-3 w-3" />
                    {listingB.redFlags.length} red
                  </span>
                )}
                {listingB.missingInfo.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <Search className="h-3 w-3" />
                    {listingB.missingInfo.length} missing
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-black uppercase text-[var(--accent-2)]">Differences</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-[10px] font-bold uppercase text-neutral-500">Score Delta</div>
              <div className={`mt-1 text-lg font-black ${scoreDelta > 3 ? "text-green-700" : scoreDelta < -3 ? "text-red-700" : "text-amber-600"}`}>
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-[10px] font-bold uppercase text-neutral-500">Price</div>
              <div className="mt-1 text-sm font-black text-[var(--graphite)]">{priceDelta}</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-[10px] font-bold uppercase text-neutral-500">Risk</div>
              <div className="mt-1 text-sm font-black text-[var(--graphite)]">{riskDelta}</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3">
              <div className="text-[10px] font-bold uppercase text-neutral-500">Info Gaps</div>
              <div className="mt-1 text-sm font-black text-[var(--graphite)]">{missingInfoComparison}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--accent-2)]">What to do next</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{recommendedNextStep}</p>
            </div>
          </div>
        </div>

        {listingA && listingB ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 text-sm font-black text-neutral-600 transition hover:text-[var(--graphite)]">
                Seller questions for each car
                <ChevronRight className="ml-auto h-4 w-4 transition group-open:rotate-90" aria-hidden="true" />
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-500">Ask Car A seller</h4>
                  <ul className="mt-2 space-y-1.5">
                    {listingA.sellerQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-5 text-neutral-600">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-neutral-500">Ask Car B seller</h4>
                  <ul className="mt-2 space-y-1.5">
                    {listingB.sellerQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-5 text-neutral-600">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-neutral-300" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function extractPrice(result: { estimatedFairValueRange: { low: number | null } } | null): number | null {
  return result?.estimatedFairValueRange.low ?? null;
}
