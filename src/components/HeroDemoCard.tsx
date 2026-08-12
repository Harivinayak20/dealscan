"use client";

import { useEffect, useRef, useState } from "react";

const RING_RADIUS = 50;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const findings = [
  { tone: "good", text: "$1,400 below estimated fair value" },
  { tone: "good", text: "Clean title, single owner" },
  { tone: "warn", text: "Mileage not verified against records" },
] as const;

type DemoState = {
  ring: number;
  score: number;
  resultsOpacity: number;
  findingOpacity: [number, number, number];
};

/**
 * Animated scan-demo card for the landing hero: a fake listing gets "scanned"
 * on a loop — score ring fills, findings fade in, then the cycle repeats.
 * Pure presentation, no data fetching. Honors prefers-reduced-motion.
 */
export function HeroDemoCard({
  demoScore = 82,
  cycleSeconds = 5,
}: {
  demoScore?: number;
  cycleSeconds?: number;
}) {
  const [state, setState] = useState<DemoState>({
    ring: 1,
    score: demoScore,
    resultsOpacity: 1,
    findingOpacity: [1, 1, 1],
  });
  const frameRef = useRef(0);

  useEffect(() => {
    // Product-showcase loop: runs even under prefers-reduced-motion (owner's
    // call — it is small, contained, and the whole point of the hero).
    const start = performance.now();
    let lastTick = 0;

    const ease = (v: number) => 1 - Math.pow(1 - Math.min(Math.max(v, 0), 1), 3);

    function tick(now: number) {
      frameRef.current = requestAnimationFrame(tick);
      // ~22fps is plenty for this loop and keeps the main thread quiet.
      if (now - lastTick < 45) return;
      lastTick = now;

      const t = ((now - start) / 1000) % cycleSeconds;
      const ring = ease((t - 1.2) / 1.0);
      const fadeOut = t > cycleSeconds - 0.6 ? (cycleSeconds - t) / 0.6 : 1;
      const resultsOpacity = Math.min(ease(t / 0.6), fadeOut);

      setState({
        ring,
        score: Math.round(ring * demoScore),
        resultsOpacity,
        findingOpacity: [
          ease((t - 1.6) / 0.4) * fadeOut,
          ease((t - 1.9) / 0.4) * fadeOut,
          ease((t - 2.2) / 0.4) * fadeOut,
        ],
      });
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [demoScore, cycleSeconds]);

  return (
    <div className="relative rounded-[22px] border border-[var(--border-subtle)] bg-[var(--paper)] p-4 shadow-[0_34px_70px_-34px_rgba(0,0,0,0.7)] sm:p-5">
      <div className="mono-label absolute right-4 top-3 text-[11px] text-[var(--muted)]">
        dealscan.dev
      </div>

      {/* Fake listing card */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[rgba(26,22,19,0.09)]">
        <div
          className="relative h-[158px] overflow-hidden"
          style={{ background: "linear-gradient(150deg, #EFE6D8 0%, #E4D6C2 60%, #DCCBB2 100%)" }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{ background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 11px, rgba(0,0,0,0.02) 11px 22px)" }}
          />
          <span className="scanbeam" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--paper)] px-2.5 py-1 text-[11px] font-bold text-[var(--graphite)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--racing-green)]" />
            AutoTrader
          </span>
          <span className="mono-label absolute bottom-2 left-3 text-[10px] text-[var(--muted)]">
            listing photo · 1 / 24
          </span>
          <span className="mono-label absolute bottom-2 right-3 text-[10px] text-[var(--muted)]">
            1080 × 720
          </span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-2 bg-[var(--paper)] p-3.5">
          <div>
            <div className="font-display text-base font-bold text-[var(--graphite)]">
              2019 Toyota Camry SE
            </div>
            <div className="mono-label mt-0.5 text-[11px] text-[var(--muted)]">
              Listed 6 days ago · 12 mi away
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-lg font-extrabold text-[var(--graphite)]">$18,400</div>
            <div className="text-xs font-bold text-[var(--gink)]">≈ $1,400 under</div>
          </div>
          <div className="flex w-full flex-wrap gap-1.5 pt-1 text-[11px] font-semibold text-[var(--text-muted)]">
            {[
              { label: "42,300 mi", tone: "neutral" },
              { label: "Clean title", tone: "good" },
              { label: "1 owner", tone: "good" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--chip)] px-2.5 py-1"
              >
                <span
                  className={`h-[5px] w-[5px] rounded-full ${
                    chip.tone === "good" ? "bg-[var(--success)]" : "bg-[var(--muted)]"
                  }`}
                />
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results block */}
      <div
        className="mt-4 flex items-center gap-4"
        style={{ opacity: state.resultsOpacity }}
        aria-hidden="true"
      >
        <div className="relative h-[120px] w-[120px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--border-subtle)" strokeWidth="11" />
            <circle
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke="#3F8A5B"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - state.ring * 0.82)}
            />
          </svg>
          <div className="absolute inset-0 grid place-content-center text-center">
            <span className="font-display text-[34px] font-extrabold leading-none text-[var(--graphite)] [font-variant-numeric:tabular-nums]">
              {state.score}
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)]">out of 100</span>
          </div>
        </div>
        <div className="grid gap-2">
          <span className="inline-flex w-fit rounded-full bg-[var(--gbg)] px-3 py-1 text-xs font-bold text-[var(--gink)]">
            Great deal
          </span>
          {findings.map((finding, i) => (
            <div
              key={finding.text}
              className={`flex items-center gap-2 text-sm font-semibold ${
                finding.tone === "good" ? "text-[var(--graphite)]" : "text-[#8a6d3b]"
              }`}
              style={{ opacity: state.findingOpacity[i] }}
            >
              <span
                className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                  finding.tone === "good" ? "bg-[var(--success)]" : "bg-[var(--warning)]"
                }`}
              />
              {finding.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
