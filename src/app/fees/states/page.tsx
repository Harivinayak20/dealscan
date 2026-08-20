import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { stateFees } from "@/lib/state-fees";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Dealer Fees by State: Caps & Taxes (2026)",
  description:
    "Doc fee caps, sales tax rates, and title fees for used car purchases in all 50 states. See what dealers can legally charge in your state and what to push back on.",
  alternates: {
    canonical: "/fees/states",
  },
  openGraph: {
    title: "Used Car Dealer Fees by State | DealScan",
    description: "Doc fee caps, sales tax, and title fees for all 50 states.",
    url: `${appUrl}/fees/states`,
    type: "website",
  },
};

export default function StateFeesHub() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Dealer fees", href: "/fees" },
            { name: "By state" },
          ]}
        />

        <section className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Dealer fees by state</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used car dealer fees in every state
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">
            The same used car can cost hundreds more to buy in one state than another, purely on fees. Some states cap the doc fee at under $200; others let it run past $900. Pick your state to see the doc fee rules, sales tax, title and registration costs, and the charges worth pushing back on.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stateFees.map((entry) => (
              <Link
                key={entry.slug}
                href={`/fees/states/${entry.slug}`}
                className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
              >
                <p className="text-xs font-black uppercase text-[var(--racing-green)]">
                  {entry.capped === "Yes" ? "Doc fee capped" : "No doc fee cap"}
                </p>
                <h2 className="mt-2 flex-1 text-lg font-black leading-snug">{entry.name}</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{entry.docFee}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                  See all fees
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
