/**
 * Machine-readable OpenAPI 3.1 spec for the public DealScan API. AI agents and
 * developer tools fetch this to discover and call /api/v1/analyze. Linked from
 * /llms.txt.
 */
import { CORS_HEADERS } from "@/lib/api-cors";
import { PUBLIC_API_VERSION } from "@/lib/public-api";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export function GET(): Response {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "DealScan API",
      version: PUBLIC_API_VERSION,
      description:
        "Free, independent used-car deal analysis. Submit a listing URL or text and get a 0-100 deal score, red flags, fair-value range, and a suggested offer. Not affiliated with any marketplace or dealer.",
      contact: { url: `${appUrl}/contact` },
      license: { name: "Free for non-commercial and attributed use" },
    },
    servers: [{ url: appUrl }],
    paths: {
      "/api/v1/analyze": {
        post: {
          operationId: "analyzeListing",
          summary: "Analyze a used-car listing",
          description:
            "Provide exactly one of `url`, `text`, or `manualDetails`. Returns a deal score, verdict, red flags, good signs, a fair-value range, and a suggested offer.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AnalyzeRequest" },
                examples: {
                  byUrl: { value: { url: "https://www.autotrader.com/cars-for-sale/vehicle/123" } },
                  byText: {
                    value: {
                      text: "2019 Toyota Camry SE, 42,300 miles, clean title, one owner, $18,400.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Analysis result",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AnalyzeResponse" } },
              },
            },
            "400": { description: "Invalid request body" },
            "422": { description: "Listing could not be read or had too little detail" },
            "429": { description: "Rate limit exceeded" },
          },
        },
        get: {
          operationId: "analyzeListingByQuery",
          summary: "Analyze a listing via query string",
          description: "Convenience form for GET-only clients. Pass `url` or `text`.",
          parameters: [
            { name: "url", in: "query", required: false, schema: { type: "string", format: "uri" } },
            { name: "text", in: "query", required: false, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Analysis result, or service metadata when no query is given",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AnalyzeResponse" } },
              },
            },
            "429": { description: "Rate limit exceeded" },
          },
        },
      },
    },
    components: {
      schemas: {
        AnalyzeRequest: {
          type: "object",
          description: "Provide exactly one of url, text, or manualDetails.",
          properties: {
            url: { type: "string", format: "uri", description: "Public listing URL." },
            text: { type: "string", description: "Raw listing text." },
            manualDetails: {
              type: "object",
              properties: {
                year: { type: "string" },
                make: { type: "string" },
                model: { type: "string" },
                mileage: { type: "string" },
                price: { type: "string" },
                titleStatus: { type: "string" },
                sellerNotes: { type: "string" },
              },
            },
          },
        },
        Range: {
          type: "object",
          properties: {
            low: { type: ["number", "null"] },
            high: { type: ["number", "null"] },
            note: { type: "string" },
          },
        },
        AnalyzeResponse: {
          type: "object",
          properties: {
            apiVersion: { type: "string" },
            analysis: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100 },
                verdict: { type: "string" },
                summary: { type: "string" },
                confidence: { type: "string", enum: ["Low", "Medium", "High"] },
                fairValue: { $ref: "#/components/schemas/Range" },
                suggestedOffer: { $ref: "#/components/schemas/Range" },
                categories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      label: { type: "string" },
                      score: { type: "number" },
                      note: { type: "string" },
                    },
                  },
                },
                redFlags: { type: "array", items: { type: "string" } },
                greenFlags: { type: "array", items: { type: "string" } },
                missingInfo: { type: "array", items: { type: "string" } },
                negotiationTip: { type: "string" },
                sellerQuestions: { type: "array", items: { type: "string" } },
              },
            },
            meta: {
              type: "object",
              properties: {
                analysisMode: { type: "string", enum: ["groq", "gemini", "local"] },
                cached: { type: "boolean" },
                disclaimer: { type: "string" },
                source: { type: "object" },
              },
            },
          },
        },
      },
    },
    "x-mcp": {
      endpoint: `${appUrl}/api/mcp`,
      transport: "streamable-http",
      description: "MCP server exposing analyze_listing and check_price tools.",
    },
  };

  return new Response(JSON.stringify(spec), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      ...CORS_HEADERS,
    },
  });
}
