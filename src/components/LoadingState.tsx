import { CheckCircle2, Gauge, Search, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { label: "Checking price against market data", icon: Gauge },
  { label: "Scanning for red flags and hidden issues", icon: Search },
  { label: "Evaluating seller transparency", icon: ShieldCheck },
  { label: "Generating negotiation strategy", icon: CheckCircle2 },
];

export function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep >= steps.length) return;
    const delay = activeStep === 0 ? 600 : 1800;
    const timer = setTimeout(() => setActiveStep((s) => s + 1), delay);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <div
      className="rounded-2xl border border-[rgba(201,168,106,0.18)] bg-[rgba(244,240,232,0.96)] p-6 shadow-[0_24px_70px_-46px_rgba(11,13,16,0.80)]"
      role="status"
    >
      <div className="grid gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 animate-spin place-items-center rounded-full border-2 border-[var(--champagne)] border-t-transparent">
            <div className="h-2 w-2 rounded-full bg-[var(--champagne)]" />
          </div>
          <div>
            <p className="text-lg font-black text-[var(--graphite)]">Analyzing listing...</p>
            <p className="text-sm text-neutral-600">This takes about 10 seconds</p>
          </div>
        </div>
        <div className="grid gap-3">
          {steps.map((step, index) => {
            const isComplete = index < activeStep;
            const isActive = index === activeStep;
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-bold transition-all duration-500 ${
                  isComplete
                    ? "border-[rgba(124,169,130,0.30)] bg-[rgba(124,169,130,0.10)] text-[var(--racing-green)]"
                    : isActive
                      ? "border-[rgba(201,168,106,0.40)] bg-[rgba(201,168,106,0.10)] text-[var(--graphite)]"
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
                  } ${isActive ? "animate-pulse" : ""}`}
                  aria-hidden="true"
                />
                <span>{step.label}</span>
                {isComplete && <CheckCircle2 className="ml-auto h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
