import { interpolate, useCurrentFrame } from "remotion";
import { clamp, enter } from "./animation";
import { colors, fontStack } from "./theme";

type PriceRangeProps = {
  start?: number;
};

export function PriceRange({ start = 0 }: PriceRangeProps) {
  const frame = useCurrentFrame();
  const progress = enter(frame, start, 52);
  const marker = interpolate(progress, [0, 1], [9, 72], clamp);

  return (
    <div
      style={{
        padding: 44,
        borderRadius: 34,
        border: `2px solid ${colors.line}`,
        background: colors.panel,
        fontFamily: fontStack,
        color: colors.text,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <div style={{ fontSize: 30, color: colors.muted, fontWeight: 800 }}>FAIR PRICE RANGE</div>
          <div style={{ fontSize: 62, fontWeight: 900, marginTop: 8 }}>$24,700 - $26,300</div>
        </div>
        <div style={{ color: colors.green, fontSize: 34, fontWeight: 900 }}>Offer target $25,100</div>
      </div>
      <div style={{ position: "relative", height: 72, marginTop: 42 }}>
        <div
          style={{
            position: "absolute",
            inset: "24px 0",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${colors.green}, ${colors.cyan}, ${colors.yellow}, ${colors.red})`,
            opacity: 0.9,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${marker}%`,
            top: 0,
            width: 24,
            height: 72,
            borderRadius: 999,
            background: colors.text,
            boxShadow: "0 0 34px rgba(255,255,255,0.6)",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: colors.muted, fontSize: 26, fontWeight: 700 }}>
        <span>Underpriced</span>
        <span>Market</span>
        <span>Overpriced</span>
      </div>
    </div>
  );
}
