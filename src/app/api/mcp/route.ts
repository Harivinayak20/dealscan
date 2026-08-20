/**
 * DealScan MCP server (Model Context Protocol over Streamable HTTP).
 *
 *   POST /api/mcp   JSON-RPC 2.0 messages
 *
 * Lets any MCP client (Claude, ChatGPT, IDE agents) add DealScan as a native
 * tool. Exposes two tools:
 *   - analyze_listing: score a used-car listing (URL or pasted text)
 *   - check_price:     fair-price estimate for a known model/year/mileage
 *
 * Stateless: each request is handled independently, so no session store is
 * needed. Referenced from /llms.txt.
 */
import { checkRateLimit } from "@/lib/rate-limit";
import { CORS_HEADERS, corsPreflight, jsonResponse } from "@/lib/api-cors";
import {
  analyzeInputSchema,
  analyzePublicListing,
  PUBLIC_API_VERSION,
  PUBLIC_DISCLAIMER,
  PublicApiError,
} from "@/lib/public-api";
import { estimatePrice, priceCheckerModels, type Condition } from "@/lib/pricing";
import { avoidFlag } from "@/lib/pricing";

const PROTOCOL_VERSION = "2025-06-18";
const RATE_LIMIT = 20;

const SERVER_INFO = {
  name: "dealscan",
  title: "DealScan",
  version: PUBLIC_API_VERSION,
};

const TOOLS = [
  {
    name: "analyze_listing",
    title: "Analyze a used-car listing",
    description:
      "Score a used-car listing from 0-100 with a verdict, red flags, good signs, a fair-value range, and a suggested offer. Accepts a public listing URL or pasted listing text.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Public listing URL (AutoTrader, Cars.com, CarGurus, Edmunds, TrueCar, etc.).",
        },
        text: {
          type: "string",
          description: "Raw listing text pasted from the ad (use when there is no public URL).",
        },
      },
    },
  },
  {
    name: "check_price",
    title: "Check a used-car fair price",
    description:
      "Estimate what a used car is worth by model, year, and mileage. Returns a fair private-party price, a private range, and typical dealer retail.",
    inputSchema: {
      type: "object",
      required: ["model", "year"],
      properties: {
        model: {
          type: "string",
          description:
            "Model slug or 'Make Model' label, e.g. 'toyota-camry' or 'Toyota Camry'. Call with an unknown model to receive the list of supported models.",
        },
        year: { type: "integer", description: "Model year, e.g. 2019." },
        mileage: {
          type: "integer",
          description: "Odometer miles. Optional; defaults to typical mileage for the age.",
        },
        condition: {
          type: "string",
          enum: ["excellent", "good", "fair", "rough"],
          description: "Vehicle condition. Optional; defaults to 'good'.",
        },
        title: {
          type: "string",
          enum: ["clean", "branded"],
          description: "Title status. Optional; defaults to 'clean'.",
        },
      },
    },
  },
] as const;

type JsonRpcId = string | number | null;

function rpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0" as const, id, result };
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0" as const, id, error: { code, message } };
}

function toolText(payload: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  };
}

function toolError(message: string) {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

async function callTool(name: string, args: Record<string, unknown>) {
  if (name === "analyze_listing") {
    const parsed = analyzeInputSchema.safeParse({
      url: typeof args.url === "string" ? args.url : undefined,
      text: typeof args.text === "string" ? args.text : undefined,
    });
    if (!parsed.success) {
      return toolError(parsed.error.issues[0]?.message ?? "Provide `url` or `text`.");
    }
    try {
      const response = await analyzePublicListing(parsed.data);
      return toolText(response);
    } catch (error) {
      if (error instanceof PublicApiError) return toolError(error.message);
      return toolError("Could not analyze that listing.");
    }
  }

  if (name === "check_price") {
    const rawModel = typeof args.model === "string" ? args.model.trim() : "";
    const year = Number(args.year);
    if (!rawModel || !Number.isFinite(year)) {
      return toolError("Provide `model` and `year`.");
    }

    const models = priceCheckerModels();
    const needle = rawModel.toLowerCase();
    const match = models.find(
      (m) => m.slug === needle || m.label.toLowerCase() === needle,
    );
    if (!match) {
      return toolText({
        error: `Unknown model "${rawModel}".`,
        supportedModels: models.map((m) => ({ slug: m.slug, label: m.label })),
      });
    }

    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - year);
    const mileage = Number.isFinite(Number(args.mileage))
      ? Number(args.mileage)
      : age * 12000;
    const condition = (
      ["excellent", "good", "fair", "rough"].includes(String(args.condition))
        ? args.condition
        : "good"
    ) as Condition;
    const title = args.title === "branded" ? "branded" : "clean";

    const estimate = estimatePrice(match.slug, year, mileage, condition, title, currentYear);
    if (!estimate) {
      return toolError(`No pricing data for ${match.label} ${year}.`);
    }

    const avoid = avoidFlag(match.slug, year);
    return toolText({
      model: match.label,
      slug: match.slug,
      year,
      mileage,
      condition,
      title,
      fairPrice: estimate.fair,
      privateRange: { low: estimate.privateLow, high: estimate.privateHigh },
      dealerRetail: estimate.dealerRetail,
      yearsToAvoidFlag: avoid ? { years: avoid.years, reason: avoid.reason } : null,
      disclaimer: PUBLIC_DISCLAIMER,
    });
  }

  return null;
}

async function handleMessage(message: {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
}) {
  const id: JsonRpcId = message.id ?? null;
  const method = typeof message.method === "string" ? message.method : "";
  const params = (message.params ?? {}) as Record<string, unknown>;

  switch (method) {
    case "initialize":
      return rpcResult(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Use analyze_listing to score a used-car listing (URL or pasted text), and check_price for a fair-price estimate by model/year/mileage. Estimates are independent and not a substitute for a mechanic's inspection.",
      });

    case "ping":
      return rpcResult(id, {});

    case "tools/list":
      return rpcResult(id, { tools: TOOLS });

    case "tools/call": {
      const name = typeof params.name === "string" ? params.name : "";
      const args = (params.arguments ?? {}) as Record<string, unknown>;
      const result = await callTool(name, args);
      if (result === null) return rpcError(id, -32602, `Unknown tool: ${name}`);
      return rpcResult(id, result);
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

export function OPTIONS(): Response {
  return corsPreflight();
}

export function GET(): Response {
  // Advertise the server for clients that probe with GET before POSTing.
  return jsonResponse(
    {
      server: SERVER_INFO,
      transport: "streamable-http",
      protocolVersion: PROTOCOL_VERSION,
      tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
      hint: "POST JSON-RPC 2.0 messages to this endpoint.",
    },
    200,
    CORS_HEADERS,
  );
}

export async function POST(request: Request): Promise<Response> {
  const rl = await checkRateLimit(request, RATE_LIMIT);
  if (!rl.allowed) {
    const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
    return jsonResponse(
      rpcError(null, -32000, `Too many requests. Try again in ${retryAfterSec} seconds.`),
      429,
      { "Retry-After": String(retryAfterSec) },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(rpcError(null, -32700, "Parse error: invalid JSON."), 400);
  }

  // Notifications (no `id`) get an accepted-but-empty response per JSON-RPC.
  const isNotification = (m: { id?: unknown; method?: unknown }) =>
    typeof m?.method === "string" && m.method.startsWith("notifications/");

  // Support a single message or a batch.
  if (Array.isArray(payload)) {
    const responses = [];
    for (const message of payload) {
      if (isNotification(message)) continue;
      responses.push(await handleMessage(message));
    }
    if (responses.length === 0) return new Response(null, { status: 202, headers: CORS_HEADERS });
    return jsonResponse(responses);
  }

  const message = payload as { id?: JsonRpcId; method?: unknown };
  if (isNotification(message)) {
    return new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  return jsonResponse(await handleMessage(message));
}
