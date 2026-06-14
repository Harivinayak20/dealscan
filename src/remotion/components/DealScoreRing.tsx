import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontStack } from "./theme";
import { osc } from "./animation";

type DealScoreRingProps = {
  score: number;
  start?: number;
  size?: number;
};

export function DealScoreRing({ score, start = 0, size = 430 }: DealScoreRingProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - start,
    fps,
    config: { damping: 24, stiffness: 90, mass: 0.9 },
    durationInFrames: 80,
  });
  const display = Math.round(interpolate(progress, [0, 1], [0, score], { extrapolateRight: "clamp" }));
  const degrees = display * 3.6;
  const tone = score >= 70 ? colors.green : score >= 45 ? colors.yellow : colors.red;
  // never still: breathing scale + glow pulse + slow counter-rotation
  const breathe = 1 + osc(frame, 40) * 0.02;
  const glow = 0.5 + (osc(frame, 30) + 1) * 0.18;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        transform: `scale(${breathe}) rotate(${osc(frame, 120) * 2}deg)`,
        background: `conic-gradient(${tone} ${degrees}deg, rgba(28,26,23,0.08) ${degrees}deg)`,
        boxShadow: `0 0 ${60 + glow * 40}px ${tone}55, inset 0 0 40px rgba(28,26,23,0.05)`,
        fontFamily: fontStack,
      }}
    >
      <div
        style={{
          width: size * 0.73,
          height: size * 0.73,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(145deg, #ffffff, #f6f1e8)",
          border: `2px solid ${colors.line}`,
          transform: `rotate(${-osc(frame, 120) * 2}deg)`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: tone, fontSize: size * 0.27, lineHeight: 1, fontWeight: 900 }}>{display}</div>
          <div style={{ color: colors.muted, fontSize: size * 0.064, fontWeight: 800, marginTop: 14, letterSpacing: 2 }}>DEAL SCORE</div>
        </div>
      </div>
    </div>
  );
}
