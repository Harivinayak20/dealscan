# Ads Readiness

Dealscan is prepared for ad review locally, but ads must stay disabled until the account and compliance gates below are complete.

## Built locally

- AdSense script loading is disabled by default behind `NEXT_PUBLIC_ENABLE_ADSENSE=false`.
- AdSense code only renders when `NEXT_PUBLIC_ENABLE_ADSENSE=true`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, and a slot ID are present.
- Ad slots exist on the home page and guide article pages.
- `/ads.txt` is generated from `ADSENSE_PUBLISHER_ID`, `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`, or `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.
- `/robots.txt` and `/sitemap.xml` are generated.
- `/privacy`, `/terms`, `/cookies`, `/about`, `/contact`, `/affiliate-links`, `/guides`, and guide article pages exist.
- Affiliate disclosures and advertising disclosures are visible.

## Before enabling ads

1. Get AdSense approval for the domain.
2. Add approved values:
   - `ADSENSE_PUBLISHER_ID=pub-0000000000000000`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000`
   - `NEXT_PUBLIC_ADSENSE_HOME_SLOT=0000000000`
   - `NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT=0000000000`
3. Keep `NEXT_PUBLIC_ENABLE_ADSENSE=false` until the site is approved and you are ready for ad traffic.
4. Replace placeholder buyer-tool URLs with approved affiliate links only after each program approves the site.
5. Configure AdSense Privacy & Messaging or another Google-certified CMP before serving ads to EEA, UK, or Switzerland visitors.
6. Confirm `/ads.txt` returns the final Google line:
   `google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0`

## Current local verification

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- Browser route check for `/`, `/guides`, one guide article, `/affiliate-links`, `/privacy`, `/terms`, `/cookies`, `/about`, `/contact`, `/ads.txt`, `/robots.txt`, and `/sitemap.xml`

## Do not do yet

- Do not deploy until Hari approves.
- Do not enable AdSense before approved IDs and consent settings are ready.
- Do not claim affiliate revenue projections until live click and conversion data exists.
