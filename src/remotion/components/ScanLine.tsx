import { interpolate, useCurrentFrame } from "remotion";
import { clamp } from "./animation";
import { colors } from "./theme";

type ScanLineProps = {
  start?: number;
  height?: number;
};

export function ScanLine({ start = 0, height = 820 }: ScanLineProps) {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [start, start + 78], [-180, height + 120], clamp);
  const opacity = interpolate(frame, [start, start + 8, start + 70, start + 82], [0, 1, 1, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -24,
          right: -24,
          top: y,
          height: 18,
          background: `linear-gradient(90deg, transparent, ${colors.cyan}, ${colors.green}, transparent)`,
          boxShadow: `0 0 48px ${colors.blue}, 0 0 90px rgba(54,227,154,0.55)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y - 120,
          height: 240,
          background: "linear-gradient(180deg, transparent, rgba(40,168,255,0.16), transparent)",
        }}
      />
    </div>
  );
}
