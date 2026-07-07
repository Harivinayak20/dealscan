import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, SearchCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { dealerFees, getDealerFee } from "@/lib/dealer-fees";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type FeePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return dealerFees.map((fee) => ({ slug: fee.slug }));
}

export async function generateMetadata({ params }: FeePageProps): Promise<Metadata> {
  const { slug } = await params;
  const fee = getDealerFee(slug);

  if (!fee) {
    return {};
  }

  return {
    title: fee.title,
    description: fee.description,
    alternates: {
      canonical: `/fees/${fee.slug}`,
    },
    openGraph: {
      title: fee.title,
      description: fee.description,
      url: `${appUrl}/fees/${fee.slug}`,
      type: "article",
    },
  };
}

export default async function FeePage({ params }: FeePageProps) {
  const { slug } = await params;
  const fee = getDealerFee(slug);

  if (!fee) {
    notFound();
  }

  const feeIndex = dealerFees.findIndex((f) => f.slug === fee.slug);
  const relatedFees = [1, 2, 3].map((offset) => dealerFees[(feeIndex + offset) % dealerFees.length]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: fee.title,
      description: fee.description,
      dateModified: fee.updatedAt,
      datePublished: fee.updatedAt,
      author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
      publisher: {
        "@type": "Organization",
        name: "DealScan",
      },
      mainEntityOfPage: `${appUrl}/fees/${fee.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: fee.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
    breadcrumbSchema([
      { name: "Home", href: "/" },
      { name: "Dealer fees", href: "/fees" },
      { name: fee.name },
    ]),
  ];

  const keyFacts = [
    { label: "Typical cost", value: fee.typicalRange },
    { label: "Mandatory?", value: fee.mandatory },
    { label: "Negotiable?", value: fee.negotiable },
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
            href="/fees"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            All fees
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Dealer fees", href: "/fees" },
            { name: fee.name },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Dealer fee glossary</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {fee.name}
          </h1>
          {fee.aka.length > 0 ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Also called: {fee.aka.join(", ")}
            </p>
          ) : null}
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">{fee.shortAnswer}</p>

          <dl className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-4 shadow-sm">
                <dt className="text-xs font-black uppercase tracking-wide text-[var(--racing-green)]">{fact.label}</dt>
                <dd className="mt-2 text-base font-bold leading-6 text-[var(--text-body)]">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <div className="space-y-8">
              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">What it is</h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-[var(--text-body)]">
                  {fee.whatItIs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
                <h2 className="text-2xl font-black leading-tight">Frequently asked</h2>
                <div className="mt-4 space-y-6">
                  {fee.faqs.map((faq) => (
                    <div key={faq.q}>
                      <h3 className="text-lg font-black leading-snug">{faq.q}</h3>
                      <p className="mt-2 text-base leading-8 text-[var(--text-body)]">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Watch for</h2>
              <ul className="mt-4 grid gap-3">
                {fee.watchFor.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                Check your quote
              </Link>
              <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                Paste an offer sheet into DealScan to flag padded fees and add-ons before you sign.
              </p>
            </aside>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-black leading-tight">More dealer fees</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedFees.map((related) => (
                <Link
                  key={related.slug}
                  href={`/fees/${related.slug}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
                >
                  <p className="text-xs font-black uppercase text-[var(--racing-green)]">{related.typicalRange}</p>
                  <h3 className="mt-2 flex-1 text-lg font-black leading-snug">{related.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                    Read more
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
