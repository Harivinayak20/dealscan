import type { Metadata } from "next";
import { ArrowLeft, CarFront } from "lucide-react";
import Link from "next/link";
import { PriceChecker } from "@/components/PriceChecker";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Used Car Value & Fair Price Checker — Free, No Signup | Dealscan",
  description:
    "Free used car value estimator. Enter year, make, model, mileage, and condition to get a fair price range and a verdict on the asking price — no email, no signup.",
  alternates: { canonical: "/price-checker" },
  openGraph: {
    title: "Used Car Value & Fair Price Checker — Free, No Signup",
    description:
      "Get a fair price range for any used car in seconds. Transparent estimate, risk-flagged years, no signup.",
    url: `${appUrl}/price-checker`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Dealscan Used Car Price Checker",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: `${appUrl}/price-checker`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free used car fair price estimator with a transparent depreciation model and risk-flagged model years.",
};

export default function PriceCheckerPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            Dealscan.dev
          </Link>
          <Link
            href="/cars"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Car checks
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free used car value</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            What is this used car actually worth?
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Enter the car and we estimate a fair price range — private party and dealer — then tell you whether the asking price is high, fair, or a steal. No email, no signup, and we show exactly how the number is calculated.
          </p>

          <div className="mt-8">
            <PriceChecker />
          </div>

          <p className="mt-8 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
            How it works: we anchor to a typical new price for the model and apply a depreciation curve for its segment, then adjust for mileage versus the expected average, condition, and title status. It is a transparent estimate and negotiation starting point, not a transaction-data valuation. Always pair it with a vehicle history report and an independent inspection.
          </p>
        </section>
      </div>
    </main>
  );
}
