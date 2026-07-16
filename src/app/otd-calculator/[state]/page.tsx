import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, SearchCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OtdCalculator } from "@/components/OtdCalculator";
import { breadcrumbSchema } from "@/lib/schema-builders";
import { truncateMeta } from "@/lib/seo";
import { calculateOtd, formatUsd } from "@/lib/otd-calculator";
import { DATA_UPDATED } from "@/lib/state-doc-fees";
import {
  getOtdStatePage,
  nationalAverages,
  nearbyStatePages,
  otdStatePages,
} from "@/lib/otd-states";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type StatePageProps = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return otdStatePages.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const s = getOtdStatePage(state);
  if (!s) return {};

  const title = `${s.name} Out-the-Door Price Calculator — Car Sales Tax & Fees | DealScan`;
  const description = truncateMeta(
    `Free out-the-door price calculator for ${s.name}: ${s.salesTaxRate}% state sales tax, ${formatUsd(s.docFee)} doc fee, and ${formatUsd(s.titleFee)} title. See the real ${s.name} car OTD price with trade-in included.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/otd-calculator/${s.slug}` },
    openGraph: { title, description, url: `${appUrl}/otd-calculator/${s.slug}`, type: "website" },
  };
}

// A concrete $25,000 example so the copy shows real dollars, computed from the
// same pure function the calculator uses — no hard-coded totals.
const EXAMPLE_PRICE = 25000;

export default async function OtdStatePage({ params }: StatePageProps) {
  const { state } = await params;
  const s = getOtdStatePage(state);
  if (!s) notFound();

  const example = calculateOtd({
    vehiclePrice: EXAMPLE_PRICE,
    salesTaxRate: s.salesTaxRate,
    docFee: s.docFee,
    titleFee: s.titleFee,
    registrationFee: s.registrationFee,
  });

  const taxVsNational =
    s.salesTaxRate > nationalAverages.salesTaxRate
      ? "above"
      : s.salesTaxRate < nationalAverages.salesTaxRate
        ? "below"
        : "in line with";
  const docVsNational =
    s.docFee > nationalAverages.docFee
      ? "higher than"
      : s.docFee < nationalAverages.docFee
        ? "lower than"
        : "about the same as";

  const noSalesTax = s.salesTaxRate === 0;

  const faqs = [
    {
      q: `How much is the out-the-door price on a car in ${s.name}?`,
      a: `On a ${formatUsd(EXAMPLE_PRICE)} used car in ${s.name}, expect roughly ${formatUsd(example.total)} out the door: ${formatUsd(EXAMPLE_PRICE)} vehicle price, ${formatUsd(example.salesTax)} state sales tax (${s.salesTaxRate}%), a ${formatUsd(s.docFee)} documentation fee, a ${formatUsd(s.titleFee)} title fee, and about ${formatUsd(s.registrationFee)} for registration. Local county tax, if any, is added on top — use the calculator above to add your local rate.`,
    },
    {
      q: `What is the car sales tax rate in ${s.name}?`,
      a: noSalesTax
        ? `${s.name} has no statewide vehicle sales tax (0%). You may still owe local or county levies and other DMV paperwork, so confirm with your county before you sign.`
        : `${s.name}'s base state vehicle sales tax is ${s.salesTaxRate}%, which is ${taxVsNational} the national average of ${nationalAverages.salesTaxRate}%. Counties and cities can add a local rate on top, so your total tax may be higher depending on where you register the car.`,
    },
    {
      q: `How much are dealer doc and title fees in ${s.name}?`,
      a: `The typical documentation fee in ${s.name} runs about ${formatUsd(s.docFee)} — ${docVsNational} the roughly ${formatUsd(nationalAverages.docFee)} national average — and the state title fee is around ${formatUsd(s.titleFee)}. Doc fees are dealer profit and vary from lot to lot, so it is the one line worth pushing back on. Title and registration are government charges you cannot negotiate.`,
    },
    {
      q: `Is sales tax charged before or after a trade-in in ${s.name}?`,
      a: `Most states, and this calculator by default, apply sales tax to the price after the trade-in credit, so a trade-in lowers the tax you owe. A few states tax the full price regardless. Enter your trade-in above to see the effect, and confirm ${s.name}'s trade-in rule with the DMV if it matters to your deal.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: `${s.name} Out-the-Door Price Calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: `${appUrl}/otd-calculator/${s.slug}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: `Free out-the-door price calculator for ${s.name} used cars — adds ${s.name} sales tax, doc fee, title, and registration to any vehicle price.`,
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
      { name: "Out-the-door price calculator", href: "/otd-calculator" },
      { name: s.name },
    ]),
  ];

  const nearby = nearbyStatePages(s.abbr, 4);

  const keyFacts = [
    { label: "State sales tax", value: `${s.salesTaxRate}%` },
    { label: "Doc fee (typical)", value: formatUsd(s.docFee) },
    { label: "Title fee", value: formatUsd(s.titleFee) },
    { label: "Registration (est.)", value: formatUsd(s.registrationFee) },
  ];

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "OTD calculator", href: "/otd-calculator" },
            { name: s.name },
          ]}
        />

        <section className="py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">
            Out-the-door price by state
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {s.name} Out-the-Door Price Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            See the real out-the-door price of a used car in {s.name}. This calculator starts with{" "}
            {s.name}&apos;s {s.salesTaxRate}% state sales tax, a typical {formatUsd(s.docFee)} doc fee,
            a {formatUsd(s.titleFee)} title fee, and a registration estimate — all pre-filled, with
            trade-in credit factored in. No signup.
          </p>

          <dl className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {keyFacts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-4 shadow-sm"
              >
                <dt className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-lg font-black leading-6 text-[var(--graphite)]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <OtdCalculator initialState={s.abbr} />
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">
            What a car really costs out the door in {s.name}
          </h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              On a {formatUsd(EXAMPLE_PRICE)} used car in {s.name}, the out-the-door total works out to
              about <strong>{formatUsd(example.total)}</strong>. That breaks down as {formatUsd(EXAMPLE_PRICE)}{" "}
              for the vehicle, {formatUsd(example.salesTax)} in state sales tax at {s.salesTaxRate}%, a{" "}
              {formatUsd(s.docFee)} documentation fee, a {formatUsd(s.titleFee)} title fee, and roughly{" "}
              {formatUsd(s.registrationFee)} for registration and plates. Any county or city sales tax is
              added on top — enter your local rate in the calculator to see it.
            </p>
            <p>
              {noSalesTax ? (
                <>
                  {s.name} is one of the few states with no statewide vehicle sales tax, so the tax line
                  above is {formatUsd(example.salesTax)}. That makes {s.name}&apos;s out-the-door total
                  unusually close to the sticker — the fees, not the tax, are what to watch. The national
                  average state vehicle sales tax is {nationalAverages.salesTaxRate}%.
                </>
              ) : (
                <>
                  {s.name}&apos;s {s.salesTaxRate}% state vehicle sales tax is {taxVsNational} the national
                  average of {nationalAverages.salesTaxRate}%, and its typical {formatUsd(s.docFee)} doc fee
                  is {docVsNational} the roughly {formatUsd(nationalAverages.docFee)} charged nationwide. The
                  doc fee is the one negotiable line here — title and registration are fixed government
                  charges.
                </>
              )}{" "}
              For a plain-English breakdown of every line, see our{" "}
              <Link
                href={`/fees/states/${s.slug}`}
                className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline"
              >
                {s.name} dealer fees guide
              </Link>
              .
            </p>
            <p>
              These are estimates pulled from our{" "}
              <Link
                href="/fees"
                className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline"
              >
                state dealer-fee data
              </Link>{" "}
              (updated {DATA_UPDATED}). Doc fees are set by each dealer and registration is often based on a
              vehicle&apos;s value, weight, or age, so treat the figures as a way to sanity-check a quote —
              not a binding total. Always confirm the exact numbers on your paperwork and with the {s.name}{" "}
              DMV. Want the general version? Use the main{" "}
              <Link
                href="/otd-calculator"
                className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline"
              >
                out-the-door price calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
          <h2 className="text-2xl font-black leading-tight">
            Found a {s.name} listing? Check the actual deal.
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
            Once the out-the-door number looks right, make sure the car itself is priced fairly. Paste the ad
            into DealScan for a 0–100 deal score and a list of red flags before you visit.
          </p>
          <Link
            href="/#analyzer"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
          >
            <SearchCheck className="h-4 w-4" aria-hidden="true" />
            Check a listing free
          </Link>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="text-2xl font-black tracking-tight">{s.name} out-the-door price FAQ</h2>
          <dl className="mt-6 grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="text-lg font-bold text-[var(--graphite)]">{faq.q}</dt>
                <dd className="mt-2 text-[15px] leading-7 text-[var(--text-body)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="pb-12">
          <h2 className="text-2xl font-black">Out-the-door price in nearby states</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((n) => (
              <Link
                key={n.slug}
                href={`/otd-calculator/${n.slug}`}
                className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
              >
                <p className="text-xs font-black uppercase text-[var(--racing-green)]">
                  {n.salesTaxRate}% tax
                </p>
                <h3 className="mt-2 flex-1 text-lg font-black leading-snug">{n.name} OTD price</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                  Calculate
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
