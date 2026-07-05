import { endWatch } from "@/lib/watch-store";

// Linked from every alert email. Plain HTML response, no login required.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const ended = token ? await endWatch(token, "unsubscribed") : false;

  const message = ended
    ? "Done — you've stopped watching that listing. No more emails about it."
    : "That watch link is invalid or was already stopped.";

  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>DealScan alerts</title></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f6f1e7;color:#1c1f24;display:grid;place-items:center;min-height:100vh;margin:0">
  <div style="max-width:480px;background:#fffdfa;border:1px solid #e6ddcc;border-radius:16px;padding:32px;text-align:center">
    <div style="font-size:20px;font-weight:800">DealScan.dev</div>
    <p style="font-size:16px;line-height:1.6">${message}</p>
    <a href="/" style="color:#B4501F;font-weight:700">Back to DealScan</a>
  </div>
</body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
