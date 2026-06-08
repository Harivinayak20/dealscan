import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";

export function AnimatedBackdrop() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = interpolate(frame, [0, 60 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(40,168,255,0.26), transparent 26%), radial-gradient(circle at 82% 24%, rgba(54,227,154,0.16), transparent 24%), linear-gradient(135deg, #05070b 0%, #0a1018 46%, #030509 100%)",
          transform: `scale(${1.04 + drift * 0.03}) translate3d(${-80 + drift * 120}px, ${-50 + drift * 80}px, 0)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.26,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          transform: `translate3d(${-frame * 0.25}px, ${frame * 0.16}px, 0)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage:
            "repeating-radial-gradient(circle at 35% 25%, rgba(255,255,255,0.55) 0 1px, transparent 1px 6px)",
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
}
