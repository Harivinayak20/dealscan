import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, SearchCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { carModels, getCarModel } from "@/lib/car-models";
import { avoidFlag, estimatePrice, modelYears } from "@/lib/pricing";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
const CURRENT_YEAR = new Date().getFullYear();

const sidebarLink =
  "flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--canvas)] px-3 py-2 text-sm font-bold transition hover:border-[var(--racing-green)]";

// Value pages are the only pages with meaningful crawl equity, so they carry the
// internal links to the conversion tools Google has not indexed yet.
const TOOL_LINKS = [
  { href: "/deal-checker", label: "Rate a listing" },
  { href: "/good-deal", label: "Is this a good deal?" },
  { href: "/otd-calculator", label: "Out-the-door price" },
  { href: "/scam-checker", label: "Scam checker" },
] as const;

type ValuePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return carModels.map((car) => ({ slug: car.slug }));
}

function money(n: number) {
  return `$${n.toLocaleString()}`;
}

function averageMiles(age: number) {
  return age <= 0 ? 8000 : 12500 * age;
}

function mileageScenarios(age: number) {
  if (age <= 0) return { low: 2000, avg: 8000, high: 15000 };
  return { low: 8500 * age, avg: 12500 * age, high: 17000 * age };
}

// One row per model year at average mileage. This is the whole point of the page:
// the year-over-year curve is the thing a single year page cannot show.
function valueRows(slug: string) {
  return modelYears(slug, CURRENT_YEAR)
    .slice()
    .reverse()
    .map((year) => {
      const age = Math.max(0, CURRENT_YEAR - year);
      const miles = averageMiles(age);
      const est = estimatePrice(slug, year, miles, "good", "clean", CURRENT_YEAR);
      return est ? { year, miles, est, avoid: avoidFlag(slug, year) } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);
}

export async function generateMetadata({ params }: ValuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarModel(slug);
  if (!car) return {};

  const rows = valueRows(slug);
  if (rows.length === 0) return {};

  const newest = rows[0];
  const oldest = rows[rows.length - 1];
  const title = `Used ${car.make} ${car.model} Value by Year (${CURRENT_YEAR})`;
  const description = `What a used ${car.make} ${car.model} is worth every year from ${oldest.year} to ${newest.year}: ${money(oldest.est.fair)} to ${money(newest.est.fair)} at average mileage, plus price by mileage. Free, no signup.`;

  return {
    title,
    description: description.slice(0, 155),
    alternates: { canonical: `/cars/${slug}/value` },
    openGraph: {
      title,
      description: description.slice(0, 155),
      url: `${appUrl}/cars/${slug}/value`,
      type: "article",
    },
  };
}

export default async function ModelValuePage({ params }: ValuePageProps) {
  const { slug } = await params;
  const car = getCarModel(slug);
  if (!car) notFound();

  const rows = valueRows(slug);
  if (rows.length === 0) notFound();

  const newest = rows[0];
  const oldest = rows[rows.length - 1];
  const flaggedYears = rows.filter((r) => r.avoid);

  // Mileage bands are shown once, for a mid-age car, because the spread scales
  // with age the same way for every year on the table.
  const sample = rows[Math.floor(rows.length / 2)];
  const sampleAge = Math.max(0, CURRENT_YEAR - sample.year);
  const sc = mileageScenarios(sampleAge);
  const bands = [
    { label: "Lower mileage", miles: sc.low, est: estimatePrice(slug, sample.year, sc.low, "good", "clean", CURRENT_YEAR) },
    { label: "Average mileage", miles: sc.avg, est: estimatePrice(slug, sample.year, sc.avg, "good", "clean", CURRENT_YEAR) },
    { label: "Higher mileage", miles: sc.high, est: estimatePrice(slug, sample.year, sc.high, "good", "clean", CURRENT_YEAR) },
  ].filter((b): b is typeof b & { est: NonNullable<typeof b.est> } => b.est !== null);

  const quickAnswer = `A used ${car.make} ${car.model} in good condition with average mileage runs from about ${money(oldest.est.fair)} for a ${oldest.year} up to ${money(newest.est.fair)} for a ${newest.year}. The table below gives the fair value and private-party range for every year${flaggedYears.length > 0 ? `, and flags the ${flaggedYears.length} model year${flaggedYears.length === 1 ? "" : "s"} we would avoid` : ""}.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Used ${car.make} ${car.model} Value by Year`,
      description: quickAnswer,
      dateModified: car.updatedAt,
      datePublished: car.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/cars/${slug}/value`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is a used ${car.make} ${car.model} worth?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `In good condition with average mileage, between ${money(oldest.est.fair)} for a ${oldest.year} and ${money(newest.est.fair)} for a ${newest.year} private party. Mileage, condition, and title status move the number.`,
          },
        },
        {
          "@type": "Question",
          name: `How many miles is too many for a used ${car.make} ${car.model}?`,
          acceptedAnswer: { "@type": "Answer", text: car.mileageNote },
        },
        ...(flaggedYears.length > 0
          ? [
              {
                "@type": "Question",
                name: `Which ${car.make} ${car.model} years should you avoid?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${flaggedYears.map((r) => r.year).join(", ")}. ${flaggedYears[0].avoid?.reason ?? ""}`,
                },
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Cars", href: "/cars" },
            { name: `${car.make} ${car.model}`, href: `/cars/${car.slug}` },
            { name: "Value by year" },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Used value estimate</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used {car.make} {car.model} value by year
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By the <Link href="/about" className="font-semibold underline-offset-2 hover:underline">DealScan team</Link> · Updated {car.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">Quick answer</p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{quickAnswer}</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">{car.make} {car.model} value for every year</h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">Good condition, clean title, average mileage for the age. Newest first.</p>
                <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--line)]">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--canvas)] text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">
                      <tr>
                        <th className="px-4 py-2.5">Year</th>
                        <th className="px-4 py-2.5">Avg miles</th>
                        <th className="px-4 py-2.5">Fair value</th>
                        <th className="px-4 py-2.5">Private party</th>
                        <th className="px-4 py-2.5">Dealer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.year} id={`y${r.year}`} className="scroll-mt-24 border-t border-[var(--line)]">
                          <td className="px-4 py-3 font-bold">
                            {r.year}
                            {r.avoid ? (
                              <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-[rgba(196,90,74,0.30)] px-2 py-0.5 text-xs font-black text-[var(--danger)]">
                                <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                                Avoid
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-body)]">{r.miles.toLocaleString()}</td>
                          <td className="px-4 py-3 font-black">{money(r.est.fair)}</td>
                          <td className="px-4 py-3 text-[var(--text-body)]">{money(r.est.privateLow)}–{money(r.est.privateHigh)}</td>
                          <td className="px-4 py-3 text-[var(--text-body)]">{money(r.est.dealerRetail)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link
                  href={`/price-checker?car=${slug}`}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
                >
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  Get a custom estimate for your {car.model}
                </Link>
              </section>

              {bands.length > 0 ? (
                <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                  <h2 className="text-2xl font-black leading-tight">How much mileage moves the price</h2>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Using a {sample.year} {car.model} as the example. The same spread applies at every year on the table above.
                  </p>
                  <div className="mt-5 overflow-x-auto rounded-xl border border-[var(--line)]">
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
                        {bands.map((b) => (
                          <tr key={b.label} className="border-t border-[var(--line)]">
                            <td className="px-4 py-3 font-bold">{b.label}</td>
                            <td className="px-4 py-3 text-[var(--text-body)]">{b.miles.toLocaleString()}</td>
                            <td className="px-4 py-3 font-black">{money(b.est.fair)}</td>
                            <td className="px-4 py-3 text-[var(--text-body)]">{money(b.est.privateLow)}–{money(b.est.privateHigh)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {flaggedYears.length > 0 ? (
                <section className="rounded-2xl border border-[rgba(196,90,74,0.30)] bg-[var(--paper)] p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                    <TriangleAlert className="h-6 w-6 text-[var(--danger)]" aria-hidden="true" />
                    Which years to avoid
                  </h2>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-[var(--text-body)]">
                    {flaggedYears.map((r) => (
                      <li key={r.year}>
                        <span className="font-black">{r.year}</span> ({r.avoid?.years}): {r.avoid?.reason}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/cars/${slug}/years-to-avoid`} className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    Full {car.make} {car.model} years-to-avoid breakdown
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </section>
              ) : (
                <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                    <CheckCircle2 className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
                    Which years to avoid
                  </h2>
                  <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                    No year of the {car.model} is on our years-to-avoid list, so judge each car on history and maintenance rather than model year.
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
                <h2 className="text-2xl font-black leading-tight">Found a {car.model} listing?</h2>
                <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                  Paste the ad into the analyzer and DealScan scores the deal against these values, flags the risks above when they apply, and lists what to ask the seller.
                </p>
                <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-6 text-sm font-black transition hover:-translate-y-1 hover:border-[var(--champagne)]">
                  Check a listing free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </div>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">More on the {car.model}</h2>
              <div className="mt-4 grid gap-2">
                <Link href={`/cars/${slug}`} className={sidebarLink}>
                  Buyer check
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={`/cars/${slug}/years-to-avoid`} className={sidebarLink}>
                  Years to avoid
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href={`/cars/${slug}/mileage`} className={sidebarLink}>
                  Mileage guide
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/price-checker" className={sidebarLink}>
                  Price checker (any car)
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <h2 className="mt-6 text-lg font-black">Free tools</h2>
              <div className="mt-4 grid gap-2">
                {TOOL_LINKS.map((tool) => (
                  <Link key={tool.href} href={tool.href} className={sidebarLink}>
                    {tool.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ))}
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
