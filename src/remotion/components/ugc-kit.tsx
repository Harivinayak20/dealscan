import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedBackdrop } from "./AnimatedBackdrop";
import { enter, bob, wobble, osc, pulse } from "./animation";
import { colors, fontStack } from "./theme";
import type { PromoListing } from "../data/listings";

/* Shared vertical-UGC kit (1080×1920). These are the inline helpers used across
   the viral UGC compositions, factored out so every clip shares one source of
   truth for the perpetual-motion vocabulary instead of copy-pasting it. */

/* ─── Perpetual floating particle field — constant motion behind everything ─── */
export function Particles() {
  const frame = useCurrentFrame();
  const dots = [
    { x: 8, y: 16, s: 22, c: colors.blue, p: 0 },
    { x: 86, y: 12, s: 14, c: colors.cyan, p: 40 },
    { x: 78, y: 40, s: 18, c: colors.blue, p: 80 },
    { x: 14, y: 52, s: 12, c: colors.cyan, p: 20 },
    { x: 90, y: 68, s: 20, c: colors.blue, p: 120 },
    { x: 6, y: 78, s: 16, c: colors.cyan, p: 60 },
    { x: 50, y: 8, s: 12, c: colors.blue, p: 100 },
    { x: 44, y: 90, s: 18, c: colors.cyan, p: 140 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: d.c,
            opacity: 0.22 + (osc(frame, 36, d.p) + 1) * 0.12,
            transform: `translate3d(${bob(frame, 26, 90, d.p)}px, ${bob(frame, 34, 76, d.p * 1.3)}px, 0) scale(${pulse(frame, 0.3, 50, d.p)})`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

/* ─── Shared shell: backdrop + particles + 48px inset flex column ─── */
export function VerticalShell({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill>
      <AnimatedBackdrop />
      <Particles />
      <div style={{ position: "absolute", inset: 48, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </AbsoluteFill>
  );
}

/* ─── Persistent watermark, perpetual bob + breathing opacity ─── */
export function Watermark() {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: fontStack,
        fontSize: 28,
        fontWeight: 900,
        color: colors.muted,
        letterSpacing: 2,
        transform: `translateY(${bob(frame, 4, 50)}px)`,
        opacity: 0.6 + (osc(frame, 44) + 1) * 0.1,
      }}
    >
      DEALSCAN.DEV
    </div>
  );
}

/* ─── Red urgency flash that reads on a light background ─── */
export function UrgencyFlash({ amount }: { amount: number }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent 52%, rgba(192,73,47,${amount}))`,
      }}
    />
  );
}

/* ─── Listing card for vertical layout ─── */
export function VerticalListingCard({ listing, start }: { listing: PromoListing; start: number }) {
  const frame = useCurrentFrame();
  const p = enter(frame, start, 18);
  const toneColor =
    listing.risk === "good" ? colors.green : listing.risk === "warn" ? colors.yellow : colors.red;

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 60 + bob(frame, 7, 60) * p}px) rotate(${wobble(frame, 0.5, 84) * p}deg) scale(${1 + osc(frame, 54) * 0.007 * p})`,
        border: `2px solid ${colors.line}`,
        borderRadius: 32,
        padding: "40px 36px",
        background: colors.panelStrong,
        boxShadow: "0 32px 90px rgba(60,40,28,0.16)",
      }}
    >
      <div style={{ fontFamily: fontStack, fontSize: 38, fontWeight: 950, color: colors.text }}>
        {listing.title}
      </div>
      <div style={{ fontFamily: fontStack, fontSize: 24, fontWeight: 600, color: colors.muted, marginTop: 8 }}>
        {listing.trim}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "baseline" }}>
        <div style={{ fontFamily: fontStack, fontSize: 52, fontWeight: 950, color: colors.text, transform: `scale(${pulse(frame, 0.02, 38)})`, transformOrigin: "left" }}>
          {listing.price}
        </div>
        <div style={{ fontFamily: fontStack, fontSize: 22, fontWeight: 700, color: toneColor, transform: `translateY(${bob(frame, 3, 34)}px)` }}>
          {listing.market}
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
        {[listing.mileage, listing.titleStatus, listing.seller, listing.fees].map((tag, i) => (
          <div
            key={tag}
            style={{
              border: `1px solid ${colors.line}`,
              borderRadius: 14,
              padding: "10px 18px",
              fontFamily: fontStack,
              fontSize: 20,
              fontWeight: 700,
              color: colors.muted,
              background: "rgba(28,26,23,0.03)",
              opacity: 0.8 + (osc(frame, 30, i * 14) + 1) * 0.1,
              transform: `translateY(${bob(frame, 3, 40, i * 11)}px)`,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Flag item: slide-in from left with bob, color-coded ─── */
export function FlagItem({
  label,
  index,
  start,
  type,
}: {
  label: string;
  index: number;
  start: number;
  type: "red" | "green";
}) {
  const frame = useCurrentFrame();
  const p = enter(frame, start + index * 8, 14);
  const color = type === "red" ? colors.red : colors.green;
  const icon = type === "red" ? "🚩" : "✅";
  const tint = type === "red" ? "rgba(192,73,47," : "rgba(95,138,82,";

  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${(1 - p) * 80 + bob(frame, 5, 48, index * 13) * p}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        border: `1.5px solid ${tint}0.32)`,
        borderRadius: 22,
        padding: "24px 28px",
        background: `${tint}0.07)`,
        fontFamily: fontStack,
        fontSize: 26,
        fontWeight: 800,
        color,
      }}
    >
      <span style={{ fontSize: 32, display: "inline-block", transform: `translateY(${bob(frame, -6, 26, index * 9)}px) rotate(${wobble(frame, 6, 30, index * 9)}deg)` }}>{icon}</span>
      {label}
    </div>
  );
}

/* ─── Verdict banner: spring-scale entry, post-entry pulse + wobble ─── */
export function VerdictBanner({
  verdict,
  score,
  start,
  damping = 12,
  stiffness = 120,
}: {
  verdict: string;
  score: number;
  start: number;
  damping?: number;
  stiffness?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - start, fps, config: { damping, stiffness } });
  const color = score >= 70 ? colors.green : score >= 45 ? colors.yellow : colors.red;

  return (
    <div
      style={{
        transform: `scale(${scale * pulse(frame, 0.035, 26)}) rotate(${wobble(frame, 1, 40)}deg)`,
        textAlign: "center",
        padding: "30px 0",
      }}
    >
      <div style={{ fontFamily: fontStack, fontSize: 92, fontWeight: 950, color }}>{verdict}</div>
    </div>
  );
}

/* ─── Pulsing CTA pill with blue border + oscillating glow ─── */
export function CtaPill({
  delay,
  pulseAmp = 0.04,
  pulsePeriod = 28,
}: {
  delay: number;
  pulseAmp?: number;
  pulsePeriod?: number;
}) {
  const frame = useCurrentFrame();
  const p = enter(frame, delay, 14);
  return (
    <div
      style={{
        opacity: p,
        border: `3px solid ${colors.blue}`,
        borderRadius: 60,
        padding: "28px 64px",
        fontFamily: fontStack,
        fontSize: 36,
        fontWeight: 950,
        color: colors.blue,
        background: "rgba(183,96,58,0.08)",
        transform: `scale(${pulse(frame, pulseAmp, pulsePeriod) * p}) translateY(${bob(frame, 5, 46)}px)`,
        boxShadow: `0 0 ${30 + (osc(frame, 30) + 1) * 24}px rgba(183,96,58,0.30)`,
      }}
    >
      dealscan.dev
    </div>
  );
}
