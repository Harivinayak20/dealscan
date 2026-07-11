import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ReceiptText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  DATA_UPDATED,
  cappedCount,
  highestDocFees,
  lowestDocFees,
  nationalAverageDocFee,
  stateDocFees,
  uncappedCount,
} from "@/lib/state-doc-fees";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

const title = "Used Car Dealer Fees by State (2026): Doc Fee Study | DealScan";
const description =
  "A 50-state + DC data study of used-car dealer documentation fees in 2026: which states cap the doc fee, the 10 highest and 10 lowest states, plus title and registration costs. Free to cite with attribution.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/research/dealer-fees-by-state" },
  openGraph: {
    title,
    description,
    url: `${appUrl}/research/dealer-fees-by-state`,
    type: "article",
  },
};

function money(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export default function DealerFeesByStatePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Used Car Dealer Fees by State (2026)",
      description,
      datePublished: DATA_UPDATED,
      dateModified: DATA_UPDATED,
      author: { "@type": "Organization", name: "DealScan", url: appUrl },
      publisher: { "@type": "Organization", name: "DealScan" },
      mainEntityOfPage: `${appUrl}/research/dealer-fees-by-state`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${appUrl}/` },
        { "@type": "ListItem", position: 2, name: "Research", item: `${appUrl}/research` },
        { "@type": "ListItem", position: 3, name: "Dealer fees by state" },
      ],
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
            href="/research"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Research
          </Link>
        </header>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Research", href: "/research" },
            { name: "Dealer fees by state" },
          ]}
        />

        <section className="py-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <ReceiptText className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            DealScan data study
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used Car Dealer Fees by State (2026)
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            The documentation (&ldquo;doc&rdquo;) fee is the same paperwork task in every state, yet it costs {money(85)} in
            California and nearly {money(1000)} in Florida. We compiled the typical doc fee, the legal cap (where one
            exists), and title and registration costs for all 50 states and DC. Journalists and researchers may cite any
            figure with attribution to DealScan.dev and the date shown.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
              <div className="text-3xl font-black">{money(nationalAverageDocFee)}</div>
              <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">average doc fee across 51 jurisdictions</div>
            </div>
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
              <div className="text-3xl font-black">{cappedCount}</div>
              <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">states cap the doc fee by law</div>
            </div>
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
              <div className="text-3xl font-black">{uncappedCount}</div>
              <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">jurisdictions leave it uncapped</div>
            </div>
          </div>
        </section>

        {/* Key findings */}
        <section className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">Key findings</h2>
          <ul className="mt-4 grid gap-3 text-base leading-7 text-[var(--text-body)]">
            <li>
              <strong>Doc fees vary more than 11x by state.</strong> The typical doc fee runs from {money(85)} in
              California to {money(999)} in Florida for the identical paperwork.
            </li>
            <li>
              <strong>Only {cappedCount} states cap the doc fee by law;</strong> {uncappedCount} states and DC let dealers
              set it themselves. Uncapped states dominate the high end of the table.
            </li>
            <li>
              <strong>Florida, Virginia, Colorado and North Carolina are the priciest,</strong> each averaging {money(699)}
              or more. California, Arkansas, Texas and Minnesota are the cheapest, all at or below {money(150)}.
            </li>
            <li>
              <strong>A legal cap is the single biggest predictor of a low fee.</strong> Seven of the ten lowest-fee states
              cap the doc fee, while every one of the ten highest is uncapped.
            </li>
            <li>
              <strong>Caps move.</strong> Several states (Illinois, Louisiana, Michigan, Missouri, Pennsylvania) index
              their cap to inflation, so the ceiling rises automatically each year.
            </li>
          </ul>
        </section>

        {/* Highest / lowest tables */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
            <h2 className="text-xl font-black">10 highest doc-fee states</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(11,13,16,0.10)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    <th className="py-2 pr-3">#</th>
                    <th className="py-2 pr-3">State</th>
                    <th className="py-2 pr-3">Avg doc fee</th>
                    <th className="py-2">Capped?</th>
                  </tr>
                </thead>
                <tbody>
                  {highestDocFees.map((s, i) => (
                    <tr key={s.abbr} className="border-b border-[rgba(11,13,16,0.05)]">
                      <td className="py-2 pr-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="py-2 pr-3 font-bold">{s.name}</td>
                      <td className="py-2 pr-3">{money(s.docFeeAvg)}</td>
                      <td className="py-2">{s.capped ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
            <h2 className="text-xl font-black">10 lowest doc-fee states</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(11,13,16,0.10)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    <th className="py-2 pr-3">#</th>
                    <th className="py-2 pr-3">State</th>
                    <th className="py-2 pr-3">Avg doc fee</th>
                    <th className="py-2">Capped?</th>
                  </tr>
                </thead>
                <tbody>
                  {lowestDocFees.map((s, i) => (
                    <tr key={s.abbr} className="border-b border-[rgba(11,13,16,0.05)]">
                      <td className="py-2 pr-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="py-2 pr-3 font-bold">{s.name}</td>
                      <td className="py-2 pr-3">{money(s.docFeeAvg)}</td>
                      <td className="py-2">{s.capped ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Full 50-state table */}
        <section className="mt-10 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
          <h2 className="text-2xl font-black tracking-tight">All 50 states + DC</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Typical doc fee, legal cap (if any), and ballpark title and registration costs. Registration is usually
            value-, weight-, or age-based, so those figures are ranges.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-[rgba(11,13,16,0.10)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4">Avg doc fee</th>
                  <th className="py-2 pr-4">Capped by law?</th>
                  <th className="py-2 pr-4">Cap</th>
                  <th className="py-2 pr-4">Title fee</th>
                  <th className="py-2">Registration</th>
                </tr>
              </thead>
              <tbody>
                {stateDocFees.map((s) => (
                  <tr key={s.abbr} className="border-b border-[rgba(11,13,16,0.05)]">
                    <td className="py-2 pr-4 font-bold">{s.name}</td>
                    <td className="py-2 pr-4">{money(s.docFeeAvg)}</td>
                    <td className="py-2 pr-4">
                      {s.capped ? (
                        <span className="font-bold text-[var(--racing-green)]">Yes</span>
                      ) : (
                        <span className="text-[var(--text-muted)]">No</span>
                      )}
                    </td>
                    <td className="py-2 pr-4">{s.capAmount}</td>
                    <td className="py-2 pr-4">{s.titleFee}</td>
                    <td className="py-2 text-[var(--text-muted)]">{s.regNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
            Data as of {DATA_UPDATED}. Cite as &ldquo;DealScan, Used Car Dealer Fees by State, {DATA_UPDATED}.&rdquo;
          </p>
        </section>

        {/* How to fight junk fees */}
        <section className="mt-10 rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <ShieldCheck className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
            How to fight junk fees
          </h2>
          <ul className="mt-4 grid gap-3 text-base leading-7 text-[var(--text-body)]">
            <li>
              <strong>Know your cap.</strong> If your state limits the{" "}
              <Link href="/fees/documentation-fee" className="font-bold underline">documentation fee</Link>, anything above
              the cap on the contract is an error — point it out and it disappears.
            </li>
            <li>
              <strong>Negotiate the out-the-door total, not the fee.</strong> In uncapped states the doc fee is dealer
              profit; offset a high fee with a lower car price instead of arguing the line item.
            </li>
            <li>
              <strong>Watch for duplicates.</strong> An{" "}
              <Link href="/fees/electronic-filing-fee" className="font-bold underline">electronic filing fee</Link> or{" "}
              <Link href="/fees/dealer-prep-fee" className="font-bold underline">dealer prep fee</Link> stacked on top of the
              doc fee often bills you twice for the same paperwork.
            </li>
            <li>
              <strong>Decline the add-ons.</strong>{" "}
              <Link href="/fees/nitrogen-tire-fill" className="font-bold underline">Nitrogen tire fill</Link>,{" "}
              <Link href="/fees/vin-etching" className="font-bold underline">VIN etching</Link>, and{" "}
              <Link href="/fees/paint-and-fabric-protection" className="font-bold underline">paint and fabric protection</Link>{" "}
              are optional; a <Link href="/fees/market-adjustment" className="font-bold underline">market adjustment</Link> is
              negotiable.
            </li>
            <li>
              <Link href="/fees" className="font-bold underline">Browse the full dealer-fee glossary</Link> or{" "}
              <Link href="/fees/states" className="font-bold underline">look up the rules in your state</Link> before you sign.
            </li>
          </ul>
        </section>

        {/* Methodology */}
        <section className="mt-10 max-w-3xl pb-12">
          <h2 className="text-2xl font-black tracking-tight">Methodology</h2>
          <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
            &ldquo;Average doc fee&rdquo; is the typical charged documentation fee in each state from CarEdge&rsquo;s 2026
            dataset. In capped states the average sits at or near the legal cap because dealers charge the maximum
            allowed. Whether a fee is capped, and the cap amount, come from published state statutes as summarized by
            RealCarTips and Edmunds; several caps are indexed to inflation and adjust annually, so we mark those
            &ldquo;(indexed)&rdquo; and recommend verifying the current figure with your state DMV or revenue department.
            Title and registration figures are ballparks aggregated from state DMV fee schedules; registration in most
            states is value-, weight-, or age-based, so those are ranges rather than fixed prices. Figures were compiled
            on {DATA_UPDATED}.
          </p>
          <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
            Sources: CarEdge, &ldquo;Car Dealer Doc Fee by State (2026)&rdquo;; RealCarTips, &ldquo;Average Dealer
            Documentation Fees by State&rdquo;; Edmunds, &ldquo;What New Car Fees Should You Pay?&rdquo;; state DMV fee
            schedules. Press inquiries:{" "}
            <a href="mailto:hello@dealscan.dev" className="font-bold underline">hello@dealscan.dev</a>.
          </p>
          <Link
            href="/fees/states"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]"
          >
            See dealer fees in your state
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </main>
  );
}
