/**
 * MCP Server Card (SEP-1649) for the DealScan MCP server at /api/mcp.
 *
 * Discovery metadata only -- the server itself lives in src/app/api/mcp/route.ts.
 * Route handlers cannot export extra constants, so the name and tool list are
 * restated here; the version is imported so it cannot drift.
 */
import { PUBLIC_API_VERSION } from "@/lib/public-api-core";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export function GET() {
  const card = {
    serverInfo: {
      name: "dealscan",
      title: "DealScan",
      version: PUBLIC_API_VERSION,
      description:
        "Score a used-car listing 0-100 with red flags, a fair-value range, and a suggested offer. Free, no auth.",
      websiteUrl: appUrl,
    },
    endpoint: `${appUrl}/api/mcp`,
    transport: "streamable-http",
    capabilities: {
      tools: { listChanged: false },
    },
    tools: [
      {
        name: "analyze_listing",
        description:
          "Score a used-car listing from 0-100 with a verdict, red flags, good signs, a fair-value range, and a suggested offer. Accepts a public listing URL or pasted listing text.",
      },
      {
        name: "check_price",
        description:
          "Fair-price estimate for a known used-car model, year, and mileage.",
      },
    ],
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
