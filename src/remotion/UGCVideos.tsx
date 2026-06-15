import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedBackdrop } from "./components/AnimatedBackdrop";
import { DealScoreRing } from "./components/DealScoreRing";
import { KineticText } from "./components/KineticText";
import { clamp, enter, bob, wobble, osc, pulse } from "./components/animation";
import { colors, fontStack } from "./components/theme";
import {
  scamListing,
  scamFlags,
  goodDealListing,
  goodDealFlags,
  overpricedListing,
  overpricedFlags,
} from "./data/ugc-listings";
import type { PromoListing } from "./data/listings";

/* ─── Perpetual floating particle field — constant motion behind everything ─── */

function Particles() {
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

/* ─── Shared vertical shell (1080 × 1920) ─── */

function VerticalShell({ children }: { children: React.ReactNode }) {
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

function Watermark() {
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
        opacity: 0.6 + (osc(frame, 44) + 1) * 0.2,
      }}
    >
      DEALSCAN.DEV
    </div>
  );
}

/* ─── Red/amber urgency flash that actually reads on a light background ─── */

function UrgencyFlash({ amount }: { amount: number }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, transparent 52%, rgba(192,73,47,${amount}))`,
      }}
    />
  );
}

/* ─── Card for vertical layout ─── */

function VerticalListingCard({
  listing,
  start,
}: {
  listing: PromoListing;
  start: number;
}) {
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

/* ─── Flag item for vertical layout ─── */

function FlagItem({
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

/* ─── Verdict banner ─── */

function VerdictBanner({ verdict, score, start }: { verdict: string; score: number; start: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - start, fps, config: { damping: 12, stiffness: 120 } });
  const color = score >= 70 ? colors.green : score >= 45 ? colors.yellow : colors.red;

  return (
    <div
      style={{
        transform: `scale(${scale * pulse(frame, 0.035, 26)}) rotate(${wobble(frame, 1, 40)}deg)`,
        textAlign: "center",
        padding: "36px 0",
      }}
    >
      <div style={{ fontFamily: fontStack, fontSize: 92, fontWeight: 950, color }}>
        {verdict}
      </div>
    </div>
  );
}

/* ─── Pulsing CTA pill ─── */

function CtaPill({ delay }: { delay: number }) {
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
        transform: `scale(${pulse(frame, 0.04, 30) * p}) translateY(${bob(frame, 5, 46)}px)`,
        boxShadow: `0 0 ${30 + (osc(frame, 30) + 1) * 24}px rgba(183,96,58,0.30)`,
      }}
    >
      dealscan.dev
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   UGC 1: "IS THIS A SCAM?" — sketchy listing reveal
   ═══════════════════════════════════════════════════ */

export function IsThisAScam() {
  const frame = useCurrentFrame();
  const flash = interpolate(frame % 24, [0, 5, 24], [0.03, 0.16, 0.03], clamp);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* Hook text — first 2 seconds */}
        <Sequence durationInFrames={120}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 24 }}>
            <div style={{ fontFamily: fontStack, fontSize: 36, fontWeight: 800, color: colors.red, textTransform: "uppercase", letterSpacing: 4, transform: `translateY(${bob(frame, 6, 36)}px)` }}>
              {enter(frame, 0, 10) > 0.5 ? "Found on Facebook Marketplace" : ""}
            </div>
            <KineticText lines={["Is this", "a scam?"]} start={8} size={120} accent={colors.red} align="center" />
          </div>
        </Sequence>

        {/* Listing card reveal */}
        <Sequence from={100} durationInFrames={240}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
            <VerticalListingCard listing={scamListing} start={10} />
            <div
              style={{
                textAlign: "center",
                fontFamily: fontStack,
                fontSize: 28,
                fontWeight: 800,
                color: colors.muted,
                opacity: enter(frame - 100, 60, 14),
                transform: `translateY(${bob(frame, 5, 44)}px)`,
              }}
            >
              Let&apos;s run it through DealScan...
            </div>
          </div>
        </Sequence>

        {/* Red flags cascade */}
        <Sequence from={340} durationInFrames={400}>
          <UrgencyFlash amount={flash} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 20 }}>
            <div style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 900, color: colors.red, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 340, 0, 10), transform: `scale(${pulse(frame, 0.03, 22)})`, transformOrigin: "left" }}>
              🚩 {scamFlags.length} Red Flags Found
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
              {scamFlags.map((flag, i) => (
                <FlagItem key={flag} label={flag} index={i} start={20} type="red" />
              ))}
            </div>
          </div>
        </Sequence>

        {/* Score + Verdict */}
        <Sequence from={740} durationInFrames={360}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
            <DealScoreRing score={scamListing.score} start={12} />
            <VerdictBanner verdict={scamListing.verdict} score={scamListing.score} start={40} />
            <div
              style={{
                fontFamily: fontStack,
                fontSize: 36,
                fontWeight: 800,
                color: colors.text,
                textAlign: "center",
                lineHeight: 1.5,
                opacity: enter(frame - 740, 70, 14),
                maxWidth: 800,
                transform: `translateY(${bob(frame, 4, 48)}px)`,
              }}
            >
              This listing has every red flag in the book. Don&apos;t waste your time.
            </div>
          </div>
        </Sequence>

        {/* CTA */}
        <Sequence from={1080}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
            <KineticText lines={["Check yours", "for free."]} start={6} size={100} accent={colors.blue} align="center" />
            <CtaPill delay={40} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}

/* ═══════════════════════════════════════════════════
   UGC 2: "DEAL SCORE REVEAL" — quick score card
   ═══════════════════════════════════════════════════ */

export function DealScoreReveal() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* Hook */}
        <Sequence durationInFrames={90}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <KineticText lines={["Found this", "on Craigslist."]} start={6} size={100} align="center" />
          </div>
        </Sequence>

        {/* Show listing */}
        <Sequence from={80} durationInFrames={200}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <div style={{ fontFamily: fontStack, fontSize: 26, fontWeight: 800, color: colors.blue, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 80, 0, 10), transform: `translateX(${bob(frame, 6, 40)}px)` }}>
              The listing
            </div>
            <VerticalListingCard listing={goodDealListing} start={14} />
            <div style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 800, color: colors.muted, textAlign: "center", opacity: enter(frame - 80, 80, 14), transform: `scale(${pulse(frame, 0.04, 24)})` }}>
              Scanning...
            </div>
          </div>
        </Sequence>

        {/* Score reveal */}
        <Sequence from={280} durationInFrames={280}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
            <DealScoreRing score={goodDealListing.score} start={10} />
            <VerdictBanner verdict={goodDealListing.verdict} score={goodDealListing.score} start={36} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
              {goodDealFlags.map((flag, i) => (
                <FlagItem key={flag} label={flag} index={i} start={50} type="green" />
              ))}
            </div>
          </div>
        </Sequence>

        {/* Offer range + CTA */}
        <Sequence from={560} durationInFrames={340}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40 }}>
            <div style={{ fontFamily: fontStack, fontSize: 30, fontWeight: 800, color: colors.muted, opacity: enter(frame - 560, 0, 10), transform: `translateY(${bob(frame, 5, 44)}px)` }}>
              Suggested offer
            </div>
            <div
              style={{
                fontFamily: fontStack,
                fontSize: 72,
                fontWeight: 950,
                color: colors.green,
                opacity: enter(frame - 560, 14, 16),
                transform: `scale(${(0.8 + enter(frame - 560, 14, 16) * 0.2) * pulse(frame, 0.03, 30)})`,
              }}
            >
              {goodDealListing.offer}
            </div>
            <div style={{ marginTop: 40, opacity: enter(frame - 560, 50, 14) }}>
              <KineticText lines={["Know before", "you go."]} start={0} size={88} accent={colors.blue} align="center" />
            </div>
            <CtaPill delay={80 + 560 - 560} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}

/* ═══════════════════════════════════════════════════
   UGC 3: "RED FLAG CHECK" — overpriced listing exposé
   ═══════════════════════════════════════════════════ */

export function RedFlagCheck() {
  const frame = useCurrentFrame();
  const flash = interpolate(frame % 30, [0, 7, 30], [0.03, 0.14, 0.03], clamp);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* Hook */}
        <Sequence durationInFrames={100}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20 }}>
            <div style={{ fontFamily: fontStack, fontSize: 30, fontWeight: 800, color: colors.yellow, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame, 0, 10), transform: `translateY(${bob(frame, 6, 38)}px)` }}>
              Dealer listing
            </div>
            <KineticText lines={["Looks clean.", "It's not."]} start={10} size={110} accent={colors.red} align="center" />
          </div>
        </Sequence>

        {/* Show listing */}
        <Sequence from={90} durationInFrames={200}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
            <VerticalListingCard listing={overpricedListing} start={10} />
          </div>
        </Sequence>

        {/* Red flags */}
        <Sequence from={290} durationInFrames={360}>
          <UrgencyFlash amount={flash} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 40 }}>
            <div style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 900, color: colors.red, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 290, 0, 10), transform: `scale(${pulse(frame, 0.03, 22)})`, transformOrigin: "left" }}>
              🚩 DealScan found {overpricedFlags.length} problems
            </div>
            {overpricedFlags.map((flag, i) => (
              <FlagItem key={flag} label={flag} index={i} start={18} type="red" />
            ))}
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontFamily: fontStack,
                fontSize: 28,
                fontWeight: 800,
                color: colors.muted,
                opacity: enter(frame - 290, 80, 14),
                transform: `translateY(${bob(frame, 4, 46)}px)`,
              }}
            >
              They want ${overpricedListing.price}. It&apos;s worth ${overpricedListing.market}.
            </div>
          </div>
        </Sequence>

        {/* Score + CTA */}
        <Sequence from={650} durationInFrames={350}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
            <DealScoreRing score={overpricedListing.score} start={10} />
            <VerdictBanner verdict={overpricedListing.verdict} score={overpricedListing.score} start={34} />
            <KineticText lines={["Scan yours", "before you visit."]} start={60} size={80} accent={colors.blue} align="center" />
            <CtaPill delay={90} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}
