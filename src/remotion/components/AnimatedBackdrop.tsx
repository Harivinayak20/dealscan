import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./theme";
import { bob, osc } from "./animation";

// Light, perpetually-moving backdrop: warm bone ground, drifting cognac/amber
// blooms, a slowly scrolling grid, and a moving sheen. Never a still frame.
export function AnimatedBackdrop() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.ink, overflow: "hidden" }}>
      {/* drifting warm blooms */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(40% 32% at 22% 20%, rgba(183,96,58,0.22), transparent 70%), radial-gradient(38% 30% at 80% 28%, rgba(201,138,60,0.20), transparent 70%), radial-gradient(46% 38% at 50% 92%, rgba(169,130,83,0.16), transparent 72%)",
          transform: `translate3d(${bob(frame, 70, 150)}px, ${bob(frame, 50, 130, 30)}px, 0) scale(${1.08 + osc(frame, 200) * 0.04})`,
        }}
      />
      {/* second bloom layer, counter-moving for depth */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(34% 26% at 70% 60%, rgba(201,138,60,0.16), transparent 70%), radial-gradient(30% 24% at 24% 70%, rgba(183,96,58,0.14), transparent 72%)",
          transform: `translate3d(${bob(frame, -90, 180, 60)}px, ${bob(frame, -60, 160)}px, 0)`,
        }}
      />
      {/* scrolling editorial grid */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage:
            "linear-gradient(rgba(28,26,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28,26,23,0.05) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
          transform: `translate3d(${(-frame * 0.4) % 110}px, ${(frame * 0.28) % 110}px, 0)`,
        }}
      />
      {/* moving diagonal sheen */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)",
          opacity: 0.22,
          transform: `translateX(${osc(frame, 90) * 60}%)`,
          mixBlendMode: "soft-light",
        }}
      />
      {/* fine grain */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </AbsoluteFill>
  );
}
