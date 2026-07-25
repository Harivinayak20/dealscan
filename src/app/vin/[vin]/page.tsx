import type { Metadata } from "next";
import { ArrowRight, CircleAlert, Fuel, ShieldCheck, Wrench } from "lucide-react";
import Link from "next/link";
import { VinLookupForm } from "@/components/VinLookupForm";
import { buildVinReport, isValidVin } from "@/lib/vin-report";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

// Every request hits live NHTSA/EPA APIs (with per-call timeouts), so render on demand.
export const dynamic = "force-dynamic";

type VinPageProps = {
  params: Promise<{ vin: string }>;
};

function vehicleName(decode: { year: string | null; make: string | null; model: string | null; trim: string | null }): string | null {
  if (!decode.make || !decode.model) return null;
  return [decode.year, decode.make, decode.model, decode.trim].filter(Boolean).join(" ");
}

export async function generateMetadata({ params }: VinPageProps): Promise<Metadata> {
  const { vin: raw } = await params;
  const vin = decodeURIComponent(raw).trim().toUpperCase();

  if (!isValidVin(vin)) {
    return { title: "VIN Lookup", robots: { index: false } };
  }

  const report = await buildVinReport(vin);
  const name = vehicleName(report.decode);
  const title = name ? `${name} VIN ${vin} — Specs, Recalls, Safety & MPG | DealScan` : `VIN ${vin} Lookup | DealScan`;
  const description = name
    ? `Free VIN report for this ${name}: factory specs, ${report.recalls ? `${report.recalls.length} NHTSA recall${report.recalls.length === 1 ? "" : "s"}` : "recall lookup"}, crash-test ratings, and EPA fuel economy. No signup.`
    : `VIN ${vin} could not be fully decoded. Try the free DealScan VIN lookup for specs, recalls, and safety ratings.`;

  return {
    title,
    description,
    alternates: { canonical: `/vin/${vin}` },
    // Only ask search engines to index pages with a real decoded vehicle on them.
    robots: name ? undefined : { index: false },
    openGraph: { title, description, url: `${appUrl}/vin/${vin}`, type: "article" },
  };
}

export default async function VinReportPage({ params }: VinPageProps) {
  const { vin: raw } = await params;
  const vin = decodeURIComponent(raw).trim().toUpperCase();
  const valid = isValidVin(vin);
  const report = valid ? await buildVinReport(vin) : null;
  const name = report ? vehicleName(report.decode) : null;

  const jsonLd = name
    ? {
        "@context": "https://schema.org",
        "@type": "Car",
        name,
        vehicleIdentificationNumber: vin,
        brand: report?.decode.make ? { "@type": "Brand", name: report.decode.make } : undefined,
        model: report?.decode.model ?? undefined,
        vehicleModelDate: report?.decode.year ?? undefined,
        url: `${appUrl}/vin/${vin}`,
      }
    : null;

  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-5xl">

        {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}

        <section className="py-10">
          {!valid || !report ? (
            <>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight">That doesn&apos;t look like a valid VIN</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--text-body)]">
                A VIN is exactly 17 characters and never contains the letters I, O, or Q. Check the listing (or the
                driver-side door jamb) and try again.
              </p>
              <div className="mt-8">
                <VinLookupForm />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--racing-green)]">Free VIN report</p>
              <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                {name ?? `VIN ${vin}`}
              </h1>
              <p className="mt-2 font-mono text-sm tracking-wider text-[var(--text-muted)]">VIN {vin}</p>
              {report.decode.error ? (
                <p className="mt-4 max-w-2xl rounded-xl border border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.10)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--text-body)]">
                  <CircleAlert className="mr-1 inline h-4 w-4 text-[var(--warning)]" aria-hidden="true" />
                  The government decoder could not fully identify this VIN ({report.decode.error}). Some sections may be
                  empty — double-check the VIN against the car.
                </p>
              ) : null}

              <div className="mt-6 rounded-2xl border border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.10)] p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="flex-1 text-base font-bold leading-7 text-[var(--text-body)]">
                    Looking at a listing for this car? Get a free 0-100 deal score, red flags, and a negotiation plan in
                    about 30 seconds.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--graphite)] px-6 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Scan the listing
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {report.specs.length > 0 ? (
                <section className="mt-10">
                  <h2 className="text-2xl font-black tracking-tight">Factory specifications</h2>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Decoded from the NHTSA vPIC database.</p>
                  <dl className="mt-4 grid gap-x-8 gap-y-3 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm sm:grid-cols-2">
                    {report.specs.map((spec) => (
                      <div key={spec.label} className="flex items-baseline justify-between gap-4 border-b border-[rgba(11,13,16,0.06)] pb-2">
                        <dt className="text-sm font-bold text-[var(--text-muted)]">{spec.label}</dt>
                        <dd className="text-right text-sm font-black">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
                  <Wrench className="h-6 w-6 text-[var(--warning)]" aria-hidden="true" />
                  Safety recalls
                </h2>
                {report.recalls === null ? (
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-body)]">
                    Recall lookup is unavailable right now. Check{" "}
                    <a href={`https://www.nhtsa.gov/recalls?vin=${vin}`} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                      NHTSA.gov recalls
                    </a>{" "}
                    directly with this VIN.
                  </p>
                ) : report.recalls.length === 0 ? (
                  <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--text-body)]">
                    No NHTSA recalls found for this model year. Still ask the seller whether all service campaigns were
                    completed.
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                      {report.recalls.length} recall{report.recalls.length === 1 ? "" : "s"} filed for this model year.
                      Ask the seller for proof each was repaired — recall work is free at franchised dealers.
                    </p>
                    <ul className="mt-4 grid gap-3">
                      {report.recalls.map((recall) => (
                        <li key={recall.campaignNumber} className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-4 shadow-sm">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-base font-black">{recall.component}</h3>
                            <span className="font-mono text-xs text-[var(--text-muted)]">
                              {recall.campaignNumber}
                              {recall.reportedDate ? ` · ${recall.reportedDate}` : ""}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{recall.summary}</p>
                          {recall.remedy ? (
                            <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                              <strong>Fix:</strong> {recall.remedy}
                            </p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
                  <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <ShieldCheck className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
                    NHTSA crash-test ratings
                  </h2>
                  {report.safety ? (
                    <dl className="mt-3 grid gap-2 text-sm">
                      {[
                        ["Overall", report.safety.overall],
                        ["Frontal crash", report.safety.frontalCrash],
                        ["Side crash", report.safety.sideCrash],
                        ["Rollover", report.safety.rollover],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-baseline justify-between border-b border-[rgba(11,13,16,0.06)] pb-1.5">
                          <dt className="font-bold text-[var(--text-muted)]">{label}</dt>
                          <dd className="font-black">{value ? `${value} / 5 stars` : "Not rated"}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
                      No NHTSA crash-test rating is published for this exact model year.
                    </p>
                  )}
                  {report.safety?.variantDescription ? (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">Rated variant: {report.safety.variantDescription}</p>
                  ) : null}
                </section>

                <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
                  <h2 className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <Fuel className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
                    EPA fuel economy
                  </h2>
                  {report.fuelEconomy ? (
                    <>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                        {[
                          ["City", report.fuelEconomy.city],
                          ["Highway", report.fuelEconomy.highway],
                          ["Combined", report.fuelEconomy.combined],
                        ].map(([label, value]) => (
                          <div key={label as string} className="rounded-xl border border-[rgba(11,13,16,0.08)] bg-[var(--ivory)] p-3">
                            <div className="text-2xl font-black">{value ?? "—"}</div>
                            <div className="text-xs font-bold text-[var(--text-muted)]">{label} MPG</div>
                          </div>
                        ))}
                      </div>
                      {report.fuelEconomy.matchedTrim ? (
                        <p className="mt-2 text-xs text-[var(--text-muted)]">Closest EPA match: {report.fuelEconomy.matchedTrim}</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
                      No EPA fuel-economy match found for this model. Check{" "}
                      <a href="https://www.fueleconomy.gov" target="_blank" rel="noopener noreferrer" className="font-bold underline">
                        fueleconomy.gov
                      </a>
                      .
                    </p>
                  )}
                </section>
              </div>

              <p className="mt-10 max-w-3xl text-xs leading-5 text-[var(--text-muted)]">
                Data sources: NHTSA vPIC (specifications), NHTSA recall and safety-rating databases, and EPA
                fueleconomy.gov. A VIN report describes the vehicle as built — it is not a title, accident, or odometer
                history. Pair it with a vehicle history report and an independent inspection, and run the listing through
                the free <Link href="/" className="font-bold underline">DealScan deal analyzer</Link> before you negotiate.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
