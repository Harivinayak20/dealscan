"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Search, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/financing-calculator";
import { generateMarketplaceLinks } from "@/lib/cross-platform-search";
import type { BetterDeal, BetterDealsResult } from "@/lib/better-deals";

type BetterDealsPanelProps = {
  make: string | null;
  model: string | null;
  year: string | null;
  price: number | null;
  mileage: number | null;
  sourceText: string;
};

function DealRow({ deal, scannedMileage }: { deal: BetterDeal; scannedMileage: number | null }) {
  const title = [deal.year, deal.make, deal.model, deal.trim].filter(Boolean).join(" ");
  const higherMileage =
    scannedMileage !== null && deal.mileage !== null && deal.mileage > scannedMileage * 1.15;

  return (
    <a
      href={deal.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex items-center gap-4 rounded-xl border border-[var(--border-subtle)] bg-white/82 p-4 transition hover:-translate-y-0.5 hover:border-[rgba(124,169,130,0.55)] hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-xl font-black text-[var(--graphite)]">{formatCurrency(deal.price)}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[rgba(124,169,130,0.14)] px-2 py-0.5 text-sm font-black text-[var(--racing-green)]">
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
            Save {formatCurrency(deal.savings)}
          </span>
          {deal.cpo ? (
            <span className="rounded-md bg-[rgba(52,119,186,0.10)] px-2 py-0.5 text-xs font-black text-[#2c5f8f]">CPO</span>
          ) : null}
        </div>
        <p className="mt-1 truncate text-sm font-bold text-[var(--text-body)]">{title || deal.vin}</p>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {[
            deal.mileage !== null ? `${deal.mileage.toLocaleString()} mi` : null,
            deal.location,
          ]
            .filter(Boolean)
            .join(" · ")}
          {higherMileage ? " · higher mileage than your listing" : ""}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
    </a>
  );
}

function MarketplaceFallback({ sourceText }: { sourceText: string }) {
  const links = generateMarketplaceLinks(sourceText).filter((link) => link.type === "marketplace");

  if (links.length === 0) return null;

  return (
    <div>
      <p className="text-sm leading-6 text-[var(--text-body)]">
        Search this exact vehicle across every major marketplace at once, then paste any listing back here to score it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-white/82 px-3.5 py-2 text-sm font-black text-[var(--graphite)] transition hover:-translate-y-0.5 hover:border-[rgba(124,169,130,0.55)] hover:shadow-sm"
          >
            {link.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function BetterDealsPanel({ make, model, year, price, mileage, sourceText }: BetterDealsPanelProps) {
  const [fetched, setFetched] = useState<{ key: string; result: BetterDealsResult } | null>(null);
  const canSearch = Boolean(make && model && price);
  const queryKey = `${make}|${model}|${year}|${price}`;

  useEffect(() => {
    if (!canSearch) return;

    let isMounted = true;

    fetch("/api/better-deals", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ make, model, year, price, zip: extractZipFromText(sourceText) }),
    })
      .then((res) => res.json() as Promise<{ result: BetterDealsResult }>)
      .then((data) => {
        if (isMounted) setFetched({ key: queryKey, result: data.result });
      })
      .catch(() => {
        if (isMounted) {
          setFetched({ key: queryKey, result: { status: "error", message: "Could not load listings." } });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [canSearch, queryKey, make, model, year, price, sourceText]);

  if (!canSearch) return null;

  const result = fetched?.key === queryKey ? fetched.result : null;
  const deals = result?.status === "ok" ? result.deals : [];
  const isLoading = result === null;

  return (
    <section className="animate-fade-in-up rounded-2xl border border-[rgba(124,169,130,0.40)] bg-[rgba(124,169,130,0.06)] p-5 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
        <h2 className="text-lg font-black text-[var(--graphite)]">
          {deals.length > 0 ? "You can do better" : "Find a better deal"}
        </h2>
      </div>

      {isLoading ? (
        <p className="mt-3 text-sm font-bold text-[var(--text-muted)]">Checking listings for a cheaper one...</p>
      ) : deals.length > 0 ? (
        <>
          <p className="mt-1 text-sm leading-6 text-[var(--text-body)]">
            {deals.length} cheaper {deals.length === 1 ? "listing" : "listings"} of the same vehicle
            {result?.status === "ok" && result.searchedNear ? ` near ${result.searchedNear}` : ""}.
            Ranked by how much you would save against this asking price.
          </p>
          <div className="mt-4 grid gap-2.5">
            {deals.map((deal) => (
              <DealRow key={deal.vin} deal={deal} scannedMileage={mileage} />
            ))}
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
            Prices come from dealer listings and change often. Mileage and condition vary, so compare before you drive out.
          </p>
        </>
      ) : (
        <div className="mt-3">
          <MarketplaceFallback sourceText={sourceText} />
        </div>
      )}
    </section>
  );
}

/** Mirrors the server-side rule: only trust a ZIP that follows a state abbreviation. */
function extractZipFromText(text: string): string | null {
  return text.match(/\b[A-Z]{2}[\s,]+(\d{5})(?:-\d{4})?\b/)?.[1] ?? null;
}
