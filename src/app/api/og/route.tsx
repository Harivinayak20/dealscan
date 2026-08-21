import { ImageResponse } from "next/og";
import { getShare } from "@/lib/share-storage";

function scoreColor(score: number): string {
  if (score >= 85) return "#2d9c6a";
  if (score >= 70) return "#c9a86a";
  if (score >= 55) return "#e8914a";
  if (score >= 40) return "#d44242";
  return "#d44242";
}

function scoreGradientEnd(score: number, color: string): string {
  return `${color} ${score * 3.6}deg, #2a2d33 ${score * 3.6}deg`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token || token.length !== 48) {
    return new Response("Invalid token", { status: 400 });
  }

  const share = await getShare(token);
  if (!share) {
    return new Response("Share not found or expired", { status: 404 });
  }

  const { payload } = share;
  const color = scoreColor(payload.score);
  const gradientEnd = scoreGradientEnd(payload.score, color);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #1c1a17 0%, #14181d 50%, #1c1a17 100%)",
          fontFamily: "Geist, Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
          padding: 56,
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
            background: "rgba(169,130,83,0.12)",
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
            background: "rgba(183,96,58,0.30)",
            filter: "blur(80px)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
            <rect width="100" height="100" rx="20" fill="#c9a86a"/>
            <g transform="translate(50,50) scale(1.1)">
              <path d="M-8-28 L8-28 L14-16 L10-16 L8-22 L-8-22 L-10-16 L-14-16Z" fill="#1c1a17"/>
              <rect x="-18" y="-16" width="36" height="22" rx="4" fill="#1c1a17"/>
              <rect x="-14" y="-12" width="8" height="6" rx="1.5" fill="#c9a86a"/>
              <rect x="6" y="-12" width="8" height="6" rx="1.5" fill="#c9a86a"/>
              <rect x="-20" y="6" width="8" height="14" rx="2" fill="#1c1a17"/>
              <rect x="12" y="6" width="14" height="2" rx="2" fill="#1c1a17"/>
              <circle cx="-16" cy="20" r="4" fill="#c9a86a"/>
              <circle cx="16" cy="20" r="4" fill="#c9a86a"/>
            </g>
          </svg>
          <span style={{ color: "#c9a86a", fontSize: 24, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            DealScan
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `conic-gradient(${gradientEnd})`,
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  background: "#1c1a17",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ color, fontSize: 56, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {payload.score}
                </span>
                <span style={{ color: "#a7adb5", fontSize: 18, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Score
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
            <h1
              style={{
                fontSize: 48,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#f4f0e8",
                margin: 0,
              }}
            >
              {payload.vehicle}
            </h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 18px",
                borderRadius: 999,
                border: `2px solid ${color}`,
                color,
                fontSize: 22,
                fontWeight: 900,
                width: "fit-content",
              }}
            >
              {payload.verdict}
            </span>
            <p style={{ fontSize: 20, color: "#a7adb5", lineHeight: 1.5, margin: 0 }}>
              {payload.summary}
            </p>
            {payload.suggestedOfferLow !== null && payload.suggestedOfferHigh !== null ? (
              <p style={{ fontSize: 18, color: "#f4f0e8", lineHeight: 1.4, margin: 0, fontWeight: 800 }}>
                Suggested offer: ${payload.suggestedOfferLow.toLocaleString("en-US")} - ${payload.suggestedOfferHigh.toLocaleString("en-US")}
              </p>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#c9a86a",
            fontSize: 18,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            position: "relative",
          }}
        >
          dealscan.dev
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
