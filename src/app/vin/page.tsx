import type { Metadata } from "next";
import { FileSearch, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { VinLookupForm } from "@/components/VinLookupForm";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export const metadata: Metadata = {
  title: "Free VIN Lookup: Specs, Recalls & Safety Ratings",
  description:
    "Free VIN check with no signup. Decode any 17-character VIN for vehicle specs, open NHTSA recalls, crash-test ratings, and EPA fuel economy.",
  alternates: { canonical: "/vin" },
  openGraph: {
    title: "Free VIN Lookup — Specs, Recalls, Safety Ratings & MPG",
    description:
      "Decode any VIN free: factory specs, open recalls, crash-test ratings, and MPG. No email, no signup, no upsell wall.",
    url: `${appUrl}/vin`,
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DealScan Free VIN Lookup",
  applicationCategory: "AutomotiveBusiness",
  operatingSystem: "Web",
  url: `${appUrl}/vin`,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free VIN decoder with factory specs, open NHTSA recalls, crash-test ratings, and EPA fuel economy for any US-market vehicle.",
};

export default function VinLookupPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="py-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free VIN check — no signup</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Look up any VIN: specs, recalls, safety ratings, and MPG
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
            Paste the 17-character VIN from a listing, a door jamb, or a windshield. We decode it against official
            government data — no email, no credit card, no report paywall.
          </p>

          <div className="mt-8">
            <VinLookupForm />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
              <FileSearch className="h-6 w-6 text-[var(--champagne)]" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-black">Factory specs</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-body)]">
                Engine, transmission, drivetrain, body style, horsepower, and where the car was built — straight from the
                NHTSA vPIC database.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
              <Wrench className="h-6 w-6 text-[var(--warning)]" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-black">Open recalls</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-body)]">
                Every NHTSA safety recall filed for the model year — ask the seller for proof each one was fixed before
                you buy.
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
              <ShieldCheck className="h-6 w-6 text-[var(--racing-green)]" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-black">Safety &amp; MPG</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--text-body)]">
                NHTSA crash-test star ratings and EPA city/highway fuel economy, so you know what the car costs to live
                with.
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
            Where the data comes from: vehicle specs are decoded by the NHTSA vPIC service, recalls and crash-test ratings
            come from NHTSA safety databases, and fuel economy comes from the EPA (fueleconomy.gov). A VIN lookup shows
            what the car <em>is</em> — it is not a title or accident history report. For ownership history pair it with a
            history report, and for the actual deal, paste the listing into the{" "}
            <Link href="/" className="font-bold underline">
              DealScan analyzer
            </Link>{" "}
            for a free deal score.
          </p>
        </section>
      </div>
    </main>
  );
}
