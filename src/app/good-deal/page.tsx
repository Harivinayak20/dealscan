import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Gauge, ListChecks, TrendingDown } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Is This a Good Deal on a Used Car? Free Checker | DealScan",
  description:
    "Wondering if a used car listing is a good deal? Paste it into our free checker for a 0-100 score, fair price range, and red flags — no signup, in seconds.",
  alternates: { canonical: "/good-deal" },
  openGraph: {
    title: "Is This a Good Deal on a Used Car?",
    description:
      "Paste any used car listing and find out instantly whether the price is fair, with a 0-100 score and red flags. Free, no signup.",
    url: `${appUrl}/good-deal`,
    type: "website",
  },
};

const signals = [
  { title: "Price vs. market value", detail: "How the asking price compares to similar year, mileage, and trim." },
  { title: "Mileage for the age", detail: "Whether the odometer is low, average, or high for the model year." },
  { title: "Title and history risk", detail: "Salvage, rebuilt, or unclear title language in the listing." },
  { title: "Listing completeness", detail: "Missing VIN, photos, or maintenance history often hides a problem." },
];

const faqs = [
  {
    q: "How do I know if I'm getting a good deal on a used car?",
    a: "Compare the asking price to the going rate for that year, mileage, and trim, then check for red flags: unclear title status, vague mileage, no maintenance history, and pressure to decide fast. If the price is at or below market and the listing is transparent, it is likely a good deal. If the price is above market or the listing is thin on details, treat it with caution.",
  },
  {
    q: "What is a fair price for a used car?",
    a: "A fair price sits within the normal range for that year, make, model, mileage, and condition in your area, adjusted for options and any known issues. Prices below that range can signal a great deal or a hidden problem; prices above it usually mean you are overpaying unless the car has documented low mileage or exceptional condition.",
  },
  {
    q: "What are the biggest red flags in a used car listing?",
    a: "Unclear or 'clean' title claims without documentation, mileage that is not listed or seems rounded, urgency language like 'must sell today,' cash-only demands, no VIN or photos, and a price that is noticeably below market for no stated reason. Any one of these is worth a question; several together are worth walking away from.",
  },
  {
    q: "Can a tool actually tell me if a listing is a good deal?",
    a: "A tool can do the price comparison and pattern-matching far faster than a manual search — checking the asking price against market data and scanning the text for risk language. It cannot replace a test drive or a mechanic's inspection, but it is a reliable first filter before you spend time on a listing.",
  },
  {
    q: "Should I still get an inspection if the deal score is high?",
    a: "Yes. A high score means the price and listing look reasonable on paper, not that the car is mechanically sound. Always get a pre-purchase inspection or at minimum work through a thorough checklist before handing over money.",
  },
];

const jsonLd = [
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
    { name: "Is this a good deal?" },
  ]),
];

export default function GoodDealPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Is this a good deal?" }]} />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Is This a Good Deal on a Used Car?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Paste the listing you&apos;re looking at and get a straight answer: a 0–100 score, a fair price range,
            and any red flags in the ad — before you message the seller or drive out to see it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#analyzer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Find out now
            </Link>
            <span className="text-sm text-[var(--text-muted)]">Free, no signup, takes under a minute.</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {signals.map((s) => (
              <div key={s.title} className="flex gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
                <Gauge className="h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <div>
                  <div className="text-sm font-bold">{s.title}</div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">How to tell if a used car listing is actually a good deal</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              &quot;Is this a good deal?&quot; is the question every used car shopper asks and almost nobody can
              answer with confidence from the listing alone. The price is one number out of context, the photos are
              chosen to flatter the car, and the description is written by someone trying to sell it, not inform you.
              Answering the question properly means comparing the price to real market data and reading between the
              lines of what the seller did and did not say.
            </p>
            <p>
              Start with price. A used car is a good deal when the asking price sits at or below the going rate for
              that year, make, model, mileage, and condition — not some rule of thumb like &quot;10% off MSRP.&quot;
              Mileage matters too: a car with unusually low miles for its age can be a genuine find, but it can also
              mean it sat unused and developed its own problems, so ask why.
            </p>
            <p>
              Then read the listing for what is missing. No VIN, no photos of the odometer or title, vague phrases
              like &quot;runs good&quot; instead of a maintenance history, or urgency language pushing you to decide
              today are all signals worth weighing. None of them alone means walk away, but two or three together
              usually do.
            </p>
            <p>
              DealScan automates this comparison. Paste the listing — link, text, photo, or VIN — and it checks the
              price against market data for that exact year and mileage band, scans the text for the risk language
              above, and returns a 0–100 score with the reasoning spelled out, plus a fair offer range so you know
              what to counter with if the number is off.
            </p>
            <p>
              For a deeper look, run the same listing through our{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                price checker
              </Link>{" "}
              for a dedicated fair-value estimate, decode the history with the{" "}
              <Link href="/vin" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                VIN lookup
              </Link>
              , add taxes and fees with the{" "}
              <Link href="/otd-calculator" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                out-the-door calculator
              </Link>
              , and see how the price will hold up with the{" "}
              <Link href="/depreciation" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                depreciation calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <ListChecks className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
            Good deal FAQ
          </h2>
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
            <TrendingDown className="mx-auto h-7 w-7 text-[var(--racing-green)]" aria-hidden="true" />
            <h2 className="mt-2 text-xl font-black">Stop guessing. Get the answer.</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Paste the listing and see your deal score in under a minute.
            </p>
            <Link
              href="/#analyzer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Check this listing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
