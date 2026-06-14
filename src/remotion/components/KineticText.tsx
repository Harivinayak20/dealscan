import { interpolate, useCurrentFrame } from "remotion";
import { clamp, enter, bob, wobble, osc } from "./animation";
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
  // After entry, the block never stops moving: gentle bob + breathing scale.
  const live = progress;

  return (
    <div
      style={{
        fontFamily: fontStack,
        color: colors.text,
        textAlign: align,
        transform: `translateY(${(1 - progress) * 90 + bob(frame, 6, 58) * live}px) scale(${0.96 + progress * 0.04 + osc(frame, 50) * 0.012 * live})`,
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
            transform: `translateX(${bob(frame, 5, 40) * live}px)`,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      {lines.map((line, index) => {
        const lp = enter(frame, start + index * 8, 22);
        return (
          <div
            key={line}
            style={{
              fontSize: size,
              lineHeight: 0.94,
              fontWeight: 900,
              letterSpacing: 0,
              // each line keeps swaying on its own phase, so lines never align statically
              transform: `translateX(${(1 - lp) * -72 + bob(frame, 4, 52, index * 17) * lp}px) rotate(${wobble(frame, 0.5, 70, index * 23) * lp}deg)`,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}
