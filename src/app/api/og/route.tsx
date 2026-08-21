import { getShare } from "@/lib/share-storage";

function scoreColor(score: number): string {
  if (score >= 85) return "#3f8a5b";
  if (score >= 70) return "#b98a38";
  if (score >= 55) return "#b4501f";
  return "#c0492f";
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character] ?? character);
}

function lines(value: string, maxCharacters: number, maxLines: number): string[] {
  const words = value.trim().split(/\s+/);
  const output: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters) {
      current = candidate;
      continue;
    }
    if (current) output.push(current);
    current = word;
    if (output.length === maxLines - 1) break;
  }
  if (current && output.length < maxLines) output.push(current);
  return output;
}

function textLines(values: string[], x: number, y: number, lineHeight: number): string {
  return values.map((value, index) => `<tspan x="${x}" y="${y + index * lineHeight}">${escapeXml(value)}</tspan>`).join("");
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || token.length !== 48) return new Response("Invalid token", { status: 400 });

  const share = await getShare(token);
  if (!share) return new Response("Share not found or expired", { status: 404 });

  const { payload } = share;
  const color = scoreColor(payload.score);
  const circumference = 452.4;
  const dash = (payload.score / 100) * circumference;
  const vehicleLines = lines(payload.vehicle, 32, 2);
  const summaryLines = lines(payload.summary, 55, 3);
  const offer = payload.suggestedOfferLow !== null && payload.suggestedOfferHigh !== null
    ? `Suggested offer: $${payload.suggestedOfferLow.toLocaleString("en-US")} - $${payload.suggestedOfferHigh.toLocaleString("en-US")}`
    : "Automated estimate - verify before buying";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1a1613"/>
          <stop offset="1" stop-color="#2a211b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#background)"/>
      <circle cx="1060" cy="80" r="250" fill="#b4501f" opacity="0.12"/>
      <circle cx="80" cy="610" r="270" fill="#b98a38" opacity="0.10"/>

      <text x="62" y="72" fill="#d9a441" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" letter-spacing="3">DEALSCAN</text>

      <circle cx="220" cy="300" r="72" fill="none" stroke="#453c35" stroke-width="18"/>
      <circle cx="220" cy="300" r="72" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round"
        stroke-dasharray="${dash} ${circumference - dash}" transform="rotate(-90 220 300)"/>
      <text x="220" y="310" text-anchor="middle" fill="#fffdfa" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="900">${payload.score}</text>
      <text x="220" y="345" text-anchor="middle" fill="#b7ada5" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700">OUT OF 100</text>

      <text x="355" y="175" fill="#fffdfa" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="900">
        ${textLines(vehicleLines, 355, 175, 54)}
      </text>
      <rect x="355" y="255" width="310" height="48" rx="24" fill="${color}" opacity="0.18" stroke="${color}" stroke-width="2"/>
      <text x="378" y="287" fill="${color}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">${escapeXml(payload.verdict)}</text>
      <text x="355" y="360" fill="#c9c0b8" font-family="Arial, Helvetica, sans-serif" font-size="23">
        ${textLines(summaryLines, 355, 360, 34)}
      </text>

      <line x1="62" y1="520" x2="1138" y2="520" stroke="#51463e"/>
      <text x="62" y="572" fill="#fffdfa" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">${escapeXml(offer)}</text>
      <text x="1138" y="572" text-anchor="end" fill="#d9a441" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">dealscan.dev</text>
    </svg>`;

  return new Response(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
