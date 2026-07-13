import type { Metadata } from "next";
import { Accessibility } from "lucide-react";

export const metadata: Metadata = {
  title: "DealScan Accessibility Statement",
  description: "DealScan's commitment to accessibility and how to report accessibility issues.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <Accessibility className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Accessibility
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Accessibility statement.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--text-body)]">
            DealScan is committed to making the analyzer usable by as many people as possible, regardless of ability or technology.
          </p>
        </section>

        <section className="space-y-5 text-sm leading-7 text-[var(--text-body)]">
          {[
            {
              title: "Our approach",
              text: "We aim to meet WCAG 2.1 level AA guidance across the site: semantic HTML, keyboard-navigable controls, visible focus states, and sufficient color contrast.",
            },
            {
              title: "Known limitations",
              text: "Some third-party embeds (ads, affiliate widgets) are outside our direct control and may not fully meet the same standard. We review and replace vendors that fall short.",
            },
            {
              title: "Ongoing work",
              text: "Accessibility is an ongoing effort. We periodically audit new features for keyboard and screen-reader support before and after launch.",
            },
            {
              title: "Report an issue",
              text: "If you encounter an accessibility barrier anywhere on DealScan, email hello@dealscan.dev with the page and a description of the issue. We aim to respond within a few business days.",
            },
          ].map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
              <h2 className="text-lg font-black text-[var(--graphite)]">{item.title}</h2>
              <p className="mt-2">{item.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
