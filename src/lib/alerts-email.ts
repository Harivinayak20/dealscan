// Transactional alert email via the Resend HTTP API. Everything is optional:
// without RESEND_API_KEY the watch flow still works, we just can't send email
// (the UI tells users alerts aren't live yet). No SDK dependency — one fetch.

const RESEND_URL = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export type AlertEmail = {
  to: string;
  subject: string;
  html: string;
};

export async function sendAlertEmail(email: AlertEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.ALERTS_FROM_EMAIL ?? "DealScan Alerts <alerts@dealscan.dev>";

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to: [email.to], subject: email.subject, html: email.html }),
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

function shell(title: string, bodyHtml: string, unsubscribeToken: string): string {
  const unsubscribe = `${appUrl}/api/watch/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  return `<!doctype html><html><body style="margin:0;background:#f6f1e7;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1c1f24">
  <div style="max-width:560px;margin:0 auto;background:#fffdfa;border:1px solid #e6ddcc;border-radius:16px;padding:28px">
    <div style="font-size:20px;font-weight:800;margin-bottom:4px">DealScan.dev</div>
    <h1 style="font-size:22px;margin:16px 0 8px">${title}</h1>
    ${bodyHtml}
    <p style="font-size:12px;color:#8a8378;margin-top:28px;border-top:1px solid #eee5d5;padding-top:12px">
      You get this because you asked DealScan to watch this listing.
      <a href="${unsubscribe}" style="color:#8a8378">Stop watching it</a>.
      DealScan never sells your email or shares it with dealers.
    </p>
  </div>
</body></html>`;
}

function money(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function priceDropEmail(args: {
  vehicleTitle: string;
  from: number;
  to: number;
  listingUrl: string;
  token: string;
}): { subject: string; html: string } {
  const drop = money(args.from - args.to);
  return {
    subject: `Price drop: ${args.vehicleTitle} is down ${drop}`,
    html: shell(
      `${args.vehicleTitle} dropped to ${money(args.to)}`,
      `<p style="font-size:15px;line-height:1.6">The asking price fell from <strong>${money(args.from)}</strong> to <strong>${money(args.to)}</strong> — a <strong>${drop}</strong> drop since you started watching. A falling price is a strong negotiation signal: the seller is motivated.</p>
       <p style="margin:20px 0"><a href="${args.listingUrl}" style="background:#1c1f24;color:#fffdfa;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">View the listing</a>
       &nbsp; <a href="${appUrl}/" style="color:#1c1f24;font-weight:700">Re-scan it on DealScan</a></p>`,
      args.token,
    ),
  };
}

export function listingGoneEmail(args: {
  vehicleTitle: string;
  lastPrice: number | null;
  token: string;
}): { subject: string; html: string } {
  const price = args.lastPrice
    ? ` It was last listed at <strong>${money(args.lastPrice)}</strong> — useful as a real-world comp for the next one.`
    : "";
  return {
    subject: `${args.vehicleTitle} is gone — probably sold`,
    html: shell(
      `${args.vehicleTitle} is off the market`,
      `<p style="font-size:15px;line-height:1.6">The listing you were watching no longer loads, which usually means it sold or was pulled.${price}</p>
       <p style="margin:20px 0"><a href="${appUrl}/" style="background:#1c1f24;color:#fffdfa;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:700">Scan the next candidate</a></p>`,
      args.token,
    ),
  };
}
