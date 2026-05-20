"use client";

import { BadgeDollarSign, Calculator, Camera, ChevronRight, FileSearch, Gauge, Link as LinkIcon, LineChart, SearchCheck, ShieldCheck, ShoppingCart, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ResultSummary } from "@/components/ResultSummary";
import { CompareView } from "@/components/CompareView";
import type { SavedResult } from "@/components/CompareView";
import { DemoBanner } from "@/components/DemoBanner";
import { generateDealSummary } from "@/lib/generate-summary";
import { loadSavedResults, saveSavedResults } from "@/lib/local-storage";
import { extractVin } from "@/lib/vin-decoder";
import type { VinDecodeResult } from "@/lib/vin-decoder";

import type { AnalysisMode, AnalyzeListingRequest, AnalyzeListingResult, InputType, ManualDetails } from "@/lib/analyzer-types";
import { partnerLinks } from "@/lib/integration-links";
import { getListingTextError, LISTING_TEXT_MAX_LENGTH } from "@/lib/listing-validation";
import { adminStore } from "@/lib/admin-store";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

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
  { value: "url", label: "Listing URL", note: "Scrape the listing first", icon: LinkIcon },
  { value: "text", label: "Paste Text", note: "Best for full listing descriptions", icon: FileSearch },
  { value: "screenshot", label: "Screenshot", note: "Upload image, run OCR", icon: Camera },
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
  const [inputType, setInputType] = useState<InputType>("url");
  const [listingUrl, setListingUrl] = useState("");
  const [lastExtractedUrl, setLastExtractedUrl] = useState("");
  const [listingText, setListingText] = useState("");
  const [manualDetails, setManualDetails] = useState<ManualDetails>({});
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeListingResult | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("groq");
  const [notice, setNotice] = useState("");
  const [viewMode, setViewMode] = useState<"analyzer" | "result" | "compare">("analyzer");
  const [demoMode, setDemoMode] = useState(false);
  const [savedResults, setSavedResults] = useState<SavedResult[]>(() => loadSavedResults<SavedResult>());
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceNotice, setSourceNotice] = useState("");
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");

  const analysisText = inputType === "manual" ? manualDetailsToText(manualDetails) : listingText.trim();
  const isBusy = isLoading || isScraping || isOcrLoading;

  useEffect(() => {
    saveSavedResults(savedResults);
  }, [savedResults]);

  useKeyboardShortcut("Enter", (event) => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === "TEXTAREA" || target.tagName === "INPUT";
    if (isInput && (event.metaKey || event.ctrlKey) && !isBusy) {
      event.preventDefault();
      void analyzeListing();
    }
  });

  function updateManualField(key: keyof ManualDetails, value: string) {
    setManualDetails((current) => ({ ...current, [key]: value }));
  }

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Could not read that screenshot file."));
      reader.readAsDataURL(file);
    });
  }

  async function extractScreenshotText(imageDataUrl: string) {
    setIsOcrLoading(true);
    setSourceNotice("Reading screenshot with Groq OCR...");

    try {
      const response = await fetch("/api/extract-screenshot-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageDataUrl }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error || "Could not read that screenshot.");
      }

      const data = (await response.json()) as { text: string };
      setListingText(data.text);
      setSourceNotice("Screenshot text extracted. Review it, then scan.");

      return data.text;
    } finally {
      setIsOcrLoading(false);
    }
  }

  async function handleScreenshotChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setScreenshotPreviewUrl(null);
      setScreenshotDataUrl(null);
      return;
    }

    setError("");
    setSourceNotice("");
    setScreenshotPreviewUrl(URL.createObjectURL(file));

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setScreenshotDataUrl(dataUrl);
      await extractScreenshotText(dataUrl);
    } catch (caughtError) {
      const msg = caughtError instanceof Error ? caughtError.message : "Could not read that screenshot.";
      if (msg.includes("GROQ_API_KEY")) {
        setError("GROQ_API_KEY is not set. Paste listing text manually instead, or add the API key.");
      } else {
        setError(`${msg}. You can still paste the listing text manually in the field below.`);
      }
    }
  }

  async function extractListingFromUrl() {
    const url = listingUrl.trim();

    if (!url) {
      throw new Error("Enter a listing URL first.");
    }

    setIsScraping(true);
    setSourceNotice("Extracting listing page...");

    try {
      const response = await fetch("/api/extract-listing-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error || "Could not extract that listing.");
      }

      const data = (await response.json()) as {
        listing: {
          url: string;
          title: string;
          text: string;
        };
      };

      setListingText(data.listing.text);
      setLastExtractedUrl(url);
      setSourceNotice(`Extracted ${data.listing.title}. Review the text, then scan.`);

      return data.listing.text;
    } finally {
      setIsScraping(false);
    }
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
        notice?: string;
      };

      setResult(data.result);
      setViewMode("result");
      setAnalysisMode(data.analysisMode ?? "groq");
      if (data.notice) {
        setNotice(data.notice);
        setTimeout(() => setNotice(""), 8000);
      }
      setLastAnalyzedText(body.listingText);
      try {
        const title = vehicleTitleFromText(body.listingText);
        adminStore.addScan({
          vehicleTitle: title,
          score: data.result.score,
          verdict: data.result.verdict,
          confidence: data.result.confidence,
          sourceUrl: body.sourceUrl,
          listingTextSnippet: body.listingText.slice(0, 500),
        });
      } catch { /* admin store unavailable */ }
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

  async function analyzeListing(overrideInputType?: InputType) {
    setError("");
    setResult(null);
    setNotice("");

    const activeInputType = overrideInputType ?? inputType;
    let normalizedAnalysisText = analysisText.trim();
    let sourceUrl: string | undefined;

    try {
      if (activeInputType === "url") {
        sourceUrl = listingUrl.trim();

        if (!sourceUrl) {
          throw new Error("Enter a listing URL first.");
        }

        if (!normalizedAnalysisText || lastExtractedUrl !== sourceUrl) {
          normalizedAnalysisText = (await extractListingFromUrl()).trim();
        }
      }

      if (activeInputType === "screenshot" && !normalizedAnalysisText && screenshotDataUrl) {
        normalizedAnalysisText = (await extractScreenshotText(screenshotDataUrl)).trim();
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not prepare that listing.");
      return;
    }

    const validationError = getListingTextError(normalizedAnalysisText);

    if (validationError) {
      setError(validationError);
      return;
    }

    await submitAnalysis({
      inputType: activeInputType,
      listingText: normalizedAnalysisText,
      sourceUrl,
      manualDetails: activeInputType === "manual" ? manualDetails : undefined,
    });
  }

  function loadExampleListing(text: string) {
    setInputType("text");
    setListingUrl("");
    setListingText(text);
    setResult(null);
    setError("");
    void submitAnalysis({ inputType: "text", listingText: text });
  }

  async function addToCompare() {
    if (!result) return;
    const vin = extractVin(lastAnalyzedText);
    let vinResult: VinDecodeResult | undefined;
    if (vin) {
      try {
        const res = await fetch("/api/decode-vin", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ vin }),
        });
        const data = await res.json();
        vinResult = data.result;
      } catch { /* VIN decode failed — non-blocking */ }
    }
    setSavedResults((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        result,
        sourceText: lastAnalyzedText,
        vehicleTitle: vehicleTitleFromText(lastAnalyzedText),
        analysisMode,
        summary: generateDealSummary(result, lastAnalyzedText),
        listingUrl: inputType === "url" ? listingUrl.trim() || undefined : undefined,
        timestamp: Date.now(),
        vinResult,
      },
    ]);
  }

  function removeFromCompare(id: string) {
    setSavedResults((prev) => prev.filter((s) => s.id !== id));
  }

  function clearCompare() {
    setSavedResults([]);
  }

  function reset() {
    setResult(null);
    setError("");
    setNotice("");
    setInputType("url");
    setListingUrl("");
    setListingText("");
    setManualDetails({});
    setScreenshotPreviewUrl(null);
    setScreenshotDataUrl(null);
    setViewMode("analyzer");
  }

  if (viewMode === "compare") {
    return (
      <CompareView
        savedResults={savedResults}
        onRemove={removeFromCompare}
        onClearAll={clearCompare}
        onBack={() => setViewMode(result ? "result" : "analyzer")}
      />
    );
  }

  if (viewMode === "result" && result) {
    return (
      <>
        {notice ? (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-slide-down rounded-2xl border border-[rgba(201,168,106,0.35)] bg-[var(--ivory)] px-5 py-3 text-sm font-bold text-[var(--graphite)] shadow-xl">
            {notice}
          </div>
        ) : null}
        <ResultSummary
          result={result}
          analysisMode={analysisMode}
          sourceText={lastAnalyzedText}
          vehicleTitle={vehicleTitleFromText(lastAnalyzedText)}
          summary={generateDealSummary(result, lastAnalyzedText)}
          onReset={reset}
          onAddToCompare={addToCompare}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--canvas)] text-[var(--graphite)]">
      <header className="sticky top-0 z-40 border-b border-[rgba(32,40,35,0.10)] bg-[var(--overlay)] text-[var(--graphite)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 sm:px-7">
          <Link href="/" className="leading-tight text-left transition hover:-translate-y-0.5" aria-label="Dealscan.dev home">
            <div className="text-2xl font-black">Dealscan.dev</div>
            <div className="text-[11px] font-bold uppercase text-[var(--racing-green)]">Listing review</div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold lg:flex" aria-label="Primary">
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`transition hover:-translate-y-1 ${demoMode ? "text-[var(--champagne)]" : "hover:text-[var(--racing-green)]"}`}
            >
              {demoMode ? "✦ Demo" : "Demo"}
            </button>
            <a href="#analyzer" onClick={(e) => { e.preventDefault(); document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" }); }} className="transition hover:-translate-y-1 hover:text-[var(--racing-green)]">
              Analyze
            </a>
            <Link href="/dashboard" className="transition hover:-translate-y-1 hover:text-[var(--racing-green)]">
              Dashboard
            </Link>
            <a href="#market-data" onClick={(e) => { e.preventDefault(); document.getElementById("market-data")?.scrollIntoView({ behavior: "smooth" }); }} className="transition hover:-translate-y-1 hover:text-[var(--racing-green)]">
              Engine
            </a>
            <a href="/affiliate-links" className="transition hover:-translate-y-1 hover:text-[var(--racing-green)]">
              Buyer tools
            </a>
            {savedResults.length > 0 ? (
              <button
                type="button"
                onClick={() => setViewMode("compare")}
                className="relative flex items-center gap-1.5 rounded-full border border-[rgba(18,61,51,0.20)] bg-[rgba(18,61,51,0.08)] px-3.5 py-1.5 text-sm font-black text-[var(--racing-green)] transition hover:-translate-y-1 hover:bg-[rgba(18,61,51,0.14)]"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Compare
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--racing-green)] text-xs font-black text-white">
                  {savedResults.length}
                </span>
              </button>
            ) : null}
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="#analyzer"
              className="btn-pill"
            >
              Check a Listing
            </a>
          </div>
        </div>
      </header>

      {demoMode && (
        <section className="mx-auto max-w-[1600px] px-5 pt-6 sm:px-8">
          <DemoBanner onSelect={loadExampleListing} />
        </section>
      )}

      <section id="hero" className="bg-[var(--canvas)] px-5 py-8 text-[var(--graphite)] sm:px-7 lg:py-12">
        <div className="mx-auto grid max-w-[1560px] gap-6 md:grid-cols-[0.62fr_1fr] md:items-start lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[1.35rem] border border-[rgba(32,40,35,0.10)] bg-white/76 p-5 shadow-[0_18px_60px_-48px_rgba(32,40,35,0.55)] sm:p-7 lg:sticky lg:top-28">
            <p className="text-sm font-black uppercase text-[var(--racing-green)]">Used car deal check</p>
            <h1 className="mt-3 max-w-xl text-4xl font-black leading-[1.02] sm:text-5xl lg:text-6xl">
              Find out if this listing is worth it.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[#52615b] sm:text-lg">
              Paste the listing URL first. Dealscan extracts the page, scores the deal with Groq, and gives you the buyer questions to ask next.
            </p>

            <div className="mt-5 grid gap-2 text-sm font-bold text-[#52615b]">
              {[
                "URL extraction is the first attempt",
                "Screenshot OCR and pasted text stay as fallbacks",
                "Output is a score, risks, missing proof, and offer guidance",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[rgba(32,40,35,0.08)] bg-[var(--canvas)] px-3 py-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--racing-green)]" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <section
            id="analyzer"
            className="rounded-[1.35rem] border border-[rgba(32,40,35,0.10)] bg-white p-4 text-[var(--graphite)] shadow-[0_30px_90px_-58px_rgba(32,40,35,0.55)] sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-[var(--racing-green)]">Deal check</p>
                <h2 className="mt-1 text-2xl font-black">Check a listing</h2>
              </div>
              <a
                href="#market-data"
                className="rounded-full border border-[rgba(18,61,51,0.16)] bg-[rgba(18,61,51,0.06)] px-3 py-2 text-xs font-black text-[var(--racing-green)] transition hover:-translate-y-1 hover:bg-[rgba(18,61,51,0.10)]"
              >
                Groq engine
              </a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label="Listing input methods">
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
                        setError("");
                        setSourceNotice("");
                      }}
                      className={`group grid min-h-24 gap-2 rounded-2xl border p-3 text-left transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white ${
                        inputType === method.value
                          ? "border-[rgba(18,61,51,0.32)] bg-[rgba(18,61,51,0.08)] text-[var(--graphite)] shadow-sm"
                          : "border-[rgba(32,40,35,0.10)] bg-[var(--canvas)] text-[#5d6862] hover:bg-white"
                      }`}
                    >
                      <Icon className={`h-5 w-5 transition group-hover:scale-110 ${inputType === method.value ? "text-[var(--racing-green)]" : "text-[var(--champagne)]"}`} aria-hidden="true" />
                      <span className="text-sm font-black">{method.label}</span>
                      <span className={`text-xs leading-4 ${inputType === method.value ? "text-neutral-600" : "text-[#68756f]"}`}>{method.note}</span>
                    </a>
                  );
                })()
              ))}
            </div>

            <div className="mt-5">
              {inputType === "url" ? (
                <div className="grid gap-3">
                  <label className="grid gap-2">
                    <span className="text-sm font-black text-[var(--graphite)]">Listing URL</span>
                    <span className="text-sm leading-6 text-[#68756f]">Paste the public listing page. Dealscan extracts the listing text first, then sends the extracted details to Groq.</span>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        value={listingUrl}
                        onChange={(event) => {
                          setListingUrl(event.target.value);
                          setLastExtractedUrl("");
                        }}
                        placeholder="https://www.example.com/listing/2019-toyota-camry"
                        className="input flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          void extractListingFromUrl().catch((caughtError) => {
                            setError(caughtError instanceof Error ? caughtError.message : "Could not extract that listing.");
                          });
                        }}
                        disabled={isBusy}
                        className="btn-outline !rounded-2xl !border-[rgba(18,61,51,0.20)] !text-[var(--racing-green)] hover:!bg-[rgba(18,61,51,0.06)]"
                      >
                        <FileSearch className="h-5 w-5" aria-hidden="true" />
                        Extract
                      </button>
                    </div>
                  </label>
                  {listingText ? (
                    <label className="grid gap-2">
                      <span className="text-sm font-black text-[var(--graphite)]">Extracted listing text</span>
                      <textarea
                        value={listingText}
                        onChange={(event) => setListingText(event.target.value)}
                        rows={4}
                        maxLength={LISTING_TEXT_MAX_LENGTH}
                        className="textarea"
                      />
                    </label>
                  ) : null}
                </div>
              ) : null}

              {inputType === "text" ? (
                <label className="grid gap-2">
                  <span className="text-sm font-black text-[var(--graphite)]">Listing text</span>
                  <span className="text-sm leading-6 text-[#68756f]">Copy the seller description exactly. Include price, mileage, title, VIN, and seller claims when available.</span>
                  <textarea
                    value={listingText}
                    onChange={(event) => setListingText(event.target.value)}
                    rows={5}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    placeholder="Example: 2019 Toyota Camry LE, 72,000 miles, clean title, one owner, asking $15,900..."
                    className="textarea sm:min-h-44"
                  />
                </label>
              ) : null}

              {inputType === "screenshot" ? (
                <div className="grid gap-4">
                  <label className="grid min-h-24 cursor-pointer place-items-center rounded-lg border border-dashed border-[rgba(32,40,35,0.18)] bg-[var(--canvas)] p-4 text-center transition hover:-translate-y-1 hover:border-[var(--racing-green)] hover:bg-white focus-within:ring-2 focus-within:ring-[var(--racing-green)]">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleScreenshotChange} aria-label="Upload listing screenshot" />
                    <span className="grid justify-items-center gap-2">
                      <Camera className="h-8 w-8 text-[var(--champagne)]" aria-hidden="true" />
                      <span className="text-base font-black">Upload screenshot</span>
                      <span className="text-sm text-[#68756f]">Auto-extracts text. You can also type manually below.</span>
                    </span>
                  </label>
                  {screenshotPreviewUrl ? (
                    <img src={screenshotPreviewUrl} alt="Uploaded listing screenshot preview" className="max-h-36 w-full rounded-lg border border-[rgba(32,40,35,0.12)] object-contain" />
                  ) : null}
                  <textarea
                    value={listingText}
                    onChange={(event) => setListingText(event.target.value)}
                    rows={3}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    placeholder="OCR text appears here after upload. Edit or type manually..."
                    className="textarea"
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
                      <label key={key} className="grid gap-1 text-xs font-black uppercase text-[#68756f]">
                        {label}
                        <input
                          value={manualDetails[key as keyof ManualDetails] ?? ""}
                          onChange={(event) => updateManualField(key as keyof ManualDetails, event.target.value)}
                          placeholder={placeholder}
                          className="input"
                        />
                      </label>
                    ))}
                  </div>
                  <label className="grid gap-1 text-xs font-black uppercase text-[#68756f]">
                    Seller Notes
                    <textarea
                      value={manualDetails.sellerNotes ?? ""}
                      onChange={(event) => updateManualField("sellerNotes", event.target.value)}
                      rows={3}
                      maxLength={1800}
                      placeholder="Add condition, options, maintenance, accident history, or unclear claims."
                      className="textarea"
                    />
                  </label>
                </div>
              ) : null}
            </div>

            <div className="card mt-4">
              <div className="flex items-center justify-between gap-3 text-xs font-black uppercase text-[#68756f]">
                <span>Try a sample listing</span>
                <span>{analysisText.length} / {LISTING_TEXT_MAX_LENGTH}</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {exampleListings.map((example) => (
                  <button
                    key={example.id}
                    type="button"
                    onClick={() => loadExampleListing(example.text)}
                    className="group w-full rounded-xl border border-[rgba(32,40,35,0.10)] bg-white/70 p-3 text-left transition hover:-translate-y-1 hover:border-[var(--racing-green)] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--racing-green)]"
                  >
                    <span className="block text-sm font-black text-[var(--graphite)] transition group-hover:text-[var(--racing-green)]">{example.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#68756f]">{example.tone}</span>
                  </button>
                ))}
              </div>
            </div>

            {error ? <div className="mt-4"><ErrorState message={error} /></div> : null}
            {sourceNotice ? (
              <p className="notice mt-4">
                {sourceNotice}
              </p>
            ) : null}
            {isBusy ? <div className="mt-4"><LoadingState /></div> : null}

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  if (!isBusy) {
                    void analyzeListing();
                  }
                }}
                aria-label="Scan listing and generate deal score"
                className={`group btn-pill min-w-52 ${
                  isBusy ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <SearchCheck className="h-5 w-5 transition group-hover:rotate-12 group-hover:scale-125" aria-hidden="true" />
                Scan Listing
              </button>
            </div>
          </section>
        </div>
      </section>

      <section id="resources" className="bg-[var(--paper)] px-5 py-16 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto grid max-w-[1560px] gap-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-sm font-black uppercase text-[var(--racing-green)]">Buyer tools</p>
            <h2 className="mt-2 text-4xl font-black">Quick links before you buy.</h2>
            <p className="mt-4 text-lg leading-8 text-neutral-700">
              History, inspection, insurance, payments, and simple tools.
            </p>
            <a href="/affiliate-links" className="btn-pill mt-5 !min-h-11 !rounded-full !bg-[var(--graphite)] !text-[var(--ivory)] hover:!bg-[var(--racing-green)]">
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
                  className="card-hover group flex items-center justify-between"
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

      <section id="market-data" className="bg-[var(--mist)] px-5 py-16 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase text-[var(--racing-green)]">Engine</p>
              <h2 className="mt-2 text-3xl font-black">URL extraction. Groq scoring. Clear output.</h2>
            </div>
            <p className="text-lg leading-8 text-[#52615b]">
              Dealscan turns rough listing pages into structured buyer guidance: score, risks, missing details, and what to ask next.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "URL extraction", note: "Public listing pages are fetched first so copy paste is no longer the default path.", icon: LinkIcon, href: "#analyzer" },
              { title: "Groq scoring", note: "Server-side Groq analysis scores price, mileage, title, condition, red flags, and missing details.", icon: LineChart, href: "#market-data" },
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
                  className="rounded-2xl border border-[rgba(32,40,35,0.10)] bg-white/75 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] transition hover:-translate-y-1.5 hover:border-[rgba(18,61,51,0.24)] hover:bg-white"
                >
                  <Icon className="h-7 w-7 text-[var(--racing-green)]" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#68756f]">{item.note}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-[rgba(244,240,232,0.94)] px-5 py-16 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">See it in action</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">What you get with every scan</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">
            Paste any listing and get a full breakdown in seconds — score, flags, pricing, and what to ask the seller.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card-hover">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-[rgba(201,168,106,0.14)]">
                <Gauge className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-black">Deal Score &amp; Verdict</h3>
              <p className="mt-3 text-base leading-7 text-neutral-600">
                A clear 0–100 score with a verdict: Great Deal, Decent Deal, Proceed with Caution, or Avoid. Know instantly if it&apos;s worth your time.
              </p>
            </div>
            <div className="card-hover">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-[rgba(201,168,106,0.14)]">
                <FileSearch className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-black">Red &amp; Green Flags</h3>
              <p className="mt-3 text-base leading-7 text-neutral-600">
                We scan for 17 red flag patterns (salvage, flood, no title) and 12 green flags (service records, one owner, clean Carfax).
              </p>
            </div>
            <div className="card-hover">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-[rgba(201,168,106,0.14)]">
                <BadgeDollarSign className="h-7 w-7 text-[var(--champagne)]" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-black">Price Range &amp; Offer Target</h3>
              <p className="mt-3 text-base leading-7 text-neutral-600">
                Fair market range, suggested offer, and negotiation talking points. Know what to pay before you message the seller.
              </p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <a
              href="#analyzer"
              onClick={(event) => {
                event.preventDefault();
                window.setTimeout(() => {
                  document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="btn-pill !bg-[var(--graphite)] !text-[var(--ivory)] hover:!bg-[var(--racing-green)]"
            >
              <SearchCheck className="h-5 w-5" aria-hidden="true" />
              Try it now
            </a>
          </div>
        </div>
      </section>

      <section id="waitlist" className="relative overflow-hidden bg-[var(--racing-green)] px-5 py-16 text-[var(--ivory)] sm:px-7">
        <div className="absolute left-[-12rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[rgba(201,168,106,0.10)] blur-3xl" />
        <div className="absolute right-[-10rem] bottom-[-6rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(18,61,51,0.35)] blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase text-[var(--champagne)]">Stay updated</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Get better at buying cars</h2>
          <p className="mt-4 text-lg leading-8 text-[var(--silver)]">
            New features, market insights, and car-buying tips. No spam, just useful tools.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              const input = form.elements.namedItem("email") as HTMLInputElement;
              const button = form.querySelector("button[type=submit]") as HTMLButtonElement;
              const status = form.querySelector("[data-waitlist-status]") as HTMLElement;
              if (!input?.value) return;
              button.disabled = true;
              button.textContent = "Subscribing...";
              try {
                const res = await fetch("/api/waitlist", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email: input.value }),
                });
                const data = await res.json();
                if (status) {
                  status.textContent = data.message || "Thanks for subscribing!";
                  status.style.display = "block";
                }
                input.value = "";
              } catch {
                if (status) {
                  status.textContent = "Something went wrong. Try again.";
                  status.style.display = "block";
                }
              } finally {
                button.disabled = false;
                button.textContent = "Subscribe";
              }
            }}
          >
            <label className="sr-only" htmlFor="waitlist-email">Email address</label>
            <input
              id="waitlist-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="min-h-14 flex-1 rounded-2xl border border-white/20 bg-white/[0.08] px-5 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] outline-none backdrop-blur-sm placeholder:text-white/45 focus:border-[var(--champagne)] focus:ring-2 focus:ring-[rgba(201,168,106,0.30)]"
            />
            <button
              type="submit"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[var(--champagne)] px-7 text-base font-black text-[var(--graphite)] shadow-[0_18px_48px_-24px_rgba(201,168,106,0.40)] transition hover:-translate-y-1 hover:bg-[var(--ivory)] hover:shadow-[0_18px_48px_-24px_rgba(244,240,232,0.50)]"
            >
              Subscribe
            </button>
          </form>
          <p data-waitlist-status className="mt-4 hidden text-sm font-bold text-[var(--success)]" />
          <p className="mt-2 text-sm text-white/45">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <section id="faq" className="bg-[rgba(244,240,232,0.94)] px-5 py-16 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-black uppercase text-[var(--racing-green)]">FAQ</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Frequently asked questions</h2>
          <div className="mt-10 grid gap-4">
            {[
              {
                q: "How does the deal score work?",
                a: "The score (0–100) is calculated by a local heuristic engine that checks price, mileage, title status, red flags, green flags, and missing information. When available, Groq AI enhances the analysis for deeper insights.",
              },
              {
                q: "Is Dealscan free to use?",
                a: "Yes, the listing analyzer is completely free. We may introduce premium features later (market data integrations, saved listings, alerts), but the core analysis will remain free.",
              },
              {
                q: "What marketplaces does it work with?",
                a: "It works with any public listing page — Craigslist, Facebook Marketplace, Cars.com, Autotrader, CarGurus, and dealer inventory pages. Just paste the URL or copy-paste the listing text.",
              },
              {
                q: "Do you store my listings or personal data?",
                a: "No. Analysis is done server-side but we don't log or store listing text, URLs, or personal information. Results are cached temporarily to avoid redundant API calls.",
              },
              {
                q: "Can I use it on mobile?",
                a: "Yes. Dealscan works on any device with a modern browser. You can paste URLs, text, or upload screenshots directly from your phone.",
              },
              {
                q: "How accurate is the pricing estimate?",
                a: "Pricing estimates are rough calculations based on the listing details and basic market heuristics. They are labeled as estimates and should not replace licensed market data or professional appraisals.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="card-hover !p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-black text-[var(--graphite)]">
                  <span>{q}</span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--champagne)] transition group-open:rotate-90" aria-hidden="true" />
                </summary>
                <p className="mt-4 text-base leading-7 text-neutral-600">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(255,255,255,0.12)] bg-[var(--charcoal)] px-5 py-12 text-[#cbd3ce] sm:px-7">
        <div className="mx-auto max-w-[1560px]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="text-2xl font-black text-[var(--ivory)]">Dealscan.dev</div>
              <div className="mt-1 text-[11px] font-bold uppercase text-[var(--champagne)]">Listing review</div>
              <p className="mt-4 max-w-xs text-sm leading-7 text-[var(--silver)]">
                Data-backed used car deal checker. Know the car, not the hype.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--ivory)]">Product</h3>
              <ul className="mt-4 grid gap-3 text-sm font-bold">
                <li><a href="#analyzer" className="transition hover:text-[var(--champagne)]">Analyze a listing</a></li>
                <li><a href="#how-it-works" className="transition hover:text-[var(--champagne)]">How it works</a></li>
                <li><a href="#faq" className="transition hover:text-[var(--champagne)]">FAQ</a></li>
                <li><a href="/affiliate-links" className="transition hover:text-[var(--champagne)]">Buyer tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--ivory)]">Resources</h3>
              <ul className="mt-4 grid gap-3 text-sm font-bold">
                <li><a href={partnerLinks.carfax} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Carfax report</a></li>
                <li><a href={partnerLinks.inspection} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">PPI booking</a></li>
                <li><a href={partnerLinks.insurance} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Insurance quote</a></li>
                <li><a href={partnerLinks.payments} target="_blank" rel="sponsored noopener noreferrer" className="transition hover:text-[var(--champagne)]">Loan calculator</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-[var(--ivory)]">Company</h3>
              <ul className="mt-4 grid gap-3 text-sm font-bold">
                <li><span className="text-white/40">Contact: hello@dealscan.dev</span></li>
                <li><span className="text-white/40">Built by Car IQ Inc.</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/35">
            <p>Dealscan.dev provides estimates based on listing information, not guarantees. Always verify title, history, and condition before purchasing.</p>

          </div>
        </div>
      </footer>

    </main>
  );
}
