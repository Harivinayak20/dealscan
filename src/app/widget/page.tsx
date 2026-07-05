import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Free Used Car Deal Checker Widget for Your Site | Dealscan",
  description:
    "Embed DealScan's free used car deal checker widget on your site in one line of code. Built for credit unions, dealership blogs, personal-finance sites, and car-buying courses.",
  alternates: {
    canonical: "/widget",
  },
  openGraph: {
    title: "Free Used Car Deal Checker Widget for Your Site | Dealscan",
    description: "Embed DealScan's free used car deal checker widget on your site in one line of code.",
    url: `${appUrl}/widget`,
    type: "website",
  },
};

const audiences = [
  {
    name: "Credit unions",
    detail: "Give auto-loan members an unbiased second opinion before they sign, right on your member resources page.",
  },
  {
    name: "Dealership blogs",
    detail: "Show shoppers you have nothing to hide by letting them check any listing, including your own.",
  },
  {
    name: "Personal-finance sites",
    detail: "Slot it into car-buying or budgeting posts as a practical tool readers can use immediately.",
  },
  {
    name: "Car-buying course creators",
    detail: "Give students a hands-on tool to apply what they're learning to a real listing.",
  },
];

const embedSnippet = `<iframe
  src="${appUrl}/embed/price-checker"
  title="DealScan used car price checker"
  width="100%"
  height="720"
  style="border:0; border-radius:12px; max-width:640px;"
  loading="lazy"
></iframe>
<p style="font-size:12px; margin-top:8px;">
  Powered by <a href="${appUrl}" target="_blank" rel="noopener">DealScan.dev</a>
</p>`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Free used car deal checker widget for your site",
  description: "Embed DealScan's free used car deal checker widget on your site in one line of code.",
  dateModified: "2026-07-03",
  datePublished: "2026-07-03",
  author: { "@type": "Organization", name: "DealScan", url: `${appUrl}/about` },
  publisher: {
    "@type": "Organization",
    name: "DealScan",
  },
  mainEntityOfPage: `${appUrl}/widget`,
};

export default function WidgetPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <img src="/dealscan-logo.png" alt="DealScan" width="44" height="44" className="h-11 w-11 rounded-full" />
            DealScan.dev
          </Link>
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Home
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Embed DealScan" },
          ]}
        />

        <section className="py-12">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">Free widget</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Put a free used car deal checker widget on your site
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-body)]">
            DealScan&apos;s price checker widget lets any visitor paste in a used car listing and instantly see whether the price is fair. Drop it into a page with one iframe, no signup or API key required, and give your audience a genuinely useful tool instead of another outbound link.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {audiences.map((a) => (
              <div
                key={a.name}
                className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm"
              >
                <h2 className="flex items-center gap-2 text-lg font-black leading-snug">
                  <CheckCircle2 className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
                  {a.name}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{a.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-black tracking-tight">Copy-paste embed code</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--text-body)]">
              Paste this wherever your CMS accepts raw HTML. It renders the widget at a max width of 640px and links back to DealScan.dev underneath.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--charcoal)] p-5 text-sm leading-6 text-[#e8e2d4]">
              <code>{embedSnippet}</code>
            </pre>
          </div>

          <div className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Want a custom size, color match, or full deal-check widget?</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
              Email us and we&apos;ll help you get it set up, free of charge.
            </p>
            <a
              href="mailto:harivinayak20402@gmail.com?subject=DealScan widget"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--racing-green)] px-5 text-base font-black text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              Email us about the widget
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
