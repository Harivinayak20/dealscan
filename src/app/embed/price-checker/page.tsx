import type { Metadata } from "next";
import Link from "next/link";
import { PriceChecker } from "@/components/PriceChecker";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Used Car Price Checker (Embed)",
  description: "Free used car fair price estimator widget by DealScan.",
  alternates: { canonical: "/embed/price-checker" },
  robots: { index: false, follow: true },
};

export default function EmbedPriceCheckerPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-4 py-5 text-[var(--graphite)]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm font-black tracking-tight">Used car price checker</p>
          <Link href="/price-checker" target="_blank" rel="noopener" className="text-xs font-bold text-[var(--racing-green)] underline-offset-2 hover:underline">
            by DealScan.dev
          </Link>
        </div>

        <PriceChecker embed />

        <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
          <Link href="/price-checker" target="_blank" rel="noopener" className="font-semibold text-[var(--racing-green)] hover:underline">
            Free Used Car Price Checker
          </Link>{" "}
          by DealScan · {appUrl.replace("https://", "")}
        </p>
      </div>
    </main>
  );
}
