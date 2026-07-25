import { CheckCircle2, Loader2, ScanText, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export type AnalysisPhase = "scraping" | "reading" | "analyzing";

// Only phases the client can actually observe. The previous four steps advanced
// on a setTimeout ladder and finished at 6s regardless of what the request was
// doing, so the checklist routinely claimed to be working after the analysis had
// returned, or sat fully ticked while it was still open.
const PHASE_ORDER: AnalysisPhase[] = ["scraping", "reading", "analyzing"];

const PHASE_COPY: Record<AnalysisPhase, { label: string; icon: typeof Search }> = {
  scraping: { label: "Fetching the listing", icon: Search },
  reading: { label: "Reading the screenshot", icon: ScanText },
  analyzing: { label: "Analyzing the listing", icon: Sparkles },
};

// Measured against production on 2026-07-24. A single flat estimate was wrong on
// every path: pasted text returns in ~3.4s while a URL adds a 5-10s scrape first.
// Summing only the phases that will actually run keeps the promise honest.
const PHASE_ESTIMATE_MS: Record<AnalysisPhase, number> = {
  scraping: 7_000,
  reading: 4_000,
  analyzing: 4_000,
};

type LoadingStateProps = {
  phase: AnalysisPhase;
  /** Phases that will not run for this request, e.g. no screenshot to read. */
  skip?: AnalysisPhase[];
};

export function LoadingState({ phase, skip = [] }: LoadingStateProps) {
  const [overtime, setOvertime] = useState(false);

  const steps = PHASE_ORDER.filter((p) => !skip.includes(p));
  const activeIndex = steps.indexOf(phase);
  const estimateMs = steps.reduce((total, p) => total + PHASE_ESTIMATE_MS[p], 0);

  useEffect(() => {
    const timer = setTimeout(() => setOvertime(true), estimateMs);
    return () => clearTimeout(timer);
  }, [estimateMs]);

  return (
    <div
      className="rounded-2xl border border-[rgba(169,130,83,0.18)] bg-[rgba(244,240,232,0.96)] p-6 shadow-[0_24px_70px_-46px_rgba(11,13,16,0.80)]"
      role="status"
      aria-live="polite"
    >
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-[var(--champagne)]" aria-hidden="true" />
          <div>
            <p className="text-lg font-black text-[var(--graphite)]">
              {PHASE_COPY[phase].label}...
            </p>
            <p className="text-sm text-[var(--text-body)]">
              {overtime
                ? "Taking longer than usual, still working"
                : `This usually takes about ${Math.round(estimateMs / 1000)} seconds`}
            </p>
          </div>
        </div>
        <div className="grid gap-3">
          {steps.map((step, index) => {
            const isComplete = activeIndex > index;
            const isActive = activeIndex === index;
            const Icon = PHASE_COPY[step].icon;

            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-bold transition-all duration-500 ${
                  isComplete
                    ? "border-[rgba(124,169,130,0.30)] bg-[rgba(124,169,130,0.10)] text-[var(--racing-green)]"
                    : isActive
                      ? "border-[rgba(169,130,83,0.40)] bg-[rgba(169,130,83,0.10)] text-[var(--graphite)]"
                      : "border-transparent text-neutral-400"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-all duration-500 ${
                    isComplete
                      ? "text-[var(--success)]"
                      : isActive
                        ? "text-[var(--champagne)]"
                        : "text-neutral-300"
                  } ${isActive ? "breathe" : ""}`}
                  aria-hidden="true"
                />
                <span>{PHASE_COPY[step].label}</span>
                {isComplete && <CheckCircle2 className="ml-auto h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
