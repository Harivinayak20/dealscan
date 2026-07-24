import type { Metadata } from "next";
import Link from "next/link";
import { DepreciationCalculator } from "@/components/DepreciationCalculator";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Car Depreciation Calculator: Value in 5 Years",
  description:
    "Free car depreciation calculator. See how much a vehicle loses each year with a transparent depreciation curve, a value-by-year table, and an estimated resale value — no signup.",
  alternates: { canonical: "/depreciation" },
  openGraph: {
    title: "Car Depreciation Calculator — Free Resale Value Estimate",
    description:
      "Estimate how much a car will be worth in future years with a clear year-by-year depreciation curve and resale value. Free, no signup.",
    url: `${appUrl}/depreciation`,
    type: "website",
  },
};

const faqs = [
  {
    q: "How much does a car depreciate per year?",
    a: "A typical car loses about 20% of its value in the first year, then roughly 15% per year through year five, and around 10% per year after that. By five years old most vehicles are worth 35–45% of what they cost new. Luxury cars and EVs often depreciate faster; trucks and some reliable models hold value better.",
  },
  {
    q: "How does this depreciation calculator work?",
    a: "Enter the purchase price, how old the car is now, and how many years you plan to own it. We apply a standard depreciation curve — about 20% in year one, 15% per year for years two to five, then 10% per year — with a 10% residual floor so the value never drops to zero. The result is a year-by-year value table, a bar chart, and an estimated resale value.",
  },
  {
    q: "Why do cars lose the most value in the first year?",
    a: "A new car stops being new the moment it is registered, and buyers pay a premium for that new status. As soon as it becomes a used car it competes with every other used example, so the price resets sharply — often 20% or more in the first twelve months. This is why buying a one- to three-year-old used car captures most of the value while avoiding the steepest drop.",
  },
  {
    q: "Which cars depreciate the least?",
    a: "Reliable, in-demand vehicles hold value best — many Toyota and Honda models, popular trucks, and body-on-frame SUVs. Fast depreciators tend to be luxury sedans, cars with expensive maintenance, and models replaced by a new generation. Our estimate uses an average curve, so adjust your expectations up or down based on the specific model.",
  },
  {
    q: "Is this depreciation estimate exact?",
    a: "No. Real depreciation depends on the make and model, mileage, condition, options, local demand, and the broader used-car market. This calculator uses a transparent average curve to give you a realistic ballpark for budgeting and comparing how long to keep a car. Pair it with a fair-value check before buying or selling.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DealScan Car Depreciation Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${appUrl}/depreciation`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free car depreciation calculator with a year-by-year value table and estimated resale value.",
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
    { name: "Car depreciation calculator" },
  ]),
];

export default function DepreciationPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Car Depreciation Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Every car loses value — the question is how fast. Enter a price and see the year-by-year drop, an estimated
            value today, and what the car should be worth when you sell. Transparent curve, no email, no signup.
          </p>

          <div className="mt-8">
            <DepreciationCalculator />
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">Understanding car depreciation</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              Depreciation is the difference between what you pay for a car and what it is worth when you sell it — and
              for most owners it is the single largest cost of ownership, bigger than fuel, insurance, or maintenance.
              Understanding the curve helps you decide what to buy, when to buy it, and how long to keep it.
            </p>
            <p>
              The pattern is remarkably consistent. A new car typically loses about <strong>20% of its value in the
              first year</strong> alone. From years two through five it sheds roughly <strong>15% per year</strong> of
              its remaining value, and after that the decline slows to around <strong>10% per year</strong>. By the time
              a car is five years old it is usually worth only 35 to 45 percent of its original price. This calculator
              uses exactly that curve, with a 10% residual floor so an old car never depreciates to nothing.
            </p>
            <p>
              The steepness of the first-year drop is why buying slightly used is such good value. Let someone else
              absorb that initial 20% hit, and you capture a nearly-new car for meaningfully less. It is also why leasing
              feels expensive: you are paying for the worst part of the depreciation curve and handing the car back
              before it flattens out.
            </p>
            <p>
              Depreciation is an average, not a guarantee. Reliable, in-demand models hold value far better than luxury
              cars with costly upkeep, and a fresh redesign can knock down the price of the outgoing generation
              overnight. Mileage, condition, color, and local demand all move the number. Treat the estimate here as a
              realistic baseline for budgeting and comparing scenarios, then adjust for the specific vehicle.
            </p>
            <p>
              Before you buy or sell, pair this with a fair-value check. Use our{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                used car price checker
              </Link>{" "}
              to estimate today&apos;s market value, run any listing through the free{" "}
              <Link href="/" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                deal analyzer
              </Link>{" "}
              for a 0–100 score, and calculate the real{" "}
              <Link href="/otd-calculator" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                out-the-door price
              </Link>{" "}
              including tax and fees.
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="text-2xl font-black tracking-tight">Car depreciation FAQ</h2>
          <dl className="mt-6 grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="text-lg font-bold text-[var(--graphite)]">{faq.q}</dt>
                <dd className="mt-2 text-[15px] leading-7 text-[var(--text-body)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
