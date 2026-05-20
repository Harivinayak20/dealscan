import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dealscan — AI-Powered Used Car Listing Analyzer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b0d10 0%, #14181d 50%, #0b0d10 100%)",
          fontFamily: "Geist, Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-120px",
            top: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(201,168,106,0.12)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-160px",
            bottom: "-100px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "rgba(18,61,51,0.30)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "8px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.05)",
              color: "#c9a86a",
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#c9a86a" }} />
            AI-POWERED CAR LISTING ANALYZER
          </div>
          <h1
            style={{
              fontSize: "96px",
              fontWeight: 900,
              letterSpacing: "-0.055em",
              lineHeight: 0.92,
              textAlign: "center",
              color: "#f4f0e8",
              margin: 0,
            }}
          >
            Know the car,{"\n"}not the hype.
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#a7adb5",
              textAlign: "center",
              maxWidth: "700px",
              marginTop: "24px",
              lineHeight: 1.5,
            }}
          >
            Score any used car listing. Spot red flags. Negotiate with confidence.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#c9a86a",
            fontSize: "20px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="20" fill="#c9a86a"/>
            <g transform="translate(50,50) scale(1.1)">
              <path d="M-8-28 L8-28 L14-16 L10-16 L8-22 L-8-22 L-10-16 L-14-16Z" fill="#0b0d10"/>
              <rect x="-18" y="-16" width="36" height="22" rx="4" fill="#0b0d10"/>
              <rect x="-14" y="-12" width="8" height="6" rx="1.5" fill="#c9a86a"/>
              <rect x="6" y="-12" width="8" height="6" rx="1.5" fill="#c9a86a"/>
              <rect x="-20" y="6" width="8" height="14" rx="2" fill="#0b0d10"/>
              <rect x="12" y="6" width="8" height="14" rx="2" fill="#0b0d10"/>
              <circle cx="-16" cy="20" r="4" fill="#c9a86a"/>
              <circle cx="16" cy="20" r="4" fill="#c9a86a"/>
            </g>
          </svg>
          dealscan.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
