# Dealscan.dev

Dealscan.dev is a used-car listing analyzer. It helps shoppers review a listing before contacting the seller by returning a deal score, risk signals, missing details, rough price context, and negotiation guidance.

The primary flow starts with a public listing URL. Dealscan extracts the page text first, can OCR uploaded screenshots with Groq vision, and keeps paste/manual entry as fallback paths. It does not log into marketplaces or bypass access controls.

## Current Production

- App: https://dealscan.pages.dev
- Repository: https://github.com/Harivinayak20/dealscan
- Hosting: Cloudflare Pages
- Default analysis mode: Groq scoring
- Paid API requirement: `GROQ_API_KEY`

## Features

- Public listing URL extraction
- Paste listing text fallback
- Screenshot OCR listing flow
- Manual vehicle detail entry
- Deal score from 0 to 100
- Verdict and plain-English summary
- Rough fair-value range
- Suggested offer range
- Category scoring cards
- Red and green flag detection
- Missing information checklist
- Negotiation tip
- Seller questions
- Buyer tool links for history reports, inspections, insurance, payments, parts, and OBD2 scanners

## Analysis Engine

Dealscan requires Groq for user-facing analysis. The local heuristic analyzer is still used only as an internal schema baseline for Groq prompts and is not returned as a fallback result.

The analyzer evaluates:

- Year, make, model, trim, mileage, price, title status, location, and condition language
- Mileage for age
- Title and ownership risk
- Mechanical risk terms
- Seller transparency
- Missing information
- Positive proof points
- Negotiation opportunity

Rough market and offer ranges are estimates based on listing text. They are not licensed market valuations.

## Provider Support

Provider support is intentionally narrow and honest: Groq is the only supported AI provider. Gemini, OpenRouter, Anthropic, and fake local fallback modes are not advertised.

Server-only keys:

```bash
GROQ_API_KEY=
GROQ_MODEL=
GROQ_VISION_MODEL=
```

Never expose provider keys with `NEXT_PUBLIC_`.

## Scraping

The URL extractor uses guarded server-side HTML fetching:

- Accepts only public `http` and `https` URLs
- Blocks credentials, localhost, loopback, private-network, link-local, and `.local` hosts
- Follows redirects manually and re-validates every redirect target
- Limits fetched HTML size
- Extracts title, metadata, JSON-LD, and readable body text

Scrapling review: `D4Vinci/Scrapling` is active, BSD-3-Clause licensed, and useful for Python scraping stacks. It was not added as a runtime dependency here because this app is a Next/Edge web app and Scrapling's strongest fetcher path depends on Python/browser automation packages. The production path uses the safer in-app extractor above instead of shipping a fragile cross-runtime dependency.

## Local Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Add `GROQ_API_KEY`, then run the app:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Admin Dashboard

Dealscan includes a full admin dashboard at `/admin` for monitoring scans, managing settings, and reviewing audit logs.

See [ADMIN_DASHBOARD.md](./ADMIN_DASHBOARD.md) for full documentation.

Quick start:
```bash
# Set an admin token in .env.local
ADMIN_TOKEN=my-secret-token

# Open http://localhost:3000/admin and enter the token
```

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npm run test         # Run tests
```

## Environment Variables

Client-safe variables:

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_HISTORY_REPORT_URL=
NEXT_PUBLIC_INSURANCE_URL=
NEXT_PUBLIC_LOAN_URL=
NEXT_PUBLIC_INSPECTION_URL=
NEXT_PUBLIC_PARTS_URL=
NEXT_PUBLIC_OBD_SCANNER_URL=
NEXT_PUBLIC_DETAILING_KIT_URL=
NEXT_PUBLIC_ENABLE_ADSENSE=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=
NEXT_PUBLIC_ADSENSE_HOME_SLOT=
NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only variables:

```bash
ADMIN_TOKEN=                     # Required for admin dashboard access
GROQ_API_KEY=
GROQ_MODEL=
GROQ_VISION_MODEL=
MARKET_DATA_API_KEY=
VIN_HISTORY_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADSENSE_PUBLISHER_ID=             # Optional server-only ads.txt publisher ID, e.g. pub-0000000000000000
```

## Cloudflare Pages

Current production settings:

- Production branch: `main`
- Build command: `npx @cloudflare/next-on-pages@1`
- Output directory: `.vercel/output/static`
- Compatibility flag: `nodejs_compat`
- API route runtime: Edge

Recommended production variables:

```bash
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
NEXT_PUBLIC_APP_URL=https://dealscan.pages.dev
```

## Trust and Safety

- Dealscan.dev extracts only public listing URLs provided by the user.
- No marketplace login automation or access-control bypass is included.
- Scores and price ranges are estimates, not guarantees.
- Buyers should verify title status, inspect the vehicle, and consider a mechanic inspection before purchase.
- Market estimates can vary by location, condition, mileage, demand, and available records.

## Current Limitations

- No licensed market-data feed yet
- No VIN decoding or vehicle-history API integration yet
- No accounts, saved cars, alerts, or payment flow yet
- Affiliate links should be replaced with approved partner URLs before monetization

## Deployment Checklist

- Review `docs/ads-readiness.md` before enabling ads or affiliate monetization.
- `npm run build` passes
- `npm run test` passes
- Cloudflare Pages environment variables are set
- Server-only keys are not exposed client-side
- AdSense remains disabled until approved IDs are configured and `NEXT_PUBLIC_ENABLE_ADSENSE=true`
- `/ads.txt`, `/robots.txt`, `/sitemap.xml`, `/privacy`, `/terms`, `/cookies`, `/about`, `/contact`, and `/guides` respond successfully
- EEA, UK, and Switzerland ad serving is not enabled until AdSense Privacy & Messaging or another Google-certified CMP is configured
- `nodejs_compat` is enabled
- URL extraction remains guarded against private-network targets
- Disclaimers remain visible in the product
