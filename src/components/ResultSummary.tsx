import type { ComponentType } from "react";
import {
  BadgeDollarSign,
  CarFront,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Heart,
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

const trustLayerStatements = [
  "Dealscan.dev provides estimates based on listing information, not guarantees.",
  "Always verify title status, inspect the vehicle, and consider a mechanic inspection before buying.",
  "Dealscan.dev does not scrape marketplaces. It analyzes only information you provide.",
  "Market estimates may vary by location, condition, mileage, and demand.",
];

type ResultSummaryProps = {
  result: AnalyzeListingResult;
  analysisMode: AnalysisMode;
  sourceText: string;
  vehicleTitle: string;
  onReset: () => void;
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

function RightPanel({ result }: { result: AnalyzeListingResult }) {
  const marketAverage =
    result.estimatedFairValueRange.low !== null && result.estimatedFairValueRange.high !== null
      ? Math.round((result.estimatedFairValueRange.low + result.estimatedFairValueRange.high) / 2)
      : null;
  const healthRows = result.categories.slice(1, 7);

  return (
    <aside className="grid gap-4 xl:sticky xl:top-20">
      <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
        <h2 className="flex items-center gap-2 text-lg font-black text-[var(--graphite)]">
          Market price range
          <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </h2>
        <p className="mt-1 text-sm text-neutral-600">Estimate from the provided listing details.</p>
        <div className="mt-3 text-2xl font-black text-[var(--graphite)]">
          {formatRange(result.estimatedFairValueRange.low, result.estimatedFairValueRange.high)}
        </div>
        <div className="mt-5 h-2 rounded-full bg-neutral-200">
          <div className="h-2 w-2/3 rounded-full bg-[var(--champagne)]" />
        </div>
        <div className="mt-2 flex justify-between text-xs font-bold text-neutral-600">
          <span>{formatMoney(result.estimatedFairValueRange.low)}</span>
          <span>{formatMoney(marketAverage)}</span>
          <span>{formatMoney(result.estimatedFairValueRange.high)}</span>
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
        <h2 className="flex items-center gap-2 text-lg font-black text-[var(--graphite)]">
          Car health summary
          <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </h2>
        <div className="mt-3 grid gap-2">
          {healthRows.map((category) => {
            const tone = scoreTone(category.score);

            return (
              <div key={category.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-neutral-700">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
                  {category.label.replace(" risk", "")}
                </span>
                <span className={`rounded-full border px-2 py-1 text-xs font-black ${tone.soft}`}>{tone.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
        <h2 className="flex items-center gap-2 text-lg font-black text-[var(--graphite)]">
          Similar listings
          <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
        </h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          Not connected yet. This app does not scrape marketplaces. Add a licensed pricing API later for real comparable
          vehicles.
        </p>
      </section>
    </aside>
  );
}

export function ResultSummary({ result, analysisMode, sourceText, vehicleTitle, onReset }: ResultSummaryProps) {
  const tone = scoreTone(result.score);
  const Icon = tone.icon;
  const sellerPrice = extractPrice(sourceText);
  const mileage = extractMileage(sourceText);
  const title = titleStatus(sourceText);
  const owner = ownerStatus(sourceText);
  const primaryCategories = result.categories.slice(0, 4);
  const talkDownPoints = [
    result.missingInfo[0] ? `Ask for ${result.missingInfo[0].toLowerCase()}` : "Ask for proof before visiting",
    result.redFlags[0] ?? "Use missing details to negotiate",
    "Confirm service records and inspection",
  ];
  const reportHref = `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({ vehicleTitle, sourceText, result }, null, 2),
  )}`;

  return (
    <section id="analysis-result" className="min-h-screen bg-[rgba(244,240,232,0.94)] text-[var(--graphite)]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(11,13,16,0.90)] text-[var(--ivory)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--champagne)] text-[var(--graphite)]">
              <CarFront className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="text-2xl font-black tracking-normal">
              Dealscan.dev
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--silver)] lg:flex" aria-label="Result navigation">
            <a href="#saved-cars" className="flex items-center gap-2 transition hover:text-[var(--champagne)]">
              <Heart className="h-5 w-5" aria-hidden="true" />
              Saved Cars
            </a>
            <a href="#report" className="flex items-center gap-2 transition hover:text-[var(--champagne)]">
              <FileText className="h-5 w-5" aria-hidden="true" />
              Reports
            </a>
            <a href="#seller-questions" className="flex items-center gap-2 transition hover:text-[var(--champagne)]">
              <CircleHelp className="h-5 w-5" aria-hidden="true" />
              Help
            </a>
            <a href="#account" className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 transition hover:bg-white/15">
              <UserRound className="h-5 w-5" aria-hidden="true" />
              Buyer
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 xl:grid-cols-[220px_minmax(0,1fr)_300px]">
        <aside className="hidden xl:block">
          <div className="sticky top-24 grid gap-6">
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/86 p-5 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
              {["Vehicle", "Condition", "Price", "Result"].map((label, index) => (
                <div key={label} className="flex gap-3 pb-8 last:pb-0">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--graphite)] text-sm font-black text-[var(--ivory)]">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-base font-black text-[var(--graphite)]">{label}</div>
                    <div className="text-sm text-neutral-600">
                      {index === 3 ? "Your analysis" : index === 2 ? "Market and pricing" : "Listing details"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/86 p-5 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
              <div className="font-black text-[var(--graphite)]">Analysis Progress</div>
              <div className="mt-4 flex items-center gap-2 text-sm text-neutral-700">
                <CheckCircle2 className="h-5 w-5 text-[var(--success)]" aria-hidden="true" />
                All set. Here is your result.
              </div>
              <div className="mt-4 h-2 rounded-full bg-neutral-200">
                <div className="h-2 w-full rounded-full bg-[var(--success)]" />
              </div>
              <p className="mt-3 text-sm text-neutral-600">4 of 4 steps complete</p>
            </div>
          </div>
        </aside>

        <div className="grid gap-4" id="report">
          <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-4 shadow-[0_22px_60px_-42px_rgba(11,13,16,0.60)] transition hover:shadow-[0_28px_70px_-46px_rgba(11,13,16,0.70)]">
            <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center">
              <div className="min-h-28 overflow-hidden rounded-xl bg-[var(--graphite)]">
                <img
                  src="/porsche-911-track-black.jpg"
                  alt="Rear view of a black Porsche GT3 RS with a large wing"
                  className="h-full min-h-28 w-full object-cover object-[72%_54%]"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-normal text-[var(--graphite)]">{vehicleTitle}</h1>
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

          <section
            className="overflow-x-auto rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)] transition hover:shadow-[0_24px_56px_-42px_rgba(11,13,16,0.60)]"
            aria-label="Condition summary"
          >
            <div className="flex min-w-max">
              <ConditionPill label="Title" value={title} risky={title !== "Clean Title"} />
              <ConditionPill label="Accident History" value="Ask seller" risky />
              <ConditionPill label="Tires" value="Verify" risky={!/new tires/i.test(sourceText)} />
              <ConditionPill label="Brakes" value="Verify" risky />
              <ConditionPill label="Interior" value="Review photos" risky />
              <ConditionPill label="Mechanical" value={result.redFlags.length ? "Check" : "Good"} risky={result.redFlags.length > 0} />
            </div>
          </section>

          <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/88 p-5 shadow-[0_22px_60px_-42px_rgba(11,13,16,0.60)] transition hover:shadow-[0_28px_70px_-46px_rgba(11,13,16,0.70)]">
            <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
              <div className="grid justify-items-center gap-4 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="rounded-full border border-[rgba(18,61,51,0.18)] bg-[rgba(18,61,51,0.08)] px-3 py-1 text-xs font-black uppercase tracking-normal text-[var(--racing-green)]">
                    Basic analysis
                  </span>
                  <span className="rounded-full border border-[rgba(11,13,16,0.10)] bg-neutral-100 px-3 py-1 text-xs font-black uppercase tracking-normal text-neutral-600">
                    {analysisMode === "ai" ? "Enhanced AI analysis" : "Enhanced AI analysis coming soon"}
                  </span>
                </div>
                <h2 className="flex items-center gap-2 text-lg font-black">
                  Deal Score
                  <Info className="h-4 w-4 text-slate-400" aria-hidden="true" />
                </h2>
                <ScoreRing score={result.score} />
                <div className={`inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xl font-black ${tone.soft}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  {result.verdict}
                </div>
                <p className="text-sm font-bold text-neutral-600">
                  {tone.label} confidence: {result.confidence}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <MiniMetric
                  label="Fair Price Range"
                  value={formatRange(result.estimatedFairValueRange.low, result.estimatedFairValueRange.high)}
                  note={result.estimatedFairValueRange.note}
                  icon={ShieldCheck}
                />
                <MiniMetric label="Seller Price" value={sellerPrice} note="Based on user-provided listing text." icon={BadgeDollarSign} />
                <MiniMetric
                  label="Negotiate Target"
                  value={formatMoney(result.suggestedOfferRange.high)}
                  note={result.suggestedOfferRange.note}
                  icon={Search}
                />
                <MiniMetric
                  label="Potential Savings"
                  value={formatMoney(result.suggestedOfferRange.low)}
                  note="Use inspection findings to negotiate."
                  icon={Download}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[rgba(124,169,130,0.35)] bg-[rgba(124,169,130,0.12)] p-5">
              <div className="grid gap-4 md:grid-cols-[80px_120px_minmax(0,1fr)] md:items-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[rgba(124,169,130,0.18)] text-[var(--racing-green)]">
                  <ShoppingCart className="h-9 w-9" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-700">Our Verdict</div>
                  <div className="text-4xl font-black text-[var(--racing-green)]">
                    {result.score >= 80 ? "Buy" : result.score >= 60 ? "Negotiate" : "Wait"}
                  </div>
                </div>
                <p className="text-lg leading-8 text-[var(--graphite)]">{result.summary}</p>
              </div>
            </div>
          </section>

          <section className="grid gap-3" id="saved-cars">
            <h2 className="text-xl font-black text-[var(--graphite)]">Why this score?</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {primaryCategories.map((category) => (
                <ReasonCard key={category.label} label={category.label} note={category.note} score={category.score} />
              ))}
            </div>
          </section>

          <section className="grid gap-3">
            <h2 className="text-xl font-black text-[var(--graphite)]">Talk-down points</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {talkDownPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
                  <Wrench className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
                  <span className="text-base font-bold text-[var(--graphite)]">{point}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <FlagChips title="Red flags" flags={result.redFlags} tone="red" />
            <FlagChips title="Green flags" flags={result.greenFlags} tone="green" />
          </div>
          <section id="listing-source" className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
            <h2 className="text-xl font-black text-[var(--graphite)]">Listing source</h2>
            <p className="mt-2 max-h-32 overflow-auto rounded-xl bg-[rgba(244,240,232,0.72)] p-3 text-base leading-7 text-neutral-700">
              {sourceText || "No listing text was provided."}
            </p>
          </section>

          <MissingInfoChecklist items={result.missingInfo} />
          <div id="seller-questions">
            <SellerQuestionsCard questions={result.sellerQuestions} />
          </div>

          {analysisMode === "local" ? (
            <p className="rounded-2xl border border-[rgba(18,61,51,0.20)] bg-[rgba(18,61,51,0.08)] px-4 py-3 text-base font-bold text-[var(--racing-green)]">
              Basic analysis is running on the free local scoring engine. No paid AI key is required.
            </p>
          ) : null}

          <section className="rounded-2xl border border-[rgba(11,13,16,0.10)] bg-white/82 p-4 text-base leading-7 text-neutral-600 shadow-[0_18px_46px_-36px_rgba(11,13,16,0.50)]">
            <h2 className="text-lg font-black text-[var(--graphite)]">Trust notes</h2>
            <div className="mt-3 grid gap-2">
              {trustLayerStatements.map((statement) => (
                <p key={statement}>{statement}</p>
              ))}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            <a
              href={reportHref}
              download={`${vehicleTitle.replaceAll(" ", "-").toLowerCase()}-report.json`}
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[var(--graphite)] px-5 text-lg font-black text-[var(--ivory)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--charcoal)] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
              Download Report
            </a>
            <a
              href="#analyze-another"
              onClick={onReset}
              aria-label="Analyze another car"
              className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[rgba(201,168,106,0.55)] bg-white px-5 text-lg font-black text-[var(--graphite)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[rgba(201,168,106,0.14)] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--champagne)]"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              Analyze Another Car
            </a>
          </div>
        </div>

        <RightPanel result={result} />
      </div>
    </section>
  );
}
