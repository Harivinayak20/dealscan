import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gauge } from "lucide-react";
import Link from "next/link";
import { getShare } from "@/lib/share-storage";
import { ShareResultActions } from "./ShareResultActions";

export const dynamic = "force-dynamic";

function verdictColor(verdict: string): string {
  if (verdict === "Great Deal") return "#3f8a5b";
  if (verdict === "Decent Deal") return "#b98a38";
  if (verdict === "Proceed with Caution") return "#b4501f";
  return "#c0492f";
}

function money(value: number | null): string | null {
  if (value === null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function range(low: number | null, high: number | null): string | null {
  const formattedLow = money(low);
  const formattedHigh = money(high);
  return formattedLow && formattedHigh ? `${formattedLow} - ${formattedHigh}` : null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const share = await getShare(token);

  if (!share) {
    return { title: "Share Not Found | DealScan", robots: { index: false, follow: false } };
  }

  const { payload } = share;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
  const shareUrl = `${baseUrl}/s/${token}`;
  const imageUrl = `${baseUrl}/api/og?token=${token}`;

  return {
    title: `${payload.vehicle} | ${payload.verdict} (${payload.score}/100)`,
    description: payload.summary,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${payload.vehicle} | ${payload.verdict} (${payload.score}/100)`,
      description: payload.summary,
      url: shareUrl,
      type: "website",
      siteName: "DealScan",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${payload.vehicle} DealScan result` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${payload.vehicle} | ${payload.verdict} (${payload.score}/100)`,
      description: payload.summary,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await getShare(token);
  if (!share) notFound();

  const { payload, createdAt, expiresAt } = share;
  const color = verdictColor(payload.verdict);
  const fairValue = range(payload.fairValueLow, payload.fairValueHigh);
  const suggestedOffer = range(payload.suggestedOfferLow, payload.suggestedOfferHigh);
  const context = [
    payload.askingPrice !== null ? { label: "Asking price", value: money(payload.askingPrice) } : null,
    fairValue ? { label: "Estimated fair range", value: fairValue } : null,
    suggestedOffer ? { label: "Suggested offer", value: suggestedOffer } : null,
    payload.mileage !== null ? { label: "Mileage", value: `${payload.mileage.toLocaleString("en-US")} mi` } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item?.value));

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]">
            DealScan
          </Link>
          <span className="text-xs text-[var(--text-muted)]">
            Shared {new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </header>

        <article className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm">
          <header>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: color, color }}>
              <Gauge className="h-3 w-3" aria-hidden="true" />
              {payload.verdict}
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <h1 className="text-2xl font-black leading-tight sm:text-3xl">{payload.vehicle}</h1>
              <div className="shrink-0 text-right" style={{ color }}>
                <span className="text-4xl font-black">{payload.score}</span>
                <span className="text-sm font-bold">/100</span>
              </div>
            </div>
          </header>

          <p className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--ivory)] p-4 text-base leading-7">
            {payload.summary}
          </p>

          {context.length ? (
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {context.map((item) => (
                <div key={item.label} className="rounded-xl border border-[var(--border-subtle)] p-4">
                  <dt className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{item.label}</dt>
                  <dd className="mt-1 text-lg font-black">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <section className="mt-5" aria-labelledby="reasons-heading">
            <h2 id="reasons-heading" className="text-sm font-black uppercase tracking-wide">Why it received this score</h2>
            <ul className="mt-3 grid gap-3">
              {payload.reasons.map((reason) => (
                <li key={reason} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--ivory)] p-4 text-sm leading-6">
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-5 rounded-xl border border-[var(--accent-2-line)] bg-[rgba(183,96,58,0.05)] p-4 text-sm leading-6 text-[var(--text-body)]">
            <strong>Automated estimate, not an inspection.</strong> DealScan reads listing information and cannot verify the vehicle, title, history, or condition. Verify those independently before making an offer.
          </div>

          <ShareResultActions token={token} />
        </article>

        <footer className="mt-6 text-center text-xs leading-5 text-[var(--text-muted)]">
          <p>This link expires {new Date(expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.</p>
          <p>
            <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link> ·{" "}
            <a href={`mailto:hello@dealscan.dev?subject=${encodeURIComponent(`Takedown request for share ${token}`)}`} className="underline">Request takedown</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
