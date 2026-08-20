import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, SearchCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { bestLists, getBestList } from "@/lib/best-lists";
import { getCarModel } from "@/lib/car-models";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type BestListPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return bestLists.map((list) => ({ slug: list.slug }));
}

export async function generateMetadata({ params }: BestListPageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = getBestList(slug);

  if (!list) {
    return {};
  }

  const title = `${list.metaTitle} (2026)`;

  return {
    title,
    description: list.metaDescription,
    alternates: {
      canonical: `/best/${list.slug}`,
    },
    openGraph: {
      title,
      description: list.metaDescription,
      url: `${appUrl}/best/${list.slug}`,
      type: "article",
    },
  };
}

export default async function BestListPage({ params }: BestListPageProps) {
  const { slug } = await params;
  const list = getBestList(slug);

  if (!list) {
    notFound();
  }

  const entries = list.entries
    .map((entry) => ({ entry, car: getCarModel(entry.slug) }))
    .filter((e): e is { entry: (typeof list.entries)[number]; car: NonNullable<ReturnType<typeof getCarModel>> } => Boolean(e.car));

  const listIndex = bestLists.findIndex((l) => l.slug === list.slug);
  const relatedLists = [1, 2, 3].map((offset) => bestLists[(listIndex + offset) % bestLists.length]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: list.title,
      description: list.metaDescription,
      itemListElement: entries.map(({ car }, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${car.make} ${car.model}`,
        url: `${appUrl}/cars/${car.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: list.title,
      description: list.metaDescription,
      dateModified: list.updatedAt,
      datePublished: list.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: {
        "@type": "Organization",
        name: "DealScan",
      },
      mainEntityOfPage: `${appUrl}/best/${list.slug}`,
    },
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Best lists", href: "/best" },
      { name: list.title },
    ]),
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
            { name: "Best used cars", href: "/best" },
            { name: list.title },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Best used cars</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {list.title}
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By the <Link href="/about" className="font-semibold underline-offset-2 hover:underline">DealScan team</Link> · Updated {list.updatedAt}
          </p>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">{list.intro}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <ol className="space-y-5">
              {entries.map(({ entry, car }, i) => (
                <li key={car.slug} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-[var(--racing-green)]">{i + 1}</span>
                    <h2 className="text-2xl font-black leading-tight">
                      {car.make} {car.model}
                    </h2>
                  </div>
                  <p className="mt-1 text-sm font-black uppercase text-[var(--racing-green)]">{car.years}</p>
                  <p className="mt-3 text-base leading-8 text-[var(--text-body)]">{entry.reason}</p>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--canvas)] p-3">
                      <dt className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">
                        Screen for
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[var(--text-body)]">{car.knownIssues[0]}</dd>
                    </div>
                    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--canvas)] p-3">
                      <dt className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">
                        Verify first
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[var(--text-body)]">{car.verify[0]}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-black text-[var(--racing-green)]">
                    <Link href={`/cars/${car.slug}`} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                      Buyer check
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link href={`/cars/${car.slug}/value`} className="underline-offset-4 hover:underline">
                      Value by year
                    </Link>
                    <Link href={`/cars/${car.slug}/years-to-avoid`} className="underline-offset-4 hover:underline">
                      Years to avoid
                    </Link>
                  </div>
                </li>
              ))}
            </ol>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Found one of these?</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
                Paste the listing into DealScan and it scores the deal, flags this model&apos;s known risks when they apply, and lists the questions worth asking the seller.
              </p>
              <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                Check a listing free
              </Link>
              <ul className="mt-5 grid gap-3">
                <li className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>Reliability is the year and records, not just the badge.</span>
                </li>
                <li className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>Always pair a shortlist with a history report and inspection.</span>
                </li>
              </ul>
            </aside>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
            Picks reflect general reliability patterns and typical used prices as of {list.updatedAt}; actual availability and pricing vary by market and condition. Always verify the specific car with a history report and inspection.
          </p>

          <section className="mt-12">
            <h2 className="text-2xl font-black leading-tight">More best-of lists</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedLists.map((related) => (
                <Link
                  key={related.slug}
                  href={`/best/${related.slug}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
                >
                  <p className="text-xs font-black uppercase text-[var(--racing-green)]">{related.entries.length} picks</p>
                  <h3 className="mt-2 flex-1 text-lg font-black leading-snug">{related.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                    See the list
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
