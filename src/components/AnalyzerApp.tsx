"use client";

import {
  Brain,
  Calculator,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileSearch,
  Flag,
  Gauge,
  LineChart,
  Lock,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ResultSummary } from "@/components/ResultSummary";
import type { AnalysisMode, AnalyzeListingRequest, AnalyzeListingResult, InputType, ManualDetails } from "@/lib/analyzer-types";
import { partnerLinks } from "@/lib/integration-links";
import { getListingTextError, LISTING_TEXT_MAX_LENGTH } from "@/lib/listing-validation";

const exampleListings = [
  {
    id: "great",
    label: "Great deal",
    tone: "Clean records",
    text: "2018 Toyota Camry LE, 72,000 miles, Austin, TX, clean title, one owner, service records available, new tires, recent maintenance, no accidents reported, cold AC, asking $15,900. VIN and title photo available.",
  },
  {
    id: "caution",
    label: "Caution",
    tone: "Needs proof",
    text: "2016 BMW M3 Sedan, 74,000 miles, Austin, TX, title status unclear, 6-speed manual, asking $28,500. Seller says there are minor issues, limited photos, no service history provided, sold as-is, and price is firm.",
  },
  {
    id: "avoid",
    label: "Avoid",
    tone: "High risk",
    text: "2009 Nissan Altima, 181,000 miles, Dallas, TX, no title, runs rough, needs work, as-is, cash only, check engine light on, asking $2,400. Seller says it may need transmission work.",
  },
  {
    id: "vague",
    label: "Vague",
    tone: "Low confidence",
    text: "Honda Civic runs good. Price not listed. Mileage not listed. Text me for details.",
  },
];

const inputMethods = [
  { value: "text", label: "Paste Text", note: "Best for full listing descriptions", icon: FileSearch },
  { value: "screenshot", label: "Screenshot", note: "Upload image, paste visible text", icon: Camera },
  { value: "manual", label: "Manual", note: "Year, mileage, price, title", icon: Gauge },
] satisfies Array<{ value: InputType; label: string; note: string; icon: LucideIcon }>;

const quickActions = [
  { label: "Run VIN Report (Carfax)", note: "Check accidents, owners, title", href: partnerLinks.carfax, icon: FileSearch },
  { label: "Book Pre-Purchase Inspection", note: "Have a mechanic inspect it", href: partnerLinks.inspection, icon: Wrench },
  { label: "Get Insurance Quote", note: "Compare rates in minutes", href: partnerLinks.insurance, icon: ShieldCheck },
  { label: "Estimate Payments", note: "See real loan options", href: partnerLinks.payments, icon: Calculator },
  { label: "Find OBD2 Scanner", note: "Scan codes before you buy", href: partnerLinks.obd, icon: ShoppingCart },
];

const rubric = [
  "Price vs estimated market range",
  "Mileage for age and segment",
  "Title, VIN, and ownership risk",
  "Mechanical and repair exposure",
  "Seller transparency and proof",
  "Missing information penalty",
  "Positive signal bonus",
  "Negotiation opportunity",
];

const trustItems = [
  {
    title: "No marketplace scraping",
    note: "The analyzer only uses text, screenshots, and details that the buyer voluntarily provides.",
    icon: Lock,
  },
  {
    title: "Confidence and assumptions",
    note: "Results call out missing VIN, title, mileage, price, and seller proof instead of pretending to know everything.",
    icon: ShieldAlert,
  },
  {
    title: "Data moat ready",
    note: "Anonymized analyses, saved cars, VIN flags, offer prices, and buyer outcomes can become the proprietary asset.",
    icon: LineChart,
  },
];

const trustLayerStatements = [
  "DealScan provides estimates based on listing information, not guarantees.",
  "Always verify title status, inspect the vehicle, and consider a mechanic inspection before buying.",
  "DealScan does not scrape marketplaces. It analyzes only information you provide.",
  "Market estimates may vary by location, condition, mileage, and demand.",
];

function manualDetailsToText(details: ManualDetails) {
  const vehicleName = [details.year, details.make, details.model].filter(Boolean).join(" ");

  return [
    vehicleName,
    details.mileage,
    details.price,
    details.titleStatus,
    details.sellerNotes,
  ]
    .filter(Boolean)
    .join(", ");
}

function vehicleTitleFromText(text: string) {
  const match = text.match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,4}/);

  return match?.[0].replace(/,$/, "") ?? "Used Car Analysis";
}

export function AnalyzerApp() {
  const [inputType, setInputType] = useState<InputType>("text");
  const [listingText, setListingText] = useState("");
  const [manualDetails, setManualDetails] = useState<ManualDetails>({});
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeListingResult | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("local");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");

  const analysisText = inputType === "manual" ? manualDetailsToText(manualDetails) : listingText.trim();

  function updateManualField(key: keyof ManualDetails, value: string) {
    setManualDetails((current) => ({ ...current, [key]: value }));
  }

  function handleScreenshotChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setScreenshotPreviewUrl(null);
      return;
    }

    setScreenshotPreviewUrl(URL.createObjectURL(file));
  }

  async function submitAnalysis(body: AnalyzeListingRequest) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze-listing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error || "The analyzer could not process this listing.");
      }

      const data = (await response.json()) as {
        result: AnalyzeListingResult;
        analysisMode?: AnalysisMode;
      };

      setResult(data.result);
      setAnalysisMode(data.analysisMode ?? "local");
      setLastAnalyzedText(body.listingText);
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong. Check the listing details and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function analyzeListing() {
    setError("");
    setResult(null);

    const normalizedAnalysisText = analysisText.trim();
    const validationError = getListingTextError(normalizedAnalysisText);

    if (validationError) {
      setError(validationError);
      return;
    }

    await submitAnalysis({
      inputType,
      listingText: normalizedAnalysisText,
      manualDetails: inputType === "manual" ? manualDetails : undefined,
    });
  }

  function useExampleListing(text: string) {
    setInputType("text");
    setListingText(text);
    setResult(null);
    setError("");
    void submitAnalysis({ inputType: "text", listingText: text });
  }

  function reset() {
    setResult(null);
    setError("");
  }

  if (result) {
    return (
      <ResultSummary
        result={result}
        analysisMode={analysisMode}
        sourceText={lastAnalyzedText}
        vehicleTitle={vehicleTitleFromText(lastAnalyzedText)}
        onReset={reset}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-[#080d12]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060a0e] text-white">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between px-5 py-4 sm:px-7">
          <a href="#hero" className="leading-tight transition hover:-translate-y-0.5" aria-label="DEALSCAN home">
            <div className="text-2xl font-black tracking-normal">DEALSCAN</div>
            <div className="text-[11px] font-bold uppercase tracking-normal text-white/70">Real numbers. Real confidence.</div>
          </a>
          <nav className="hidden items-center gap-9 text-sm font-bold lg:flex" aria-label="Primary">
            <a href="#how-it-works" className="transition hover:-translate-y-1 hover:text-red-300">
              How It Works
            </a>
            <a href="#pricing" className="transition hover:-translate-y-1 hover:text-red-300">
              Pricing
            </a>
            <a href="#features" className="transition hover:-translate-y-1 hover:text-red-300">
              Features
            </a>
            <a href="#resources" className="flex items-center gap-1 transition hover:-translate-y-1 hover:text-red-300">
              Resources <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#analyzer" className="hidden px-3 py-2 text-sm font-bold transition hover:-translate-y-1 hover:text-red-300 sm:block">
              Log in
            </a>
            <a
              href="#pricing"
              className="rounded-md bg-white px-4 py-3 text-sm font-black text-black shadow-lg transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500 hover:text-white hover:shadow-red-500/30 sm:px-5"
            >
              Sign up free
            </a>
          </div>
        </div>
      </header>

      <section id="hero" className="relative min-h-[calc(100svh-73px)] overflow-hidden bg-[#060a0e] text-white">
        <div id="example-listing" className="sr-only">Example listing control</div>
        <img
          src="/porsche-911-track-black.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_54%] brightness-[0.50] contrast-125 saturate-[0.82]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.80)_33%,rgba(0,0,0,0.48)_62%,rgba(0,0,0,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.20),rgba(0,0,0,0.68))]" />
        <div className="relative mx-auto grid max-w-[1560px] gap-8 px-5 py-6 sm:px-7 lg:grid-cols-[minmax(0,0.86fr)_minmax(620px,1.14fr)] lg:items-center lg:py-8">
          <div className="py-4 lg:py-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              Data-backed used car deal checker
            </div>
            <h1 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-[4.75rem]">
              Know the car.
              <br />
              Not the hype.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">
              Paste a listing and get a clear score, red flags, and negotiation tips. No paid AI key is required.
            </p>
            <div id="features" className="mt-6 grid max-w-xl grid-cols-2 gap-3 text-sm font-bold sm:grid-cols-4">
              {[
                { icon: Gauge, label: "Local scoring", href: "#prediction-rubric" },
                { icon: LineChart, label: "Price logic", href: "#market-data" },
                { icon: Flag, label: "Risk checks", href: "#prediction-rubric" },
                { icon: Lock, label: "No scraping", href: "#trust" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group grid min-h-24 content-between rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <Icon className="h-6 w-6 transition group-hover:scale-110 group-hover:text-red-300" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <section
            id="analyzer"
            className="rounded-[1.35rem] border border-white/[0.14] bg-[#10161d]/90 p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">Deal check</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Analyze a Listing</h2>
              </div>
              <a
                href="#market-data"
                className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/75 transition hover:-translate-y-1 hover:bg-white/10"
              >
                Basic analysis
              </a>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black uppercase tracking-[0.12em] text-white/60">
              {["1 Input", "2 Verify", "3 Score"].map((step) => (
                <a
                  key={step}
                  href={step === "1 Input" ? "#analyzer" : step === "2 Verify" ? partnerLinks.carfax : "#prediction-rubric"}
                  target={step === "2 Verify" ? "_blank" : undefined}
                  rel={step === "2 Verify" ? "sponsored noopener noreferrer" : undefined}
                  className="rounded-full border border-white/10 bg-white/[0.045] px-2 py-2 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  {step}
                </a>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2" role="tablist" aria-label="Listing input methods">
              {inputMethods.map((method) => (
                (() => {
                  const Icon = method.icon;

                  return (
                    <a
                      key={method.value}
                      href={`#${method.value}`}
                      role="tab"
                      aria-selected={inputType === method.value}
                      onClick={(event) => {
                        event.preventDefault();
                        setInputType(method.value);
                      }}
                      className={`group grid min-h-28 gap-2 rounded-2xl border p-3 text-left transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white ${
                        inputType === method.value
                          ? "border-white/30 bg-white text-[#111820] shadow-xl"
                          : "border-white/10 bg-white/[0.045] text-white/70 hover:bg-white/[0.085]"
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition group-hover:scale-110 ${inputType === method.value ? "text-red-600" : "text-red-300"}`} aria-hidden="true" />
                      <span className="text-sm font-black">{method.label}</span>
                      <span className={`text-xs leading-4 ${inputType === method.value ? "text-neutral-600" : "text-white/50"}`}>{method.note}</span>
                    </a>
                  );
                })()
              ))}
            </div>

            <div className="mt-5">
              {inputType === "text" ? (
                <label className="grid gap-2">
                  <span className="text-sm font-black text-white">Listing text</span>
                  <span className="text-sm leading-6 text-white/60">Copy the seller description exactly. Include price, mileage, title, VIN, and seller claims when available.</span>
                  <textarea
                    value={listingText}
                    onChange={(event) => setListingText(event.target.value)}
                    rows={5}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    placeholder="Example: 2019 Toyota Camry LE, 72,000 miles, clean title, one owner, asking $15,900..."
                    className="min-h-36 w-full resize-y rounded-2xl border border-white/15 bg-[#0b1117]/80 p-4 text-base leading-7 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none placeholder:text-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/40 sm:min-h-44"
                  />
                </label>
              ) : null}

              {inputType === "screenshot" ? (
                <div className="grid gap-4">
                  <label className="grid min-h-24 cursor-pointer place-items-center rounded-lg border border-dashed border-white/25 bg-white/[0.04] p-4 text-center transition hover:-translate-y-1 hover:border-red-300 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-white">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleScreenshotChange} aria-label="Upload listing screenshot" />
                    <span className="grid justify-items-center gap-2">
                      <Camera className="h-8 w-8 text-red-300" aria-hidden="true" />
                      <span className="text-base font-black">Upload screenshot</span>
                      <span className="text-sm text-white/60">MVP preview only. Paste visible text below for analysis.</span>
                    </span>
                  </label>
                  {screenshotPreviewUrl ? (
                    <img src={screenshotPreviewUrl} alt="Uploaded listing screenshot preview" className="max-h-36 w-full rounded-lg border border-white/15 object-contain" />
                  ) : null}
                  {/* TODO: Add OCR here later so screenshot text can be extracted before analysis. */}
                  <textarea
                    value={listingText}
                    onChange={(event) => setListingText(event.target.value)}
                    rows={3}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    placeholder="Paste the visible listing text from the screenshot..."
                    className="min-h-24 w-full resize-y rounded-lg border border-white/20 bg-white/[0.03] p-4 text-base leading-7 text-white outline-none placeholder:text-white/50 focus:border-white/60 focus:ring-2 focus:ring-white/40"
                  />
                </div>
              ) : null}

              {inputType === "manual" ? (
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["year", "Year", "2023"],
                      ["make", "Make", "Porsche"],
                      ["model", "Model", "911 GT3 RS"],
                      ["mileage", "Mileage", "8,900 mi"],
                      ["price", "Price", "$242,500"],
                      ["titleStatus", "Title", "Clean title"],
                    ].map(([key, label, placeholder]) => (
                      <label key={key} className="grid gap-1 text-xs font-black uppercase text-white/70">
                        {label}
                        <input
                          value={manualDetails[key as keyof ManualDetails] ?? ""}
                          onChange={(event) => updateManualField(key as keyof ManualDetails, event.target.value)}
                          placeholder={placeholder}
                          className="min-h-11 rounded-lg border border-white/20 bg-white/[0.03] px-3 text-base normal-case text-white outline-none placeholder:text-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/40"
                        />
                      </label>
                    ))}
                  </div>
                  <label className="grid gap-1 text-xs font-black uppercase text-white/70">
                    Seller Notes
                    <textarea
                      value={manualDetails.sellerNotes ?? ""}
                      onChange={(event) => updateManualField("sellerNotes", event.target.value)}
                      rows={3}
                      maxLength={1800}
                      placeholder="Add condition, options, maintenance, accident history, or unclear claims."
                      className="min-h-24 resize-y rounded-lg border border-white/20 bg-white/[0.03] p-3 text-base normal-case leading-7 text-white outline-none placeholder:text-white/40 focus:border-white/60 focus:ring-2 focus:ring-white/40"
                    />
                  </label>
                </div>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
              <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.12em] text-white/70">
                <span>Seed examples</span>
                <span>{analysisText.length} / {LISTING_TEXT_MAX_LENGTH}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {exampleListings.map((example) => (
                  <a
                    key={example.id}
                    href="#example-listing"
                    onClick={(event) => {
                      event.preventDefault();
                      useExampleListing(example.text);
                    }}
                    className="group rounded-xl border border-white/10 bg-[#0b1117]/65 p-3 text-left transition hover:-translate-y-1 hover:border-red-300 hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={`Use ${example.label} example listing`}
                  >
                    <span className="block text-sm font-black text-white transition group-hover:text-red-200">{example.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-white/55">{example.tone}</span>
                  </a>
                ))}
              </div>
            </div>

            {error ? <div className="mt-4"><ErrorState message={error} /></div> : null}
            {isLoading ? <div className="mt-4"><LoadingState /></div> : null}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="#analysis-result"
                onClick={(event) => {
                  event.preventDefault();
                  if (!isLoading) {
                    void analyzeListing();
                  }
                }}
                aria-disabled={isLoading}
                aria-label="Analyze listing and generate deal score"
                className={`group flex min-h-12 min-w-52 items-center justify-center gap-2 rounded-md bg-red-500 px-6 text-base font-black text-white shadow-xl shadow-red-500/25 transition hover:-translate-y-1.5 hover:scale-[1.03] hover:bg-red-600 hover:shadow-red-500/40 focus:outline-none focus:ring-2 focus:ring-white ${
                  isLoading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <SearchCheck className="h-5 w-5 transition group-hover:rotate-12 group-hover:scale-125" aria-hidden="true" />
                Analyze Listing
              </a>
              <span className="flex items-center gap-2 text-sm font-bold text-white/80">
                <Lock className="h-4 w-4 text-yellow-300" aria-hidden="true" />Free local analysis
              </span>
            </div>
          </section>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-[1560px] gap-6 px-5 py-5 text-sm text-neutral-700 sm:px-7 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-8">
            <span>Built for buyers checking listings from</span>
            <strong>Private sellers</strong>
            <strong>Dealers</strong>
            <strong>Auctions</strong>
            <strong>Forums</strong>
            <strong>Text messages</strong>
            <a href="#resources" className="transition hover:-translate-y-1 hover:text-red-500">
              & more
            </a>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center sm:gap-8">
            <a href="#trust" className="transition hover:-translate-y-1"><strong className="block text-xl text-black">0</strong>Marketplaces Scraped</a>
            <a href="#features" className="transition hover:-translate-y-1"><strong className="block text-xl text-black">3</strong>Input Methods</a>
            <a href="#market-data" className="transition hover:-translate-y-1"><strong className="block text-xl text-black">Free</strong>Local Engine</a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#f2f4f7] px-5 py-10 sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-red-600">Three-step flow</p>
              <h2 className="mt-2 text-4xl font-black tracking-normal">Predictable deal analysis, not a toy score.</h2>
            </div>
            <p className="text-lg leading-8 text-neutral-600">
              The product starts empty, waits for buyer-provided information, then scores that data with the free local heuristic engine by default.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Input", "Paste listing text, upload a screenshot, or enter the vehicle details by hand.", "#analyzer"],
              ["2", "Verify", "Use VIN, title, history, inspection, and service-record links to validate seller claims.", partnerLinks.carfax],
              ["3", "Result", "Score price, mileage, red flags, green flags, confidence, and negotiation room.", "#prediction-rubric"],
            ].map(([step, title, note, href]) => (
              <a
                key={step}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
                className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-black text-xl font-black text-white transition group-hover:scale-110 group-hover:bg-red-500">{step}</div>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 text-base leading-7 text-neutral-600">{note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="prediction-rubric" className="bg-white px-5 py-10 sm:px-7">
        <div className="mx-auto grid max-w-[1560px] gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-red-600">Prediction rubric</p>
            <h2 className="mt-2 text-4xl font-black tracking-normal">The score explains why it moved.</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Vague listings are penalized. Clean title, one owner, records, reasonable mileage, and transparent seller language are rewarded.
            </p>
            <a href="#analyzer" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-black px-6 text-base font-black text-white transition hover:-translate-y-1 hover:scale-105 hover:bg-red-500">
              Analyze a car
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {rubric.map((item) => (
              <a
                key={item}
                href="#analyzer"
                className="rounded-xl border border-neutral-200 p-5 text-sm font-bold shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:shadow-lg"
              >
                <CheckCircle2 className="mb-4 h-5 w-5 text-green-600" aria-hidden="true" />
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="market-data" className="bg-[#f2f4f7] px-5 py-10 sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase text-red-600">Data layer</p>
              <h2 className="mt-2 text-4xl font-black tracking-normal">Ready for real pricing and VIN data.</h2>
            </div>
            <p className="text-lg leading-8 text-neutral-600">
              Local scoring is the default. Production-grade underwriting can later add optional AI providers, licensed market data, VIN decoding, title reports, repair estimates, depreciation curves, and local comps.
            </p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Free local analysis", note: "Heuristic scoring works without paid AI keys or external services.", icon: Gauge, href: "#analyzer" },
              { title: "Optional AI providers", note: "Anthropic, Gemini, Groq, and OpenRouter can be added later without blocking the free path.", icon: Brain, href: "#prediction-rubric" },
              { title: "VIN and history", note: "CARFAX destination wired now. API contract can replace the link later.", icon: FileSearch, href: partnerLinks.carfax },
              { title: "Market pricing", note: "Clear hook for licensed comps, depreciation, and local market ranges.", icon: Gauge, href: "#prediction-rubric" },
              { title: "Inspection layer", note: "Pre-purchase inspection link supports buyer trust and affiliate revenue.", icon: Wrench, href: partnerLinks.inspection },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
                  className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 transition hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <Icon className="h-7 w-7 text-red-500" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{item.note}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="resources" className="bg-white px-5 py-10 sm:px-7">
        <div className="mx-auto grid max-w-[1560px] gap-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-sm font-black uppercase text-red-600">Affiliate tools</p>
            <h2 className="mt-2 text-4xl font-black tracking-normal">Every action has a destination.</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              These are working outbound links today. Add approved affiliate IDs before launch, then replace with API-backed experiences as partnerships mature.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <a
                  key={action.label}
                  href={action.href}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-neutral-100 transition group-hover:scale-110 group-hover:bg-red-50">
                      <Icon className="h-5 w-5 text-blue-700" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-base font-black">{action.label}</span>
                      <span className="text-sm text-neutral-600">{action.note}</span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#080d12] px-5 py-10 text-white sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Free Analyzer", "$0", "Local scoring, buyer-safe disclaimers, and no paid AI requirement."],
              ["Premium Report", "$9-$19", "Downloadable report, saved assumptions, offer script, and inspection checklist."],
              ["Buyer Account", "Soon", "Saved cars, compare garage, price alerts, and email follow-ups."],
            ].map(([title, price, note]) => (
              <a key={title} href="#analyzer" className="rounded-xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1.5 hover:bg-white/[0.10] hover:shadow-2xl">
                <h3 className="text-xl font-black">{title}</h3>
                <div className="mt-4 text-4xl font-black">{price}</div>
                <p className="mt-4 text-sm leading-6 text-white/70">{note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="bg-white px-5 py-10 sm:px-7">
        <div className="mx-auto grid max-w-[1560px] gap-6">
          <div className="grid gap-5 md:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <a key={item.title} href="#analyzer" className="rounded-xl border border-neutral-200 p-6 shadow-sm transition hover:-translate-y-1.5 hover:shadow-xl">
                  <Icon className="h-7 w-7 text-red-500" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-neutral-600">{item.note}</p>
                </a>
              );
            })}
          </div>
          <div className="grid gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-base font-bold leading-7 text-neutral-700 sm:grid-cols-2">
            {trustLayerStatements.map((statement) => (
              <p key={statement}>{statement}</p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
