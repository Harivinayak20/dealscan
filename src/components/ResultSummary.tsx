import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  CarFront,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Download,
  ExternalLink,
  Gauge,
  Info,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  ThumbsUp,
  UserRound,
  Wrench,
} from "lucide-react";
import type { AnalysisMode, AnalyzeListingResult } from "@/lib/analyzer-types";
import { FlagChips } from "@/components/FlagChips";
import { MissingInfoChecklist } from "@/components/MissingInfoChecklist";
import { ScoreRing, scoreTone } from "@/components/ScoreRing";
import { SellerQuestionsCard } from "@/components/SellerQuestionsCard";
import { extractVin } from "@/lib/vin-decoder";
import type { VinDecodeResult } from "@/lib/vin-decoder";
import { generateNegotiationScripts } from "@/lib/generate-scripts";
import { FinancingPanel } from "@/components/FinancingPanel";
import { TCOPanel } from "@/components/TCOPanel";
import { MarketVisualizer } from "@/components/MarketVisualizer";
import { WatchButton } from "@/components/WatchButton";
import { ShareByEmail } from "@/components/ShareByEmail";
import { detectSource } from "@/lib/dealer-detector";
import {
  buildCommonsImageSearchUrl,
  buildVehicleImageQuery,
  getCuratedVehicleImage,
  imageFromCommonsPage,
  type CommonsImagePage,
  type VehicleImage,
} from "@/lib/vehicle-image";

const trustLayerStatements = [
  "Dealscan.dev provides estimates based on listing information, not guarantees.",
  "Always verify title status, inspect the vehicle, and consider a mechanic inspection before buying.",
  "Dealscan.dev extracts public listing pages only when you provide the URL.",
  "Market estimates may vary by location, condition, mileage, and demand.",
];

type ResultSummaryProps = {
  result: AnalyzeListingResult;
  analysisMode: AnalysisMode;
  sourceText: string;
  vehicleTitle: string;
  summary?: string;
  onReset: () => void;
  onAddToCompare?: () => void;
};

function formatRange(low: number | null, high: number | null) {
  if (low === null || high === null) {
    return "Unknown";
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return `${formatter.format(low)} - ${formatter.format(high)}`;
}

function formatMoney(value: number | null) {
  if (value === null) {
    return "Unknown";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function extractPrice(text: string) {
  return text.match(/\$\s?[\d,]+/)?.[0] ?? "Not provided";
}

function extractMileage(text: string) {
  return text.match(/\b\d{1,3}(?:,\d{3})*\s?(?:miles|mi)\b/i)?.[0] ?? "Mileage missing";
}

function titleStatus(text: string) {
  if (/clean title/i.test(text)) {
    return "Clean Title";
  }

  if (/no title|salvage|rebuilt/i.test(text)) {
    return "Title risk";
  }

  return "Verify title";
}

function ownerStatus(text: string) {
  if (/one owner|1 owner/i.test(text)) {
    return "One Owner";
  }

  return "Owner unknown";
}

function MiniMetric({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-neutral-700">
            {label}
            <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-black text-[var(--graphite)]">{value}</div>
          <p className="mt-1 text-sm leading-6 text-neutral-600">{note}</p>
        </div>
        <Icon className="h-7 w-7 text-[var(--racing-green)]" aria-hidden="true" />
      </div>
    </article>
  );
}

function ConditionPill({ label, value, risky = false }: { label: string; value: string; risky?: boolean }) {
  return (
    <div className="flex min-w-36 items-center gap-3 border-r border-neutral-200 px-4 py-3 last:border-r-0">
      {risky ? (
        <CircleAlert className="h-6 w-6 text-[var(--warning)]" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="h-6 w-6 text-[var(--success)]" aria-hidden="true" />
      )}
      <div>
        <div className="text-sm font-black text-[var(--graphite)]">{label}</div>
        <div className={`text-sm font-bold ${risky ? "text-[#7a5615]" : "text-[var(--racing-green)]"}`}>{value}</div>
      </div>
    </div>
  );
}

function ReasonCard({ label, note, score }: { label: string; note: string; score: number }) {
  const tone = scoreTone(score);
  const Icon = score >= 80 ? ThumbsUp : score >= 60 ? Gauge : Wrench;

  return (
    <article className="flex min-h-32 justify-between gap-3 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
      <div>
        <h3 className="text-base font-black leading-6 text-[var(--graphite)]">{label}</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{note}</p>
      </div>
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${tone.soft}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
    </article>
  );
}

export function ResultSummary({ result, sourceText, vehicleTitle, summary, onReset, onAddToCompare }: ResultSummaryProps) {
  const [isCompared, setIsCompared] = useState(false);
  const tone = scoreTone(result.score);
  const Icon = tone.icon;
  const sellerPrice = extractPrice(sourceText);
  const sellerPriceNum = (() => {
    const m = sourceText.match(/\$\s?([\d,]+)/);
    return m ? Number(m[1].replace(/,/g, "")) : null;
  })();
  const mileage = extractMileage(sourceText);
  const mileageNum = (() => {
    const m = sourceText.match(/(\d{1,3}(?:,\d{3})*)\s?(?:miles|mi)/i);
    return m ? Number(m[1].replace(/,/g, "")) : null;
  })();
  const monthlyPayment = sellerPriceNum ? Math.round(sellerPriceNum * 0.016) : 0;
  const title = titleStatus(sourceText);
  const owner = ownerStatus(sourceText);
  const primaryCategories = result.categories.slice(0, 4);
  const detectedVin = extractVin(sourceText);
  const [vinResult, setVinResult] = useState<VinDecodeResult | null>(null);
  const [vinLoading, setVinLoading] = useState(false);
  const makeFromVin = vinResult?.make ?? null;
  const modelFromVin = vinResult?.model ?? null;
  const yearFromVin = vinResult?.year ?? null;
  const titleWords = vehicleTitle.split(/\s+/);
  const detectedYear = yearFromVin || (titleWords[0]?.match(/^(19|20)\d{2}$/) ? titleWords[0] : null);
  const detectedMake = makeFromVin || (titleWords.length > 1 ? titleWords[1] : null);
  const detectedModel = modelFromVin || (titleWords.length > 2 ? titleWords.slice(2).join(" ") : null);
  const vehicleImageQuery = buildVehicleImageQuery({
    year: detectedYear,
    make: detectedMake,
    model: detectedModel,
    vehicleTitle,
  });
  const curatedVehicleImage = getCuratedVehicleImage(vehicleImageQuery);
  const [searchedVehicleImage, setSearchedVehicleImage] = useState<{ query: string; image: VehicleImage | null } | null>(null);
  const [failedVehicleImageUrl, setFailedVehicleImageUrl] = useState("");
  const vehicleImage = curatedVehicleImage ?? (searchedVehicleImage?.query === vehicleImageQuery ? searchedVehicleImage.image : null);
  const vehicleImageFailed = !!vehicleImage && failedVehicleImageUrl === vehicleImage.url;
  const reportHref = `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ vehicleTitle, sourceText, result }, null, 2),
  )}`;

  useEffect(() => {
    let isMounted = true;

    if (!vehicleImageQuery || curatedVehicleImage) return;

    fetch(buildCommonsImageSearchUrl(vehicleImageQuery))
      .then((res) => res.json() as Promise<{ query?: { pages?: Record<string, CommonsImagePage> } }>)
      .then((data) => {
        const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index ?? 999) - (b.index ?? 999));
        const image = pages
          .map((page) => imageFromCommonsPage(page, vehicleImageQuery))
          .find((candidate): candidate is VehicleImage => Boolean(candidate));

        if (isMounted) setSearchedVehicleImage({ query: vehicleImageQuery, image: image ?? null });
      })
      .catch(() => {
        if (isMounted) setSearchedVehicleImage({ query: vehicleImageQuery, image: null });
      });

    return () => {
      isMounted = false;
    };
  }, [vehicleImageQuery, curatedVehicleImage]);

  return (
    <section id="analysis-result" className="min-h-screen bg-[rgba(244,240,232,0.94)] text-[var(--graphite)]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,13,16,0.90)] text-[var(--ivory)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 transition hover:-translate-y-0.5" aria-label="Dealscan.dev home">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--champagne)] text-[var(--graphite)]">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-2xl font-black">
              Dealscan.dev
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm font-bold text-[var(--silver)] transition hover:text-[var(--champagne)] sm:block">
              Dashboard
            </Link>
            <a href="#report" className="hidden text-sm font-bold text-[var(--silver)] transition hover:text-[var(--champagne)] lg:block">
              Report
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">

        <div className="grid gap-4" id="report">
          <section className="animate-fade-in-up rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-4 shadow-[0_22px_60px_-42px_rgba(11,13,16,0.60)] transition hover:shadow-[0_28px_70px_-46px_rgba(11,13,16,0.70)]">
            <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center">
              <div className="relative min-h-28 overflow-hidden rounded-xl bg-[var(--graphite)]">
                {vehicleImage && !vehicleImageFailed ? (
                  <>
                    <img
                      src={vehicleImage.url}
                      alt={vehicleImage.alt}
                      loading="lazy"
                      onError={() => setFailedVehicleImageUrl(vehicleImage.url)}
                      className="h-full min-h-28 w-full object-cover"
                    />
                    <a
                      href={vehicleImage.sourceUrl}
                      className="absolute bottom-2 left-2 right-2 truncate rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold text-white/90 backdrop-blur-sm"
                      title={vehicleImage.credit}
                    >
                      {vehicleImage.credit}
                    </a>
                  </>
                ) : (
                  <div className="grid min-h-28 place-items-center bg-[linear-gradient(135deg,var(--graphite),var(--racing-green))] px-4 text-center text-[var(--ivory)]">
                    <div>
                      <CarFront className="mx-auto h-9 w-9 text-[var(--champagne)]" aria-hidden="true" />
                      <p className="mt-2 text-xs font-black uppercase tracking-wide">
                        {searchedVehicleImage?.query === vehicleImageQuery ? "Vehicle image unavailable" : "Finding vehicle image"}
                      </p>
                      <p className="mt-1 text-xs text-white/70">{vehicleImageQuery || "Add make and model"}</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-black text-[var(--graphite)]">{vehicleTitle}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {sourceText && (() => {
                      const urlMatch = sourceText.match(/https?:\/\/[^\s]+/);
                      if (urlMatch) {
                        const src = detectSource(urlMatch[0]);
                        return <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs font-bold text-neutral-500">{src.icon} {src.name}</span>;
                      }
                      return null;
                    })()}
                  </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-neutral-600">
                  <span className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" aria-hidden="true" />
                    {mileage}
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--success)]" aria-hidden="true" />
                    {title}
                  </span>
                  <span className="flex items-center gap-2">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                    {owner}
                  </span>
                </div>
              </div>
              <div className="grid gap-2 md:justify-items-end">
                <div className="text-sm font-bold text-neutral-600">Seller Price</div>
                <div className="text-3xl font-black text-[var(--graphite)]">{sellerPrice}</div>
                <a
                  href="#listing-source"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[rgba(201,168,106,0.55)] px-5 text-base font-black text-[var(--graphite)] transition hover:-translate-y-0.5 hover:bg-[rgba(201,168,106,0.14)] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]"
                >
                  View Listing
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          {summary ? (
            <section className="animate-fade-in-up rounded-2xl border border-[rgba(201,168,106,0.25)] bg-[rgba(201,168,106,0.08)] px-4 py-3">
              <div className="flex items-start gap-3">
                <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
                <p className="text-base leading-7 text-neutral-700">{summary}</p>
              </div>
            </section>
          ) : null}

          <section className="animate-fade-in-up rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[160px_minmax(0,1fr)]">
              <div className="grid justify-items-center gap-3 text-center">
                <ScoreRing score={result.score} />
                <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-lg font-black ${tone.soft}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {result.verdict}
                </div>
                <p className="text-xs font-bold text-neutral-500">{tone.label} confidence: {result.confidence}</p>
                <p className="mt-1 text-[10px] leading-4 text-neutral-400">Informational only &mdash; verify VIN, title, and inspection yourself.</p>
              </div>
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniMetric
                    label="Fair Price Range"
                    value={formatRange(result.estimatedFairValueRange.low, result.estimatedFairValueRange.high)}
                    note={result.estimatedFairValueRange.note}
                    icon={ShieldCheck}
                  />
                  <MiniMetric label="Seller Price" value={sellerPrice} note="Listing asking price" icon={BadgeDollarSign} />
                  <MiniMetric
                    label="Negotiate Target"
                    value={formatMoney(result.suggestedOfferRange.high)}
                    note={result.suggestedOfferRange.note}
                    icon={Search}
                  />
                  <MiniMetric
                    label="Potential Savings"
                    value={formatMoney(result.suggestedOfferRange.low)}
                    note="Use inspection findings to negotiate"
                    icon={Download}
                  />
                </div>
                <div className="mt-4 rounded-lg border border-[rgba(124,169,130,0.30)] bg-[rgba(124,169,130,0.10)] p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[rgba(124,169,130,0.18)] text-[var(--racing-green)]">
                      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-600">Our Verdict</div>
                      <div className="text-2xl font-black text-[var(--racing-green)]">
                        {result.score >= 80 ? "Buy" : result.score >= 60 ? "Negotiate" : "Wait"}
                      </div>
                    </div>
                    <p className="ml-auto text-sm leading-6 text-neutral-700">{result.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4">
            <FinancingPanel price={sellerPriceNum} />
            <TCOPanel make={detectedMake} year={detectedYear} price={sellerPriceNum} mileage={mileageNum} score={result.score} monthlyPayment={monthlyPayment} />
            <MarketVisualizer price={sellerPriceNum} score={result.score} make={detectedMake} model={detectedModel} year={detectedYear} />
          </div>

          <details className="group rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 shadow-sm">
            <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-lg font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]">
              <Search className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
              Deep Analysis
              <ChevronRight className="ml-auto h-5 w-5 transition group-open:rotate-90" aria-hidden="true" />
            </summary>
            <div className="border-t border-[rgba(11,13,16,0.10)] px-5 py-4">
              <div className="grid gap-4">
                {detectedVin && !vinResult && !vinLoading ? (
                  <section className="rounded-2xl border border-[rgba(52,119,186,0.25)] bg-[rgba(52,119,186,0.08)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-neutral-600">VIN detected</p>
                        <p className="mt-1 font-mono text-sm font-bold text-[var(--graphite)]">{detectedVin}</p>
                      </div>
                      <button
                        onClick={async () => {
                          setVinLoading(true);
                          try {
                            const res = await fetch("/api/decode-vin", {
                              method: "POST",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ vin: detectedVin }),
                            });
                            const data = (await res.json()) as { result: VinDecodeResult };
                            setVinResult(data.result);
                          } catch {
                            setVinResult({
                              vin: detectedVin, make: null, model: null, year: null, trim: null,
                              engine: null, driveType: null, fuelType: null, bodyClass: null, plantCity: null, plantState: null,
                              error: "VIN decode failed.",
                            });
                          } finally {
                            setVinLoading(false);
                          }
                        }}
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--graphite)] px-4 text-sm font-black text-white transition hover:bg-[var(--charcoal)]"
                      >
                        Decode VIN
                      </button>
                    </div>
                  </section>
                ) : null}

                {vinResult ? (
                  <section className="rounded-2xl border border-[rgba(52,119,186,0.25)] bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-neutral-600">VIN Decode</p>
                        <p className="mt-1 font-mono text-sm font-bold text-[var(--graphite)]">{vinResult.vin}</p>
                      </div>
                      <button onClick={() => setVinResult(null)} className="btn-ghost !min-h-0 !px-2 !py-1 !text-xs !font-bold !text-neutral-500 hover:!text-[var(--danger)]">Dismiss</button>
                    </div>
                    {vinResult.error ? (
                      <p className="mt-3 text-sm text-[var(--danger)]">{vinResult.error}</p>
                    ) : (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                        {[
                          { label: "Make", value: vinResult.make },
                          { label: "Model", value: vinResult.model },
                          { label: "Year", value: vinResult.year },
                          { label: "Trim", value: vinResult.trim },
                          { label: "Engine", value: vinResult.engine },
                          { label: "Drive", value: vinResult.driveType },
                          { label: "Fuel", value: vinResult.fuelType },
                          { label: "Body", value: vinResult.bodyClass },
                          { label: "Plant", value: vinResult.plantCity && vinResult.plantState ? `${vinResult.plantCity}, ${vinResult.plantState}` : null },
                        ].filter((r) => r.value).map((r) => (
                          <div key={r.label} className="rounded-lg bg-neutral-50 p-2">
                            <div className="text-xs font-bold text-neutral-600">{r.label}</div>
                            <div className="font-bold text-[var(--graphite)]">{r.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ) : null}

                {vinLoading ? (
                  <section className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="text-sm font-bold text-neutral-600">Decoding VIN...</p>
                  </section>
                ) : null}

                <section aria-label="Condition summary">
                  <div className="flex flex-wrap gap-3">
                    <ConditionPill label="Title" value={title} risky={title !== "Clean Title"} />
                    <ConditionPill label="Accident History" value="Ask seller" risky />
                    <ConditionPill label="Tires" value="Verify" risky={!/new tires/i.test(sourceText)} />
                    <ConditionPill label="Brakes" value="Verify" risky />
                    <ConditionPill label="Interior" value="Review photos" risky />
                    <ConditionPill label="Mechanical" value={result.redFlags.length ? "Check" : "Good"} risky={result.redFlags.length > 0} />
                  </div>
                </section>

                <section id="saved-cars">
                  <h3 className="text-base font-black text-[var(--graphite)]">Why this score?</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {primaryCategories.map((category) => (
                      <ReasonCard key={category.label} label={category.label} note={category.note} score={category.score} />
                    ))}
                  </div>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                  <FlagChips title="Red flags" flags={result.redFlags} tone="red" />
                  <FlagChips title="Green flags" flags={result.greenFlags} tone="green" />
                </div>

                <MissingInfoChecklist items={result.missingInfo} />
                <div id="seller-questions">
                  <SellerQuestionsCard questions={result.sellerQuestions} />
                </div>

                <NegotiationScriptsSection result={result} sourceText={sourceText} />

                <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 text-base leading-7 text-neutral-600">
                  <h3 className="text-base font-black text-[var(--graphite)]">Trust notes</h3>
                  <div className="mt-3 grid gap-2">
                    {trustLayerStatements.map((statement) => (
                      <p key={statement}>{statement}</p>
                    ))}
                  </div>
                </section>

                <section id="listing-source" className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4">
                  <h3 className="text-base font-black text-[var(--graphite)]">Listing text</h3>
                  <p className="mt-2 max-h-24 overflow-auto rounded-lg bg-[rgba(244,240,232,0.72)] p-3 text-sm leading-6 text-neutral-700">
                    {sourceText || "No listing text was provided."}
                  </p>
                </section>
              </div>
            </div>
          </details>

          <div className="flex flex-wrap gap-3">
            <WatchButton result={result} vehicleTitle={vehicleTitle} sourceText={sourceText} price={sellerPriceNum} />
            <a
              href={reportHref}
              download={`${vehicleTitle.replaceAll(" ", "-").toLowerCase()}-report.json`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 text-base font-black text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-md"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Report
            </a>
            <ShareByEmail vehicleTitle={vehicleTitle} score={result.score} />
            <button
              onClick={() => window.print()}
              className="btn-secondary no-print"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              PDF
            </button>
            <button
              type="button"
              disabled={isCompared || !onAddToCompare}
              onClick={() => {
                if (onAddToCompare) {
                  setIsCompared(true);
                  onAddToCompare();
                }
              }}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 text-base font-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-60 ${
                isCompared
                  ? "border-[rgba(124,169,130,0.55)] bg-[rgba(124,169,130,0.12)] text-[var(--racing-green)]"
                  : "border-[rgba(201,168,106,0.55)] bg-white text-[var(--graphite)] hover:bg-[rgba(201,168,106,0.14)]"
              }`}
            >
              {isCompared ? (
                <><CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Compared</>
              ) : (
                <><ShoppingCart className="h-5 w-5" aria-hidden="true" /> Compare</>
              )}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--graphite)] px-5 text-base font-black text-[var(--ivory)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--charcoal)] hover:shadow-md"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              New Scan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function NegotiationScriptsSection({ result, sourceText }: { result: AnalyzeListingResult; sourceText: string }) {
  const scripts = generateNegotiationScripts(result, sourceText);
  const items: { label: string; script: string }[] = [
    { label: "Text message", script: scripts.text },
    { label: "Formal email", script: scripts.email },
    { label: "In-person script", script: scripts.inPerson },
  ];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  return (
    <details className="group rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)] open:ring-2 open:ring-[rgba(201,168,106,0.25)]">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-lg font-black text-[var(--graphite)] transition hover:text-[var(--racing-green)]">
        <Wrench className="h-5 w-5 text-[var(--champagne)]" aria-hidden="true" />
        Negotiation Scripts
        <ChevronRight className="ml-auto h-5 w-5 transition group-open:rotate-90" aria-hidden="true" />
      </summary>
      <div className="border-t border-[rgba(11,13,16,0.10)] px-5 py-4">
        <div className="grid gap-4">
          {items.map(({ label, script }, i) => (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-black uppercase text-neutral-500">{label}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(script);
                    setCopiedIndex(i);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }}
                  className="btn-ghost !min-h-0 !rounded-lg !px-3 !py-1.5 !text-xs !font-bold"
                >
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-wrap rounded-xl bg-[rgba(244,240,232,0.72)] p-4 text-base leading-7 text-neutral-700">{script}</p>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
