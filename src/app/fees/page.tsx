import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ReceiptText, SearchCheck } from "lucide-react";
import Link from "next/link";
import { dealerFees } from "@/lib/dealer-fees";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Dealer Fees Explained: Doc Fees, Add-Ons & Junk Fees | Dealscan",
  description:
    "A plain-English glossary of dealer fees and add-ons, from documentation fees to nitrogen tires and VIN etching. Learn which are mandatory, which are negotiable, and what they should cost.",
  alternates: {
    canonical: "/fees",
  },
  openGraph: {
    title: "Dealer Fees Explained: Doc Fees, Add-Ons & Junk Fees | Dealscan",
    description:
      "A plain-English glossary of dealer fees and add-ons. Learn which are mandatory, which are negotiable, and what they should cost.",
    url: `${appUrl}/fees`,
    type: "website",
  },
};

export default function FeesPage() {
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
            <ReceiptText className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Dealer fee glossary
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Dealer fees and add-ons, decoded before you sign.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Sitting at the dealership staring at a line you do not recognize? Look it up here. Each fee explains what it
            is, what it should cost, whether it is mandatory, and whether you can negotiate it away.
          </p>
          <Link
            href="/#analyzer"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
          >
            <SearchCheck className="h-4 w-4" aria-hidden="true" />
            Check a quote for junk fees
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {dealerFees.map((fee) => (
            <Link
              key={fee.slug}
              href={`/fees/${fee.slug}`}
              className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-[var(--racing-green)]">{fee.typicalRange}</p>
                  <h2 className="mt-3 text-2xl font-black leading-tight">{fee.name}</h2>
                </div>
                <ArrowRight className="mt-1 h-6 w-6 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--racing-green)]" aria-hidden="true" />
              </div>
              <p className="mt-4 text-base leading-7 text-[var(--text-body)]">{fee.shortAnswer}</p>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
          <h2 className="text-2xl font-black leading-tight">Dealer fees in your state</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-body)]">
            Doc fee caps, sales tax, and title costs vary enormously by state — the same paperwork can cost $85 in California and $900 in Virginia. Look up the rules where you are buying.
          </p>
          <Link
            href="/fees/states"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
          >
            Browse all 50 states
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
