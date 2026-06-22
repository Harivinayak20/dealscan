import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { comparisons } from "@/lib/comparisons";
import { getCarModel } from "@/lib/car-models";

export const metadata: Metadata = {
  title: "Used Car Comparisons: Head-to-Head Buyer Guides — DealScan",
  description:
    "Side-by-side used car comparisons on reliability, known issues, mileage, and what to verify. Decide between two models before you buy.",
  alternates: { canonical: "/compare" },
};

export default function CompareIndexPage() {
  const groups = comparisons.reduce<Record<string, typeof comparisons>>((acc, c) => {
    (acc[c.segment] ??= []).push(c);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-4 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2 text-xl font-black tracking-tight transition hover:-translate-y-0.5 sm:gap-3 sm:text-2xl">
            <img src="/dealscan-logo.png" alt="DealScan" width="44" height="44" className="h-9 w-9 shrink-0 rounded-full sm:h-11 sm:w-11" />
            <span className="truncate">DealScan.dev</span>
          </Link>
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-sm font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl sm:text-base"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-10 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Head-to-head</p>
          <h1 className="mt-2 max-w-3xl text-2xl font-black leading-[1.15] tracking-tight sm:text-3xl sm:leading-tight lg:text-4xl">
            Used car comparisons, decided on the details.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--text-body)] sm:text-lg sm:leading-8">
            Torn between two used models? Each comparison lays out reliability, known issues, mileage outlook, and exactly what to verify on both, then sends you to the analyzer with a real listing.
          </p>

          <div className="mt-10 space-y-10">
            {Object.entries(groups).map(([segment, items]) => (
              <div key={segment}>
                <h2 className="text-sm font-black uppercase tracking-wide text-[var(--text-muted)]">{segment}</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {items.map((c) => {
                    const a = getCarModel(c.aSlug);
                    const b = getCarModel(c.bSlug);
                    if (!a || !b) return null;
                    return (
                      <Link key={c.slug} href={`/compare/${c.slug}`} className="card-hover group flex items-center justify-between !p-5">
                        <span className="text-lg font-black leading-snug">
                          {a.make} {a.model} <span className="text-[var(--text-muted)]">vs</span> {b.make} {b.model}
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 text-[var(--racing-green)] transition group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
