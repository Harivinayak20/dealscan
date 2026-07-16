import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Gauge, SearchCheck, ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Used Car Deal Checker — Free Car Deal Rating | DealScan",
  description:
    "Free used car deal checker. Paste any listing and get a 0-100 deal rating, red-flag detection, and a fair offer range in seconds — no signup required.",
  alternates: { canonical: "/deal-checker" },
  openGraph: {
    title: "Used Car Deal Checker — Free Car Deal Rating",
    description:
      "Paste a used car listing and get an instant 0-100 deal score, red flags, and a fair offer range. Free, no signup.",
    url: `${appUrl}/deal-checker`,
    type: "website",
  },
};

const faqs = [
  {
    q: "How does the used car deal checker work?",
    a: "Paste a listing link, the ad text, a photo, or a VIN into the analyzer. DealScan reads the price, mileage, year, title status, and seller language, compares the price against market value for that year and mileage, and flags risky wording. The result is a 0-100 deal score with the reasons behind it.",
  },
  {
    q: "What does the deal rating actually measure?",
    a: "The rating blends price fairness against market data, mileage relative to age, title and history risk, and how much information the listing is missing. A high score means the price looks fair and the listing raises no red flags. A low score means either the price is too high, the listing is hiding something, or both.",
  },
  {
    q: "Is the deal checker free to use?",
    a: "Yes. Checking a listing takes seconds and does not require an account, email, or payment. There is no limit on how many listings you can check.",
  },
  {
    q: "Can it check a listing from any site?",
    a: "Yes. It works with listings from Craigslist, Facebook Marketplace, Cars.com, AutoTrader, CarGurus, dealer sites, or a private seller's text message — paste the link or the text and the analyzer handles the rest.",
  },
  {
    q: "Does a low deal score mean I should not buy the car?",
    a: "Not necessarily. A low score means the listing has risk factors worth investigating further, such as an above-market price or vague title language. Use the score as a starting point for questions to the seller and a pre-purchase inspection, not as a final verdict.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DealScan Used Car Deal Checker",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${appUrl}/deal-checker`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free used car deal checker that rates any listing 0-100 based on price fairness, mileage, and red flags.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  },
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Deal checker" },
  ]),
];

export default function DealCheckerPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Deal checker" }]} />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used Car Deal Checker
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Paste any used car listing and get a 0–100 deal rating in seconds — price fairness, mileage, title risk,
            and red flags, all in one report. Built to catch what a quick skim of the ad misses.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#analyzer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Check a listing now
            </Link>
            <span className="text-sm text-[var(--text-muted)]">No signup. No email. Just paste and check.</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
              <Gauge className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
              <div className="mt-2 text-sm font-bold">0–100 deal score</div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Instant rating you can compare across listings</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
              <ShieldAlert className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
              <div className="mt-2 text-sm font-bold">Red flag detection</div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Title issues, vague mileage, risky seller language</p>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
              <SearchCheck className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
              <div className="mt-2 text-sm font-bold">Fair offer range</div>
              <p className="mt-1 text-xs text-[var(--text-muted)]">A number to open negotiation with</p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">What a deal checker looks at that you might miss</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              Most listings are written to generate interest, not to help you evaluate risk. The price looks
              reasonable at a glance, the mileage sounds fine, and the seller says the car runs great — but none of
              that tells you whether the price is actually fair for the year, mileage, and condition, or whether the
              listing is quietly avoiding a question you would ask if you thought to ask it.
            </p>
            <p>
              A proper <strong>car deal rating</strong> checks the asking price against real market data for that
              model year and mileage band, not a rule of thumb. It reads the listing text for language that
              correlates with hidden problems — vague title status, &quot;runs good&quot; instead of a maintenance
              history, cash-only urgency, or missing VIN and photos. It weighs how much information is present versus
              missing, because a thin listing is itself a signal.
            </p>
            <p>
              DealScan combines all of that into a single 0–100 score with a plain-language breakdown of why the
              score landed where it did, plus a fair offer range so you know what to counter with. Paste a link, the
              ad text, a screenshot, or a VIN — whichever you have on hand — and the analyzer works from any of them.
            </p>
            <p>
              A deal checker is not a replacement for a pre-purchase inspection or a vehicle history report, but it is
              the fastest way to decide whether a listing is worth the drive. Run every listing you are considering
              through it before you contact the seller, so you walk into the conversation already knowing where the
              leverage is.
            </p>
            <p>
              Once you have a score, dig deeper with our{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                price checker
              </Link>{" "}
              for a standalone fair-value estimate, run the{" "}
              <Link href="/vin" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                VIN lookup
              </Link>{" "}
              to decode the vehicle&apos;s history, add fees with the{" "}
              <Link href="/otd-calculator" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                out-the-door calculator
              </Link>
              , and check long-term value with the{" "}
              <Link href="/depreciation" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                depreciation calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="text-2xl font-black tracking-tight">Deal checker FAQ</h2>
          <dl className="mt-6 grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="flex items-center gap-2 text-lg font-bold text-[var(--graphite)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  {faq.q}
                </dt>
                <dd className="mt-2 text-[15px] leading-7 text-[var(--text-body)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <div className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 text-center shadow-sm">
            <h2 className="text-xl font-black">Ready to check a listing?</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Paste it in and get your deal score in under a minute.
            </p>
            <Link
              href="/#analyzer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Open the deal checker
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
