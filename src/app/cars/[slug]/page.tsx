import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, SearchCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { AdUnit } from "@/components/AdUnit";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ADSENSE_IN_ARTICLE_SLOT } from "@/lib/adsense";
import { carModels, getCarModel } from "@/lib/car-models";
import { comparisonsForModel } from "@/lib/comparisons";
import { modelYears } from "@/lib/pricing";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// Build a 150-160 char meta description from complete sentences, never cut mid-word.
function metaDescription(text: string) {
  if (text.length <= 160) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const sentence of sentences) {
    if ((out + sentence).length > 160) break;
    out += sentence;
  }
  out = out.trim();
  return out.length >= 120 ? out : `${text.slice(0, 157).trimEnd()}…`;
}

type CarPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return carModels.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: CarPageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarModel(slug);

  if (!car) {
    return {};
  }

  const title = `Is a used ${car.make} ${car.model} a good deal? Known issues & buyer checks`;
  const description = metaDescription(car.quickAnswer);

  return {
    title,
    description,
    alternates: {
      canonical: `/cars/${car.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${appUrl}/cars/${car.slug}`,
      type: "article",
    },
  };
}

export default async function CarModelPage({ params }: CarPageProps) {
  const { slug } = await params;
  const car = getCarModel(slug);

  if (!car) {
    notFound();
  }

  const carIndex = carModels.findIndex((m) => m.slug === car.slug);
  const related = [1, 2, 3].map((offset) => carModels[(carIndex + offset) % carModels.length]);
  const modelComparisons = comparisonsForModel(car.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `Is a used ${car.make} ${car.model} a good deal?`,
      description: car.quickAnswer,
      dateModified: car.updatedAt,
      datePublished: car.updatedAt,
      author: {
        "@type": "Person",
        name: "Hari Vinayak",
        url: `${appUrl}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "DealScan",
      },
      mainEntityOfPage: `${appUrl}/cars/${car.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: car.faqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
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
            href="/cars"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            All models
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Cars", href: "/cars" },
            { name: `${car.make} ${car.model}` },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">{car.years}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Is a used {car.make} {car.model} a good deal?
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By <Link href="/about" className="font-semibold underline-offset-2 hover:underline">Hari Vinayak</Link> · Updated {car.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">Quick answer</p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{car.quickAnswer}</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={`/cars/${car.slug}/years-to-avoid`}
                className="inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline"
              >
                {car.make} {car.model} years to avoid (and best years to buy)
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/price-checker?car=${car.slug}`}
                className="inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline"
              >
                What is a used {car.make} {car.model} worth? Free price checker
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                  <Wrench className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
                  Known issues to check first
                </h2>
                <ul className="mt-4 space-y-4 text-base leading-8 text-[var(--text-body)]">
                  {car.knownIssues.map((issue) => (
                    <li key={issue} className="flex gap-3">
                      <CheckCircle2 className="mt-1.5 h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <AdUnit slot={ADSENSE_IN_ARTICLE_SLOT} />

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">How much mileage is okay?</h2>
                <p className="mt-4 text-base leading-8 text-[var(--text-body)]">{car.mileageNote}</p>
              </section>

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">Common questions</h2>
                <div className="mt-4 space-y-6">
                  {car.faqs.map(({ q, a }) => (
                    <div key={q}>
                      <h3 className="text-lg font-bold">{q}</h3>
                      <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">Found a {car.model} listing? Check it before you message.</h2>
                <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
                  Paste the ad link or text into the analyzer and DealScan scores the deal, flags the risks above when they apply, and lists the questions worth asking this specific seller.
                </p>
                <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
                  <SearchCheck className="h-4 w-4" aria-hidden="true" />
                  Check a listing free
                </Link>
              </section>
            </div>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Verify before you visit</h2>
              <ul className="mt-4 grid gap-3">
                {car.verify.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                General patterns for this model, not a diagnosis of any specific car. Always pair with a history report and inspection.
              </p>
            </aside>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-black">What is a used {car.make} {car.model} worth by year?</h2>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">Free value estimate for each year, with a price-by-mileage table and year-specific risks.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {modelYears(car.slug).slice().reverse().map((y) => (
                <Link
                  key={y}
                  href={`/cars/${car.slug}/${y}-value`}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--racing-green)] hover:text-[var(--racing-green)]"
                >
                  {y} value
                </Link>
              ))}
            </div>
          </section>

          {modelComparisons.length > 0 ? (
            <section className="mt-12">
              <h2 className="text-2xl font-black">Compare the {car.make} {car.model}</h2>
              <p className="mt-2 text-base leading-7 text-[var(--text-body)]">Torn between two models? See the {car.model} head-to-head with its closest rivals.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {modelComparisons.map(({ comparison, otherSlug }) => {
                  const other = getCarModel(otherSlug);
                  if (!other) return null;
                  return (
                    <Link
                      key={comparison.slug}
                      href={`/compare/${comparison.slug}`}
                      className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--racing-green)] hover:text-[var(--racing-green)]"
                    >
                      vs {other.make} {other.model}
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="text-2xl font-black">More buyer checks</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {related.map((m) => (
                <Link key={m.slug} href={`/cars/${m.slug}`} className="card-hover group !p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">{m.years}</p>
                  <h3 className="mt-2 text-lg font-black leading-snug">Used {m.make} {m.model}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                    Buyer check
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
