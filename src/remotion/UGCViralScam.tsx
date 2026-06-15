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
import { scamListing, scamFlags } from "./data/ugc-listings";

/* ═══════════════════════════════════════════════════
   UGC VIRAL 1 — "IS THIS A SCAM?"  (1080×1920, 30fps, 300f)
   ═══════════════════════════════════════════════════ */
export function UGCViralScam() {
  const frame = useCurrentFrame();
  const flash = interpolate(frame % 20, [0, 5, 20], [0.03, 0.18, 0.03]);

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* 0:00–0:02 — hook */}
        <Sequence durationInFrames={60}>
          <UrgencyFlash amount={flash} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <KineticText eyebrow="Found on" lines={["FACEBOOK", "MARKETPLACE"]} start={4} size={120} accent={colors.red} align="center" />
          </div>
        </Sequence>

        {/* 0:02–0:05.5 — listing + scan sweep */}
        <Sequence from={60} durationInFrames={105}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <div style={{ fontFamily: fontStack, fontSize: 26, fontWeight: 800, color: colors.muted, textTransform: "uppercase", letterSpacing: 2, textAlign: "center", opacity: enter(frame - 60, 0, 10), transform: `translateY(${bob(frame, 5, 42)}px)` }}>
              Saw this and thought...
            </div>
            <VerticalListingCard listing={scamListing} start={6} />
            <div style={{ textAlign: "center", fontFamily: fontStack, fontSize: 28, fontWeight: 800, color: colors.muted, opacity: enter(frame - 60, 65, 14), transform: `translateY(${bob(frame, 5, 44)}px)` }}>
              Let&apos;s run it through DealScan...
            </div>
          </div>
          <ScanLine start={45} height={1400} />
        </Sequence>

        {/* 0:05.5–0:07 — red flags */}
        <Sequence from={165} durationInFrames={45}>
          <UrgencyFlash amount={interpolate(frame % 18, [0, 5, 18], [0.03, 0.16, 0.03])} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
            <div style={{ fontFamily: fontStack, fontSize: 32, fontWeight: 900, color: colors.red, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 165, 0, 10), transform: `scale(${pulse(frame, 0.03, 22)})`, transformOrigin: "left" }}>
              🚩 {scamFlags.length} Red Flags Found
            </div>
            {scamFlags.slice(0, 3).map((flag, i) => (
              <FlagItem key={flag} label={flag} index={i} start={14} type="red" />
            ))}
          </div>
        </Sequence>

        {/* 0:07–0:08.5 — score + verdict */}
        <Sequence from={210} durationInFrames={45}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28 }}>
            <DealScoreRing score={scamListing.score} start={10} />
            <VerdictBanner verdict={scamListing.verdict} score={scamListing.score} start={20} damping={10} stiffness={130} />
            <div style={{ fontFamily: fontStack, fontSize: 36, fontWeight: 800, color: colors.text, textAlign: "center", lineHeight: 1.5, maxWidth: 820, opacity: enter(frame - 210, 30, 14), transform: `translateY(${bob(frame, 4, 48)}px)` }}>
              This listing has every red flag in the book.
            </div>
          </div>
        </Sequence>

        {/* 0:08.5–0:10 — CTA */}
        <Sequence from={255} durationInFrames={45}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
            <KineticText lines={["Check yours", "for free."]} start={4} size={100} accent={colors.blue} align="center" />
            <CtaPill delay={20} pulseAmp={0.04} pulsePeriod={24} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}

export default UGCViralScam;
