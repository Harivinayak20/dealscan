import { retrieveCheckoutSession } from "@/lib/stripe";
import { PRO_COOKIE, signProCookie, upsertProMember } from "@/lib/pro";

// Stripe success_url lands here. Verify the session actually paid, record the
// member, set the signed entitlement cookie, and bounce to the homepage.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") ?? "";
  const home = new URL("/", url.origin);

  const session = sessionId ? await retrieveCheckoutSession(sessionId) : null;
  const email = session?.customer_details?.email ?? null;
  const paid = session?.payment_status === "paid";

  if (!session || !paid || !email) {
    return Response.redirect(new URL("/pricing?activation=failed", url.origin), 303);
  }

  const subscription = typeof session.subscription === "object" ? session.subscription : null;
  // Entitle until the period end Stripe reports (+1 day grace); webhook renewals extend it.
  const periodEnd = subscription?.current_period_end
    ? subscription.current_period_end * 1000 + 86400000
    : Date.now() + 8 * 86400000;

  await upsertProMember({
    email,
    stripeCustomerId: session.customer,
    plan: subscription?.items?.data?.[0]?.price?.id === process.env.STRIPE_PRICE_WEEKLY ? "weekly" : "monthly",
    currentPeriodEnd: periodEnd,
  });

  const cookie = await signProCookie(email, periodEnd);
  const headers = new Headers({ location: `${home.toString()}?pro=welcome` });
  if (cookie) {
    headers.append(
      "set-cookie",
      `${PRO_COOKIE}=${encodeURIComponent(cookie)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.floor((periodEnd - Date.now()) / 1000)}`,
    );
  }
  return new Response(null, { status: 303, headers });
}
