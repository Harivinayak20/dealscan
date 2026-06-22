"use client";

import { ArrowLeft, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
            <TriangleAlert className="h-10 w-10 text-[var(--champagne)]" aria-hidden="true" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-5xl">
            Something went wrong
          </h1>
          <p className="mt-5 max-w-md mx-auto text-lg leading-8 text-[var(--text-body)]">
            DealScan ran into an unexpected error. Try again or head back to the analyzer.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={reset} className="btn-pill min-w-48">
              Try again
            </button>
            <Link
              href="/"
              className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-6 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
            >
              Go to Analyzer
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
