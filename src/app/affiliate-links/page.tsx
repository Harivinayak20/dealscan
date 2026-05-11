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
import { partnerLinks } from "@/lib/integration-links";

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
    <main className="min-h-screen bg-[#f8f3ea] px-5 py-6 text-blue-950 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 text-2xl font-black tracking-normal transition hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-950 text-white shadow-lg shadow-blue-950/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            DEALSCAN
          </a>
          <a
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </a>
        </header>

        <section className="py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/70 px-4 py-2 text-sm font-black text-slate-800 shadow-sm">
            <ShoppingBag className="h-4 w-4 text-amber-700" aria-hidden="true" />
            Buyer tools
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-normal sm:text-7xl">
            Useful links before you buy.
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-700">
            These resources can help verify the listing, inspect the car, and estimate likely repair costs. Some links may
            be affiliate links.
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
                className="group rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-xl shadow-blue-950/5 transition duration-200 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-950/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-950 transition group-hover:scale-110 group-hover:bg-blue-950 group-hover:text-white">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="h-6 w-6 text-slate-500 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-blue-700" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-2xl font-black tracking-normal">{link.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-700">{link.description}</p>
              </a>
            );
          })}
        </section>

        <p className="mt-8 rounded-2xl border border-amber-200 bg-white/75 p-4 text-base leading-7 text-slate-700">
          Affiliate disclosure: DEALSCAN may earn a commission from qualifying purchases. Replace these URLs with your
          approved affiliate links before launch.
        </p>
      </div>
    </main>
  );
}
