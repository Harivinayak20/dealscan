import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { DealScoreRing } from "./components/DealScoreRing";
import { KineticText } from "./components/KineticText";
import { enter, bob, pulse } from "./components/animation";
import { colors, fontStack } from "./components/theme";
import {
  VerticalShell,
  Watermark,
  VerticalListingCard,
  FlagItem,
  VerdictBanner,
  CtaPill,
} from "./components/ugc-kit";
import { goodDealListing, goodDealFlags } from "./data/ugc-listings";

/* ═══════════════════════════════════════════════════
   UGC VIRAL 2 — "DEAL SCORE REVEAL"  (1080×1920, 30fps, 300f)
   ═══════════════════════════════════════════════════ */
export function UGCViralDealScore() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <VerticalShell>
        {/* 0:00–0:02 — hook */}
        <Sequence durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <KineticText eyebrow="Honestly thought it was a scam" lines={["Found this", "on Craigslist."]} start={2} size={110} accent={colors.green} align="center" />
          </div>
        </Sequence>

        {/* 0:02–0:04 — the listing */}
        <Sequence from={60} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <div style={{ fontFamily: fontStack, fontSize: 26, fontWeight: 800, color: colors.blue, textTransform: "uppercase", letterSpacing: 3, opacity: enter(frame - 60, 0, 10), transform: `translateX(${bob(frame, 6, 40)}px)` }}>
              The listing
            </div>
            <VerticalListingCard listing={goodDealListing} start={8} />
            <div style={{ fontFamily: fontStack, fontSize: 28, fontWeight: 800, color: colors.muted, textAlign: "center", opacity: enter(frame - 60, 25, 14), transform: `scale(${pulse(frame, 0.04, 24)})` }}>
              Scanning...
            </div>
          </div>
        </Sequence>

        {/* 0:04–0:06 — score reveal + green flags */}
        <Sequence from={120} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 26 }}>
            <DealScoreRing score={goodDealListing.score} start={8} size={380} />
            <VerdictBanner verdict={goodDealListing.verdict} score={goodDealListing.score} start={20} damping={12} stiffness={120} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
              {goodDealFlags.slice(0, 3).map((flag, i) => (
                <FlagItem key={flag} label={flag} index={i} start={30} type="green" />
              ))}
            </div>
          </div>
        </Sequence>

        {/* 0:06–0:08 — suggested offer */}
        <Sequence from={180} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32 }}>
            <div style={{ fontFamily: fontStack, fontSize: 30, fontWeight: 800, color: colors.muted, opacity: enter(frame - 180, 0, 10), transform: `translateY(${bob(frame, 5, 44)}px)` }}>
              Suggested offer
            </div>
            <div style={{ fontFamily: fontStack, fontSize: 72, fontWeight: 950, color: colors.green, opacity: enter(frame - 180, 10, 16), transform: `scale(${(0.8 + enter(frame - 180, 10, 16) * 0.2) * pulse(frame, 0.03, 30)})` }}>
              {goodDealListing.offer}
            </div>
            <div style={{ fontFamily: fontStack, fontSize: 36, fontWeight: 800, color: colors.muted, textAlign: "center", opacity: enter(frame - 180, 30, 14), transform: `translateY(${bob(frame, 4, 48)}px)` }}>
              Know before you go.
            </div>
          </div>
        </Sequence>

        {/* 0:08–0:10 — CTA */}
        <Sequence from={240} durationInFrames={60}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
            <KineticText lines={["Scan yours", "for free."]} start={4} size={100} accent={colors.blue} align="center" />
            <CtaPill delay={20} pulseAmp={0.04} pulsePeriod={30} />
          </div>
        </Sequence>

        <Watermark />
      </VerticalShell>
    </AbsoluteFill>
  );
}

export default UGCViralDealScore;
