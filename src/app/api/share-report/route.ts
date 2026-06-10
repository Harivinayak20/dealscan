import { NextResponse } from "next/server";

const MAX_PAYLOAD_BYTES = 2048;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const hitCounters = new Map<string, { count: number; resetAt: number }>();

function simpleEmailCheck(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const clientIp = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";

  const now = Date.now();
  const counter = hitCounters.get(clientIp);
  if (counter && now < counter.resetAt) {
    if (counter.count >= RATE_LIMIT_MAX) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
    counter.count++;
  } else {
    hitCounters.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let email: string;
  let vehicleTitle: string;
  let score: number;

  try {
    const text = await request.text();
    if (text.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    const body = JSON.parse(text) as { email?: unknown; vehicleTitle?: unknown; score?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
    vehicleTitle = typeof body.vehicleTitle === "string" ? body.vehicleTitle.slice(0, 200) : "Used Car";
    score = typeof body.score === "number" ? Math.min(Math.max(0, Math.round(body.score)), 100) : 0;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!simpleEmailCheck(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (vehicleTitle.length < 1 || score < 0) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  console.log(`[share-report] request for "${vehicleTitle}" (score=${score})`);

  return NextResponse.json({
    message: "Request received. Email delivery will be available when connected to an email provider.",
  });
}
