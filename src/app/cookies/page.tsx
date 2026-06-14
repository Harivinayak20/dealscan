import type { Metadata } from "next";
import { ArrowLeft, CarFront, Cookie, Settings } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealscan Cookie Policy",
  description: "How Dealscan uses local storage, advertising cookies, affiliate links, and third-party ad choices.",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-tight transition hover:-translate-y-0.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--graphite)] text-[var(--ivory)] shadow-lg shadow-black/20">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </span>
            Dealscan.dev
          </Link>
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <Cookie className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Cookies
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Cookie and local storage policy.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--text-body)]">
            The core analyzer works without an account. Some browser storage and advertising technologies may be used when optional features or ads are enabled.
          </p>
        </section>

        <section className="space-y-5 text-sm leading-7 text-[var(--text-body)]">
          {[
            {
              title: "Local storage",
              text: "Dealscan uses browser local storage to keep scan history, saved comparisons, and watchlist items on your device. This helps the dashboard work without requiring an account.",
            },
            {
              title: "Advertising cookies",
              text: "When advertising is enabled, third-party vendors including Google may use cookies to serve ads based on visits to Dealscan or other websites. Google and its partners may use advertising cookies to personalize, measure, and improve ad delivery.",
            },
            {
              title: "Affiliate links",
              text: "Some outbound buyer-tool links may be affiliate links. The destination site may use its own cookies, tracking, and privacy practices after you click through.",
            },
            {
              title: "Your choices",
              text: "You can clear Dealscan local storage in your browser. You can also manage Google ad personalization through Google Ad Settings or opt out of some personalized advertising through industry opt-out tools.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
              <h2 className="text-lg font-black text-[var(--graphite)]">{item.title}</h2>
              <p className="mt-2">{item.text}</p>
            </article>
          ))}

          <div className="rounded-2xl border border-[rgba(169,130,83,0.30)] bg-[var(--paper)] p-6">
            <div className="flex items-start gap-4">
              <Settings className="mt-1 h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
              <p>
                For EEA, UK, and Switzerland visitors, Google requires a certified Consent Management Platform for AdSense. Do not enable ads for those regions until AdSense Privacy &amp; Messaging or another Google-certified CMP is configured in the ad account.
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-[var(--text-body)]">
            Manage Google ad personalization at <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--racing-green)] underline">Google Ad Settings</a>.
            You can also visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--racing-green)] underline">AboutAds choices</a> for participating third-party opt-outs.
          </p>
        </section>
      </div>
    </main>
  );
}
