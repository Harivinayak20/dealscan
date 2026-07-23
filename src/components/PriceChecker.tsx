"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, SearchCheck, TriangleAlert } from "lucide-react";
import { avoidFlag, estimatePrice, priceCheckerModels, type Condition } from "@/lib/pricing";

const MODELS = priceCheckerModels();
const CURRENT_YEAR = new Date().getFullYear();

function money(n: number) {
  return `$${n.toLocaleString()}`;
}

function getInitialSlug(): string {
  if (typeof window === "undefined") return MODELS[0]?.slug ?? "";
  const p = new URLSearchParams(window.location.search);
  const car = p.get("car");
  if (car && MODELS.some((m) => m.slug === car)) return car;
  return MODELS[0]?.slug ?? "";
}

function getInitialYear(): string {
  if (typeof window === "undefined") return "2018";
  const p = new URLSearchParams(window.location.search);
  const y = p.get("year");
  return y ?? "2018";
}

function getInitialMiles(): string {
  if (typeof window === "undefined") return "60000";
  const p = new URLSearchParams(window.location.search);
  const mi = p.get("miles");
  return mi ?? "60000";
}

function getInitialCondition(): Condition {
  if (typeof window === "undefined") return "good";
  const p = new URLSearchParams(window.location.search);
  const c = p.get("condition");
  if (c === "excellent" || c === "good" || c === "fair" || c === "rough") return c;
  return "good";
}

function getInitialTitle(): "clean" | "branded" {
  if (typeof window === "undefined") return "clean";
  const p = new URLSearchParams(window.location.search);
  const t = p.get("title");
  if (t === "branded" || t === "clean") return t;
  return "clean";
}

function getInitialAsking(): string {
  if (typeof window === "undefined") return "";
  const p = new URLSearchParams(window.location.search);
  return p.get("asking") ?? "";
}

export function PriceChecker({ embed = false }: { embed?: boolean }) {
  const linkProps = embed ? { target: "_blank" as const, rel: "noopener" } : {};
  const [slug, setSlug] = useState(getInitialSlug);
  const [year, setYear] = useState(getInitialYear);
  const [miles, setMiles] = useState(getInitialMiles);
  const [condition, setCondition] = useState<Condition>(getInitialCondition);
  const [title, setTitle] = useState<"clean" | "branded">(getInitialTitle);
  const [asking, setAsking] = useState(getInitialAsking);

  // Keep the URL in sync so any result can be copied and shared.
  useEffect(() => {
    const p = new URLSearchParams({ car: slug, year, miles, condition, title });
    if (asking) p.set("asking", asking);
    window.history.replaceState(null, "", `?${p.toString()}`);
  }, [slug, year, miles, condition, title, asking]);

  const modelYear = Number(year) || 0;
  const milesNum = Number(miles) || 0;
  const askingNum = Number(asking) || 0;

  const estimate = useMemo(
    () => estimatePrice(slug, modelYear, milesNum, condition, title, CURRENT_YEAR),
    [slug, modelYear, milesNum, condition, title]
  );
  const avoid = useMemo(() => avoidFlag(slug, modelYear), [slug, modelYear]);
  const selected = MODELS.find((m) => m.slug === slug);

  const verdict = useMemo(() => {
    if (!estimate || !askingNum) return null;
    if (askingNum < estimate.privateLow)
      return { tone: "good", text: `${money(askingNum)} is below our estimated fair range — a strong price on paper. Confirm why it is cheap before you celebrate.` };
    if (askingNum <= estimate.privateHigh)
      return { tone: "fair", text: `${money(askingNum)} sits inside our estimated fair private-party range.` };
    return { tone: "high", text: `${money(askingNum)} is above our estimated fair range. Use the gap as negotiating room.` };
  }, [estimate, askingNum]);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      {/* Inputs */}
      <div className="rounded-2xl border-2 border-[rgba(183,96,58,0.30)] bg-[var(--accent-2-soft)] p-5 shadow-[0_18px_44px_-26px_rgba(183,96,58,0.45)] sm:p-6">
        <div className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">Car</span>
            <select value={slug} onChange={(e) => setSlug(e.target.value)} className="input">
              {MODELS.map((m) => (
                <option key={m.slug} value={m.slug}>{m.label}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">Year</span>
              <input type="number" inputMode="numeric" value={year} min={1995} max={CURRENT_YEAR}
                onChange={(e) => setYear(e.target.value)} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">Mileage</span>
              <input type="number" inputMode="numeric" value={miles} min={0}
                onChange={(e) => setMiles(e.target.value)} placeholder="60000" className="input" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">Condition</span>
              <select value={condition} onChange={(e) => setCondition(e.target.value as Condition)} className="input">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="rough">Rough</option>
              </select>
            </label>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold text-[var(--graphite)]">Title</span>
              <select value={title} onChange={(e) => setTitle(e.target.value as "clean" | "branded")} className="input">
                <option value="clean">Clean</option>
                <option value="branded">Salvage / rebuilt</option>
              </select>
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-sm font-bold text-[var(--graphite)]">Asking price <span className="font-medium text-[var(--text-muted)]">(optional)</span></span>
            <input type="number" inputMode="numeric" value={asking} min={0}
              onChange={(e) => setAsking(e.target.value)} placeholder="What is the seller asking?" className="input" />
          </label>
        </div>
      </div>

      {/* Result */}
      <div className="grid gap-4">
        {estimate ? (
          <>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">Estimated fair value</p>
              <p className="mt-1 text-4xl font-black tracking-tight">{money(estimate.fair)}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-3">
                  <p className="font-semibold text-[var(--text-muted)]">Private party</p>
                  <p className="mt-0.5 text-base font-black">{money(estimate.privateLow)}–{money(estimate.privateHigh)}</p>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--canvas)] p-3">
                  <p className="font-semibold text-[var(--text-muted)]">Dealer retail</p>
                  <p className="mt-0.5 text-base font-black">{money(estimate.dealerRetail)}</p>
                </div>
              </div>

              {verdict ? (
                <div className={`mt-4 rounded-xl border p-3 text-sm font-semibold ${
                  verdict.tone === "good"
                    ? "border-[var(--accent-2-line)] bg-[var(--accent-2-soft)] text-[var(--racing-green)]"
                    : verdict.tone === "high"
                    ? "border-[rgba(196,90,74,0.30)] bg-[rgba(196,90,74,0.08)] text-[var(--danger)]"
                    : "border-[var(--line)] bg-[var(--canvas)] text-[var(--text-body)]"
                }`}>
                  {verdict.text}
                </div>
              ) : null}
            </div>

            {avoid ? (
              <div className="rounded-2xl border border-[rgba(196,90,74,0.30)] bg-[var(--paper)] p-5 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-black text-[var(--danger)]">
                  <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                  {modelYear} is a flagged year ({avoid.years})
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{avoid.reason}</p>
                {selected ? (
                  <Link href={`/cars/${slug}/years-to-avoid`} {...linkProps} className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    {selected.make} {selected.model} years to avoid
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            ) : null}

            <details className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 text-sm shadow-sm">
              <summary className="cursor-pointer font-black">How we calculated this</summary>
              <ul className="mt-3 grid gap-1.5 text-[var(--text-body)]">
                <li>Age: {estimate.age} {estimate.age === 1 ? "year" : "years"} from a typical new price for this model.</li>
                <li>Mileage vs expected ({estimate.expectedMiles.toLocaleString()} mi): {estimate.mileageAdjPct >= 0 ? "+" : ""}{Math.round(estimate.mileageAdjPct * 100)}%</li>
                <li>Condition: {estimate.conditionAdjPct >= 0 ? "+" : ""}{Math.round(estimate.conditionAdjPct * 100)}%</li>
                <li>Title: {estimate.titleAdjPct === 0 ? "no adjustment (clean)" : `${Math.round(estimate.titleAdjPct * 100)}% (branded)`}</li>
              </ul>
              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                This is a transparent estimate and a negotiation starting point, not a transaction-data valuation. Always pair it with a history report and an inspection.
              </p>
            </details>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/#analyzer" {...linkProps} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                Check this exact listing
              </Link>
              {selected ? (
                <Link href={`/cars/${slug}`} {...linkProps} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 text-sm font-black transition hover:-translate-y-1 hover:border-[var(--champagne)]">
                  Known issues
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 text-sm text-[var(--text-muted)]">
            Pick a car and enter a year to see an estimated fair value.
          </div>
        )}
      </div>
    </div>
  );
}
