import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { changelog } from "@/lib/changelog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Changelog — What's New on DealScan",
  description:
    "Everything we've shipped to make used-car buying more transparent: new tools, data, and pages, in the open, dated.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: "DealScan Changelog",
    description: "Everything we ship to make used-car buying more transparent, in the open, dated.",
    url: `${appUrl}/changelog`,
    type: "website",
  },
};

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Built in the open</p>
          <h1 className="mt-2 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Changelog</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Everything we ship to make used-car buying more transparent — dated, in plain English. Have a feature
            request? <Link href="/contact" className="font-bold underline">Tell us</Link>.
          </p>

          <ol className="mt-10 grid gap-8">
            {changelog.map((entry) => (
              <li key={entry.date + entry.title} className="relative rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-6 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <Sparkles className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
                    {entry.title}
                  </h2>
                  <time dateTime={entry.date} className="text-sm font-bold text-[var(--text-muted)]">
                    {formatDate(entry.date)}
                  </time>
                </div>
                <ul className="mt-3 grid list-disc gap-2 pl-5">
                  {entry.items.map((item) => (
                    <li key={item} className="text-base leading-7 text-[var(--text-body)]">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
