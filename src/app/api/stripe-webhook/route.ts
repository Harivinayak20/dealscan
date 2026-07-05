import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { upsertProMember } from "@/lib/pro";

// Keeps pro_members in sync with Stripe: renewals extend the entitlement,
// cancellations simply stop extending it (access lapses at period end).
export async function POST(request: Request) {
  const payload = await request.text();
  const valid = await verifyStripeSignature(payload, request.headers.get("stripe-signature"));
  if (!valid) return NextResponse.json({ error: "Bad signature." }, { status: 400 });

  let event: {
    type?: string;
    data?: {
      object?: {
        customer?: string | null;
        customer_details?: { email?: string | null } | null;
        customer_email?: string | null;
        current_period_end?: number;
        plan?: { id?: string } | null;
      };
    };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  }

  const object = event.data?.object;
  const email = object?.customer_details?.email ?? object?.customer_email ?? null;

  if (
    (event.type === "checkout.session.completed" ||
      event.type === "invoice.paid" ||
      event.type === "customer.subscription.updated") &&
    email
  ) {
    const periodEnd = object?.current_period_end
      ? object.current_period_end * 1000 + 86400000
      : Date.now() + 8 * 86400000;
    await upsertProMember({
      email,
      stripeCustomerId: object?.customer ?? null,
      plan: null,
      currentPeriodEnd: periodEnd,
    });
  }

  return NextResponse.json({ received: true });
}
