import Script from "next/script";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/adsense";

export function AdSenseScript() {
  if (!ADSENSE_ENABLED || !ADSENSE_CLIENT_ID) {
    return null;
  }

  return (
    <Script
      id="adsense-auto-ads"
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
    />
  );
}
