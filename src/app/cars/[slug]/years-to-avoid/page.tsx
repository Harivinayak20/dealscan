import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, SearchCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCarModel } from "@/lib/car-models";
import { getYearsToAvoid, yearsToAvoid } from "@/lib/years-to-avoid";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type YearsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return yearsToAvoid.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: YearsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarModel(slug);
  const entry = getYearsToAvoid(slug);

  if (!car || !entry) {
    return {};
  }

  // The query is a question ("what year to stay away from prius?"), so the title
  // should carry the answer. Layout appends " | DealScan.dev", so cap this side
  // near 55 characters and fall back to fewer ranges rather than truncating.
  const base = `${car.make} ${car.model} Years to Avoid`;
  const ranges = entry.avoid.map((a) => a.years);
  const withAll = `${base}: ${ranges.join(", ")}`;
  const title =
    ranges.length === 0
      ? `${base} (and the Best Years to Buy Used)`
      : withAll.length <= 55
        ? withAll
        : `${base}: ${ranges[0]}`;

  return {
    title,
    description: entry.verdict.slice(0, 155),
    alternates: {
      canonical: `/cars/${car.slug}/years-to-avoid`,
    },
    openGraph: {
      title,
      description: entry.verdict.slice(0, 155),
      url: `${appUrl}/cars/${car.slug}/years-to-avoid`,
      type: "article",
    },
  };
}

export default async function YearsToAvoidPage({ params }: YearsPageProps) {
  const { slug } = await params;
  const car = getCarModel(slug);
  const entry = getYearsToAvoid(slug);

  if (!car || !entry) {
    notFound();
  }

  const quickAnswer = `${car.make} ${car.model} years to avoid: ${entry.avoid
    .map((a) => a.years)
    .join(", ")}. Best used years: ${entry.best.map((b) => b.years).join(", ")}. ${entry.verdict}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${car.make} ${car.model} Years to Avoid`,
      description: entry.verdict,
      dateModified: entry.updatedAt,
      datePublished: entry.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: {
        "@type": "Organization",
        name: "DealScan",
      },
      mainEntityOfPage: `${appUrl}/cars/${car.slug}/years-to-avoid`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Which ${car.make} ${car.model} years should I avoid?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.avoid.map((a) => `${a.years}: ${a.reason}`).join(" "),
          },
        },
        {
          "@type": "Question",
          name: `What are the best used ${car.make} ${car.model} years?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: entry.best.map((b) => `${b.years}: ${b.reason}`).join(" "),
          },
        },
      ],
    },
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
            { name: "Cars", href: "/cars" },
            { name: `${car.make} ${car.model}`, href: `/cars/${car.slug}` },
            { name: "Years to avoid" },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">{car.years}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {car.make} {car.model} years to avoid
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By the <Link href="/about" className="font-semibold underline-offset-2 hover:underline">DealScan team</Link> · Updated {entry.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">Quick answer</p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{quickAnswer}</p>
            <Link
              href={`/price-checker?car=${car.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline"
            >
              What is a used {car.make} {car.model} worth? Free price checker
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
            <section className="rounded-2xl border border-[rgba(196,90,74,0.30)] bg-[var(--paper)] p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                <TriangleAlert className="h-6 w-6 text-[var(--danger)]" aria-hidden="true" />
                Years to avoid
              </h2>
              <div className="mt-4 space-y-5">
                {entry.avoid.map((item) => (
                  <div key={item.years}>
                    <h3 className="text-lg font-black text-[var(--danger)]">{item.years}</h3>
                    <p className="mt-1 text-base leading-7 text-[var(--text-body)]">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-2xl font-black leading-tight">
                <CheckCircle2 className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
                Best years to buy
              </h2>
              <div className="mt-4 space-y-5">
                {entry.best.map((item) => (
                  <div key={item.years}>
                    <h3 className="text-lg font-black text-[var(--racing-green)]">{item.years}</h3>
                    <p className="mt-1 text-base leading-7 text-[var(--text-body)]">{item.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 max-w-3xl rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-2xl font-black leading-tight">The bottom line</h2>
            <p className="mt-3 text-base leading-8 text-[var(--text-body)]">{entry.verdict}</p>
            <p className="mt-3 text-base leading-8 text-[var(--text-body)]">
              Year guidance narrows the search, but every used car is its own story. See the full{" "}
              <Link href={`/cars/${car.slug}`} className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                used {car.make} {car.model} buyer check
              </Link>{" "}
              for known issues, mileage guidance, and what to verify before you visit.
            </p>
          </section>

          <section className="mt-8 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-2xl font-black leading-tight">Found a {car.model} listing? Check the actual car.</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
              Paste the ad link or text into the analyzer and DealScan scores the deal, flags year-specific risks when they apply, and lists the questions worth asking this specific seller.
            </p>
            <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
              <SearchCheck className="h-4 w-4" aria-hidden="true" />
              Check a listing free
            </Link>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-black">More on the {car.model}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Link href={`/cars/${car.slug}`} className="card-hover group !p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">Buyer check</p>
                <h3 className="mt-2 text-lg font-black leading-snug">Is a used {car.make} {car.model} a good deal?</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                  Read the check
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
              <Link href="/cars" className="card-hover group !p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">All models</p>
                <h3 className="mt-2 text-lg font-black leading-snug">Buyer checks for {yearsToAvoid.length}+ used models</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                  Browse models
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
