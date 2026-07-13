import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { bestLists } from "@/lib/best-lists";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Best Used Cars by Budget & Type (2026) | DealScan",
  description:
    "The best used cars by budget and type — under $10k to $30k, SUVs, trucks, and the most reliable picks, each with the year-specific checks that matter.",
  alternates: {
    canonical: "/best",
  },
  openGraph: {
    title: "Best Used Cars by Budget & Type | DealScan",
    description: "The best used cars by budget and type, with the buyer checks that matter.",
    url: `${appUrl}/best`,
    type: "website",
  },
};

export default function BestListsHub() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Best used cars" },
          ]}
        />

        <section className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Best used cars</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Best used cars by budget and type
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">
            Curated shortlists of the most dependable used cars at each budget — from under $10,000 to $30,000 — plus the best used SUVs, trucks, and the most reliable picks overall. Every entry links to a full buyer check with the year-and-engine issues to verify before you pay.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bestLists.map((list) => (
              <Link
                key={list.slug}
                href={`/best/${list.slug}`}
                className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
              >
                <p className="text-xs font-black uppercase text-[var(--racing-green)]">{list.entries.length} picks</p>
                <h2 className="mt-2 flex-1 text-lg font-black leading-snug">{list.title}</h2>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                  See the list
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
