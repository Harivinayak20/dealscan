import { Img, staticFile, useCurrentFrame } from "remotion";
import { enter } from "./animation";
import { colors, fontStack } from "./theme";

export function CTAEndCard() {
  const frame = useCurrentFrame();
  const progress = enter(frame, 16, 34);

  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        placeItems: "center",
        color: colors.text,
        fontFamily: fontStack,
        textAlign: "center",
        transform: `scale(${0.92 + progress * 0.08})`,
        opacity: progress,
      }}
    >
      <div>
        <Img src={staticFile("dealscan-icon.svg")} style={{ width: 260, height: 260, margin: "0 auto 48px" }} />
        <div style={{ fontSize: 170, lineHeight: 0.92, fontWeight: 950, letterSpacing: 0 }}>DealScan</div>
        <div style={{ marginTop: 44, fontSize: 82, fontWeight: 900 }}>Scan the deal. Save the money.</div>
        <div style={{ marginTop: 30, color: colors.muted, fontSize: 42, fontWeight: 700 }}>Built for smarter used-car buyers.</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 86,
            padding: "26px 44px",
            borderRadius: 999,
            border: `2px solid ${colors.line}`,
            background: "rgba(255,255,255,0.06)",
            color: colors.cyan,
            fontSize: 42,
            fontWeight: 850,
            boxShadow: "0 0 64px rgba(40,168,255,0.22)",
          }}
        >
          dealscan.pages.dev
        </div>
      </div>
    </div>
  );
}
