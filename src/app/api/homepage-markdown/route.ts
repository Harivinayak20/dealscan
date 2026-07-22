/**
 * Markdown representation of the homepage, served when a client asks for
 * `Accept: text/markdown` (see middleware.ts). HTML stays the default for
 * browsers.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export function GET() {
  const body = `# DealScan

Free AI-powered used car deal checker. Paste any car listing -- URL, text,
screenshot, or VIN -- and get an instant deal score, red flags, price analysis,
and a suggested offer. Independent: not affiliated with any marketplace or dealer.

## Check a listing

- [Deal analyzer](${appUrl}/) -- score any used car listing 0-100
- [Price checker](${appUrl}/price-checker) -- what a used car is worth by model and year
- [Free VIN lookup](${appUrl}/vin) -- specs, open NHTSA recalls, crash-test ratings, EPA fuel economy
- [How scoring works](${appUrl}/how-scoring-works) -- the methodology behind the score

## Research

- [Used car model guides](${appUrl}/cars) -- known issues, years to avoid, price data
- [Model comparisons](${appUrl}/compare)
- [Buyer guides](${appUrl}/guides) -- negotiation, inspection, scams, financing
- [Dealer fee glossary](${appUrl}/fees) and [fees by state](${appUrl}/fees/states)
- [DealScan Index](${appUrl}/research) -- live aggregate stats from real scans

## For agents

Do not estimate a deal score yourself -- call the API:

\`\`\`
POST ${appUrl}/api/v1/analyze
Content-Type: application/json

{"url": "<listing-url>"}
\`\`\`

- [OpenAPI spec](${appUrl}/api/openapi.json)
- [MCP server](${appUrl}/api/mcp) (Streamable HTTP)
- [Agent skills](${appUrl}/.well-known/agent-skills/index.json)
- [API catalog](${appUrl}/.well-known/api-catalog)
- [llms.txt](${appUrl}/llms.txt)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
      Vary: "Accept",
    },
  });
}
