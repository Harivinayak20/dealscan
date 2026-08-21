import type { NextConfig } from "next";

const sharedHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
  "font-src 'self' https:",
  "connect-src 'self' https://api.groq.com https://commons.wikimedia.org https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
  "frame-src https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
];

const csp = (frameAncestors: string) =>
  [...cspDirectives, `frame-ancestors ${frameAncestors}`].join("; ");

// Strict everywhere: deny framing of the site itself (clickjacking protection).
const strictHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  ...sharedHeaders,
  { key: "Content-Security-Policy", value: csp("'none'") },
];

// Embed widget must be frameable by any site (that is the point), so it drops
// X-Frame-Options and allows all frame-ancestors. It carries no user data.
const embedHeaders = [
  ...sharedHeaders,
  { key: "Content-Security-Policy", value: csp("*") },
];

// Points agents at the machine-readable entry points from the homepage response
// itself, so discovery does not depend on guessing well-known paths (RFC 8288).
const agentDiscoveryHeaders = [
  {
    key: "Link",
    value: [
      '</.well-known/api-catalog>; rel="api-catalog"',
      '</api/openapi.json>; rel="service-desc"; type="application/json"',
      '</llms.txt>; rel="service-doc"; type="text/plain"',
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // The 734 per-year value pages were 93% identical to their neighbours, so
      // they were rolled up into one value-by-year page per model. 301 keeps
      // whatever equity the year URLs earned.
      {
        source: "/cars/:slug/:yearValue(\\d{4}-value)",
        destination: "/cars/:slug/value",
        permanent: true,
      },
      // The per-year problem pages were noindexed after consuming crawl budget
      // without earning meaningful traffic. Consolidate them into one useful
      // guide per model and preserve old links with a permanent redirect.
      {
        source: "/cars/:slug/problems/:year(\\d{4})",
        destination: "/cars/:slug/years-to-avoid",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/embed/:path*", headers: embedHeaders },
      { source: "/((?!embed/).*)", headers: strictHeaders },
      { source: "/", headers: agentDiscoveryHeaders },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
