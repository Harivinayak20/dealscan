import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Gauge, SearchCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { carModels, getCarModel } from "@/lib/car-models";
import { breadcrumbSchema } from "@/lib/schema-builders";
import { compactTitle, truncateMeta } from "@/lib/seo";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type MileagePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return carModels.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: MileagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarModel(slug);
  if (!car) return {};

  const title = compactTitle(
    `How Many Miles Does a ${car.make} ${car.model} Last?`,
    `${car.make} ${car.model} Lifespan & Mileage`,
  );
  const description = truncateMeta(
    `How many miles a used ${car.make} ${car.model} lasts, what mileage is too high, and the maintenance records that matter more than the odometer. ${car.mileageNote}`,
  );

  return {
    title,
    description,
    alternates: { canonical: `/cars/${car.slug}/mileage` },
    openGraph: {
      title,
      description,
      url: `${appUrl}/cars/${car.slug}/mileage`,
      type: "article",
    },
  };
}

export default async function MileagePage({ params }: MileagePageProps) {
  const { slug } = await params;
  const car = getCarModel(slug);
  if (!car) notFound();

  // Reuse the model's existing mileage-related FAQ if present, then add mileage
  // Q&A built from the model's own data — nothing invented.
  const mileageFaq = car.faqs.find((f) => /mileage|miles/i.test(f.q));
  const faqs = [
    {
      q: `How many miles does a ${car.make} ${car.model} last?`,
      a: car.mileageNote,
    },
    ...(mileageFaq
      ? [mileageFaq]
      : [
          {
            q: `What mileage is too high for a used ${car.make} ${car.model}?`,
            a: `There is no single cutoff. ${car.mileageNote} A documented, well-maintained example at higher mileage is usually a safer buy than a neglected low-mileage one.`,
          },
        ]),
    {
      q: `Is a high-mileage ${car.make} ${car.model} worth buying?`,
      a: `${car.quickAnswer}`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `How many miles does a ${car.make} ${car.model} last?`,
      description: car.mileageNote,
      dateModified: car.updatedAt,
      datePublished: car.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/cars/${car.slug}/mileage`,
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
      { name: "Cars", href: "/cars" },
      { name: `${car.make} ${car.model}`, href: `/cars/${car.slug}` },
      { name: "Mileage" },
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
            { name: "Cars", href: "/cars" },
            { name: `${car.make} ${car.model}`, href: `/cars/${car.slug}` },
            { name: "Mileage" },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">{car.years}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            How many miles does a {car.make} {car.model} last?
          </h1>
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            By the{" "}
            <Link href="/about" className="font-semibold underline-offset-2 hover:underline">
              DealScan team
            </Link>{" "}
            · Updated {car.updatedAt}
          </p>

          <div className="mt-6 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--racing-green)]">
              <Gauge className="h-4 w-4" aria-hidden="true" />
              Quick answer
            </p>
            <p className="mt-2 text-base leading-7 text-[var(--text-body)]">{car.mileageNote}</p>
            <Link
              href={`/price-checker?car=${car.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline"
            >
              What is a used {car.make} {car.model} worth? Free price checker
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <section className="mt-8 max-w-3xl">
            <h2 className="text-2xl font-black leading-tight">
              What decides how long a {car.model} lasts
            </h2>
            <p className="mt-3 text-base leading-8 text-[var(--text-body)]">
              With a {car.make} {car.model}, maintenance records matter far more than the number on the
              odometer. The issues below are what actually shorten a {car.model}&apos;s life when they go
              unaddressed — check for them before you judge a car by its mileage.
            </p>
            <ul className="mt-5 grid gap-3">
              {car.knownIssues.map((issue) => (
                <li
                  key={issue}
                  className="flex gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-4 text-[15px] leading-7 text-[var(--text-body)] shadow-sm"
                >
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-[var(--racing-green)]"
                    aria-hidden="true"
                  />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-2xl font-black leading-tight">
              What to verify on a high-mileage {car.model}
            </h2>
            <ul className="mt-4 grid gap-3">
              {car.verify.map((item) => (
                <li key={item} className="flex gap-2 text-[15px] leading-7 text-[var(--text-body)]">
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-[var(--racing-green)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 max-w-3xl">
            <h2 className="text-2xl font-black leading-tight">
              {car.make} {car.model} mileage FAQ
            </h2>
            <div className="mt-5 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-black leading-snug">{faq.q}</h3>
                  <p className="mt-2 text-base leading-8 text-[var(--text-body)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 max-w-3xl rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-2xl font-black leading-tight">
              Found a {car.model} listing? Check the actual car.
            </h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
              Mileage is only half the story — price and history decide the deal. Paste the ad link or text
              into the analyzer and DealScan scores the deal, flags mileage-versus-condition mismatches, and
              lists the questions worth asking this seller.
            </p>
            <Link
              href="/#analyzer"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-6 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
            >
              <SearchCheck className="h-4 w-4" aria-hidden="true" />
              Check a listing free
            </Link>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-black">More on the {car.model}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Link href={`/cars/${car.slug}`} className="card-hover group !p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">
                  Buyer check
                </p>
                <h3 className="mt-2 text-lg font-black leading-snug">
                  Is a used {car.make} {car.model} a good deal?
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                  Read the check
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
              <Link href={`/cars/${car.slug}/years-to-avoid`} className="card-hover group !p-5">
                <p className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">
                  Year guide
                </p>
                <h3 className="mt-2 text-lg font-black leading-snug">
                  {car.make} {car.model} years to avoid
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)]">
                  See the years
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
