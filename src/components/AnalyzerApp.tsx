"use client";

import { Calculator, Camera, ChevronRight, FileSearch, Gauge, LineChart, SearchCheck, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChangeEvent, MouseEvent } from "react";
import { useRef, useState } from "react";
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
  const reportCardRef = useRef<HTMLDivElement | null>(null);
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

  function handleReportPointerMove(event: MouseEvent<HTMLDivElement>) {
    const card = reportCardRef.current;

    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-x", `${x * 9}deg`);
    card.style.setProperty("--tilt-y", `${y * -7}deg`);
  }

  function handleReportPointerLeave() {
    const card = reportCardRef.current;

    if (!card) {
      return;
    }

    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  }

  async function submitAnalysis(body: AnalyzeListingRequest) {
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch("/api/analyze-listing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
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
      setError(
        caughtError instanceof DOMException && caughtError.name === "AbortError"
          ? "The analyzer timed out. Local analysis should be fast, so refresh and try again."
          : caughtError instanceof Error
            ? caughtError.message
            : "Something went wrong. Check the listing details and try again.",
      );
    } finally {
      window.clearTimeout(timeout);
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
    <main className="min-h-screen overflow-hidden bg-[var(--graphite)] text-[var(--ivory)]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(11,13,16,0.82)] text-[var(--ivory)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between px-5 py-4 sm:px-7">
          <a href="#hero" className="leading-tight transition hover:-translate-y-0.5" aria-label="Dealscan.dev home">
            <div className="text-2xl font-black tracking-tight">Dealscan.dev</div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--champagne)]">Listing review</div>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-bold lg:flex" aria-label="Primary">
            <a href="#analyzer" className="transition hover:-translate-y-1 hover:text-[var(--champagne)]">
              Analyze
            </a>
            <a href="#price-preview" className="transition hover:-translate-y-1 hover:text-[var(--champagne)]">
              Price estimate
            </a>
            <a href="/affiliate-links" className="transition hover:-translate-y-1 hover:text-[var(--champagne)]">
              Buyer tools
            </a>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <a href="#analyzer" className="hidden px-3 py-2 text-sm font-bold text-[var(--silver)] transition hover:-translate-y-1 hover:text-[var(--champagne)] lg:block">
              Google
            </a>
            <a href="#analyzer" className="hidden px-3 py-2 text-sm font-bold text-[var(--silver)] transition hover:-translate-y-1 hover:text-[var(--champagne)] lg:block">
              Facebook
            </a>
            <a
              href="#analyzer"
              className="rounded-full bg-[var(--ivory)] px-4 py-3 text-sm font-black text-[var(--graphite)] shadow-[0_18px_48px_-24px_rgba(244,240,232,0.75)] transition hover:-translate-y-1 hover:bg-[var(--champagne)] sm:px-5"
            >
              Start
            </a>
          </div>
        </div>
      </header>

      <section id="hero" className="relative min-h-[calc(100svh-73px)] overflow-hidden bg-[var(--graphite)] text-[var(--ivory)]">
        <div id="example-listing" className="sr-only">Example listing control</div>
        <img
          src="/porsche-911-track-black.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[68%_52%] opacity-70 brightness-[0.54] contrast-125 saturate-[0.72]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,13,16,0.94)_0%,rgba(11,13,16,0.78)_42%,rgba(11,13,16,0.40)_72%,rgba(11,13,16,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,16,0.30),rgba(11,13,16,0.72))]" />
        <div className="premium-grid-bg absolute inset-0 opacity-70" />
        <div className="absolute left-[-12rem] top-10 h-[32rem] w-[32rem] rounded-full bg-[rgba(201,168,106,0.16)] blur-3xl" />
        <div className="absolute right-[-16rem] top-24 h-[36rem] w-[36rem] rounded-full bg-[rgba(18,61,51,0.58)] blur-3xl" />
        <div className="relative mx-auto grid max-w-[1500px] gap-8 px-5 py-8 sm:px-7 lg:grid-cols-[minmax(0,0.82fr)_minmax(560px,1.18fr)] lg:items-center lg:py-10">
          <div className="py-5 lg:py-12">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--champagne)] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
              <span className="h-2 w-2 rounded-full bg-[var(--champagne)]" />
              Used car listing checker
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.055em] sm:text-7xl lg:text-[5.9rem]">
              Know the car.
              <br />
              Not the hype.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--silver)] sm:text-xl">
              Paste a listing and get a clear score, red flags, missing details, and negotiation guidance before you message the seller.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#analyzer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--champagne)] px-6 text-base font-black text-[var(--graphite)] transition hover:-translate-y-1 hover:bg-[var(--ivory)]"
              >
                Check a listing
              </a>
              <a
                href="/affiliate-links"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] px-6 text-base font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:text-[var(--champagne)]"
              >
                Buyer tools
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div
              ref={reportCardRef}
              onMouseMove={handleReportPointerMove}
              onMouseLeave={handleReportPointerLeave}
              className="hero-report-card relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(20,24,29,0.68)] shadow-[0_36px_100px_-48px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:min-h-[440px]"
              aria-label="Porsche hero image"
            >
              <img
                src="/porsche-911-track-black.jpg"
                alt="Black Porsche 911 track car used as Dealscan.dev hero imagery"
                className="absolute inset-0 h-full w-full object-cover object-[70%_52%] brightness-[0.86] contrast-125 saturate-[0.82]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,16,0.08),rgba(11,13,16,0.66))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--champagne)]">Before you drive out</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-white">Check the listing first.</p>
              </div>
            </div>

            <section id="price-preview" className="rounded-[1.35rem] border border-white/[0.14] bg-[rgba(20,24,29,0.84)] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--champagne)]">Price prediction</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight">Rough range. Offer range. Confidence.</h2>
                </div>
                <Gauge className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Fair price range", "Suggested offer", "Missing details"].map((label) => (
                  <a
                    key={label}
                    href="#analyzer"
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:border-[var(--champagne)]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </section>

          <section
            id="analyzer"
            className="rounded-[1.35rem] border border-white/[0.14] bg-[rgba(20,24,29,0.90)] p-4 shadow-[0_28px_80px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--champagne)]">Deal check</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Analyze a Listing</h2>
              </div>
              <a
                href="#market-data"
                className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs font-black text-[var(--silver)] transition hover:-translate-y-1 hover:bg-white/10 hover:text-[var(--champagne)]"
              >
                Basic analysis
              </a>
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
                          ? "border-[rgba(201,168,106,0.60)] bg-[var(--ivory)] text-[#111820] shadow-xl"
                          : "border-white/10 bg-white/[0.045] text-white/70 hover:bg-white/[0.085]"
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition group-hover:scale-110 ${inputType === method.value ? "text-[var(--racing-green)]" : "text-[var(--champagne)]"}`} aria-hidden="true" />
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
                  <label className="grid min-h-24 cursor-pointer place-items-center rounded-lg border border-dashed border-white/25 bg-white/[0.04] p-4 text-center transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-[var(--champagne)]">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleScreenshotChange} aria-label="Upload listing screenshot" />
                    <span className="grid justify-items-center gap-2">
                      <Camera className="h-8 w-8 text-[var(--champagne)]" aria-hidden="true" />
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
                <span>Try a sample listing</span>
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
                    className="group rounded-xl border border-white/10 bg-[#0b1117]/65 p-3 text-left transition hover:-translate-y-1 hover:border-[var(--champagne)] hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[var(--champagne)]"
                    aria-label={`Use ${example.label} example listing`}
                  >
                    <span className="block text-sm font-black text-white transition group-hover:text-[var(--champagne)]">{example.label}</span>
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
                className={`group flex min-h-12 min-w-52 items-center justify-center gap-2 rounded-full bg-[var(--champagne)] px-6 text-base font-black text-[var(--graphite)] shadow-xl shadow-black/25 transition hover:-translate-y-1.5 hover:scale-[1.03] hover:bg-[var(--ivory)] focus:outline-none focus:ring-2 focus:ring-[var(--champagne)] ${
                  isLoading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <SearchCheck className="h-5 w-5 transition group-hover:rotate-12 group-hover:scale-125" aria-hidden="true" />
                Analyze Listing
              </a>
            </div>
          </section>
          </div>
        </div>
      </section>

      <section id="resources" className="bg-[rgba(244,240,232,0.94)] px-5 py-12 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto grid max-w-[1560px] gap-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--racing-green)]">Buyer tools</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight">Quick links before you buy.</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-700">
              History, inspection, insurance, payments, and simple tools.
            </p>
            <a href="/affiliate-links" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--graphite)] px-5 text-sm font-black text-[var(--ivory)] transition hover:-translate-y-1 hover:bg-[var(--racing-green)]">
              View all buyer tools
            </a>
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
                  className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1.5 hover:border-[var(--champagne)] hover:bg-white hover:shadow-xl"
                >
                  <span className="flex items-center gap-4">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-neutral-100 transition group-hover:scale-110 group-hover:bg-red-50">
                      <Icon className="h-5 w-5 text-[var(--racing-green)]" aria-hidden="true" />
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

      <section id="market-data" className="bg-[var(--charcoal)] px-5 py-10 text-[var(--ivory)] sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--champagne)]">Engine</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Local analysis. Optional enhancement.</h2>
            </div>
            <p className="text-lg leading-8 text-[var(--silver)]">
              The core scoring engine works without paid services. Provider integrations can be enabled server-side when needed.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "Local scoring", note: "Scores listings from price, mileage, title, condition, red flags, and missing details.", icon: Gauge, href: "#analyzer" },
              { title: "Enhanced analysis", note: "Server-side provider support is ready for deeper summaries when enabled.", icon: LineChart, href: "#market-data" },
              { title: "VIN and history", note: "History report links help buyers verify title, mileage, ownership, and accidents.", icon: FileSearch, href: partnerLinks.carfax },
              { title: "Market pricing", note: "Rough estimates are labeled clearly until licensed market data is connected.", icon: Gauge, href: "#market-data" },
              { title: "Inspection layer", note: "Pre-purchase inspection links help buyers verify condition before purchase.", icon: Wrench, href: partnerLinks.inspection },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "sponsored noopener noreferrer" : undefined}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:-translate-y-1.5 hover:border-[rgba(201,168,106,0.45)] hover:bg-white/[0.085]"
                >
                  <Icon className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--silver)]">{item.note}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

    </main>
  );
}
