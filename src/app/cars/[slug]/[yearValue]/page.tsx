import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, SearchCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { getCarModel } from "@/lib/car-models";
import { allValueYears, avoidFlag, estimatePrice, modelYears } from "@/lib/pricing";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
const CURRENT_YEAR = new Date().getFullYear();

type ValuePageProps = {
  params: Promise<{ slug: string; yearValue: string }>;
};

export function generateStaticParams() {
  return allValueYears().map(({ slug, year }) => ({ slug, yearValue: `${year}-value` }));
}

function money(n: number) {
  return `$${n.toLocaleString()}`;
}

function parseYear(yearValue: string): number | null {
  const m = yearValue.match(/^(\d{4})-value$/);
  return m ? Number(m[1]) : null;
}

function mileageScenarios(age: number) {
  if (age <= 0) return { low: 2000, avg: 8000, high: 15000 };
  return { low: 8500 * age, avg: 12500 * age, high: 17000 * age };
}

export async function generateMetadata({ params }: ValuePageProps): Promise<Metadata> {
  const { slug, yearValue } = await params;
  const car = getCarModel(slug);
  const year = parseYear(yearValue);
  if (!car || !year) return {};

  const title = `${year} ${car.make} ${car.model} Value: What's a Used One Worth?`;
  const age = Math.max(0, CURRENT_YEAR - year);
  const est = estimatePrice(slug, year, mileageScenarios(age).avg, "good", "clean", CURRENT_YEAR);
  const description = est
    ? `A ${year} ${car.make} ${car.model} with average mileage is worth around ${money(est.fair)} (private party ${money(est.privateLow)}–${money(est.privateHigh)}). Free estimate, no signup.`
    : `${year} ${car.make} ${car.model} used value estimate.`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: `/cars/${slug}/${yearValue}` },
    openGraph: { title, description: description.slice(0, 155), url: `${appUrl}/cars/${slug}/${yearValue}`, type: "article" },
  };
}

export default async function ValueYearPage({ params }: ValuePageProps) {
  const { slug, yearValue } = await params;
  const car = getCarModel(slug);
  const year = parseYear(yearValue);

  if (!car || !year) notFound();

  const years = modelYears(slug, CURRENT_YEAR);
  if (!years.includes(year)) notFound();

  const age = Math.max(0, CURRENT_YEAR - year);
  const sc = mileageScenarios(age);
  const low = estimatePrice(slug, year, sc.low, "good", "clean", CURRENT_YEAR);
  const avg = estimatePrice(slug, year, sc.avg, "good", "clean", CURRENT_YEAR);
  const high = estimatePrice(slug, year, sc.high, "good", "clean", CURRENT_YEAR);

  if (!low || !avg || !high) notFound();

  const avoid = avoidFlag(slug, year);
  const avoidNote = avoid
    ? `Note: ${year} is a flagged year for this model (${avoid.years}) — ${avoid.reason} Expect to pay at the lower end and budget for that risk.`
    : `${year} is not on our years-to-avoid list, so condition, history, and maintenance matter more than the model year here.`;

  const quickAnswer = `A ${year} ${car.make} ${car.model} in good condition with average mileage (about ${sc.avg.toLocaleString()} miles) is worth roughly ${money(avg.fair)} in a private-party sale — a fair range of ${money(avg.privateLow)} to ${money(avg.privateHigh)}, or about ${money(avg.dealerRetail)} at a dealer. ${avoidNote}`;

  const prevYear = years.includes(year - 1) ? year - 1 : null;
  const nextYear = years.includes(year + 1) ? year + 1 : null;

  const rows = [
    { label: "Lower mileage", miles: sc.low, est: low },
    { label: "Average mileage", miles: sc.avg, est: avg },
    { label: "Higher mileage", miles: sc.high, est: high },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${year} ${car.make} ${car.model} Value`,
      description: quickAnswer,
      dateModified: car.updatedAt,
      datePublished: car.updatedAt,
      author: { "@type": "Person", name: "Hari Vinayak", url: `${appUrl}/about` },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/cars/${slug}/${yearValue}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is a ${year} ${car.make} ${car.model} worth?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `In good condition with average mileage, around ${money(avg.fair)} private party (${money(avg.privateLow)}–${money(avg.privateHigh)}), or about ${money(avg.dealerRetail)} at a dealer. Mileage, condition, and title status move the number.`,
          },
        },
        {
          "@type": "Question",
          name: `How many miles is too many for a ${year} ${car.make} ${car.model}?`,
          acceptedAnswer: { "@type": "Answer", text: car.mileageNote },
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <img src="/dealscan-logo.png" alt="DealScan" width="44" height="44" className="h-11 w-11 rounded-full" />
            DealScan.dev
          </Link>
          <Link
            href={`/cars/${slug}`}
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            {car.model} buyer check
          </Link>
        </header>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Used value estimate</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {year} {car.make} {car.model} value
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By <Link href="/about" className="font-semibold underline-offset-2 hover:underline">Hari Vinayak</Link> · Updated {car.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">Quick answer</p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{quickAnswer}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">Estimated value by mileage</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Good condition, clean title. Mileage is the biggest single factor at this age.</p>
                <div className="mt-5 overflow-hidden rounded-xl border border-[var(--line)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--canvas)] text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">
                      <tr>
                        <th className="px-4 py-2.5">Mileage</th>
                        <th className="px-4 py-2.5">Miles</th>
                        <th className="px-4 py-2.5">Fair value</th>
                        <th className="px-4 py-2.5">Private party</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.label} className="border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-bold">{r.label}</td>
                          <td className="px-4 py-3 text-[var(--text-body)]">{r.miles.toLocaleString()}</td>
                          <td className="px-4 py-3 font-black">{money(r.est.fair)}</td>
                          <td className="px-4 py-3 text-[var(--text-body)]">{money(r.est.privateLow)}–{money(r.est.privateHigh)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link
                  href={`/price-checker?car=${slug}&year=${year}`}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
                >
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  Get a custom estimate for your {year} {car.model}
                </Link>
              </section>

              {avoid ? (
                <section className="rounded-2xl border border-[rgba(196,90,74,0.30)] bg-[var(--paper)] p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                    <TriangleAlert className="h-6 w-6 text-[var(--danger)]" aria-hidden="true" />
                    Is {year} a good year to buy?
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                    {year} is a flagged year ({avoid.years}): {avoid.reason}
                  </p>
                  <Link href={`/cars/${slug}/years-to-avoid`} className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    See all {car.make} {car.model} years to avoid
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </section>
              ) : (
                <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                    <CheckCircle2 className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
                    Is {year} a good year to buy?
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                    {year} is not on our years-to-avoid list for this model, so judge the individual car on history and maintenance.
                  </p>
                  <Link href={`/cars/${slug}/years-to-avoid`} className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    Compare the best and worst {car.model} years
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </section>
              )}

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">What to check before you pay</h2>
                <ul className="mt-4 space-y-4 text-base leading-8 text-[var(--text-body)]">
                  {car.knownIssues.slice(0, 3).map((issue) => (
                    <li key={issue} className="flex gap-3">
                      <CheckCircle2 className="mt-1.5 h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/cars/${slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                  Full used {car.make} {car.model} buyer check
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>

              <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">Found a {year} {car.model} listing?</h2>
                <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                  Paste the ad into the analyzer and DealScan scores the deal against this value, flags the risks above when they apply, and lists what to ask the seller.
                </p>
                <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-6 text-sm font-black transition hover:-translate-y-1 hover:border-[var(--champagne)]">
                  Check a listing free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </div>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Other {car.model} years</h2>
              <div className="mt-4 grid gap-2">
                {prevYear ? (
                  <Link href={`/cars/${slug}/${prevYear}-value`} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm font-bold transition hover:border-[var(--racing-green)]">
                    {prevYear} {car.model} value
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
                {nextYear ? (
                  <Link href={`/cars/${slug}/${nextYear}-value`} className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm font-bold transition hover:border-[var(--racing-green)]">
                    {nextYear} {car.model} value
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null}
                <Link href="/price-checker" className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm font-bold transition hover:border-[var(--racing-green)]">
                  Price checker (any car)
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                Transparent estimate from a depreciation model, not a transaction-data valuation. Pair with a history report and inspection.
              </p>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
