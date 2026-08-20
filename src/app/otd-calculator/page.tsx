import type { Metadata } from "next";
import Link from "next/link";
import { OtdCalculator } from "@/components/OtdCalculator";
import { breadcrumbSchema } from "@/lib/schema-builders";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Out-the-Door Car Price Calculator",
  description:
    "Free out the door price calculator. Add sales tax, doc fee, and title & registration by state to any vehicle price for a real out-the-door total — trade-in included, no signup.",
  alternates: { canonical: "/otd-calculator" },
  openGraph: {
    title: "Out-the-Door Price Calculator — Free Used Car OTD Estimate",
    description:
      "See the true out-the-door price of a car: vehicle price plus sales tax, doc fee, and title & registration by state. Free, no signup.",
    url: `${appUrl}/otd-calculator`,
    type: "website",
  },
};

const faqs = [
  {
    q: "What is an out-the-door price?",
    a: "The out-the-door (OTD) price is the total you actually pay to drive away: the vehicle price plus sales tax and all mandatory fees — documentation, title, and registration — minus any trade-in credit. It is the only number worth comparing between dealers, because a low sticker with high fees can cost more than a higher sticker with low fees.",
  },
  {
    q: "How do you calculate the out-the-door price?",
    a: "Start with the agreed vehicle price. Subtract your trade-in value if you have one, then apply your state (and any local) sales tax rate to the taxable amount. Add the dealer documentation fee, the title fee, and the registration/plate cost. The sum is your out-the-door price. This calculator does all of that using typical fee figures for your state.",
  },
  {
    q: "Is sales tax charged before or after the trade-in?",
    a: "In most states, sales tax is applied after the trade-in credit, so trading in a car lowers your tax bill. A few states tax the full purchase price regardless. This calculator applies tax to the price after the trade-in; if your state does not give trade-in tax credit, add the difference back manually.",
  },
  {
    q: "Are the doc and registration fees exact?",
    a: "No. Documentation fees are set by each dealer (capped by law in some states), and registration is often based on the vehicle's value, weight, or age. We pre-fill typical figures for your state from our dealer-fee data and let you override the doc fee. Always confirm the exact numbers on your paperwork and with your state DMV.",
  },
  {
    q: "Why is the out-the-door price higher than the advertised price?",
    a: "The advertised price rarely includes tax, doc fees, title, and registration, which commonly add 8–15% on top. Some dealers also add optional add-ons. Asking for the out-the-door price in writing before you visit is the single best way to avoid surprises at signing.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DealScan Out-the-Door Price Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${appUrl}/otd-calculator`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Free out-the-door price calculator that adds state sales tax, doc fee, title, and registration to a vehicle price.",
  },
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
    { name: "Out-the-door price calculator" },
  ]),
];

export default function OtdCalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free car buying tool</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Out-the-Door Price Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            The sticker price is not what you pay. Enter a vehicle price and your state to see the real out-the-door
            total — sales tax, doc fee, title, and registration, itemized — with trade-in credit factored in. No email,
            no signup.
          </p>

          <div className="mt-8">
            <OtdCalculator />
          </div>
        </section>

        <section className="max-w-3xl pb-6">
          <h2 className="text-2xl font-black tracking-tight">Why the out-the-door price is the only number that matters</h2>
          <div className="mt-4 grid gap-4 text-[15px] leading-7 text-[var(--text-body)]">
            <p>
              When you shop for a used car, the advertised price is only the starting point. By the time you sign, the
              dealer has added sales tax, a documentation (doc) fee, a title fee, and registration or plate costs.
              Together these routinely add 8 to 15 percent on top of the sticker — sometimes more in states with high
              uncapped doc fees. The <strong>out-the-door price</strong> is the single figure that captures all of it:
              what actually leaves your bank account to drive the car home.
            </p>
            <p>
              That is why comparing sticker prices between dealers is misleading. One dealer can advertise a lower price
              and then pad it with a $900 doc fee and questionable add-ons, while another lists slightly higher but keeps
              fees lean. Only the out-the-door total tells you which deal is genuinely cheaper. Smart buyers ask every
              dealer for the OTD price in writing before setting foot on the lot, then compare those numbers side by
              side.
            </p>
            <p>
              This calculator builds that number for you. Choose your state and we pre-fill the typical sales tax rate,
              documentation fee, title fee, and registration estimate from our{" "}
              <Link href="/fees" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                state dealer-fee data
              </Link>
              . Enter the vehicle price and, optionally, a trade-in value and a local tax rate. Because most states apply
              sales tax after the trade-in credit, entering your trade-in also lowers the tax you owe. You can override
              the doc fee with the exact figure from your quote to get a precise total.
            </p>
            <p>
              Keep in mind these are estimates. Documentation fees are set by each dealer — capped by law in states like
              California and New York, uncapped in states like Florida and Virginia. Registration is frequently based on
              the vehicle&apos;s value, weight, or age, so the figure here is a ballpark. Always confirm the exact numbers
              on your contract and with your state DMV. Use this tool to sanity-check a quote and spot padding, not as a
              binding calculation.
            </p>
            <p>
              Once you have an out-the-door number you are comfortable with, check whether the car itself is a good deal.
              Run the listing through our free{" "}
              <Link href="/" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                deal analyzer
              </Link>{" "}
              for a 0–100 score, estimate a fair value with the{" "}
              <Link href="/price-checker" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                price checker
              </Link>
              , and look up any unfamiliar line item in our{" "}
              <Link href="/fees" className="font-semibold text-[var(--racing-green)] underline-offset-2 hover:underline">
                dealer fee glossary
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl border-t border-[var(--border-subtle)] py-10">
          <h2 className="text-2xl font-black tracking-tight">Out-the-door price FAQ</h2>
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
