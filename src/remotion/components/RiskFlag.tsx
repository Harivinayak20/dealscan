import { interpolate, useCurrentFrame } from "remotion";
import { clamp, enter } from "./animation";
import { colors, fontStack } from "./theme";

type RiskFlagProps = {
  label: string;
  index: number;
  start?: number;
};

export function RiskFlag({ label, index, start = 0 }: RiskFlagProps) {
  const frame = useCurrentFrame();
  const progress = enter(frame, start + index * 7, 18);
  const tone = index % 3 === 0 ? colors.red : index % 3 === 1 ? colors.yellow : colors.blue;
  const x = interpolate(progress, [0, 1], [120, 0], clamp);

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateX(${x}px) scale(${0.94 + progress * 0.06})`,
        border: `2px solid ${tone}`,
        borderRadius: 28,
        background: "rgba(12,16,24,0.88)",
        boxShadow: `0 0 44px ${tone}33`,
        padding: "34px 40px",
        fontFamily: fontStack,
        color: colors.text,
        display: "flex",
        gap: 26,
        alignItems: "center",
      }}
    >
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: tone, boxShadow: `0 0 26px ${tone}` }} />
      <div>
        <div style={{ fontSize: 38, fontWeight: 900 }}>{label}</div>
        <div style={{ marginTop: 8, color: colors.muted, fontSize: 24, fontWeight: 700 }}>Buyer protection check</div>
      </div>
    </div>
  );
}
