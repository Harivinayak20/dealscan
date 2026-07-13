import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeDollarSign,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Gauge,
  RotateCcw,
  Search,
  ShoppingCart,
  ThumbsUp,
  UserRound,
  Wrench,
} from "lucide-react";
import type { AnalysisMode, AnalyzeListingResult } from "@/lib/analyzer-types";
import type { ListingMemory, MarketContext } from "@/lib/listing-memory";
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
import { ChallengeShareButton } from "@/components/ChallengeShareButton";
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
  "DealScan.dev provides estimates based on listing information, not guarantees.",
  "Always verify title status, inspect the vehicle, and consider a mechanic inspection before buying.",
  "DealScan.dev extracts public listing pages only when you provide the URL.",
  "Market estimates may vary by location, condition, mileage, and demand.",
];

type ResultSummaryProps = {
  result: AnalyzeListingResult;
  analysisMode: AnalysisMode;
  sourceText: string;
  vehicleTitle: string;
  summary?: string;
  listingMemory?: ListingMemory | null;
  marketContext?: MarketContext | null;
  sourceUrl?: string;
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
  return text.match(/\b\d{1,3}(?:,\d{3})*\s?(?:miles|mi)\b/i)?.[0] ?? "Mileage not listed";
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

function ReasonCard({ label, note, score }: { label: string; note: string; score: number }) {
  const tone = scoreTone(score);
  const Icon = score >= 80 ? ThumbsUp : score >= 60 ? Gauge : Wrench;

  return (
    <article className="flex min-h-32 justify-between gap-3 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
      <div>
        <h3 className="text-base font-black leading-6 text-[var(--graphite)]">{label}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">{note}</p>
      </div>
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border ${tone.soft}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
    </article>
  );
}

export function ResultSummary({ result, sourceText, vehicleTitle, summary, listingMemory, marketContext, sourceUrl, onReset, onAddToCompare }: ResultSummaryProps) {
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
  const fairLow = result.estimatedFairValueRange.low;
  const fairHigh = result.estimatedFairValueRange.high;
  const priceVsFair = (() => {
    if (!sellerPriceNum || fairLow === null || fairHigh === null) return null;
    if (sellerPriceNum > fairHigh) return { text: `${formatMoney(sellerPriceNum - fairHigh)} above fair range`, good: false };
    if (sellerPriceNum < fairLow) return { text: `${formatMoney(fairLow - sellerPriceNum)} below fair range`, good: true };
    return { text: "Within fair range", good: true };
  })();
  const potentialSavings =
    sellerPriceNum && result.suggestedOfferRange.low !== null && sellerPriceNum > result.suggestedOfferRange.low
      ? sellerPriceNum - result.suggestedOfferRange.low
      : null;

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
      <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[rgba(244,240,232,0.88)] text-[var(--graphite)] backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => {
              onReset();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="DealScan.dev home"
            className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--graphite)]"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[var(--racing-green)]"
            />
            DealScan
          </button>
          <div className="flex items-center gap-1">
            <Link href="/dashboard" className="rounded-md px-2.5 py-1.5 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--graphite)]">
              My scans
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="ml-1 inline-flex items-center rounded-full bg-[var(--racing-green)] px-4 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              New scan
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">

        <div className="grid gap-4" id="report">
          <section className="animate-fade-in-up overflow-hidden rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/92 shadow-[0_22px_60px_-42px_rgba(11,13,16,0.60)]">
            <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
              <div className="grid justify-items-center gap-3 text-center md:border-r md:border-[var(--border-subtle)] md:pr-6">
                <ScoreRing score={result.score} />
                <div className={`inline-flex items-center gap-2 rounded-lg border px-4 py-1.5 text-base font-black ${tone.soft}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {result.verdict}
                </div>
                <p className="text-xs font-bold text-[var(--text-muted)]">Confidence: {result.confidence}</p>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {sourceText && (() => {
                    const urlMatch = sourceText.match(/https?:\/\/[^\s]+/);
                    if (urlMatch) {
                      const src = detectSource(urlMatch[0]);
                      return <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border-subtle)] bg-neutral-50 px-2 py-0.5 text-xs font-bold text-[var(--text-muted)]">{src.icon} {src.name}</span>;
                    }
                    return null;
                  })()}
                  <a href="#listing-source" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-muted)] underline-offset-2 transition hover:text-[var(--racing-green)] hover:underline">
                    View listing text
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
                <div className="mt-2 flex items-start gap-4">
                  <h1 className="min-w-0 flex-1 text-2xl font-black leading-tight text-[var(--graphite)] sm:text-3xl">{vehicleTitle}</h1>
                  {vehicleImage && !vehicleImageFailed ? (
                    <a
                      href={vehicleImage.sourceUrl}
                      title={vehicleImage.credit}
                      className="hidden shrink-0 overflow-hidden rounded-xl border border-[var(--border-subtle)] sm:block"
                    >
                      <img
                        src={vehicleImage.url}
                        alt={vehicleImage.alt}
                        loading="lazy"
                        onError={() => setFailedVehicleImageUrl(vehicleImage.url)}
                        className="h-16 w-24 object-cover"
                      />
                    </a>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[rgba(244,240,232,0.85)] px-3 py-1.5 text-sm font-bold text-[var(--text-body)]">
                    <Gauge className="h-4 w-4" aria-hidden="true" />
                    {mileage}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold ${title === "Clean Title" ? "bg-[rgba(124,169,130,0.14)] text-[var(--racing-green)]" : "bg-[rgba(245,158,11,0.12)] text-[#7a5615]"}`}>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {title}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[rgba(244,240,232,0.85)] px-3 py-1.5 text-sm font-bold text-[var(--text-body)]">
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    {owner}
                  </span>
                </div>
                {(summary || result.summary) ? (
                  <p className="mt-3 text-base leading-7 text-[var(--text-body)]">{summary || result.summary}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-sm font-bold text-[var(--text-muted)]">Asking</span>
                  <span className="text-3xl font-black text-[var(--graphite)]">{sellerPrice}</span>
                  {priceVsFair ? (
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-black ${priceVsFair.good ? "bg-[rgba(124,169,130,0.14)] text-[var(--racing-green)]" : "bg-[rgba(245,158,11,0.14)] text-[#7a5615]"}`}>
                      {priceVsFair.text}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="grid divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] bg-[rgba(244,240,232,0.45)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-5 py-4">
                <div className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Fair value range</div>
                <div className="mt-1 text-xl font-black text-[var(--graphite)]">{formatRange(result.estimatedFairValueRange.low, result.estimatedFairValueRange.high)}</div>
                <p className="mt-1 text-xs leading-5 text-[var(--text-body)]">{result.estimatedFairValueRange.note}</p>
              </div>
              <div className="px-5 py-4">
                <div className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Suggested offer</div>
                <div className="mt-1 text-xl font-black text-[var(--graphite)]">{formatRange(result.suggestedOfferRange.low, result.suggestedOfferRange.high)}</div>
                <p className="mt-1 text-xs leading-5 text-[var(--text-body)]">{result.suggestedOfferRange.note}</p>
              </div>
              <div className="px-5 py-4">
                <div className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Potential savings</div>
                <div className="mt-1 text-xl font-black text-[var(--racing-green)]">{potentialSavings !== null ? formatMoney(potentialSavings) : "Unknown"}</div>
                <p className="mt-1 text-xs leading-5 text-[var(--text-body)]">If you negotiate from asking to the low offer</p>
              </div>
            </div>
            <p className="border-t border-[var(--border-subtle)] px-5 py-2.5 text-xs leading-5 text-[var(--text-muted)]">
              Estimates only, based on the listing text. Always verify the VIN and title and get a mechanic inspection before buying.
            </p>
          </section>

          {listingMemory || marketContext ? (
            <section className="animate-fade-in-up rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-4 shadow-sm">
              <h3 className="mb-2 text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Market intelligence</h3>
              <ul className="grid gap-2">
                {listingMemory?.priceDrop ? (
                  <li className="flex items-start gap-2 text-sm leading-6 text-[var(--text-body)]">
                    <BadgeDollarSign className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                    <span>
                      <strong>Price dropped {formatMoney(listingMemory.priceDrop.from - listingMemory.priceDrop.to)}</strong> since Dealscan
                      first saw this listing ({formatMoney(listingMemory.priceDrop.from)} &rarr; {formatMoney(listingMemory.priceDrop.to)}).
                      A falling price is a strong negotiation signal.
                    </span>
                  </li>
                ) : null}
                {listingMemory && listingMemory.daysSinceFirstScan >= 1 ? (
                  <li className="flex items-start gap-2 text-sm leading-6 text-[var(--text-body)]">
                    <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-[var(--champagne)]" aria-hidden="true" />
                    <span>
                      First scanned on Dealscan <strong>{listingMemory.daysSinceFirstScan} day{listingMemory.daysSinceFirstScan === 1 ? "" : "s"} ago</strong>
                      {listingMemory.scanCount > 2 ? ` and checked ${listingMemory.scanCount} times` : ""}. Listings that sit give buyers leverage.
                    </span>
                  </li>
                ) : null}
                {marketContext ? (
                  <li className="flex items-start gap-2 text-sm leading-6 text-[var(--text-body)]">
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-[var(--graphite)]" aria-hidden="true" />
                    <span>
                      Priced <strong>above {marketContext.percentile}%</strong> of {marketContext.sampleSize} similar listings scanned on
                      Dealscan (median asking {formatMoney(marketContext.medianPrice)}).
                    </span>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}

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
                        <p className="text-xs font-black uppercase text-[var(--text-body)]">VIN detected</p>
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
                  <section className="rounded-2xl border border-[rgba(52,119,186,0.25)] bg-[var(--paper)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase text-[var(--text-body)]">VIN Decode</p>
                        <p className="mt-1 font-mono text-sm font-bold text-[var(--graphite)]">{vinResult.vin}</p>
                      </div>
                      <button onClick={() => setVinResult(null)} className="btn-ghost !min-h-0 !px-2 !py-1 !text-xs !font-bold !text-[var(--text-muted)] hover:!text-[var(--danger)]">Dismiss</button>
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
                            <div className="text-xs font-bold text-[var(--text-body)]">{r.label}</div>
                            <div className="font-bold text-[var(--graphite)]">{r.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ) : null}

                {vinLoading ? (
                  <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-4">
                    <p className="text-sm font-bold text-[var(--text-body)]">Decoding VIN...</p>
                  </section>
                ) : null}

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

                <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 text-base leading-7 text-[var(--text-body)]">
                  <h3 className="text-base font-black text-[var(--graphite)]">Trust notes</h3>
                  <div className="mt-3 grid gap-2">
                    {trustLayerStatements.map((statement) => (
                      <p key={statement}>{statement}</p>
                    ))}
                  </div>
                </section>

                <section id="listing-source" className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4">
                  <h3 className="text-base font-black text-[var(--graphite)]">Listing text</h3>
                  <p className="mt-2 max-h-24 overflow-auto rounded-lg bg-[rgba(244,240,232,0.72)] p-3 text-sm leading-6 text-[var(--text-body)]">
                    {sourceText || "No listing text was provided."}
                  </p>
                </section>
              </div>
            </div>
          </details>

          <div className="flex flex-wrap gap-3">
            <WatchButton result={result} vehicleTitle={vehicleTitle} sourceText={sourceText} price={sellerPriceNum} sourceUrl={sourceUrl} />
            <ChallengeShareButton result={result} vehicleTitle={vehicleTitle} askingPrice={sellerPriceNum} />
            <a
              href={reportHref}
              download={`${vehicleTitle.replaceAll(" ", "-").toLowerCase()}-report.json`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--paper)] px-5 text-base font-black text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-md"
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
                  : "border-[rgba(169,130,83,0.55)] bg-[var(--paper)] text-[var(--graphite)] hover:bg-[rgba(169,130,83,0.14)]"
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
    <details className="group rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)] open:ring-2 open:ring-[rgba(169,130,83,0.25)]">
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
                <span className="text-sm font-black uppercase text-[var(--text-muted)]">{label}</span>
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
              <p className="whitespace-pre-wrap rounded-xl bg-[rgba(244,240,232,0.72)] p-4 text-base leading-7 text-[var(--text-body)]">{script}</p>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
