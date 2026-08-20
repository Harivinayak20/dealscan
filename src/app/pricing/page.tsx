import type { Metadata } from "next";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProCheckoutButtons } from "@/components/PricingActions";
import { isStripeConfigured, PRO_WATCH_LIMIT } from "@/lib/pro";
import { FREE_WATCH_LIMIT } from "@/lib/watch-store";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// Stripe secrets are runtime env on Workers. Until they are configured, this
// page remains a waitlist instead of presenting checkout controls.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DealScan Pricing — The Analyzer Is Free. Pro Lifts the Caps.",
  description:
    "Scanning, scoring, VIN lookups, and guides are free forever with no account. DealScan Pro adds unlimited watch alerts and deeper market context for the weeks you're actively shopping.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "DealScan Pricing",
    description: "Free forever to scan and score. Pro lifts the caps while you're actively shopping.",
    url: `${appUrl}/pricing`,
    type: "website",
  },
};

const FREE_FEATURES = [
  "Unlimited deal scans — score any listing 0-100, no account",
  "Red flags, missing info, seller questions, negotiation plan",
  "Free VIN lookup: specs, recalls, safety ratings, MPG",
  "Price checker and every guide, comparison, and fee page",
  `Watch up to ${FREE_WATCH_LIMIT} listings with email price-drop alerts`,
  "Share reports, compare cars, export",
];

const PRO_FEATURES = [
  `Watch up to ${PRO_WATCH_LIMIT} listings with price-drop and probably-sold alerts`,
  "Priority scanning during peak hours (higher rate limits)",
  "Deeper market context on every scan as listing memory grows",
  "Early access to new tools (deal-score API keys first)",
  "Founding-member price locked while subscribed",
];

export default function PricingPage() {
  const live = isStripeConfigured();

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Pricing</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            The analyzer is free. Pro exists for the weeks you&apos;re hunting.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Car shopping is a sprint, not a subscription lifestyle — so Pro bills weekly if you want it to, and
            everything that keeps you safe stays free forever. We make money from Pro and clearly-labeled affiliate
            links, never by selling you to dealers as a lead.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                <ShieldCheck className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
                Free
              </h2>
              <p className="mt-1 text-sm font-bold text-[var(--text-muted)]">Forever. No account, no card, no lead forms.</p>
              <ul className="mt-5 grid gap-2.5">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-base leading-7 text-[var(--text-body)]">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-5 text-base font-black transition hover:-translate-y-0.5 hover:border-[var(--champagne)]"
              >
                Scan a listing free
              </Link>
            </section>

            <section className="rounded-2xl border border-[rgba(169,130,83,0.45)] bg-[rgba(169,130,83,0.07)] p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                <Sparkles className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
                DealScan Pro
              </h2>
              <p className="mt-1 text-sm font-bold text-[var(--text-muted)]">
                $4.99/week or $9.99/month · for the active-hunt weeks
              </p>
              <ul className="mt-5 grid gap-2.5">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-base leading-7 text-[var(--text-body)]">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <ProCheckoutButtons live={live} />
              </div>
            </section>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
            The buyer-side promise applies to both tiers: nobody can pay to change a score, your contact info is never
            sold as a lead, and the safety-critical features — scanning, scoring, VIN checks — will not move behind the
            paywall. Read the full promise on the <Link href="/about" className="font-bold underline">about page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
