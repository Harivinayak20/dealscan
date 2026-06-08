import { interpolate, useCurrentFrame } from "remotion";
import { clamp, enter } from "./animation";
import { colors, fontStack } from "./theme";

type KineticTextProps = {
  eyebrow?: string;
  lines: string[];
  accent?: string;
  start?: number;
  size?: number;
  align?: "left" | "center";
};

export function KineticText({ eyebrow, lines, accent = colors.blue, start = 0, size = 156, align = "left" }: KineticTextProps) {
  const frame = useCurrentFrame();
  const progress = enter(frame, start, 24);
  const blur = interpolate(progress, [0, 1], [18, 0], clamp);

  return (
    <div
      style={{
        fontFamily: fontStack,
        color: colors.text,
        textAlign: align,
        transform: `translateY(${(1 - progress) * 90}px) scale(${0.96 + progress * 0.04})`,
        opacity: progress,
        filter: `blur(${blur}px)`,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            color: accent,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 0,
            marginBottom: 28,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      {lines.map((line, index) => (
        <div
          key={line}
          style={{
            fontSize: size,
            lineHeight: 0.94,
            fontWeight: 900,
            letterSpacing: 0,
            transform: `translateX(${(1 - enter(frame, start + index * 8, 22)) * -72}px)`,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}
