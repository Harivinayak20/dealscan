import type { Metadata } from "next";
import { ArrowLeft, CarFront, CheckCircle2, Sparkles, Building2, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealscan Pricing",
  description: "Dealscan pricing for free used car listing analysis and future buyer tools.",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Check individual car listings with full deal analysis.",
    icon: Zap,
    highlighted: true,
    features: [
      "Deal score and verdict",
      "Fair-value range estimate",
      "Red flag and green flag detection",
      "Seller questions and negotiation tips",
      "Compare two listings side by side",
      "Save scan history locally",
      "Marketplace search links",
    ],
    cta: "Start checking deals",
    href: "/",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious buyers checking multiple listings every week.",
    icon: Sparkles,
    highlighted: false,
    features: [
      "Everything in Free",
      "Unlimited analyses per month",
      "VIN history report integration",
      "Price trend tracking on watchlist",
      "Export scan history as CSV",
      "Priority analysis speed",
      "Higher fair-use limits",
    ],
    cta: "Get notified when Pro launches",
    href: "mailto:hello@dealscan.dev?subject=Notify%20me%20when%20Dealscan%20Pro%20launches",
  },
  {
    name: "Partner",
    price: "Custom",
    period: "",
    description: "For dealerships, buying services, and fleet managers.",
    icon: Building2,
    highlighted: false,
    features: [
      "Everything in Pro",
      "API access for bulk analysis",
      "Custom branding and white label",
      "Dealer inventory scanning",
      "Batch VIN checks",
      "Dedicated support",
      "Volume pricing",
    ],
    cta: "Contact us",
    href: "mailto:hello@dealscan.dev?subject=Dealscan%20Partner%20inquiry",
  },
];

export default function PricingPage() {
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
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[rgba(11,13,16,0.12)] bg-white px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-12 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Simple pricing for smarter car buying.
          </h1>
          <p className="mt-4 text-lg leading-8 text-neutral-700">
            Start free. Upgrade when you need more.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-[var(--accent-2)] bg-white shadow-xl"
                    : "border-neutral-200 bg-white/80 shadow-sm"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent-2)] px-3 py-1 text-[10px] font-black uppercase text-white">
                    Most popular
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(18,61,51,0.08)] text-[var(--racing-green)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-black">{tier.name}</h2>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-black">{tier.price}</span>
                  {tier.period && <span className="text-sm text-neutral-500">{tier.period}</span>}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{tier.description}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-neutral-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-6 block rounded-full py-3 text-center text-sm font-black transition ${
                    tier.highlighted
                      ? "bg-[var(--accent-2)] text-white hover:-translate-y-0.5 hover:shadow-lg"
                      : "border border-neutral-300 bg-white text-neutral-700 hover:-translate-y-0.5 hover:border-[var(--champagne)]"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </section>

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-white p-6 text-center">
          <p className="text-sm text-neutral-600">
            All tiers include the same core analysis engine. Upgrades unlock higher limits, integrations, and team features.
            <br />
            Questions? <a href="mailto:hello@dealscan.dev" className="font-bold text-[var(--accent-2)] underline">Email hello@dealscan.dev</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
