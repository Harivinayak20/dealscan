# Dealscan.dev

Dealscan.dev is a used-car listing analyzer for buyer-provided information. It helps shoppers review a listing before contacting the seller by returning a deal score, risk signals, missing details, rough price context, and negotiation guidance.

The product does not scrape marketplaces or require marketplace logins. Users provide the listing information by pasting text, uploading a screenshot for reference, or entering vehicle details manually.

## Current Production

- App: https://dealscan.pages.dev
- Repository: https://github.com/Harivinayak20/dealscan
- Hosting: Cloudflare Pages
- Default analysis mode: local heuristic scoring
- Paid API requirement: none

## Features

- Paste listing text
- Screenshot-assisted listing flow
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

The default engine is a local heuristic analyzer. It works without paid AI keys or external data providers.

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

## Optional Provider Support

AI providers are optional enhancements. If a provider is not configured or fails, the app continues with local scoring.

Supported provider values:

```bash
AI_PROVIDER=none
AI_PROVIDER=anthropic
AI_PROVIDER=gemini
AI_PROVIDER=groq
AI_PROVIDER=openrouter
```

Server-only keys:

```bash
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
GROQ_MODEL=
OPENROUTER_API_KEY=
```

Never expose provider keys with `NEXT_PUBLIC_`.

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

Run the app:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
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
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only variables:

```bash
AI_PROVIDER=
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
GROQ_MODEL=
OPENROUTER_API_KEY=
MARKET_DATA_API_KEY=
VIN_HISTORY_API_KEY=
OCR_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
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
AI_PROVIDER=none
NEXT_PUBLIC_APP_URL=https://dealscan.pages.dev
```

## Trust and Safety

- Dealscan.dev analyzes only information provided by the user.
- No marketplace scraping, crawling, or automated listing extraction is included.
- Scores and price ranges are estimates, not guarantees.
- Buyers should verify title status, inspect the vehicle, and consider a mechanic inspection before purchase.
- Market estimates can vary by location, condition, mileage, demand, and available records.

## Current Limitations

- No licensed market-data feed yet
- No VIN decoding or vehicle-history API integration yet
- No OCR extraction from screenshots yet
- No accounts, saved cars, alerts, or payment flow yet
- Affiliate links should be replaced with approved partner URLs before monetization

## Deployment Checklist

- `npm run build` passes
- Cloudflare Pages environment variables are set
- Server-only keys are not exposed client-side
- `nodejs_compat` is enabled
- No scraping functionality is introduced
- Disclaimers remain visible in the product
