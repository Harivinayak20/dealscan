"use client";

import { SearchCheck, ShoppingCart } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { ResultSummary } from "@/components/ResultSummary";
import { CompareView } from "@/components/CompareView";
import type { SavedResult } from "@/components/CompareView";
import { generateDealSummary } from "@/lib/generate-summary";
import { loadSavedResults, saveSavedResults } from "@/lib/local-storage";
import { extractVin } from "@/lib/vin-decoder";
import type { VinDecodeResult } from "@/lib/vin-decoder";

import type { AnalysisMode, AnalyzeListingRequest, AnalyzeListingResult, InputType } from "@/lib/analyzer-types";
import type { ListingMemory, MarketContext } from "@/lib/listing-memory";
import { CompareInputPanel } from "@/components/CompareInputPanel";
import { ComparisonResultView } from "@/components/ComparisonResultView";
import { AdUnit } from "@/components/AdUnit";
import { ADSENSE_HOME_SLOT } from "@/lib/adsense";
import type { ComparisonResult, ListingDraft } from "@/lib/compare-listings";
import { computeComparison, draftToRequestText, draftVehicleTitle } from "@/lib/compare-listings";
import { partnerLinks } from "@/lib/integration-links";
import { getListingTextError, LISTING_TEXT_MAX_LENGTH } from "@/lib/listing-validation";
import { Logo } from "@/components/Logo";
import { HeroDemoCard } from "@/components/HeroDemoCard";
import { faqs } from "@/lib/faqs";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

const exampleListings = [
  {
    id: "great",
    label: "Great deal",
    text: "2018 Toyota Camry LE, 72,000 miles, Austin, TX, clean title, one owner, service records available, new tires, recent maintenance, no accidents reported, cold AC, asking $15,900. VIN and title photo available.",
  },
  {
    id: "caution",
    label: "Caution",
    text: "2016 BMW M3 Sedan, 74,000 miles, Austin, TX, title status unclear, 6-speed manual, asking $28,500. Seller says there are minor issues, limited photos, no service history provided, sold as-is, and price is firm.",
  },
  {
    id: "avoid",
    label: "Avoid",
    text: "2009 Nissan Altima, 181,000 miles, Dallas, TX, no title, runs rough, needs work, as-is, cash only, check engine light on, asking $2,400. Seller says it may need transmission work.",
  },
  {
    id: "vague",
    label: "Vague",
    text: "Honda Civic runs good. Price not listed. Mileage not listed. Text me for details.",
  },
];

// Hero composer input modes, per the design handoff (mode pill + dropdown).
const composerModes = {
  link: { label: "Link", title: "Listing link", note: "Fastest, paste any ad URL", ph: "Paste a listing link…", glyph: "↳" },
  details: { label: "Details", title: "Paste details", note: "The ad text or seller notes", ph: "Paste the ad text or seller notes…", glyph: "≡" },
  photo: { label: "Photo", title: "Upload photo", note: "Use a listing screenshot", ph: "Upload a listing screenshot…", glyph: "▤" },
  vin: { label: "VIN", title: "VIN or plate", note: "Look up by VIN or license plate", ph: "Enter a VIN or license plate…", glyph: "#" },
} as const;

type HeroMode = keyof typeof composerModes;

const heroModeToInputType: Record<HeroMode, InputType> = {
  link: "url",
  details: "text",
  photo: "screenshot",
  vin: "text",
};

// Native partner placements: one blended row + the top utility links only.
// Deliberately no side rails or drawer promos to keep the site non-invasive.
const partnerOffers = [
  { glyph: "%", title: "Compare auto loan rates", note: "Estimate payments before the dealer does", href: partnerLinks.loan },
  { glyph: "◑", title: "Compare insurance", note: "Quotes from top carriers in minutes", href: partnerLinks.insurance },
  { glyph: "◈", title: "Vehicle history report", note: "Check accidents, title, and odometer", href: partnerLinks.carfax },
];

function vehicleTitleFromText(text: string) {
  const match = text.match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+(?:\s+[A-Za-z0-9-]+){0,4}/);

  return match?.[0].replace(/,$/, "") ?? "Used Car Analysis";
}

export function AnalyzerApp() {
  const [inputType, setInputType] = useState<InputType>("url");
  const [heroMode, setHeroMode] = useState<HeroMode>("link");
  const [menuOpen, setMenuOpen] = useState(false);
  const [vinValue, setVinValue] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [lastExtractedUrl, setLastExtractedUrl] = useState("");
  const [listingText, setListingText] = useState("");
  const [screenshotPreviewUrl, setScreenshotPreviewUrl] = useState<string | null>(null);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeListingResult | null>(null);
  const [listingMemory, setListingMemory] = useState<ListingMemory | null>(null);
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("groq");
  const [notice, setNotice] = useState("");
  const [viewMode, setViewMode] = useState<"analyzer" | "result" | "compare" | "comparison-result">("analyzer");
  const [savedResults, setSavedResults] = useState<SavedResult[]>(() => loadSavedResults<SavedResult>());
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [error, setError] = useState("");
  const [sourceNotice, setSourceNotice] = useState("");
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const analysisText = listingText.trim();
  const isBusy = isLoading || isScraping || isOcrLoading || isComparing;

  useEffect(() => {
    saveSavedResults(savedResults);
  }, [savedResults]);

  function pickComposerMode(mode: HeroMode) {
    setHeroMode(mode);
    setInputType(heroModeToInputType[mode]);
    setMenuOpen(false);
    setError("");
    setSourceNotice("");
  }

  async function handleComposerSubmit() {
    if (isBusy) return;

    if (heroMode === "vin") {
      setError("");
      setResult(null);
      setNotice("");
      const vin = vinValue.trim();
      if (!vin) {
        setError("Enter a VIN or license plate first.");
        return;
      }
      await submitAnalysis({
        inputType: "text",
        listingText: `VIN or plate: ${vin}. Evaluate this vehicle listing.`,
      });
      return;
    }

    await analyzeListing(heroModeToInputType[heroMode]);
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
    setSourceNotice("Reading the listing photo...");

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
      setSourceNotice("Listing details found. Review them, then check the deal.");

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
        setError("Photo reading is not available right now. Paste the seller notes instead.");
      } else {
        setError(`${msg}. You can still paste the seller notes in the field below.`);
      }
    }
  }

  async function extractListingFromUrl() {
    const url = listingUrl.trim();

    if (!url) {
      throw new Error("Enter a listing URL first.");
    }

    setIsScraping(true);
    setSourceNotice("Checking the listing page...");

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
      setSourceNotice(`Found details for ${data.listing.title}. Review them, then check the deal.`);

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
        listingMemory?: ListingMemory | null;
        marketContext?: MarketContext | null;
      };

      setResult(data.result);
      setListingMemory(data.listingMemory ?? null);
      setMarketContext(data.marketContext ?? null);
      setViewMode("result");
      setAnalysisMode(data.analysisMode ?? "groq");
      if (data.notice) {
        setNotice(data.notice);
        setTimeout(() => setNotice(""), 8000);
      }
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
    });
  }

  useKeyboardShortcut("Enter", (event) => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === "TEXTAREA" || target.tagName === "INPUT";
    if (isInput && (event.metaKey || event.ctrlKey) && !isBusy) {
      event.preventDefault();
      void analyzeListing();
    }
  });

  async function analyzeCompare(a: ListingDraft, b: ListingDraft) {
    setIsComparing(true);
    setError("");
    setComparisonResult(null);

    async function analyzeDraft(draft: ListingDraft): Promise<AnalyzeListingResult | null> {
      const text = draftToRequestText(draft);
      if (!text) return null;
      try {
        const res = await fetch("/api/analyze-listing", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ inputType: "text", listingText: text, sourceUrl: draft.state === "url" ? draft.url : undefined }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(errBody.error || `Server returned ${res.status}`);
        }
        const data = await res.json() as { result: AnalyzeListingResult };
        return data.result;
      } catch (err) {
        throw err;
      }
    }

    let resultA: AnalyzeListingResult | null = null;
    let resultB: AnalyzeListingResult | null = null;
    try {
      [resultA, resultB] = await Promise.all([analyzeDraft(a), analyzeDraft(b)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
      setIsComparing(false);
      return;
    }

    const aTitle = a.state === "url" ? draftVehicleTitle(a) : [a.manual.year, a.manual.make, a.manual.model].filter(Boolean).join(" ") || "Car A";
    const bTitle = b.state === "url" ? draftVehicleTitle(b) : [b.manual.year, b.manual.make, b.manual.model].filter(Boolean).join(" ") || "Car B";

    const comp = computeComparison(resultA, resultB);
    setComparisonResult({
      ...comp,
      aTitle: aTitle || comp.aTitle,
      bTitle: bTitle || comp.bTitle,
    });
    setViewMode("comparison-result");
    setIsComparing(false);
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
    setListingMemory(null);
    setMarketContext(null);
    setError("");
    setNotice("");
    setInputType("url");
    setHeroMode("link");
    setMenuOpen(false);
    setVinValue("");
    setListingUrl("");
    setListingText("");
    setScreenshotPreviewUrl(null);
    setScreenshotDataUrl(null);
    setViewMode("analyzer");
  }

  if (comparisonResult && viewMode === "comparison-result") {
    return (
      <ComparisonResultView
        comparison={comparisonResult}
        onBack={() => { setViewMode("analyzer"); setComparisonResult(null); }}
      />
    );
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
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-slide-down rounded-2xl border border-[rgba(169,130,83,0.35)] bg-[var(--ivory)] px-5 py-3 text-sm font-bold text-[var(--graphite)] shadow-xl">
            {notice}
          </div>
        ) : null}
        <ResultSummary
          result={result}
          analysisMode={analysisMode}
          listingMemory={listingMemory}
          marketContext={marketContext}
          sourceUrl={inputType === "url" ? listingUrl.trim() || undefined : undefined}
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
    <main className="min-h-screen overflow-x-clip bg-[var(--canvas)] text-[var(--graphite)]">
      <div className="hidden bg-[var(--paper)] md:block">
        <div className="mx-auto flex max-w-[1180px] items-center justify-end gap-4 px-4 py-2 sm:px-7">
          <div className="hidden items-center gap-5 text-[13px] font-semibold md:flex">
            <a href={partnerLinks.loan} target="_blank" rel="sponsored noopener noreferrer" className="text-[var(--text-muted)] transition hover:text-[var(--racing-green)]">Get financing →</a>
            <a href={partnerLinks.insurance} target="_blank" rel="sponsored noopener noreferrer" className="text-[var(--text-muted)] transition hover:text-[var(--racing-green)]">Insurance quotes →</a>
            <a href={partnerLinks.carfax} target="_blank" rel="sponsored noopener noreferrer" className="text-[var(--text-muted)] transition hover:text-[var(--racing-green)]">Vehicle history →</a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--overlay)] text-[var(--graphite)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-3 gap-y-3 px-5 py-3 sm:flex-nowrap sm:px-7 sm:py-4">
          <span className="order-1 text-left text-lg">
            <Logo />
          </span>

          <nav
            className="order-3 flex w-full items-center justify-center gap-1 rounded-full border border-[var(--line)] bg-[var(--paper)] p-1.5 text-sm font-semibold shadow-[0_8px_24px_-14px_rgba(60,40,28,0.28)] sm:order-2 sm:w-auto sm:gap-0.5 sm:p-1"
            aria-label="Primary"
          >
            <a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
              className="hidden rounded-full px-3.5 py-1.5 text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] lg:inline"
            >
              How it works
            </a>
            <Link href="/how-scoring-works" className="hidden rounded-full px-3.5 py-1.5 text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] lg:inline">
              Scoring
            </Link>
            <Link href="/guides" className="flex-1 rounded-full px-3.5 py-2.5 text-center text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] sm:flex-none sm:py-1.5">
              Guides
            </Link>
            <Link href="/cars" className="flex-1 rounded-full px-3.5 py-2.5 text-center text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] sm:flex-none sm:py-1.5">
              Car checks
            </Link>
            <Link href="/compare" className="hidden rounded-full px-3.5 py-1.5 text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] md:inline">
              Compare
            </Link>
            <Link href="/fees" className="hidden rounded-full px-3.5 py-1.5 text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] md:inline">
              Fees
            </Link>
            <Link href="/vin" className="hidden rounded-full px-3.5 py-1.5 text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] md:inline">
              VIN
            </Link>
            <Link href="/price-checker" className="flex-1 rounded-full px-3.5 py-2.5 text-center text-[var(--graphite)] transition hover:bg-[var(--accent-2-soft)] hover:text-[var(--racing-green)] sm:flex-none sm:py-1.5">
              Price checker
            </Link>
            {savedResults.length > 0 ? (
              <button
                type="button"
                onClick={() => setViewMode("compare")}
                className="relative flex items-center gap-1.5 rounded-full bg-[var(--racing-green)] px-3 py-1.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                Compare
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-[var(--racing-green)]">
                  {savedResults.length}
                </span>
              </button>
            ) : null}
          </nav>

          <div className="order-2 flex items-center sm:order-3">
            <a href="#analyzer" className="btn-pill !min-h-11 !px-4 !text-xs sm:!min-h-12 sm:!px-7 sm:!text-sm">
              Check a Listing
            </a>
          </div>
        </div>
      </header>

      <section id="hero" className="hero-sheen relative overflow-hidden px-4 py-8 sm:px-7 sm:py-14 lg:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/4 left-1/2 h-[70%] w-[min(70vw,720px)] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(26,22,19,0.05), transparent 70%)" }}
        />
        <div className="relative z-[2] mx-auto grid max-w-[1180px] items-center gap-10 md:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow text-[13px]">Used-car listing check</p>
            <h1 className="mt-4 font-display text-[clamp(40px,9vw,66px)] font-extrabold leading-[0.98] tracking-[-0.035em] text-[var(--graphite)]">
              <span className="rise rise-1 block">Find out if</span>
              <span className="rise rise-2 block">this listing is</span>
              <span className="rise rise-3 block text-[var(--racing-green)]">worth it.</span>
            </h1>
            <p className="mt-5 max-w-[460px] text-[clamp(16px,4.4vw,20px)] leading-[1.5] text-[var(--text-body)]">
              Paste any car listing and get a deal score, the red flags, and the price you should actually offer, in about 10 seconds.
            </p>

            <div id="analyzer" className="relative mt-8 max-w-[566px]">
              <div className="flex flex-wrap gap-2 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[var(--paper)] p-2 shadow-[0_22px_50px_-20px_rgba(0,0,0,0.6)]">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-label="Choose how to check a listing"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[var(--chip)] px-4 py-3 text-[15px] font-semibold text-[var(--text-muted)] transition hover:text-[var(--graphite)]"
                >
                  {composerModes[heroMode].label}
                  <span className="text-[10px] opacity-65" aria-hidden="true">▼</span>
                </button>
                {heroMode === "photo" ? (
                  <label className="flex min-w-[120px] flex-1 cursor-pointer items-center px-1.5 text-base text-[var(--muted)]">
                    <input type="file" accept="image/*" className="sr-only" onChange={handleScreenshotChange} aria-label="Upload listing screenshot" />
                    <span className="truncate">
                      {screenshotPreviewUrl ? "Screenshot added, hit Check deal" : "Upload a listing screenshot…"}
                    </span>
                  </label>
                ) : (
                  <input
                    value={heroMode === "link" ? listingUrl : heroMode === "details" ? listingText : vinValue}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (heroMode === "link") {
                        setListingUrl(value);
                        setLastExtractedUrl("");
                      } else if (heroMode === "details") {
                        setListingText(value);
                      } else {
                        setVinValue(value);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !isBusy) {
                        event.preventDefault();
                        void handleComposerSubmit();
                      }
                    }}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    placeholder={composerModes[heroMode].ph}
                    className="min-w-[120px] flex-1 bg-transparent px-1.5 text-base text-[var(--graphite)] outline-none"
                  />
                )}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void handleComposerSubmit()}
                  aria-label="Check listing and generate deal score"
                  className="flex-[1_0_auto] rounded-xl bg-[#B4501F] px-6 py-[13px] text-base font-bold text-[#FFFDFA] transition hover:-translate-y-0.5 hover:bg-[#9A421A] hover:shadow-[0_12px_26px_-10px_rgba(180,80,31,0.6)] disabled:pointer-events-none disabled:opacity-60"
                >
                  Check deal
                </button>
              </div>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-[5]" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="absolute left-0 top-[calc(100%+8px)] z-[6] w-[min(90vw,270px)] rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-1.5 shadow-[0_26px_54px_-18px_rgba(0,0,0,0.45)]">
                    {(Object.keys(composerModes) as HeroMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => pickComposerMode(mode)}
                        className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition hover:bg-[var(--chip)]"
                      >
                        <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-[var(--chip)] font-display text-[17px] font-bold text-[var(--racing-green)]" aria-hidden="true">
                          {composerModes[mode].glyph}
                        </span>
                        <span>
                          <span className="block font-display text-[15px] font-bold text-[var(--graphite)]">{composerModes[mode].title}</span>
                          <span className="block text-xs text-[var(--muted)]">{composerModes[mode].note}</span>
                        </span>
                      </button>
                    ))}
                    <div className="mx-2 my-1 border-t border-[var(--line)]" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => {
                        setCompareMode(true);
                        setMenuOpen(false);
                        window.setTimeout(() => document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" }), 60);
                      }}
                      className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition hover:bg-[var(--chip)]"
                    >
                      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[10px] bg-[var(--chip)] font-display text-[17px] font-bold text-[var(--racing-green)]" aria-hidden="true">
                        ⇄
                      </span>
                      <span>
                        <span className="block font-display text-[15px] font-bold text-[var(--graphite)]">Compare two cars</span>
                        <span className="block text-xs text-[var(--muted)]">Score two listings side by side</span>
                      </span>
                    </button>
                  </div>
                </>
              ) : null}
            </div>

            {heroMode === "photo" && (screenshotPreviewUrl || listingText) ? (
              <div className="mt-4 max-w-[566px] rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-3">
                {screenshotPreviewUrl ? (
                  <img src={screenshotPreviewUrl} alt="Uploaded listing screenshot preview" className="max-h-32 w-full rounded-lg border border-[var(--line)] object-contain" />
                ) : null}
                {listingText ? (
                  <textarea
                    value={listingText}
                    onChange={(event) => setListingText(event.target.value)}
                    rows={3}
                    maxLength={LISTING_TEXT_MAX_LENGTH}
                    className="textarea mt-3"
                    aria-label="Listing details read from your screenshot"
                  />
                ) : null}
              </div>
            ) : null}

            <div className="mt-4 text-sm font-medium text-[var(--silver)]">
              No account needed&nbsp;&nbsp;·&nbsp;&nbsp;Email only if you want price-drop alerts&nbsp;&nbsp;·&nbsp;&nbsp;Free
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mono-label text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">New here? See a real scan</span>
              {exampleListings.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => loadExampleListing(example.text)}
                  className="rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--text-muted)] shadow-[0_2px_6px_-2px_rgba(28,26,23,0.25)] transition hover:border-[rgba(180,80,31,0.45)] hover:bg-[var(--ivory)] hover:text-[var(--racing-green)] hover:shadow-[0_4px_10px_-3px_rgba(180,80,31,0.35)]"
                >
                  {example.label}
                </button>
              ))}
            </div>

            {error ? <div className="mt-4 max-w-[566px]"><ErrorState message={error} /></div> : null}
            {sourceNotice ? <p className="notice mt-4 max-w-[566px]">{sourceNotice}</p> : null}
            {isBusy ? <div className="mt-4 max-w-[566px]"><LoadingState /></div> : null}
          </div>

          <div className="min-w-0">
            <HeroDemoCard />
          </div>
        </div>
      </section>

      {compareMode ? (
        <section id="compare" className="px-4 py-8 sm:px-7">
          <div className="mx-auto max-w-[1180px] rounded-[20px] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="eyebrow">Compare cars</p>
                <h2 className="mt-1 text-2xl font-extrabold">Compare two listings</h2>
              </div>
              <button
                type="button"
                onClick={() => setCompareMode(false)}
                className="rounded-full border border-[var(--line)] px-3.5 py-1.5 text-xs font-bold text-[var(--text-muted)] transition hover:text-[var(--graphite)]"
              >
                Close ✕
              </button>
            </div>
            <div className="mt-5">
              <CompareInputPanel
                onCompare={(a, b) => {
                  void analyzeCompare(a, b);
                }}
                isBusy={isBusy}
              />
            </div>
          </div>
        </section>
      ) : null}

      <section aria-label="Supported marketplaces" className="border-y border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-6 sm:px-7">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-7 gap-y-3">
          <span className="mono-label text-xs text-[var(--muted)]">Reads listings from</span>
          {["AutoTrader", "Cars.com", "CarGurus", "Edmunds", "TrueCar", "CarMax", "KBB"].map((name) => (
            <span key={name} className="font-display text-[clamp(16px,4vw,19px)] font-bold text-[var(--muted)] transition hover:text-[var(--graphite)]">
              {name}
            </span>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-[var(--canvas)] px-4 py-6 text-[var(--graphite)] sm:px-7 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 text-xl font-extrabold sm:text-4xl">Three steps, about ten seconds.</h2>
          <div className="mt-5 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-3">
            {[
              { n: "01", title: "Paste the link", note: "Drop in any public ad. DealScan reads the car details for you, no retyping." },
              { n: "02", title: "We check the market", note: "Price, title, and mileage are scored against real comparable sales near you." },
              { n: "03", title: "Get your verdict", note: "A clear deal score, the red flags, and a fair offer you can actually make." },
            ].map((step) => (
              <div key={step.n} className="card-hover !p-4 sm:!p-6">
                <span className="mono-label text-sm font-semibold text-[var(--racing-green)]">{step.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold sm:mt-4 sm:text-[22px]">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)] sm:mt-2 sm:text-base sm:leading-7">{step.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Partner offers" className="bg-[var(--canvas)] px-4 pb-2 text-[var(--graphite)] sm:px-7">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-display text-[17px] font-bold">Popular with buyers</span>
            <span className="mono-label text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">Sponsored</span>
          </div>
          <div className="mt-3.5 grid gap-3.5 lg:grid-cols-3">
            {partnerOffers.map((offer) => (
              <a
                key={offer.title}
                href={offer.href}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex items-center gap-3.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-22px_rgba(0,0,0,0.4)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--chip)] font-display text-[19px] font-extrabold text-[var(--racing-green)]" aria-hidden="true">
                  {offer.glyph}
                </span>
                <span>
                  <span className="block font-display text-[15.5px] font-bold text-[var(--graphite)]">{offer.title}</span>
                  <span className="mt-0.5 block text-[12.5px] text-[var(--text-muted)]">{offer.note}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Partner links may earn DealScan a commission at no cost to you. Scoring stays independent.
          </p>
        </div>
      </section>

      <section id="features" className="bg-[var(--canvas)] px-4 py-8 text-[var(--graphite)] sm:px-7 sm:py-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { glyph: "$", title: "Fair-price check", note: "See the real market value and exactly how far this asking price sits from it." },
              { glyph: "!", title: "Red-flag detection", note: "Title, mileage, and seller signals that quietly hint at trouble ahead." },
              { glyph: "?", title: "Questions to ask", note: "A tailored checklist to bring to the test drive so nothing gets missed." },
            ].map((feature) => (
              <div key={feature.title} className="card-hover">
                <div className="grid h-10 w-10 place-items-center rounded-[11px] bg-[var(--chip)] font-display text-[20px] font-extrabold text-[var(--racing-green)]" aria-hidden="true">
                  {feature.glyph}
                </div>
                <h3 className="mt-4 font-display text-[20px] font-bold">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-[var(--text-muted)]">{feature.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sample" className="border-y border-[var(--border-subtle)] bg-[var(--paper)] px-4 py-8 text-[var(--graphite)] sm:px-7 sm:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="eyebrow">A real scan</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Every scan ends with a number and a next step.</h2>
            <p className="mt-4 max-w-[400px] text-lg leading-[1.55] text-[var(--text-muted)]">
              No jargon, no dashboards to learn. Just how good the deal is, why, and what to offer.
            </p>
          </div>
          <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[var(--ivory)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-5">
              <div
                className="grid h-[110px] w-[110px] shrink-0 place-items-center rounded-full"
                style={{ background: "conic-gradient(#3F8A5B 0% 82%, var(--line) 82% 100%)" }}
                aria-label="Sample deal score: 82 out of 100"
              >
                <div className="grid h-[84px] w-[84px] place-items-center rounded-full bg-[var(--ivory)] text-center">
                  <span className="font-display text-2xl font-extrabold leading-none">82</span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)]">out of 100</span>
                </div>
              </div>
              <div>
                <div className="mono-label text-[11px] text-[var(--muted)]">2019 Toyota Camry SE</div>
                <div className="font-display text-[26px] font-extrabold text-[var(--gink)]">Great deal</div>
                <div className="text-sm text-[var(--text-muted)]">Listed $18,400 · fair value ~$19,800</div>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                { label: "Price vs. market", pct: 88, note: "Strong", warn: false },
                { label: "Title & history", pct: 94, note: "Clean", warn: false },
                { label: "Mileage confidence", pct: 58, note: "Needs proof", warn: true },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{bar.label}</span>
                    <span className={bar.warn ? "text-[#8a6d3b]" : "text-[var(--gink)]"}>{bar.note}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--line)]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bar.pct}%`, background: bar.warn ? "var(--warning)" : "var(--success)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-[var(--chip)] px-4 py-3.5">
              <div>
                <div className="text-xs font-semibold text-[var(--text-muted)]">Suggested offer</div>
                <div className="font-display text-[28px] font-extrabold leading-none">$17,000</div>
              </div>
              <a href="#analyzer" className="btn-pill !min-h-11">See full report</a>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-[var(--canvas)] px-4 py-8 text-[var(--graphite)] sm:px-7 sm:py-14">
        <div className="mx-auto max-w-[1200px]">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Good to know.</h2>
          <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {faqs.slice(0, 4).map(({ q, a }) => (
              <div key={q} className="border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-[19px] font-bold text-[var(--graphite)]">{q}</h3>
                <p className="mt-2 text-base leading-7 text-[var(--text-muted)]">{a}</p>
              </div>
            ))}
          </div>
          <details className="mt-6 border-t border-[var(--line)] pt-5">
            <summary className="cursor-pointer font-display text-[19px] font-bold text-[var(--graphite)]">
              More questions
            </summary>
            <div className="mt-4 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {faqs.slice(4).map(({ q, a }) => (
                <div key={q}>
                  <h3 className="font-display text-base font-bold text-[var(--graphite)]">{q}</h3>
                  <p className="mt-2 text-base leading-7 text-[var(--text-muted)]">{a}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section id="about-dealscan" className="bg-[var(--mist)] px-4 py-8 text-[var(--graphite)] sm:px-7 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black sm:text-3xl">A smarter way to check any used car listing</h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-[var(--text-body)]">
            <p>
              Most used car listings look reasonable at first glance. The price seems fair, the mileage sounds manageable, and the seller says it runs great. The problem is that listings are written to generate interest, not to help buyers evaluate risk. A used car listing analyzer cuts through that. DealScan reads the listing you paste or link and scores the deal based on the factors that actually matter — before you spend time and money visiting.
            </p>
            <details className="group">
            <summary className="cursor-pointer text-sm font-bold text-[var(--racing-green)] underline-offset-4 hover:underline group-open:hidden">Keep reading: how the score works and the red flags that matter</summary>
            <div className="space-y-5">
            <h3 className="text-lg font-black text-[var(--graphite)]">How the deal score works</h3>
            <p>
              Paste any listing link from Craigslist, Cars.com, Autotrader, CarGurus, or a dealer website and DealScan pulls together the details automatically. You can also paste seller notes, enter the car details manually, or upload a listing screenshot. In seconds you get a 0–100 deal score with a plain verdict: Great Deal, Decent Deal, Proceed with Caution, or Avoid.
            </p>
            <p>
              The score weighs price against estimated fair market value for that year, make, mileage, and title status. It checks for red flag language — salvage, rebuilt, flood, no title, cash only, as-is, needs work — and green flag signals like service records, clean title, one owner, and recent maintenance. Missing information also counts: a listing that hides the VIN, skips mileage, or avoids interior photos is less trustworthy than one that volunteers every verifiable detail.
            </p>
            <h3 className="text-lg font-black text-[var(--graphite)]">The red flags that change the deal</h3>
            <p>
              Title status is the highest-impact variable in any used car purchase. A salvage or rebuilt title means the car was declared a total loss by an insurance company at some point. The discount it requires is not cosmetic — it reflects higher insurance premiums, financing difficulty, lower resale value, and the real risk of hidden structural damage. DealScan flags title issues at the top of every result.
            </p>
            <p>
              Mileage tells a second story when cross-checked against the car&apos;s age and maintenance history. A 2014 vehicle with 40,000 miles looks attractive, but abnormally low mileage can mean stored cars with degraded fluids and rubber. High-mileage cars from reliable makes can be strong buys if the service history supports them. The deal score weighs mileage relative to what is typical for the car&apos;s age and class.
            </p>
            <p>
              Price relative to comparable listings is where most buyers get it wrong. Pricing $3,000 to $5,000 below market almost never happens by accident. It usually signals a title problem, a mechanical issue the seller already knows about, or a listing designed to move fast. DealScan estimates a fair market range and flags significant departures in either direction.
            </p>
            <h3 className="text-lg font-black text-[var(--graphite)]">After the scan: four steps before you visit</h3>
            <p>
              A strong deal score is a starting point, not a guarantee. The four buyer steps that protect you after a good scan: pull a vehicle history report on the VIN to check accident records and title transfers; book a pre-purchase inspection from an independent mechanic before you commit; compare insurance quotes so the full monthly cost is clear; and check financing options before sitting across from a dealer finance office.
            </p>
            <p>
              DealScan links to vetted tools for all four steps after each analysis. Some of those links may be affiliate links — the deal score is never influenced by any partner relationship. The tool itself is completely free, no account required, and scan history saves only in your own browser.
            </p>
            </div>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-[var(--canvas)] px-4 py-8 sm:px-7 sm:py-14">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[26px] bg-[#1a1613] px-6 py-10 text-center sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(180,80,31,0.4)] blur-[80px]"
          />
          <h2 className="relative text-3xl font-extrabold text-[#f7f1e9] sm:text-4xl">
            Check your listing in 10 seconds.
          </h2>
          <p className="relative mt-3 text-base text-[#c7bcaf] sm:text-lg">
            Paste the link, get the score. No account, no cost, no catch.
          </p>
          <div className="relative mx-auto mt-8 flex max-w-[560px] flex-wrap gap-2 rounded-2xl bg-[#fffdfa] p-2">
            <input
              value={listingUrl}
              onChange={(event) => {
                setListingUrl(event.target.value);
                setLastExtractedUrl("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !isBusy) {
                  event.preventDefault();
                  setInputType("url");
                  setHeroMode("link");
                  document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                  void analyzeListing("url");
                }
              }}
              placeholder="Paste a listing link…"
              aria-label="Listing link"
              className="min-w-[140px] flex-1 bg-transparent px-4 text-base text-[#1a1613] outline-none placeholder:text-[#b3a89c]"
            />
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setInputType("url");
                setHeroMode("link");
                document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" });
                void analyzeListing("url");
              }}
              className="flex-[1_0_auto] rounded-xl bg-[#B4501F] px-7 py-4 text-base font-bold text-[#FFFDFA] transition hover:-translate-y-0.5 hover:bg-[#9A421A] hover:shadow-[0_12px_26px_-10px_rgba(180,80,31,0.7)] disabled:pointer-events-none disabled:opacity-60"
            >
              Check deal
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[var(--canvas)] px-5 py-8 sm:px-7">
        <AdUnit slot={ADSENSE_HOME_SLOT} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--overlay)] p-3 backdrop-blur-xl lg:hidden">
        <a
          href="#analyzer"
          onClick={(e) => { e.preventDefault(); document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" }); }}
          className="btn-pill w-full"
        >
          <SearchCheck className="h-5 w-5" aria-hidden="true" />
          Check a listing
        </a>
      </div>

    </main>
  );
}
