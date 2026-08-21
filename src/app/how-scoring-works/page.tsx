import type { Metadata } from "next";
import { Gauge, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "How the DealScan Score Works",
  description:
    "A transparent breakdown of the eight factors behind every DealScan deal score, what moves the score up or down, the actual verdict thresholds, and what the score cannot know.",
  alternates: { canonical: "/how-scoring-works" },
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
    text: `Clean title with the seller's name on it is the baseline. Salvage, rebuilt, lien, missing, or "title in hand soon" language is one of the heaviest penalties.`,
  },
  {
    title: "Mechanical risk language",
    text: `Phrases like "needs work," "runs rough," "check engine light," or "as-is" are scored against the asking price — a cheap car that admits problems can still score poorly.`,
  },
  {
    title: "Seller transparency",
    text: `Listings that volunteer the VIN, service records, accident history, and clear photos score higher than vague ads that ask you to "text for details."`,
  },
  {
    title: "Missing information",
    text: "Every key fact the ad leaves out — price, mileage, title status, location — lowers confidence and shows up in your missing-info checklist.",
  },
  {
    title: "Positive proof points",
    text: "One owner, maintenance receipts, recent tires or brakes, and a clean history report offered up front can add points back, with a cap that limits keyword stuffing.",
  },
  {
    title: "Negotiation opportunity",
    text: "Time on market, price-drop language, and condition admissions feed the suggested offer range and the negotiation tip you get with each scan.",
  },
];

const verdictThresholds = [
  { label: "Great Deal", threshold: "≥ 85", color: "#3f8a5b", note: "Strong buyer-friendly signals; still verify title, VIN, records, and condition." },
  { label: "Decent Deal", threshold: "70–84", color: "#b98a38", note: "Workable listing; score depends on seller proof and an inspection." },
  { label: "Proceed with Caution", threshold: "55–69", color: "#b4501f", note: "Enough uncertainty to justify asking for proof and offering below asking." },
  { label: "Red Flags Present", threshold: "40–54", color: "#c0492f", note: "Red flags detected. Do not move forward without title proof, VIN history, and a mechanic inspection." },
  { label: "Avoid", threshold: "< 40", color: "var(--danger)", note: "Major risks. Avoid unless a trusted inspection and title check resolve them." },
];

export default function HowScoringWorksPage() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How DealScan scores a used car listing",
    description:
      "Every scan produces a 0–100 score from eight factors read out of the listing itself.",
    step: factors.map((factor, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: factor.title,
      text: factor.text,
    })),
  };

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-4xl">

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "How the score works" },
          ]}
        />

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-bold text-[var(--graphite)] shadow-sm">
            <Gauge className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Methodology
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            How the deal score works.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Every scan produces a 0&ndash;100 score and a verdict: Great Deal, Decent Deal, Proceed with Caution, Red Flags Present, or Avoid.
            The score comes from eight factors read from the listing itself. Here is what moves it and what the result cannot verify.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-[var(--racing-green)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black">How the analysis works</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                DealScan first creates a structured local baseline from the listing text. When configured, Groq applies the
                scoring rubric with broader language understanding. If Groq is unavailable, DealScan can use configured
                Gemini access and then the local heuristic so the user still receives a clearly labeled result. The result
                screen identifies when local analysis was used.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[rgba(169,130,83,0.08)] p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--warning)]" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-black">Rubric limitations</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-body)]">
                <li><strong>Keyword-based heuristics:</strong> The local analyzer (and the AI when it follows the same rubric) matches phrases — it does not see the car, verify documents, or run a history report.</li>
                <li><strong>Absent information is not a defect:</strong> A short listing lowers <em>confidence</em>, not the score. Missing details appear in the checklist so you can ask the seller.</li>
                <li><strong>Green-flag cap:</strong> Positive keywords are capped at +20 points so a keyword-stuffed ad cannot reach a perfect score.</li>
                <li><strong>Heuristic ceiling:</strong> The local analyzer never exceeds 92 so AI-enhanced scoring always has room to add nuance.</li>
                <li><strong>Price estimates are rough:</strong> Fair-value ranges use basic depreciation curves, not licensed market data. Treat them as conversation starters, not appraisals.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-black">Verdict thresholds</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
            The score maps to one of five verdicts using these exact cutoffs:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {verdictThresholds.map((v) => (
              <article
                key={v.label}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] p-4 shadow-sm"
                style={{ borderLeft: `4px solid ${v.color}` }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black" style={{ color: v.color }}>{v.label}</span>
                  <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-[var(--border-subtle)] text-[var(--graphite)]">{v.threshold}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[var(--text-body)]">{v.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {factors.map((factor, index) => (
            <article key={factor.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--racing-green)]">Factor {index + 1}</div>
              <h2 className="mt-2 text-lg font-black">{factor.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">{factor.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-[var(--accent-2-line)] bg-[rgba(183,96,58,0.05)] p-6">
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
