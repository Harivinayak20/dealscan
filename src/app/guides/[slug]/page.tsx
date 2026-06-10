import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CarFront, CheckCircle2, SearchCheck } from "lucide-react";
import Link from "next/link";
import { AdUnit } from "@/components/AdUnit";
import { ADSENSE_IN_ARTICLE_SLOT } from "@/lib/adsense";
import { getGuide, guides } from "@/lib/guides";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.hari-vinayak-d.workers.dev";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `${appUrl}/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updatedAt,
    datePublished: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "Dealscan",
    },
    publisher: {
      "@type": "Organization",
      name: "Dealscan",
    },
    mainEntityOfPage: `${appUrl}/guides/${guide.slug}`,
  };

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            Dealscan.dev
          </Link>
          <Link
            href="/guides"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[rgba(11,13,16,0.12)] bg-white px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Guides
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <article className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">{guide.readTime}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">{guide.description}</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
            <div className="space-y-8">
              {guide.sections.map((section, index) => (
                <div key={section.heading}>
                  <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black leading-tight">{section.heading}</h2>
                    <div className="mt-4 space-y-4 text-base leading-8 text-neutral-700">
                      {section.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                  {index === 0 ? (
                    <div className="my-8">
                      <AdUnit slot={ADSENSE_IN_ARTICLE_SLOT} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <aside className="rounded-2xl border border-[rgba(18,61,51,0.16)] bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-lg font-black">Quick checks</h2>
              <ul className="mt-4 grid gap-3">
                {guide.quickChecks.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-neutral-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#analyzer" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
                <SearchCheck className="h-4 w-4" aria-hidden="true" />
                Check a listing
              </Link>
              <p className="mt-4 text-xs leading-5 text-neutral-500">
                Some buyer-tool links on Dealscan may be affiliate links. Deal scores stay independent.
              </p>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
