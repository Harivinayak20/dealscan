import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, SearchCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdUnit } from "@/components/AdUnit";
import { ADSENSE_IN_ARTICLE_SLOT } from "@/lib/adsense";
import { comparisons, resolveComparison } from "@/lib/comparisons";
import { breadcrumbSchema } from "@/lib/schema-builders";
import { compactTitle, truncateMeta } from "@/lib/seo";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type ComparePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveComparison(slug);
  if (!resolved) return {};

  const { a, b } = resolved;
  const title = compactTitle(
    `Used ${a.make} ${a.model} vs ${b.make} ${b.model}: Which to Buy?`,
    `${a.model} vs ${b.model}: Used Car Guide`,
  );
  const description = truncateMeta(
    `Used ${a.make} ${a.model} vs ${b.make} ${b.model} compared on reliability, known issues, mileage, and what to verify before you buy. Free side-by-side buyer guide.`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title,
      description,
      url: `${appUrl}/compare/${slug}`,
      type: "article",
    },
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slug } = await params;
  const resolved = resolveComparison(slug);
  if (!resolved) notFound();

  const { comparison, a, b } = resolved;
  const aName = `${a.make} ${a.model}`;
  const bName = `${b.make} ${b.model}`;

  const faqs = [
    {
      q: `Is the used ${aName} or ${bName} more reliable?`,
      a: `Both are popular used picks, and reliability comes down to the specific model year and how well the car was maintained more than the badge. Match each car's year to its known issues — the ${aName} watch-items and the ${bName} watch-items are listed above — and prioritize the one with documented maintenance records.`,
    },
    {
      q: `Which is cheaper to own used, the ${aName} or the ${bName}?`,
      a: `Total cost depends on purchase price, insurance, fuel, and repair risk for the specific year. Use DealScan's free price checker on each to compare fair market values, and factor in the known repair items for each model before deciding which is cheaper to own.`,
    },
    {
      q: `Should I buy the ${aName} or ${bName}?`,
      a: comparison.editorsTake,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Used ${aName} vs ${bName}: Which Should You Buy?`,
      description: `A side-by-side used-car comparison of the ${aName} and ${bName} covering reliability, known issues, mileage, and buyer checks.`,
      dateModified: comparison.updatedAt,
      datePublished: comparison.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/compare/${comparison.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Compare", href: "/compare" },
      { name: `${aName} vs ${bName}` },
    ]),
  ];

  const cars = [
    { car: a, name: aName, slug: comparison.aSlug },
    { car: b, name: bName, slug: comparison.bSlug },
  ];

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-4 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Compare", href: "/compare" },
            { name: `${a.model} vs ${b.model}` },
          ]}
        />

        <article className="py-8 sm:py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">{comparison.segment}</p>
          <h1 className="mt-3 max-w-4xl text-2xl font-black leading-[1.15] tracking-tight sm:mt-4 sm:text-3xl sm:leading-tight lg:text-4xl">
            Used {aName} vs {bName}: which should you buy?
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By the <Link href="/about" className="font-semibold underline-offset-2 hover:underline">DealScan team</Link> · Updated {comparison.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">The short answer</p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{comparison.editorsTake}</p>
          </div>

          {/* Side-by-side spec snapshot */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] shadow-sm">
            <div className="grid grid-cols-2 border-b border-[var(--border-subtle)] bg-[var(--mist)]">
              {cars.map(({ name, slug }) => (
                <div key={slug} className="p-3 text-center sm:p-4">
                  <Link href={`/cars/${slug}`} className="text-base font-black leading-snug underline-offset-4 hover:underline sm:text-lg">
                    {name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)]">
              {cars.map(({ car, slug }) => (
                <div key={slug} className="p-3 sm:p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">Model years</p>
                  <p className="mt-1 text-sm font-bold sm:text-base">{car.years}</p>
                  <p className="mt-3 text-[11px] font-black uppercase tracking-wide text-[var(--text-muted)] sm:text-xs">Mileage outlook</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-body)]">{car.mileageNote}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="my-8">
            <AdUnit slot={ADSENSE_IN_ARTICLE_SLOT} />
          </div>

          {/* Per-car detail: known issues + what to verify */}
          <div className="grid gap-6 lg:grid-cols-2">
            {cars.map(({ car, name, slug }) => (
              <section key={slug} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">{name}</h2>
                <p className="mt-3 text-base leading-7 text-[var(--text-body)]">{car.quickAnswer}</p>

                <h3 className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--danger)]">
                  <TriangleAlert className="h-4 w-4" aria-hidden="true" /> Known issues to check
                </h3>
                <ul className="mt-3 space-y-2">
                  {car.knownIssues.map((issue) => (
                    <li key={issue} className="flex items-start gap-2 text-sm leading-6 text-[var(--text-body)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--danger)]" aria-hidden="true" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> What to verify
                </h3>
                <ul className="mt-3 space-y-2">
                  {car.verify.map((v) => (
                    <li key={v} className="flex items-start gap-2 text-sm leading-6 text-[var(--text-body)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-col gap-2">
                  <Link href={`/cars/${slug}`} className="inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    Full {name} buyer check <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href={`/price-checker?car=${slug}`} className="inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline">
                    What is a used {name} worth? <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* How to decide */}
          <section className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-2xl font-black leading-tight">How to decide between them</h2>
            <p className="mt-3 text-base leading-8 text-[var(--text-body)]">
              On the used market, the better <em>specific car</em> almost always beats the better model on paper. A well-documented {aName} can be a smarter buy than a neglected {bName}, and the reverse is just as true. Build a comp set for each, match the model year to its known issues above, and price in any maintenance the records do not cover.
            </p>
            <p className="mt-3 text-base leading-8 text-[var(--text-body)]">
              Once you have a real listing for either one, paste it into DealScan to get a deal score, the red flags, a fair price range, and the questions to ask before you visit.
            </p>
          </section>

          {/* CTA */}
          <section className="mt-8 rounded-2xl border border-[var(--accent-2-line)] bg-[var(--accent-2-soft)] p-6 text-center shadow-sm">
            <h2 className="text-2xl font-black">Found a listing for either one? Check the actual car.</h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--text-body)]">
              Paste any {a.model} or {b.model} listing and get a deal score, red flags, and the price you should actually offer.
            </p>
            <Link href="/#analyzer" className="btn-pill mt-5 inline-flex">
              <SearchCheck className="h-5 w-5" aria-hidden="true" /> Check a listing
            </Link>
          </section>

          {/* FAQ */}
          <section className="mt-8">
            <h2 className="text-2xl font-black leading-tight">{aName} vs {bName}: FAQ</h2>
            <div className="mt-4 grid gap-3">
              {faqs.map(({ q, a }) => (
                <div key={q} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
                  <h3 className="text-base font-black">{q}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
