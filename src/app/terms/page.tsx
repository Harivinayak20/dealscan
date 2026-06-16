import type { Metadata } from "next";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DealScan Terms",
  description: "Terms, affiliate disclosure, advertising disclosure, and buyer responsibility notes for DealScan.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">
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
            <FileText className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Terms
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Terms and disclosures.
          </h1>
        </section>

        <section className="space-y-5 text-sm leading-7 text-[var(--text-body)]">
          {[
            {
              title: "Informational use only",
              text: "DealScan provides estimates and buyer guidance based on listing information. It does not provide professional mechanical, legal, insurance, tax, lending, or appraisal advice.",
            },
            {
              title: "Buyer responsibility",
              text: "Before buying a vehicle, verify title status, VIN, mileage, ownership, accident history, liens, recalls, emissions readiness, and mechanical condition independently.",
            },
            {
              title: "Affiliate disclosure",
              text: "Some links to buyer tools may be affiliate links. DealScan may earn a commission if you buy through those links at no extra cost to you. Affiliate relationships do not influence deal scoring.",
            },
            {
              title: "Advertising disclosure",
              text: "DealScan may display advertising when ad services are configured. Ads are labeled and should not be treated as product recommendations or endorsements.",
            },
            {
              title: "No guarantee",
              text: "Scores, price ranges, and recommendations can be wrong when listing data is incomplete, outdated, inaccurate, or intentionally misleading.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
              <h2 className="text-lg font-black text-[var(--graphite)]">{item.title}</h2>
              <p className="mt-2">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
