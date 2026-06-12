import type { Metadata } from "next";
import { ArrowLeft, CarFront, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dealscan Disclaimer and Limitation of Liability",
  description: "Liability policy for Dealscan: estimates only, no warranties, buyer responsibility, and limitation of liability.",
};

const sections = [
  {
    title: "Estimates, not facts",
    text: "Deal scores, fair-value ranges, suggested offers, flags, and all other outputs are automated estimates generated from the listing information you provide. They can be wrong, incomplete, or outdated, especially when a listing is vague, inaccurate, or intentionally misleading.",
  },
  {
    title: "Not professional advice",
    text: "Dealscan does not provide mechanical, legal, financial, insurance, tax, lending, or appraisal advice. Nothing on this site is a substitute for a licensed mechanic's pre-purchase inspection, a vehicle history report, a title search, or professional legal or financial counsel.",
  },
  {
    title: "Your purchase decisions are yours",
    text: "You are solely responsible for any decision to contact a seller, visit a vehicle, negotiate, or purchase. Always independently verify VIN, title status, liens, mileage, accident history, recalls, and mechanical condition before paying for a vehicle.",
  },
  {
    title: "No warranties",
    text: "Dealscan is provided free of charge, as is and as available, without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, accuracy, and non-infringement. We do not warrant that the service will be uninterrupted, error-free, or secure.",
  },
  {
    title: "Limitation of liability",
    text: "To the maximum extent permitted by law, Dealscan and its operator are not liable for any direct, indirect, incidental, consequential, special, exemplary, or punitive damages — including money lost on a vehicle purchase, repair costs, lost profits, or data loss — arising from your use of, or inability to use, this site, even if advised of the possibility of such damages. Where liability cannot be excluded, it is limited to the amount you paid to use Dealscan, which is zero.",
  },
  {
    title: "Third-party sites and sellers",
    text: "Dealscan links to third-party marketplaces, tools, and resources and analyzes listings created by third-party sellers. We do not control and are not responsible for third-party content, conduct, products, or transactions. Dealscan is not a party to any transaction between you and a seller.",
  },
  {
    title: "Indemnity",
    text: "You agree to hold Dealscan and its operator harmless from claims arising out of your vehicle purchases, your interactions with sellers, or your violation of these terms.",
  },
  {
    title: "Changes",
    text: "We may update this policy as the product evolves. The version published on this page is the one in effect. Questions: hello@dealscan.dev.",
  },
];

export default function DisclaimerPage() {
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
            className="flex min-h-11 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[var(--paper)] px-4 text-base font-black shadow-sm transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Analyzer
          </Link>
        </header>

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,106,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <ShieldAlert className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Disclaimer
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Disclaimer and limitation of liability.
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--text-body)]">
            Dealscan is a free research tool. Use it to ask better questions, not as the final word on any car.
          </p>
        </section>

        <section className="space-y-5 text-sm leading-7 text-[var(--text-body)]">
          {sections.map(({ title, text }) => (
            <div key={title} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
              <h2 className="text-base font-black text-[var(--graphite)]">{title}</h2>
              <p className="mt-2">{text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
