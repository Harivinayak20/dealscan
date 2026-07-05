import type { Metadata } from "next";
import { ArrowLeft, BarChart3, Database, LineChart } from "lucide-react";
import Link from "next/link";
import { getIndexStats } from "@/lib/research";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// Live numbers straight from D1 on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DealScan Research — Real Data from Real Used-Car Scans",
  description:
    "The DealScan Index: aggregate statistics from real used-car listing scans — verdict rates, most-scanned models, and median asking prices. Free to cite with attribution.",
  alternates: { canonical: "/research" },
  openGraph: {
    title: "DealScan Research & Index",
    description: "Aggregate statistics from real used-car listing scans. Free to cite with attribution.",
    url: `${appUrl}/research`,
    type: "website",
  },
};

const VERDICT_LABELS: Record<string, string> = {
  good_deal: "scored as good deals",
  fair_deal: "scored as fair deals",
  risky_deal: "flagged risky",
  avoid: "scored avoid",
  needs_review: "needed review",
};

function money(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export default async function ResearchPage() {
  const stats = await getIndexStats();

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-4xl">
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
            Analyzer
          </Link>
        </header>

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">The DealScan Index</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            What real used-car listings look like, in numbers
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Every scan on DealScan feeds an anonymized dataset: scores, verdicts, models, and asking prices — never
            people. This page reports live aggregates. Journalists and researchers may cite any figure with attribution
            to DealScan.dev and the date shown.
          </p>

          {!stats ? (
            <div className="mt-10 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <Database className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
                The index is warming up
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[var(--text-body)]">
                Index figures publish automatically once enough scans have accumulated to be statistically meaningful.
                Every scan you run contributes — <Link href="/" className="font-bold underline">analyze a listing</Link>{" "}
                and check back.
              </p>
              <h3 className="mt-6 text-sm font-black uppercase tracking-wide text-[var(--text-muted)]">What will be reported</h3>
              <ul className="mt-2 grid gap-2 text-base leading-7 text-[var(--text-body)]">
                <li>— Share of listings scored as good deals vs. flagged risky or avoid</li>
                <li>— Most-scanned models and their median asking prices</li>
                <li>— Average deal score across all scanned listings</li>
                <li>— Price-drop behavior on re-scanned listings (from listing memory)</li>
              </ul>
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
                  <div className="text-3xl font-black">{stats.totalScans.toLocaleString("en-US")}</div>
                  <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">listings scanned</div>
                </div>
                <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
                  <div className="text-3xl font-black">{stats.listingsTracked.toLocaleString("en-US")}</div>
                  <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">unique cars in listing memory</div>
                </div>
                <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 text-center shadow-sm">
                  <div className="text-3xl font-black">{stats.averageScore ?? "—"}</div>
                  <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">average deal score / 100</div>
                </div>
              </div>

              <section className="mt-8 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <BarChart3 className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
                  Verdict distribution
                </h2>
                <ul className="mt-4 grid gap-2">
                  {stats.verdictMix.map((v) => (
                    <li key={v.verdict} className="flex items-center gap-3">
                      <span className="w-14 shrink-0 text-right text-lg font-black">{v.share}%</span>
                      <span className="h-3 rounded-full bg-[var(--champagne)]" style={{ width: `${Math.max(2, v.share)}%` }} aria-hidden="true" />
                      <span className="text-sm text-[var(--text-body)]">{VERDICT_LABELS[v.verdict] ?? v.verdict}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {stats.medianAskingByModel.length > 0 ? (
                <section className="mt-8 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
                  <h2 className="flex items-center gap-2 text-xl font-black">
                    <LineChart className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
                    Median asking prices (most-scanned models)
                  </h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[rgba(11,13,16,0.10)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                          <th className="py-2 pr-4">Model</th>
                          <th className="py-2 pr-4">Median asking</th>
                          <th className="py-2">Sample</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.medianAskingByModel.map((row) => (
                          <tr key={`${row.make}-${row.model}`} className="border-b border-[rgba(11,13,16,0.05)]">
                            <td className="py-2 pr-4 font-bold">{row.make} {row.model}</td>
                            <td className="py-2 pr-4">{money(row.median)}</td>
                            <td className="py-2 text-[var(--text-muted)]">{row.sample} listings</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              <p className="mt-6 text-xs leading-5 text-[var(--text-muted)]">
                Data as of {stats.generatedAt}. Aggregates of anonymized scan activity on DealScan.dev; samples reflect
                DealScan users, not the whole US market. Cite as &quot;DealScan Index, {stats.generatedAt}&quot;.
              </p>
            </>
          )}

          <section className="mt-10 max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight">Methodology</h2>
            <p className="mt-3 text-base leading-7 text-[var(--text-body)]">
              DealScan scores public used-car listings 0-100 from the listing&apos;s own text: price vs. estimated fair
              range, mileage for age, title language, transparency, and risk phrases. The index aggregates those scans
              — no names, emails, IPs, or exact locations are stored with scan data. Listing memory tracks unique cars
              (by VIN or listing URL) to measure price drops and time on market. Press inquiries:{" "}
              <a href="mailto:hello@dealscan.dev" className="font-bold underline">hello@dealscan.dev</a>.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
