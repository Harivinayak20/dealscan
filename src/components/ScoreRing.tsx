import { type CSSProperties, useEffect, useLayoutEffect, useRef } from "react";
import { CheckCircle2, CircleAlert, OctagonAlert } from "lucide-react";

// The ring settles before it starts filling. Firing the scale and the fill
// together made the two motions cancel each other out.
const SETTLE_MS = 320;
const FILL_MS = 900;

// The markup renders the real score so it survives SSR and a failed hydration.
// Resetting it to 0 has to happen before paint or the answer flashes for a
// frame and then jumps back to zero.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

type ScoreRingProps = {
  score: number;
};

export function scoreTone(score: number) {
  if (score >= 80) {
    return {
      label: "Good",
      ring: "#7CA982",
      soft: "bg-[rgba(124,169,130,0.16)] text-[#3f4d36] border-[rgba(124,169,130,0.35)]",
      icon: CheckCircle2,
    };
  }

  if (score >= 60) {
    return {
      label: "Caution",
      ring: "#D6A84F",
      soft: "bg-[rgba(214,168,79,0.16)] text-[#5d4212] border-[rgba(214,168,79,0.35)]",
      icon: CircleAlert,
    };
  }

  return {
    label: "High Risk",
    ring: "#C45A4A",
    soft: "bg-[rgba(196,90,74,0.16)] text-[#61261f] border-[rgba(196,90,74,0.35)]",
    icon: OctagonAlert,
  };
}

export function ScoreRing({ score }: ScoreRingProps) {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const tone = scoreTone(clampedScore);
  const ringRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useBeforePaint(() => {
    const ring = ringRef.current;
    const number = numberRef.current;
    if (!ring || !number) return;

    const targetAngle = `${clampedScore * 3.6}deg`;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      ring.style.setProperty("--ring-angle", targetAngle);
      number.textContent = String(clampedScore);
      return;
    }

    // Rewind instantly. Without suppressing the transition, a score that
    // changes in place animates backwards to zero before refilling.
    number.textContent = "0";
    ring.style.transitionProperty = "none";
    ring.style.setProperty("--ring-angle", "0deg");
    void ring.offsetWidth;
    ring.style.transitionProperty = "";

    let frame = 0;
    const settle = window.setTimeout(() => {
      // The gradient is handed to CSS so the browser interpolates --ring-angle
      // off the main thread. The number is written straight to the DOM node,
      // which keeps the count-up from re-rendering the component ~48 times.
      ring.style.setProperty("--ring-angle", targetAngle);

      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / FILL_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = String(Math.round(clampedScore * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, SETTLE_MS);

    return () => {
      window.clearTimeout(settle);
      cancelAnimationFrame(frame);
    };
  }, [clampedScore]);

  return (
    <div
      ref={ringRef}
      className="relative grid h-48 w-48 place-items-center rounded-full shadow-[0_26px_70px_-42px_rgba(11,13,16,0.9)] animate-scale-in"
      role="img"
      aria-label={`Deal score ${clampedScore} out of 100. Risk label: ${tone.label}.`}
      style={
        {
          // Rendered filled so the markup is correct without JS; the effect
          // rewinds it to 0deg before paint when it is going to animate.
          "--ring-angle": `${clampedScore * 3.6}deg`,
          background: `conic-gradient(${tone.ring} var(--ring-angle), rgba(11,13,16,0.10) 0deg)`,
          transition: `--ring-angle ${FILL_MS}ms var(--ease-standard)`,
        } as CSSProperties
      }
    >
      <div className="grid h-36 w-36 place-items-center rounded-full bg-[var(--ivory)] text-center shadow-sm">
        <div>
          <div
            ref={numberRef}
            className="text-5xl font-black tracking-tight tabular-nums"
            style={{ color: tone.ring }}
          >
            {clampedScore}
          </div>
          <div className="mt-1 text-base font-bold text-slate-600">out of 100</div>
          <div className="mt-2 text-sm font-extrabold uppercase tracking-normal" style={{ color: tone.ring }}>
            {tone.label}
          </div>
        </div>
      </div>
    </div>
  );
}
