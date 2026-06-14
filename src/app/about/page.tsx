import type { Metadata } from "next";
import { ArrowLeft, CarFront, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Dealscan",
  description: "Learn how Dealscan helps used car buyers review listings, spot red flags, and prepare better seller questions.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            Dealscan.dev
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
            Dealscan helps buyers slow down before a bad car deal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            The app turns a used-car listing into a practical review: score, warning signs, missing details, pricing context, and the questions to ask before visiting.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "What it is",
              text: "Dealscan is an informational buyer tool for public listings, screenshots, and seller notes. It is built for everyday shoppers who need a faster way to judge whether a listing deserves more time.",
            },
            {
              title: "What it is not",
              text: "Dealscan is not a mechanic, appraiser, lender, insurance agent, or vehicle-history provider. Every score is an estimate that should be checked against title records, inspection results, and your own budget.",
            },
            {
              title: "How it makes money",
              text: "The analyzer is free. Some buyer-tool links may be affiliate links, and advertising may appear when ads are configured. Partner relationships do not change the deal score.",
            },
            {
              title: "How to contact us",
              text: "For product questions, corrections, advertising questions, or partnership inquiries, contact hello@dealscan.dev or use the Contact page.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
              <h2 className="text-lg font-black">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{item.text}</p>
            </article>
          ))}
        </section>

        <div className="mt-8">
          <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
            Contact Dealscan
          </Link>
        </div>
      </div>
    </main>
  );
}
