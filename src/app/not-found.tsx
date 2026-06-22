import type { Metadata } from "next";
import { ArrowLeft, SearchX } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — DealScan",
  description: "This page does not exist. Use DealScan to check any used car listing in seconds.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5"
          >
            <img
              src="/dealscan-logo.png"
              alt="DealScan"
              width="44"
              height="44"
              className="h-11 w-11 rounded-full"
            />
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

        <section className="py-20 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-[rgba(169,130,83,0.14)]">
            <SearchX className="h-10 w-10 text-[var(--champagne)]" aria-hidden="true" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">Page not found</h1>
          <p className="mt-5 max-w-lg mx-auto text-lg leading-8 text-[var(--text-body)]">
            This page does not exist. If you were trying to check a listing, paste it into the
            analyzer below.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-pill min-w-48">
              Go to Analyzer
            </Link>
            <Link
              href="/guides"
              className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-6 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
            >
              Browse guides
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {[
            { label: "Check a listing", href: "/", note: "Paste any used car listing" },
            { label: "Buyer guides", href: "/guides", note: "20 free used car buying guides" },
            { label: "Car model pages", href: "/cars", note: "Common problems and pricing by model" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-base font-black">{item.label}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{item.note}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
