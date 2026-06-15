import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { DealScoreRing } from "./components/DealScoreRing";
import { KineticText } from "./components/KineticText";
import { ScanLine } from "./components/ScanLine";
import { enter, bob, pulse } from "./components/animation";
import { colors, fontStack } from "./components/theme";
import {
  VerticalShell,
  Watermark,
  UrgencyFlash,
  VerticalListingCard,
  FlagItem,
  VerdictBanner,
  CtaPill,
} from "./components/ugc-kit";
import { overpricedListing, overpricedFlags } from "./data/ugc-listings";

/* ═══════════════════════════════════════════════════
   UGC VIRAL 3 — "RED FLAG CHECK"  (1080×1920, 30fps, 300f)
   ═══════════════════════════════════════════════════ */
export function UGCViralRedFlag() {
  const frame = useCurrentFrame();
  const flash = interpolate(frame % 22, [0, 6, 22], [0.02, 0.15, 0.02]);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* 0:00–0:02 — hook */}
        <Sequence durationInFrames={60}>
          <UrgencyFlash amount={flash} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <KineticText eyebrow="Dealer listing" lines={["Looks clean.", "It's not."]} start={8} size={130} accent={colors.yellow} align="center" />
          </div>
        </Sequence>

        {/* 0:02–0:04 — listing + scan */}
        <Sequence from={60} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <VerticalListingCard listing={overpricedListing} start={6} />
          </div>
          <ScanLine start={20} height={1400} />
        </Sequence>

        {/* 0:04–0:06.5 — red flags */}
        <Sequence from={120} durationInFrames={75}>
          <UrgencyFlash amount={interpolate(frame % 18, [0, 5, 18], [0.03, 0.16, 0.03])} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            <div style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 900, color: colors.red, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 120, 0, 10), transform: `scale(${pulse(frame, 0.03, 22)})`, transformOrigin: "left" }}>
              🚩 DealScan found {overpricedFlags.length} problems
            </div>
            {overpricedFlags.slice(0, 3).map((flag, i) => (
              <FlagItem key={flag} label={flag} index={i} start={14} type="red" />
            ))}
            <div style={{ marginTop: 12, textAlign: "center", fontFamily: fontStack, fontSize: 28, fontWeight: 800, color: colors.muted, opacity: enter(frame - 120, 50, 14), transform: `translateY(${bob(frame, 4, 46)}px)` }}>
              They want {overpricedListing.price}. It&apos;s worth {overpricedListing.market.replace(" market", "")}.
            </div>
          </div>
        </Sequence>

        {/* 0:06.5–0:08.5 — score + verdict */}
        <Sequence from={195} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28 }}>
            <DealScoreRing score={overpricedListing.score} start={8} size={420} />
            <VerdictBanner verdict={overpricedListing.verdict} score={overpricedListing.score} start={20} damping={10} stiffness={140} />
            <div style={{ fontFamily: fontStack, fontSize: 34, fontWeight: 800, color: colors.text, textAlign: "center", opacity: enter(frame - 195, 35, 14), transform: `translateY(${bob(frame, 4, 48)}px)` }}>
              Don&apos;t overpay for a rebuilt wreck.
            </div>
          </div>
        </Sequence>

        {/* 0:08.5–0:10 — CTA */}
        <Sequence from={255} durationInFrames={45}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
            <KineticText lines={["Scan yours", "before you visit."]} start={4} size={90} accent={colors.blue} align="center" />
            <CtaPill delay={20} pulseAmp={0.05} pulsePeriod={24} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}

export default UGCViralRedFlag;
