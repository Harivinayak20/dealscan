// Client-side, cookieless event beacon. Uses a per-session random id stored in
// sessionStorage (cleared when the tab closes, never persisted, no PII, no cookie).

type TrackType = "pageview" | "scan_started" | "affiliate_click" | "error";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem("ds_sid");
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem("ds_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

export function track(type: TrackType, extra?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      type,
      path: window.location.pathname,
      referrer: document.referrer,
      session: getSessionId(),
      ...extra,
    });
    const url = "/api/track";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      void fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* analytics must never break UX */
  }
}
