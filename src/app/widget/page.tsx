import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CheckCircle2, ExternalLink, Gauge, SearchCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WidgetEmbedBlock } from "@/components/WidgetEmbedBlock";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Free Used Car Deal Checker Widget for Your Site",
  description:
    "Embed DealScan's free used car deal checker widget on your site in one line of code. Built for credit unions, dealership blogs, personal-finance sites, and car-buying courses.",
  alternates: {
    canonical: "/widget",
  },
  openGraph: {
    title: "Free Used Car Deal Checker Widget for Your Site",
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

          <div className="mt-12 rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black">
              <BarChart3 className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
              Backed by real scan data
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-body)]">
              The widget draws from the same analysis engine that powers the <Link href="/research" className="font-bold underline">DealScan Index</Link> — aggregate statistics from thousands of real used-car scans, refreshed daily. Your visitors get market-backed answers, not guesses.
            </p>
            <Link
              href="/research"
              className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[var(--racing-green)] underline-offset-4 hover:underline"
            >
              See the data <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-[var(--racing-green)]">
                <Gauge className="mx-auto h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-2 text-sm font-bold">Deal score 0–100</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">Know instantly if the price is fair</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-[var(--racing-green)]">
                <SearchCheck className="mx-auto h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-2 text-sm font-bold">Red flag detection</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">Title issues, mileage, risk language</div>
            </div>
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 text-center shadow-sm">
              <div className="text-2xl font-black text-[var(--racing-green)]">
                <CheckCircle2 className="mx-auto h-7 w-7" aria-hidden="true" />
              </div>
              <div className="mt-2 text-sm font-bold">Negotiation guidance</div>
              <div className="mt-1 text-xs text-[var(--text-muted)]">Suggested offer range and talking points</div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--accent-2-line)] bg-[rgba(183,96,58,0.04)] p-6 shadow-sm">
            <h2 className="text-lg font-black">What the widget gives your audience that KBB and Carfax don&apos;t</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6">
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <span><strong>Score any listing</strong> — paste a URL or ad text, no VIN required. Works on Facebook Marketplace, Craigslist, CarGurus, dealer sites.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <span><strong>17 red-flag and 12 green-flag patterns</strong> — catches title problems, mileage discrepancies, seller transparency, and positive proof points others miss.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <span><strong>Completely free, no paywall</strong> — unlimited scans, no account required, no credit card. Visits &ldquo;sign up to see the price&rdquo; tools stay on your page.</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <span><strong>Attribution link back to your site</strong> — the iframe credit says &ldquo;Powered by DealScan.dev&rdquo; so your visitors know you gave them the tool.</span>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-black tracking-tight">Copy-paste embed code</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--text-body)]">
              Paste this wherever your CMS accepts raw HTML. It renders the widget at a max width of 640px and links back to DealScan.dev underneath.
            </p>
            <WidgetEmbedBlock snippet={embedSnippet} previewSrc={`${appUrl}/embed/price-checker`} />
          </div>

          <div className="mt-12 rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
            <h2 className="text-lg font-black">Why is the widget free?</h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-[var(--text-body)]">
              <p>
                DealScan makes money from optional affiliate partnerships and a <Link href="/pricing" className="font-semibold underline-offset-2 hover:underline">Pro plan</Link> for high-volume users — not from hiding the tool behind a paywall. The free widget builds awareness and helps more buyers, which improves the data behind the
                DealScan Index. No upsell modal, no email capture, no credit card required. It stays free.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
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
