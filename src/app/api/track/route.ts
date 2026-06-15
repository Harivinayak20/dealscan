import { NextResponse } from "next/server";
import { recordEvent, type EventType } from "@/lib/analytics";

// Public, cookieless event ingest for the client beacon. scan_completed is NOT
// accepted here (it is recorded server-side in analyze-listing so it can't be spoofed).
const CLIENT_EVENTS: EventType[] = ["pageview", "scan_started", "affiliate_click", "error"];
const APP_HOSTS = new Set(["dealscan.dev", "www.dealscan.dev", "localhost"]);

function str(value: unknown, max: number): string | null {
  return typeof value === "string" && value.length > 0 ? value.slice(0, max) : null;
}

function refererHost(referrer: unknown): string | null {
  const raw = str(referrer, 512);
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "");
    return APP_HOSTS.has(host) || APP_HOSTS.has(`www.${host}`) ? null : host;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // Cheap bot filter: real browsers send a UA.
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || /bot|crawler|spider|crawling|preview/i.test(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = body.type as EventType;
  if (!CLIENT_EVENTS.includes(type)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Whitelist meta to small known fields only (no free-form/PII).
  const meta: Record<string, string> = {};
  if (type === "affiliate_click") {
    const partner = str(body.partner, 40);
    if (partner) meta.partner = partner;
  }
  if (type === "error") {
    const message = str(body.message, 200);
    if (message) meta.message = message;
  }

  await recordEvent({
    type,
    path: str(body.path, 256)?.split("?")[0] ?? null,
    referrerHost: refererHost(body.referrer),
    session: str(body.session, 64),
    meta: Object.keys(meta).length ? meta : null,
  });

  return new NextResponse(null, { status: 204 });
}
