import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isStripeConfigured } from "@/lib/pro";
import { createCheckoutSession, type ProPlan } from "@/lib/stripe";

export async function POST(request: Request) {
  const limit = 6;
  const rl = checkRateLimit(request, limit);
  if (!rl.allowed) return rateLimitResponse(rl.retryAfterMs, limit);

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Pro checkout isn't live yet. Join the waitlist on the pricing page." },
      { status: 503 },
    );
  }

  let plan: ProPlan = "monthly";
  try {
    const body = (await request.json()) as { plan?: unknown };
    if (body.plan === "weekly" || body.plan === "monthly") plan = body.plan;
  } catch {
    /* default plan */
  }

  const session = await createCheckoutSession(plan);
  if (!session) {
    return NextResponse.json({ error: "Could not start checkout. Try again." }, { status: 502 });
  }
  return NextResponse.json({ url: session.url });
}
