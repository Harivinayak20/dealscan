import {
  ArrowLeft,
  ArrowUpRight,
  CarFront,
  FileSearch,
  Gauge,
  ShieldCheck,
  ShoppingBag,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { partnerLinks } from "@/lib/integration-links";

export const metadata: Metadata = {
  title: "Buyer Tools and Affiliate Links",
  description: "Used car buyer tools for history reports, inspections, insurance quotes, payment estimates, OBD2 scanners, and detailing kits.",
};

const affiliateLinks = [
  {
    title: "CARFAX VIN report",
    description: "Check title events, mileage history, ownership records, and reported accidents before meeting the seller.",
    href: partnerLinks.carfax,
    icon: FileSearch,
  },
  {
    title: "Pre-purchase inspection",
    description: "Book a mechanic inspection before you commit to buying a used car.",
    href: partnerLinks.inspection,
    icon: Wrench,
  },
  {
    title: "Insurance quote",
    description: "Compare insurance pricing before you commit to a car with expensive parts or higher repair risk.",
    href: partnerLinks.insurance,
    icon: ShoppingBag,
  },
  {
    title: "Payment estimate",
    description: "Estimate a monthly payment range before you negotiate an offer.",
    href: partnerLinks.payments,
    icon: ShoppingBag,
  },
  {
    title: "OBD2 scanner",
    description: "Read warning codes during a test drive and use findings in your negotiation.",
    href: partnerLinks.obd,
    icon: Gauge,
  },
  {
    title: "Detailing kit",
    description: "Clean the car after purchase and inspect paint, trim, and interior condition more clearly.",
    href: partnerLinks.detailingKit,
    icon: ShieldCheck,
  },
];

export default function AffiliateLinksPage() {
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

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,106,0.35)] bg-white/70 px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <ShoppingBag className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Buyer tools
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            Check the basics before you buy.
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-neutral-700">
            History, inspection, insurance, payments, and simple tools in one place.
          </p>
          <p className="mt-5 max-w-3xl rounded-2xl border border-[rgba(201,168,106,0.30)] bg-white/75 p-4 text-sm leading-6 text-neutral-700">
            <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links. Dealscan.dev may earn a commission from qualifying purchases at no extra cost to you. This does not influence our deal analysis or scoring.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {affiliateLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="group rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/90 p-5 shadow-xl shadow-black/5 transition duration-200 hover:-translate-y-1.5 hover:border-[var(--champagne)] hover:shadow-2xl hover:shadow-black/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(18,61,51,0.08)] text-[var(--racing-green)] transition group-hover:scale-110 group-hover:bg-[var(--racing-green)] group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-neutral-500 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--racing-green)]" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-black tracking-tight">{link.title}</h2>
                <p className="mt-2 text-base leading-7 text-neutral-700">{link.description}</p>
              </a>
            );
          })}
        </section>

        <p className="mt-8 text-sm leading-6 text-neutral-600">
          Links open third-party sites under their own terms and privacy policies. Always verify pricing, title status, vehicle history, loan terms, insurance rates, and inspection findings independently.
        </p>
      </div>
    </main>
  );
}
