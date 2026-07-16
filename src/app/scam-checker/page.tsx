import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Car Scam Checker — Spot Craigslist & Marketplace Car Scams | DealScan",
  description:
    "Free car scam checker for Craigslist, Facebook Marketplace, and dealer listings. Paste a listing to flag common used car scam signals in seconds — no signup.",
  alternates: { canonical: "/scam-checker" },
  openGraph: {
    title: "Car Scam Checker — Spot Craigslist & Marketplace Car Scams",
    description:
      "Paste any used car listing to check for common scam signals: too-good prices, title issues, and pressure tactics. Free, no signup.",
    url: `${appUrl}/scam-checker`,
    type: "website",
  },
};

const scamSignals = [
  { title: "Price too good to be true", detail: "A price far below market for the year and mileage, with no explanation." },
  { title: "Seller can't meet or won't call", detail: "Insists on wire transfer, shipping, or an 'agent' handling the deal." },
  { title: "Unclear or missing title", detail: "No VIN, no title photo, or vague answers about salvage/rebuilt status." },
  { title: "Urgency and pressure", detail: "\"Must sell today,\" \"already have other buyers,\" cash-only, act now." },
  { title: "Stock or reused photos", detail: "Generic, professional, or duplicate photos instead of real pictures of the car." },
  { title: "Story doesn't add up", detail: "Reason for selling, location, or mileage shifts between messages." },
];

const faqs = [
  {
    q: "How do I check if a Craigslist or Marketplace car listing is a scam?",
    a: "Compare the price to market value — a price far below comparable listings with no explanation is the single strongest scam signal. Then check for red flags in the seller's behavior: refusing to meet in person, insisting on wire transfer or shipping, pushing urgency ('must sell today'), and vague or shifting answers about the title, VIN, or reason for selling.",
  },
  {
    q: "What are the most common used car scam tactics?",
    a: "The classic patterns are: an unrealistically low price to generate contacts, a seller claiming to be out of town or in the military and unable to meet, a request to pay via wire transfer, gift cards, or a payment app before seeing the car, and 'escrow' or 'shipping' services that are actually part of the scam. Legitimate private sellers meet in person and let you inspect the car and title before any money changes hands.",
  },
  {
    q: "Can a scam checker really tell me if a listing is fake?",
    a: "It can flag the patterns that show up in real scam listings — price far under market, vague or missing title details, urgency language, and inconsistent information — and combine them into a single risk read. It cannot confirm a seller's identity or verify a title in real time, so always still meet in person, see the title, and never pay before inspecting the car.",
  },
  {
    q: "Is it safe to buy a car listed far below market price?",
    a: "Be very cautious. A price significantly below market for the year, mileage, and condition is either a mistake, a car with an undisclosed serious problem, or a scam listing designed to collect a deposit before the seller disappears. Ask why directly, and treat vague or evasive answers as a reason to walk away.",
  },
  {
    q: "What should I do if I suspect a listing is a scam?",
    a: "Do not send any money or personal financial information. Report the listing to the platform (Craigslist, Facebook Marketplace, or the marketplace's fraud report tool). If you already sent money, contact your bank or payment provider immediately and file a report with local law enforcement and the FTC.",
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
    { name: "Scam checker" },
  ]),
];

export default function ScamCheckerPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Scam checker" }]} />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Car Scam Checker
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Paste a Craigslist, Facebook Marketplace, or dealer listing and get an instant read on scam signals —
            price too good to be true, title red flags, and pressure tactics — alongside a full deal score.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/#analyzer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Scan this listing
            </Link>
            <span className="text-sm text-[var(--text-muted)]">Free, no signup, results in seconds.</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scamSignals.map((s) => (
              <div key={s.title} className="flex gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-5 shadow-sm">
                <AlertTriangle className="h-5 w-5 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                <div>
                  <div className="text-sm font-bold">{s.title}</div>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">How to spot a used car scam before you get burned</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              Car scam listings follow patterns because the goal is always the same: get a deposit or wire transfer
              before the buyer ever sees the car in person. The two biggest tells are a price noticeably below market
              for the year and mileage, and a seller who cannot or will not meet you face to face. Common cover
              stories include being &quot;out of town,&quot; &quot;in the military,&quot; or using a third-party
              &quot;shipping&quot; or &quot;escrow&quot; service — all designed to keep the transaction remote.
            </p>
            <p>
              Beyond price and meeting logistics, watch the listing text itself. Vague or missing details about the
              title (salvage, rebuilt, or simply undisclosed), no VIN, stock or duplicate photos instead of real
              pictures of the actual car, and pressure language like &quot;must sell today&quot; or &quot;already have
              other buyers lined up&quot; are all classic scam-listing signals, whether the scam is a full fake
              listing or just a seller hiding a real problem with the car.
            </p>
            <p>
              DealScan&apos;s analyzer reads the listing text for exactly these patterns — price versus market,
              title-language ambiguity, urgency and pressure phrasing, and missing information — and rolls them into
              your deal score&apos;s red flags. It will not confirm a seller&apos;s identity or verify a title record for you,
              but it will catch the wording and pricing patterns that show up in scam listings again and again, in
              seconds, before you invest time messaging a seller or driving to see a car that does not exist.
            </p>
            <p>
              If a listing raises multiple flags, do not send money, do not pay a deposit to &quot;hold&quot; the car,
              and insist on meeting in person with the title in hand. Report suspicious listings to the platform they
              were posted on.
            </p>
            <p>
              After you scan a listing, verify further with our{" "}
              <Link href="/vin" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                VIN lookup
              </Link>{" "}
              to check the vehicle&apos;s recorded history, confirm the price with the{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                price checker
              </Link>
              , price out the real total with the{" "}
              <Link href="/otd-calculator" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                out-the-door calculator
              </Link>
              , and see whether the numbers hold up over time with the{" "}
              <Link href="/depreciation" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                depreciation calculator
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <ShieldAlert className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
            Scam checker FAQ
          </h2>
          <dl className="mt-6 grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="flex items-center gap-2 text-lg font-bold text-[var(--graphite)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  {faq.q}
                </dt>
                <dd className="mt-2 text-[15px] leading-7 text-[var(--text-body)]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <div className="rounded-2xl border border-[var(--accent-2-line)] bg-[var(--paper)] p-6 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-7 w-7 text-[var(--racing-green)]" aria-hidden="true" />
            <h2 className="mt-2 text-xl font-black">Not sure about a listing? Scan it first.</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Paste the listing and get your red-flag report in under a minute.
            </p>
            <Link
              href="/#analyzer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--racing-green)] px-6 py-3 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              Run the scam check
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
