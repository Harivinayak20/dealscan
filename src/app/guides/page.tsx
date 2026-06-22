import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Used Car Buyer Guides",
  description: "Practical used car buying guides for red flags, pricing, inspections, and private seller questions.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-6xl">
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
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <BookOpen className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Buyer guides
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used car buying advice that helps before you message the seller.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Start with red flags, pricing, inspections, and seller questions. Then use the analyzer on the exact listing.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-[var(--racing-green)]">{guide.readTime}</p>
                  <h2 className="mt-3 text-2xl font-black leading-tight">{guide.title}</h2>
                </div>
                <ArrowRight className="mt-1 h-6 w-6 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--racing-green)]" aria-hidden="true" />
              </div>
              <p className="mt-4 text-base leading-7 text-[var(--text-body)]">{guide.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
