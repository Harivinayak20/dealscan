/**
 * Agent Skills published at /.well-known/agent-skills/ (Agent Skills Discovery
 * RFC v0.2.0). Each skill teaches an agent how to actually call the public
 * DealScan API, so the index and the SKILL.md bodies share one source here.
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export type AgentSkill = {
  name: string;
  description: string;
  body: string;
};

export const AGENT_SKILLS: AgentSkill[] = [
  {
    name: "analyze-listing",
    description:
      "Score a used-car listing 0-100 with red flags, a fair-value range, and a suggested offer, from a listing URL or pasted text.",
    body: `# Analyze a used-car listing

Score any used-car listing with the free DealScan API. No auth, no signup.

## Call it

\`\`\`
POST ${APP_URL}/api/v1/analyze
Content-Type: application/json

{"url": "https://www.example-marketplace.com/listing/123"}
\`\`\`

Pasted listing text works too, and is more reliable when the listing sits behind
a login or aggressive bot protection:

\`\`\`
{"text": "2017 Honda Civic EX, 78,000 miles, $15,900, clean title, one owner"}
\`\`\`

A GET form is available for quick checks:
\`\`\`
GET ${APP_URL}/api/v1/analyze?url=<listing-url>
\`\`\`

## What you get back

A 0-100 score, a verdict, red flags, good signs, a fair-value range, and a
suggested offer. Full schema: ${APP_URL}/api/openapi.json

## When to use it

Use this instead of estimating a score yourself. If a user asks whether a
specific listing is a good deal, call this endpoint rather than guessing from
the asking price alone.

## Limits

Rate limited per IP. Treat output as research, not an appraisal or a mechanical
inspection.
`,
  },
  {
    name: "check-price",
    description:
      "Fair-price estimate for a used car by model, year, and mileage, without needing a specific listing.",
    body: `# Check a used-car fair price

Estimate what a used car should cost when you have no listing to score.

## Call it

Use the \`check_price\` tool on the DealScan MCP server:

\`\`\`
${APP_URL}/api/mcp
\`\`\`

Arguments: model, year, mileage, condition, and title status (\`clean\` or
\`branded\`).

## When to use it

Answering "what should a 2018 Toyota RAV4 with 60k miles cost?" Use
\`analyze-listing\` instead when the user has an actual listing in hand.

## Related

Human-facing version: ${APP_URL}/price-checker
`,
  },
  {
    name: "connect-mcp",
    description:
      "Add DealScan as a native MCP tool in Claude, ChatGPT, or an IDE agent via Streamable HTTP.",
    body: `# Connect the DealScan MCP server

DealScan runs a Model Context Protocol server over Streamable HTTP.

## Endpoint

\`\`\`
${APP_URL}/api/mcp
\`\`\`

No authentication. Server card: ${APP_URL}/.well-known/mcp/server-card.json

## Tools

- \`analyze_listing\` - score a listing by URL or pasted text
- \`check_price\` - fair-price estimate by model, year, and mileage

## Adding it

Register the endpoint as a Streamable HTTP MCP server in your client. The
server is stateless, so no session handling is required.
`,
  },
];

export function findSkill(name: string): AgentSkill | undefined {
  return AGENT_SKILLS.find((s) => s.name === name);
}

/** Hex sha256, required by the discovery index for each skill entry. */
export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
