import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, SearchCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { stateFees, getStateFee } from "@/lib/state-fees";
import { dealerFees } from "@/lib/dealer-fees";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type StatePageProps = {
  params: Promise<{
    state: string;
  }>;
};

export function generateStaticParams() {
  return stateFees.map((entry) => ({ state: entry.slug }));
}

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const entry = getStateFee(state);

  if (!entry) {
    return {};
  }

  const title = `${entry.name} Used Car Dealer Fees: Doc Fee, Sales Tax & Title (2026) | Dealscan`;
  const description = `What dealer fees to expect on a used car in ${entry.name}: doc fee (${entry.docFee.toLowerCase()}), sales tax (${entry.salesTax.toLowerCase()}), title, and registration, plus which charges to push back on.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/fees/states/${entry.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${appUrl}/fees/states/${entry.slug}`,
      type: "article",
    },
  };
}

export default async function StateFeePage({ params }: StatePageProps) {
  const { state } = await params;
  const entry = getStateFee(state);

  if (!entry) {
    notFound();
  }

  const stateIndex = stateFees.findIndex((s) => s.slug === entry.slug);
  const relatedStates = [1, 2, 3].map((offset) => stateFees[(stateIndex + offset) % stateFees.length]);
  const relatedFees = dealerFees.slice(0, 3);

  const cappedAnswer =
    entry.capped === "Yes"
      ? `Yes. ${entry.name} limits the documentation fee by law: ${entry.docFee.toLowerCase()}. A doc fee above the cap on your contract is a compliance problem — point it out and ask for it to be corrected.`
      : entry.capped === "Partially"
        ? `Partially. ${entry.name}'s rules limit the doc fee in some situations (${entry.docFee.toLowerCase()}). Verify the current rule with the state DMV before signing.`
        : `No. ${entry.name} does not cap the documentation fee, and dealers commonly charge ${entry.docFee.replace("No cap; ", "").toLowerCase()}. The fee itself is rarely dropped, so negotiate the out-the-door total instead.`;

  const faqs = [
    {
      q: `Is the doc fee capped in ${entry.name}?`,
      a: cappedAnswer,
    },
    {
      q: `How much is sales tax on a used car in ${entry.name}?`,
      a: `${entry.salesTax}. Tax is a government charge, not dealer profit — but check that it is calculated on the correct price, with any trade-in credit applied where ${entry.name} allows it.`,
    },
    {
      q: `Which dealer fees can I refuse in ${entry.name}?`,
      a: `Government charges (sales tax, title, registration) are fixed. Everything else — doc fee, dealer prep, VIN etching, paint protection, nitrogen tires, appearance packages — is dealer profit. You may not get individual lines removed, but you can negotiate the out-the-door total down to offset them, or walk away.`,
    },
    {
      q: `What is a fair out-the-door price in ${entry.name}?`,
      a: `Take the agreed vehicle price, add ${entry.name}'s tax (${entry.salesTax.toLowerCase()}), title (~${entry.titleFee.replace("~", "")}), and registration, plus a doc fee in line with ${entry.docFee.toLowerCase()}. If the quote is meaningfully above that math, ask the dealer to walk you through every added line.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${entry.name} used car dealer fees explained`,
      description: `Doc fee, sales tax, title, and registration costs when buying a used car in ${entry.name}.`,
      dateModified: entry.updatedAt,
      datePublished: entry.updatedAt,
      author: {
        "@type": "Person",
        name: "Hari Vinayak",
        url: `${appUrl}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "DealScan",
      },
      mainEntityOfPage: `${appUrl}/fees/states/${entry.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];

  const keyFacts = [
    { label: "Doc fee", value: entry.docFee },
    { label: "Sales tax", value: entry.salesTax },
    { label: "Title fee", value: entry.titleFee },
    { label: "Registration", value: entry.regNote },
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
            href="/fees/states"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            All states
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
            { name: "By state", href: "/fees/states" },
            { name: entry.name },
          ]}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Dealer fees by state</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used car dealer fees in {entry.name}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">
            Buying a used car in {entry.name}, expect a documentation fee ({entry.docFee.toLowerCase()}), sales tax of {entry.salesTax.toLowerCase()}, a title fee around {entry.titleFee.replace("~", "")}, and registration ({entry.regNote.toLowerCase()}). Everything beyond those four lines deserves scrutiny before you sign.
          </p>

          <dl className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <h2 className="text-2xl font-black leading-tight">Frequently asked</h2>
                <div className="mt-4 space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.q}>
                      <h3 className="text-lg font-black leading-snug">{faq.q}</h3>
                      <p className="mt-2 text-base leading-8 text-[var(--text-body)]">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <p className="text-xs leading-5 text-[var(--text-muted)]">
                Figures are typical published amounts as of {entry.updatedAt} and can change with legislation or local rates. Always verify current caps, tax rates, and fees with the {entry.name} DMV or your county before signing.
              </p>
            </div>

            <aside className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Watch for</h2>
              <ul className="mt-4 grid gap-3">
                <li className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>{entry.watchFor}</span>
                </li>
                <li className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>Add-ons pre-loaded on the sticker: etch, protection packages, nitrogen. All negotiable.</span>
                </li>
                <li className="flex gap-2 text-sm leading-6 text-[var(--text-body)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>Fees appearing twice under different names (processing + documentation).</span>
                </li>
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
            <h2 className="text-2xl font-black leading-tight">Nearby reading</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedStates.map((related) => (
                <Link
                  key={related.slug}
                  href={`/fees/states/${related.slug}`}
                  className="group flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
                >
                  <p className="text-xs font-black uppercase text-[var(--racing-green)]">{related.docFee}</p>
                  <h3 className="mt-2 flex-1 text-lg font-black leading-snug">Dealer fees in {related.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--racing-green)]">
                    Read more
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
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
