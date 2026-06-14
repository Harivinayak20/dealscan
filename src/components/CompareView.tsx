"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Gauge,
  OctagonAlert,
  RotateCcw,
  ShoppingCart,
  Trash2,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { AnalysisMode, AnalyzeListingResult } from "@/lib/analyzer-types";
import type { VinDecodeResult } from "@/lib/vin-decoder";
import { scoreTone } from "@/components/ScoreRing";
import { ResultSummary } from "@/components/ResultSummary";
import { generateMarketplaceLinks } from "@/lib/cross-platform-search";
import type { PlatformLink } from "@/lib/cross-platform-search";
import { generateNegotiationScripts } from "@/lib/generate-scripts";

export type SavedResult = {
  id: string;
  result: AnalyzeListingResult;
  sourceText: string;
  vehicleTitle: string;
  analysisMode: AnalysisMode;
  summary: string;
  listingUrl?: string;
  timestamp: number;
  vinResult?: VinDecodeResult;
};

type CompareViewProps = {
  savedResults: SavedResult[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onBack: () => void;
};

function LinkGroup({ title, links, icon: Icon }: { title: string; links: PlatformLink[]; icon: ComponentType<{ className?: string }> }) {
  if (links.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase text-[var(--text-muted)]">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--paper)] px-2.5 py-1.5 text-xs font-bold text-[var(--text-body)] transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
          >
            {link.label}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

function CompareCard({
  saved,
  onRemove,
  onViewDetails,
}: {
  saved: SavedResult;
  onRemove: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  const { result, vehicleTitle, summary, sourceText } = saved;
  const tone = scoreTone(result.score);
  const ToneIcon = tone.icon;
  const sellerPrice = sourceText.match(/\$\s?[\d,]+/)?.[0] ?? "N/A";
  const marketRange =
    result.estimatedFairValueRange.low !== null && result.estimatedFairValueRange.high !== null
      ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.estimatedFairValueRange.low)} – ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.estimatedFairValueRange.high)}`
      : "Unknown";
  const allLinks = generateMarketplaceLinks(sourceText);
  const marketplaceLinks = allLinks.filter((l) => l.type === "marketplace");
  const referenceLinks = allLinks.filter((l) => l.type === "reference");

  return (
    <article className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center">
              <div
                className="absolute inset-0 rounded-full opacity-20"
                style={{ background: `conic-gradient(${tone.ring} ${result.score * 3.6}deg, #e5e7eb 0deg)` }}
              />
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[var(--paper)]">
                <ToneIcon className="h-6 w-6" style={{ color: tone.ring }} aria-hidden="true" />
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-[var(--graphite)]">{vehicleTitle}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>Score: <strong className="text-[var(--graphite)]" style={{ color: tone.ring }}>{result.score}/100</strong></span>
                <span className="text-neutral-300">·</span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-black ${tone.soft}`}>
                  <ToneIcon className="h-3 w-3" aria-hidden="true" />
                  {result.verdict}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onRemove(saved.id)}
            className="shrink-0 rounded-full p-2 text-neutral-400 opacity-0 transition hover:bg-red-50 hover:text-[var(--danger)] group-hover:opacity-100"
            aria-label={`Remove ${vehicleTitle} from comparison`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Seller Price</div>
            <div className="mt-1 text-xl font-black text-[var(--graphite)]">{sellerPrice}</div>
          </div>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Market Range</div>
            <div className="mt-1 text-base font-black text-[var(--graphite)]">{marketRange}</div>
          </div>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="text-xs font-bold uppercase text-[var(--text-muted)]">Flags</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {result.greenFlags.length > 0 && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {result.greenFlags.length} green
                </span>
              )}
              {result.redFlags.length > 0 && (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--danger)]">
                  <OctagonAlert className="h-4 w-4" aria-hidden="true" />
                  {result.redFlags.length} red
                </span>
              )}
              {result.greenFlags.length === 0 && result.redFlags.length === 0 && (
                <span className="text-sm text-neutral-400">None detected</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
          <div className="flex items-start gap-2">
            <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
            <p className="text-sm leading-6 text-[var(--text-body)]">{summary}</p>
          </div>
        </div>

        {saved.vinResult && !saved.vinResult.error ? (
          <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                <strong className="text-[var(--text-body)]">{saved.vinResult.year}</strong>
              </span>
              <span className="text-neutral-300">·</span>
              <span className="text-[var(--text-body)] font-medium">{saved.vinResult.make}</span>
              <span className="text-neutral-300">·</span>
              <span className="text-[var(--text-body)] font-medium">{saved.vinResult.model}</span>
              {saved.vinResult.trim && (
                <>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[var(--text-body)]">{saved.vinResult.trim}</span>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <a
                href={`https://www.nhtsa.gov/vehicle/${saved.vinResult.year}/${saved.vinResult.make}/${saved.vinResult.model}/recalls`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--paper)] px-2.5 py-1.5 text-xs font-bold text-[var(--text-body)] transition hover:-translate-y-0.5 hover:border-[var(--danger)] hover:text-[var(--danger)]"
              >
                Recall Check
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <a
                href={`https://www.nicb.org/vincheck?vin=${saved.vinResult.vin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--paper)] px-2.5 py-1.5 text-xs font-bold text-[var(--text-body)] transition hover:-translate-y-0.5 hover:border-[var(--danger)] hover:text-[var(--danger)]"
              >
                Theft Check
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <LinkGroup title="Find it elsewhere" links={marketplaceLinks} icon={Search} />
          <LinkGroup title="Reference data" links={referenceLinks} icon={ShieldCheck} />
        </div>

        <details className="group mt-4 rounded-xl border border-neutral-100 bg-neutral-50 open:ring-2 open:ring-[rgba(169,130,83,0.25)]">
          <summary className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm font-black text-[var(--text-body)] transition hover:text-[var(--graphite)]">
            <span className="rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-black uppercase text-[var(--text-body)] transition group-open:bg-[rgba(169,130,83,0.20)] group-open:text-[var(--champagne)]">
              PRO
            </span>
            Negotiation Scripts
            <ChevronRight className="ml-auto h-4 w-4 transition group-open:rotate-90" aria-hidden="true" />
          </summary>
          <div className="border-t border-[var(--border-subtle)] px-4 py-3">
            {(() => {
              const scripts = generateNegotiationScripts(result, sourceText);
              const items: { label: string; script: string }[] = [
                { label: "📱 Text", script: scripts.text },
                { label: "📧 Email", script: scripts.email },
                { label: "🗣 In-Person", script: scripts.inPerson },
              ];
              return items.map(({ label, script }) => (
                <div key={label} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase text-[var(--text-muted)]">{label}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(script)}
                      className="rounded-md border border-[var(--border-subtle)] bg-[var(--paper)] px-2 py-1 text-[10px] font-bold text-[var(--text-body)] transition hover:-translate-y-0.5 hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap rounded-lg bg-[var(--paper)] p-2.5 text-xs leading-relaxed text-[var(--text-body)] shadow-sm">{script}</p>
                </div>
              ));
            })()}
          </div>
        </details>
      </div>

      <div className="border-t border-neutral-100 px-5 py-3">
        <button
          type="button"
          onClick={() => onViewDetails(saved.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(169,130,83,0.55)] bg-[var(--paper)] px-4 py-2.5 text-sm font-black text-[var(--graphite)] transition hover:-translate-y-0.5 hover:bg-[rgba(169,130,83,0.10)] hover:shadow-sm"
        >
          View Full Analysis
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export function CompareView({ savedResults, onRemove, onClearAll, onBack }: CompareViewProps) {
  const [viewingId, setViewingId] = useState<string | null>(null);

  const viewedDeal = viewingId ? savedResults.find((s) => s.id === viewingId) : null;

  if (viewedDeal) {
    return (
      <div className="min-h-screen bg-[rgba(244,240,232,0.94)]">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,13,16,0.90)] text-[var(--ivory)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setViewingId(null)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--silver)] transition hover:text-[var(--champagne)]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Compare
            </button>
            <div className="text-sm font-bold text-[var(--silver)]">
              {viewedDeal.vehicleTitle}
            </div>
          </div>
        </div>
        <ResultSummary
          result={viewedDeal.result}
          analysisMode={viewedDeal.analysisMode}
          sourceText={viewedDeal.sourceText}
          vehicleTitle={viewedDeal.vehicleTitle}
          onReset={() => setViewingId(null)}
        />
      </div>
    );
  }

  const sorted = [...savedResults].sort((a, b) => b.result.score - a.result.score);

  return (
    <section className="min-h-screen bg-[rgba(244,240,232,0.94)] px-5 py-8 text-[var(--graphite)] sm:px-7">
      <div className="mx-auto max-w-[1600px]">
        <Link href="/" className="mb-6 inline-flex items-center gap-3 transition hover:-translate-y-0.5" aria-label="Dealscan.dev home">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--graphite)] text-[var(--champagne)]">
            <CarFront className="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-2xl font-black">Dealscan.dev</span>
            <span className="block text-[11px] font-bold uppercase text-[var(--racing-green)]">Listing review</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-2 text-sm font-bold text-[var(--text-body)] transition hover:-translate-y-0.5 hover:shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
              <h1 className="text-3xl font-black">Compare Deals</h1>
              <span className="rounded-full bg-[var(--champagne)] px-3 py-1 text-sm font-black text-[var(--graphite)]">
                {savedResults.length}
              </span>
            </div>
            <p className="mt-2 text-base leading-6 text-[var(--text-body)]">
              Sorted by score &mdash; best deal first
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--danger)] px-4 py-2.5 text-sm font-bold text-[var(--danger)] transition hover:-translate-y-0.5 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear All
            </button>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="mt-20 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-neutral-300" aria-hidden="true" />
            <h2 className="mt-6 text-2xl font-black text-neutral-400">No deals saved yet</h2>
            <p className="mt-3 text-base text-[var(--text-muted)]">
              Analyze a listing and click <strong>&ldquo;Add to Compare&rdquo;</strong> to save it here.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--graphite)] px-6 py-3 text-base font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Analyze a Listing
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((saved) => (
              <CompareCard
                key={saved.id}
                saved={saved}
                onRemove={onRemove}
                onViewDetails={setViewingId}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
