import Script from "next/script";

// The measurement ID ships in the page source on every request, so there is
// nothing to protect by moving it into an env var.
const GA_MEASUREMENT_ID = "G-FMD9JSYJZH";

// Raw <script> tags in the App Router are not reliably executed, so this follows
// the same next/script pattern as AdSenseScript. afterInteractive injects the tag
// on the client once hydration finishes, so it will not appear in view-source;
// check the Network tab or GA Realtime instead.
//
// The guard only silences `next dev`. `next start` runs as production, so a local
// production server does report to the property; filter localhost in GA if that
// becomes noisy.
export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
