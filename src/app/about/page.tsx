import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DealScan — Built for the Buyer, Not the Dealer",
  description:
    "DealScan is an independent used-car buyer tool. We don't sell your info as leads, dealers can't pay to change a score, and the analyzer is free with no signup.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-4xl">
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
            <ShieldCheck className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            About
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Built to help you buy a car — not to help someone sell you one.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Almost every car site you&apos;ve used is paid by the selling side: dealers buy the ads, dealers buy the
            placement, and your phone number gets sold as a &quot;lead.&quot; DealScan sits on your side of the table. Paste a
            listing and get an honest read — a 0-100 score, the red flags, what&apos;s missing, and how to negotiate — before
            you ever hand over your contact info to anyone.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.08)] p-6">
          <h2 className="text-xl font-black tracking-tight">The buyer-side promise</h2>
          <ul className="mt-4 grid gap-3">
            {[
              "We never sell your information as a lead. No dealer gets your name, email, or number from us — we don't even ask for them to run a scan.",
              "No one can pay to change a score. There are no sponsored verdicts, no boosted listings, no pay-to-look-good.",
              "Free means free. The analyzer, the price checker, and the VIN lookup work without an account, an email, or a card.",
              "We show our work. Estimates come with the reasoning attached, and everything we ship is dated in the open on the changelog.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-base leading-7 text-[var(--text-body)]">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "What it is",
              text: "An independent, informational buyer tool for public listings, screenshots, and seller notes. It works with listings from anywhere — dealer sites, marketplaces, classifieds — because you should get a second opinion on any car before contacting the seller.",
            },
            {
              title: "What it is not",
              text: "DealScan is not a mechanic, appraiser, lender, insurance agent, or vehicle-history provider. Every score is an estimate that should be checked against title records, inspection results, and your own budget.",
            },
            {
              title: "How it makes money",
              text: "The analyzer is free. Some buyer-tool links may be affiliate links, and advertising may appear when ads are configured. Partner relationships never change a deal score — see the buyer-side promise above.",
            },
            {
              title: "How to contact us",
              text: "For product questions, corrections, advertising questions, or partnership inquiries, contact hello@dealscan.dev or use the Contact page. Feature requests genuinely shape the roadmap.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
              <h2 className="text-lg font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{item.text}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
            Contact DealScan
          </Link>
          <Link href="/changelog" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 text-sm font-black transition hover:-translate-y-1 hover:border-[var(--champagne)]">
            See what we&apos;ve shipped
          </Link>
        </div>
      </div>
    </main>
  );
}
