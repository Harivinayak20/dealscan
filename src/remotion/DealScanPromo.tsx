import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AnimatedBackdrop } from "./components/AnimatedBackdrop";
import { DealScoreRing } from "./components/DealScoreRing";
import { KineticText } from "./components/KineticText";
import { ListingCard } from "./components/ListingCard";
import { PriceRange } from "./components/PriceRange";
import { RiskFlag } from "./components/RiskFlag";
import { ScanLine } from "./components/ScanLine";
import { ComparisonGrid } from "./components/ComparisonGrid";
import { CTAEndCard } from "./components/CTAEndCard";
import { clamp, enter } from "./components/animation";
import { colors, fontStack } from "./components/theme";
import { heroListing, riskFlags } from "./data/listings";

export type DealScanPromoProps = {
  musicFile?: string | null;
};

const transition = linearTiming({ durationInFrames: 16 });

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteFill>
      <AnimatedBackdrop />
      <div style={{ position: "absolute", inset: 116 }}>{children}</div>
    </AbsoluteFill>
  );
}

function ColdOpen() {
  const frame = useCurrentFrame();
  const beats = [
    "Clean title?",
    "$1,495 dealer prep",
    "Accident reported",
    "Mileage mismatch",
    "Market price unknown",
    "Urgent seller language",
  ];
  return (
    <Shell>
      <Sequence durationInFrames={86}>
        <KineticText lines={["Used car deals", "move fast."]} start={8} size={142} />
      </Sequence>
      <Sequence from={88}>
        <KineticText lines={["Bad deals", "move faster."]} start={0} size={142} accent={colors.red} />
      </Sequence>
      {beats.map((beat, index) => {
        const progress = enter(frame, 20 + index * 16, 12);
        return (
          <div
            key={beat}
            style={{
              position: "absolute",
              right: 120 + (index % 2) * 360,
              top: 180 + index * 190,
              opacity: progress,
              transform: `translateX(${(1 - progress) * 140}px) rotate(${index % 2 === 0 ? -2 : 2}deg)`,
              border: `2px solid ${index % 2 === 0 ? colors.red : colors.line}`,
              borderRadius: 24,
              padding: "28px 38px",
              background: "rgba(11,15,23,0.82)",
              color: index % 2 === 0 ? colors.red : colors.text,
              fontFamily: fontStack,
              fontSize: 44,
              fontWeight: 900,
              boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
            }}
          >
            {beat}
          </div>
        );
      })}
    </Shell>
  );
}

function ProductReveal() {
  return (
    <Shell>
      <div style={{ height: "100%", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", alignItems: "center", gap: 90 }}>
        <KineticText eyebrow="DealScan" lines={["Know the deal", "before you buy."]} start={8} size={128} accent={colors.cyan} />
        <div style={{ position: "relative" }}>
          <ListingCard listing={heroListing} />
          <ScanLine start={28} />
        </div>
      </div>
    </Shell>
  );
}

function ListingAnalysis() {
  const frame = useCurrentFrame();
  const chips = ["Fair range detected", "Mileage adjusted", "Price risk checked", "Dealer fee warning"];
  return (
    <Shell>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 70, height: "100%", alignItems: "center" }}>
        <ListingCard listing={heroListing} />
        <div style={{ display: "grid", gap: 34 }}>
          <DealScoreRing score={84} start={18} />
          <div style={{ color: colors.green, fontFamily: fontStack, fontSize: 68, fontWeight: 950 }}>Strong Deal</div>
          <PriceRange start={48} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {chips.map((chip, index) => {
              const progress = enter(frame, 58 + index * 10, 18);
              return (
                <div
                  key={chip}
                  style={{
                    opacity: progress,
                    transform: `translateY(${(1 - progress) * 42}px)`,
                    border: `1px solid ${colors.line}`,
                    borderRadius: 20,
                    padding: "22px 26px",
                    color: index === 3 ? colors.yellow : colors.cyan,
                    background: "rgba(255,255,255,0.045)",
                    fontFamily: fontStack,
                    fontSize: 26,
                    fontWeight: 850,
                  }}
                >
                  {chip}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function RiskDetection() {
  const frame = useCurrentFrame();
  const flash = interpolate(frame % 22, [0, 5, 22], [0.08, 0.22, 0.08], clamp);
  return (
    <Shell>
      <div style={{ position: "absolute", inset: 0, background: `rgba(255,78,100,${flash})`, mixBlendMode: "screen" }} />
      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 80, height: "100%", alignItems: "center" }}>
        <KineticText eyebrow="Risk detection" lines={["Protect the", "buyer."]} start={6} size={132} accent={colors.red} />
        <div style={{ display: "grid", gap: 22 }}>
          {riskFlags.map((flag, index) => (
            <RiskFlag key={flag} label={flag} index={index} start={22} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

function ComparisonMode() {
  return (
    <Shell>
      <div style={{ display: "grid", gap: 78, height: "100%", alignContent: "center" }}>
        <KineticText lines={["Compare cars", "in seconds."]} start={6} size={118} align="center" accent={colors.green} />
        <ComparisonGrid start={54} />
      </div>
    </Shell>
  );
}

function ConfidenceDashboard() {
  const frame = useCurrentFrame();
  const items = [
    ["Deal Score", "84", colors.green],
    ["Fair Price", "$24.7k - $26.3k", colors.cyan],
    ["Offer Range", "$24.7k - $25.3k", colors.green],
    ["Risk Flags", "1 warning", colors.yellow],
    ["Next Step", "Negotiate", colors.blue],
  ];

  return (
    <Shell>
      <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 86, height: "100%", alignItems: "center" }}>
        <KineticText lines={["Walk in prepared.", "Negotiate with confidence."]} start={8} size={108} accent={colors.green} />
        <div
          style={{
            border: `2px solid ${colors.line}`,
            borderRadius: 42,
            padding: 58,
            background: colors.panelStrong,
            boxShadow: "0 44px 150px rgba(0,0,0,0.42)",
          }}
        >
          <div style={{ color: colors.text, fontFamily: fontStack, fontSize: 54, fontWeight: 950, marginBottom: 34 }}>Final buyer dashboard</div>
          <div style={{ display: "grid", gap: 22 }}>
            {items.map(([label, value, tone], index) => {
              const progress = enter(frame, 28 + index * 9, 18);
              return (
                <div
                  key={label}
                  style={{
                    opacity: progress,
                    transform: `translateX(${(1 - progress) * 90}px)`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: `1px solid ${colors.line}`,
                    borderRadius: 24,
                    padding: "30px 34px",
                    background: "rgba(255,255,255,0.045)",
                    fontFamily: fontStack,
                  }}
                >
                  <div style={{ color: colors.muted, fontSize: 30, fontWeight: 800 }}>{label}</div>
                  <div style={{ color: tone, fontSize: 40, fontWeight: 950 }}>{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function EndCard() {
  return (
    <Shell>
      <CTAEndCard />
    </Shell>
  );
}

export function DealScanPromo({ musicFile }: DealScanPromoProps) {
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      {musicFile ? <Audio src={staticFile(musicFile)} volume={0.72} /> : null}
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={300}>
          <ColdOpen />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={320}>
          <ProductReveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={720}>
          <ListingAnalysis />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={600}>
          <RiskDetection />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={600}>
          <ComparisonMode />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={600}>
          <ConfidenceDashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-top" })} timing={transition} />
        <TransitionSeries.Sequence durationInFrames={556}>
          <EndCard />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
}
