import type { Metadata } from "next";
import { ArrowLeft, CarFront, Gauge } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How the Dealscan Score Works",
  description:
    "A transparent breakdown of the eight factors behind every Dealscan deal score, what moves the score up or down, and what the score cannot know.",
};

const factors = [
  {
    title: "Asking price",
    text: "The listed price is weighed against the vehicle's age, mileage, and condition language to judge whether it sits inside a reasonable range.",
  },
  {
    title: "Mileage for age",
    text: "Around 12,000 miles per year is typical. Far above that lowers the score; unusually low mileage with no explanation raises a question instead of a bonus.",
  },
  {
    title: "Title and ownership",
    text: "Clean title with the seller's name on it is the baseline. Salvage, rebuilt, lien, missing, or “title in hand soon” language is one of the heaviest penalties.",
  },
  {
    title: "Mechanical risk language",
    text: "Phrases like “needs work,” “runs rough,” “check engine light,” or “as-is” are scored against the asking price — a cheap car that admits problems can still score poorly.",
  },
  {
    title: "Seller transparency",
    text: "Listings that volunteer the VIN, service records, accident history, and clear photos score higher than vague ads that ask you to “text for details.”",
  },
  {
    title: "Missing information",
    text: "Every key fact the ad leaves out — price, mileage, title status, location — lowers confidence and shows up in your missing-info checklist.",
  },
  {
    title: "Positive proof points",
    text: "One owner, maintenance receipts, recent tires or brakes, a clean history report offered up front — 12 green-flag patterns add points back.",
  },
  {
    title: "Negotiation opportunity",
    text: "Time on market, price-drop language, and condition admissions feed the suggested offer range and the negotiation tip you get with each scan.",
  },
];

export default function HowScoringWorksPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            Dealscan.dev
          </Link>
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-bold shadow-sm transition hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,106,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-bold text-[var(--graphite)] shadow-sm">
            <Gauge className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Methodology
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            How the deal score works.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Every scan produces a 0&ndash;100 score and a verdict: Great Deal, Decent Deal, Proceed with Caution, or Avoid.
            The score comes from eight factors read out of the listing itself &mdash; checked against 17 red-flag patterns
            and 12 green-flag patterns. Here is exactly what moves it.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {factors.map((factor, index) => (
            <article key={factor.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--racing-green)]">Factor {index + 1}</div>
              <h2 className="mt-2 text-lg font-black">{factor.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{factor.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--accent-2-line)] bg-[rgba(18,61,51,0.05)] p-6">
          <h2 className="text-lg font-black">What the score cannot know</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
            The score reads the listing &mdash; it cannot see the car. It does not replace a vehicle history report, a
            pre-purchase inspection by a mechanic, or a title check with your DMV. Price ranges are estimates based on
            listing details and basic market heuristics, not licensed market valuations. A high score means the listing
            looks honest and fairly priced on paper; it is the start of your homework, not the end of it.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--racing-green)] px-5 text-sm font-bold text-white transition hover:bg-[var(--graphite)]"
          >
            Scan a listing
          </Link>
        </section>
      </div>
    </main>
  );
}
