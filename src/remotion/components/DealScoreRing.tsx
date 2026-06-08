import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontStack } from "./theme";

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

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: `conic-gradient(${colors.green} ${degrees}deg, rgba(255,255,255,0.09) ${degrees}deg)`,
        boxShadow: `0 0 80px rgba(54,227,154,0.28), inset 0 0 40px rgba(255,255,255,0.06)`,
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
          background: "linear-gradient(145deg, rgba(8,12,19,0.98), rgba(22,29,42,0.96))",
          border: `2px solid ${colors.line}`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: colors.green, fontSize: size * 0.26, lineHeight: 1, fontWeight: 900 }}>{display}</div>
          <div style={{ color: colors.muted, fontSize: size * 0.064, fontWeight: 800, marginTop: 14 }}>DEAL SCORE</div>
        </div>
      </div>
    </div>
  );
}
