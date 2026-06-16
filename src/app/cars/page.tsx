import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { carModels } from "@/lib/car-models";

export const metadata: Metadata = {
  title: "Used Car Buyer Checks by Model — DealScan",
  description:
    "Model-by-model used car buying checks: known issues, years to avoid, what to verify, and fair mileage expectations before you message the seller.",
  alternates: { canonical: "/cars" },
};

export default function CarsIndexPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <img src="/dealscan-logo.png" alt="DealScan" width="44" height="44" className="h-11 w-11 rounded-full" />
            DealScan.dev
          </Link>
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-12">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Buyer checks by model</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Know the model before you message the seller.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">
            Every model has its own failure points, years to avoid, and questions worth asking. Pick the car you are looking at, see what to verify, then paste the listing into the analyzer.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {carModels.map((m) => (
              <Link
                key={m.slug}
                href={`/cars/${m.slug}`}
                className="card-hover group flex flex-col justify-between !p-5"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">{m.years}</p>
                  <h2 className="mt-2 text-xl font-black leading-snug">Used {m.make} {m.model}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-muted)]">{m.knownIssues[0]}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                  Buyer check
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
