import type { Metadata } from "next";
import Link from "next/link";
import { InspectionChecklist } from "@/components/InspectionChecklist";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema-builders";
import { totalChecklistItems } from "@/lib/inspection-checklist";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Used Car Inspection Checklist — Free Interactive & Printable | DealScan",
  description:
    `Free used car inspection checklist with ${totalChecklistItems} items across exterior, interior, engine, test drive, and paperwork. Interactive with progress tracking, or print it for the lot.`,
  alternates: { canonical: "/inspection-checklist" },
  openGraph: {
    title: "Used Car Inspection Checklist — Free Interactive & Printable",
    description:
      "A complete used car inspection checklist you can check off online or print and take to the lot. Free, no signup.",
    url: `${appUrl}/inspection-checklist`,
    type: "website",
  },
};

const faqs = [
  {
    q: "What should I check when inspecting a used car?",
    a: "Cover five areas: the exterior (panel gaps, paint match, rust, tires, glass), the interior (wear vs. mileage, electronics, smells), the engine bay (fluids, leaks, belts, hoses), a full test drive (starting, shifting, braking, steering, noises), and the paperwork (title, VIN match, history report, recalls, maintenance records). This checklist walks through all five with 40 specific items.",
  },
  {
    q: "How long does a proper used car inspection take?",
    a: "A thorough self-inspection with a test drive typically takes 45–60 minutes. A professional pre-purchase inspection (PPI) at a mechanic's shop usually takes 1–2 hours and costs $100–$200, which is worth it for any car you're seriously considering.",
  },
  {
    q: "Can I use this checklist instead of a mechanic's inspection?",
    a: "Use it as a first pass to decide whether a car is worth pursuing, but it does not replace a professional pre-purchase inspection. A mechanic can put the car on a lift, check for frame damage, read diagnostic codes, and catch issues that are impossible to see or hear during a test drive.",
  },
  {
    q: "Does the checklist save my progress?",
    a: "Yes. Your checked items are saved in your browser automatically, so you can close the page and come back to the same listing later. Nothing is uploaded or shared — it stays on your device. Use Reset to start over for a new car.",
  },
  {
    q: "What do I do after finishing the inspection checklist?",
    a: "If the car passes inspection, confirm the price is fair before you make an offer. Paste the listing into DealScan for a 0-100 deal score and a fair offer range, so you walk into the negotiation knowing both the car's condition and the numbers.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  },
  breadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Inspection checklist" },
  ]),
];

export default function InspectionChecklistPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="print:hidden">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Inspection checklist" }]} />
        </div>

        <section className="py-10 print:hidden">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Used Car Inspection Checklist
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            {totalChecklistItems} items across exterior, interior, engine, test drive, and paperwork. Check them off
            on your phone at the lot, or print the whole list before you go — your progress is saved automatically.
          </p>
        </section>

        <section className="pb-10">
          <InspectionChecklist />
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10 print:hidden">
          <h2 className="text-2xl font-black tracking-tight">Why a checklist beats a gut feeling</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              It is easy to be swayed by a clean interior and a friendly seller and forget to check the things that
              actually cost money later: uneven tire wear, a transmission that hesitates, or a title that does not
              quite match the VIN. A written checklist keeps you disciplined even when the car looks great, because
              the sellers who are hiding something are usually the ones with the nicest presentation.
            </p>
            <p>
              This checklist is organized the way a mechanic would walk a car: exterior first (panel gaps and paint
              match reveal prior accident repair), then interior (wear should match the odometer), then the engine
              bay (fluids and leaks are the cheapest things to check and the most expensive to ignore), then a real
              test drive (shifting, braking, steering, and highway noise), and finally the paperwork that protects you
              after you buy.
            </p>
            <p>
              Work through it item by item, in person, before you commit to buying. If several items in one section
              fail, that section is telling you something — a car that fails several exterior checks likely has
              undisclosed accident history; a car that fails several engine checks likely has deferred maintenance.
              Either way, that is leverage for negotiating the price or a reason to walk away entirely.
            </p>
            <p>
              A checklist tells you about the car&apos;s condition. It does not tell you whether the asking price is
              fair. Once you have inspected the car, paste the listing into{" "}
              <Link href="/#analyzer" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                DealScan&apos;s analyzer
              </Link>{" "}
              for a 0–100 deal score, confirm the number with the{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                price checker
              </Link>
              , decode the vehicle&apos;s history with the{" "}
              <Link href="/vin" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                VIN lookup
              </Link>
              , add taxes and fees with the{" "}
              <Link href="/otd-calculator" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                out-the-door calculator
              </Link>
              , and check long-term value with the{" "}
              <Link href="/depreciation" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                depreciation calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10 print:hidden">
          <h2 className="text-2xl font-black tracking-tight">Inspection checklist FAQ</h2>
          <dl className="mt-6 grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="text-lg font-bold text-[var(--graphite)]">{faq.q}</dt>
                <dd className="mt-2 text-[15px] leading-7 text-[var(--text-body)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
