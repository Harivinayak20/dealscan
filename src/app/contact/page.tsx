import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact DealScan for product questions, corrections, advertising questions, and partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <Mail className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Contact
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Questions, corrections, and partnerships.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--text-body)]">
            Email DealScan for product support, content corrections, advertising questions, and buyer-tool partnership inquiries.
          </p>
        </section>

        <section className="grid gap-4">
          <a
            href="mailto:hello@dealscan.dev"
            className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent-2-soft)] text-[var(--racing-green)] transition group-hover:bg-[var(--racing-green)] group-hover:text-white">
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-black">hello@dealscan.dev</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  Include the listing URL, screenshot, or guide page if your message is about a specific analysis or content correction.
                </p>
              </div>
            </div>
          </a>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent-2-soft)] text-[var(--racing-green)]">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-black">Buyer safety note</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                  DealScan does not sell vehicles, broker purchases, hold deposits, or represent sellers. Always verify title, VIN, payment, and inspection details directly before buying a car.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
