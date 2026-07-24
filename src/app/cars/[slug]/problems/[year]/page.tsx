import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, CircleAlert, SearchCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { allProblemPages, neighborYears, problemPageData } from "@/lib/problem-pages";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type ProblemPageProps = {
  params: Promise<{ slug: string; year: string }>;
};

export function generateStaticParams() {
  return allProblemPages().map(({ slug, year }) => ({ slug, year: String(year) }));
}

export async function generateMetadata({ params }: ProblemPageProps): Promise<Metadata> {
  const { slug, year: yearParam } = await params;
  const year = Number(yearParam);
  const data = Number.isInteger(year) ? problemPageData(slug, year) : null;
  if (!data) return {};

  const name = `${data.year} ${data.car.make} ${data.car.model}`;
  const title = `${name} Problems: Known Issues & What to Check`;
  const description = data.avoid
    ? `The ${data.year} falls in the documented ${data.avoid.years} trouble range: ${data.avoid.reason.slice(0, 110)}`
    : `No widespread ${data.year}-specific problems are documented for the ${data.car.make} ${data.car.model}. Here's what to verify on any individual car before buying.`;

  return {
    title,
    description,
    // 734 near-identical year pages were consuming crawl budget for 19 impressions
    // across 90 days. Kept live for users and internal links, out of the index.
    robots: { index: false, follow: true },
    alternates: { canonical: `/cars/${slug}/problems/${data.year}` },
    openGraph: { title, description, url: `${appUrl}/cars/${slug}/problems/${data.year}`, type: "article" },
  };
}

export default async function ProblemYearPage({ params }: ProblemPageProps) {
  const { slug, year: yearParam } = await params;
  const year = Number(yearParam);
  const data = Number.isInteger(year) ? problemPageData(slug, year) : null;
  if (!data) notFound();

  const { car, avoid, best, modelVerdict, knownIssues, verify } = data;
  const name = `${data.year} ${car.make} ${car.model}`;
  const neighbors = neighborYears(slug, data.year);

  const answer = avoid
    ? `The ${name} sits inside the documented ${avoid.years} trouble range: ${avoid.reason}`
    : best
      ? `The ${name} is in a documented sweet spot (${best.years}): ${best.reason}`
      : `No widespread, year-specific problem is documented for the ${name}. That makes the individual car's history — not the model year — the thing to judge.`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${name} Problems`,
      description: answer.slice(0, 160),
      dateModified: data.updatedAt,
      datePublished: data.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/cars/${slug}/problems/${data.year}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Does the ${name} have problems?`,
          acceptedAnswer: { "@type": "Answer", text: answer },
        },
        {
          "@type": "Question",
          name: `What should I check before buying a used ${car.make} ${car.model}?`,
          acceptedAnswer: { "@type": "Answer", text: verify.join(" ") },
        },
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
            { name: `${data.year} problems` },
          ]}
        />

        <article className="py-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Known issues by model year</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {name} problems: what&apos;s documented, what to check
          </h1>

          <p className="mt-5 max-w-3xl rounded-2xl border border-[rgba(169,130,83,0.25)] bg-[rgba(169,130,83,0.08)] px-5 py-4 text-lg leading-8 text-[var(--text-body)]">
            {answer}
          </p>

          {avoid ? (
            <section className="mt-8 max-w-3xl rounded-2xl border border-[rgba(196,90,74,0.30)] bg-[rgba(196,90,74,0.06)] p-5">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <CircleAlert className="h-5 w-5 text-[var(--danger)]" aria-hidden="true" />
                Why {avoid.years} is a documented trouble range
              </h2>
              <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{avoid.reason}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                A documented range is a probability, not a verdict on every car. A {data.year} with records proving the
                known issue was addressed can still be a good buy — at the right price.
              </p>
            </section>
          ) : null}

          {best ? (
            <section className="mt-6 max-w-3xl rounded-2xl border border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.08)] p-5">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <CheckCircle2 className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
                {best.years}: a documented sweet spot
              </h2>
              <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{best.reason}</p>
            </section>
          ) : null}

          <section className="mt-10 max-w-3xl">
            <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <Wrench className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
              Known {car.make} {car.model} issues to ask about
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {knownIssues.map((issue) => (
                <li key={issue} className="flex items-start gap-3 text-base leading-7 text-[var(--text-body)]">
                  <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-[var(--warning)]" aria-hidden="true" />
                  {issue}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 max-w-3xl">
            <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <SearchCheck className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
              Verify these on the specific car
            </h2>
            <ul className="mt-4 grid gap-2.5">
              {verify.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-7 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-8 max-w-3xl text-base leading-7 text-[var(--text-body)]">{modelVerdict}</p>

          <div className="mt-8 rounded-2xl border border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.10)] p-5">
            <div className="flex flex-wrap items-center gap-4">
              <p className="flex-1 text-base font-bold leading-7 text-[var(--text-body)]">
                Found a {name} for sale? Paste the listing and get a free deal score, red flags, and a negotiation plan.
              </p>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--graphite)] px-6 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Scan the listing
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <nav className="mt-10 flex flex-wrap gap-2 text-sm">
            <Link href={`/cars/${car.slug}/years-to-avoid`} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 font-bold transition hover:border-[var(--champagne)]">
              All {car.model} years to avoid
            </Link>
            <Link href={`/cars/${car.slug}/${data.year}-value`} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 font-bold transition hover:border-[var(--champagne)]">
              {data.year} {car.model} value
            </Link>
            {neighbors.map((y) => (
              <Link key={y} href={`/cars/${car.slug}/problems/${y}`} className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 font-bold transition hover:border-[var(--champagne)]">
                {y} problems
              </Link>
            ))}
          </nav>

          <p className="mt-8 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
            Sourced from DealScan&apos;s curated model research (updated {data.updatedAt}). Issue ranges summarize widely
            reported patterns, not a guarantee about any individual vehicle &mdash; always pair with a history report and a
            pre-purchase inspection.
          </p>
        </article>
      </div>
    </main>
  );
}
