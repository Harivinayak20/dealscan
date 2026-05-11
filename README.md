# DEALSCAN

DEALSCAN is a Next.js App Router app for evaluating used car listings from information the buyer provides. It supports pasted listing text, screenshot-assisted entry, and manual entry. It does not scrape Facebook Marketplace, Craigslist, OfferUp, dealership sites, or any other third-party marketplace.

## Free-First Architecture

The default analysis engine is local heuristic scoring. The app works with no paid AI keys and no paid services.

The local analyzer checks:

- Year, make, model, trim, price, mileage, location, title status, and condition signals
- Red flag terms such as no title, salvage, rebuilt, flood, needs work, mechanic special, engine issues, transmission issues, and cash only
- Green flag terms such as clean title, one owner, no accidents, service records, new tires, new brakes, garage kept, and clean Carfax
- Missing information, vehicle age, mileage per year, rough price sanity, confidence, and negotiation leverage

Fair-value ranges are rough estimates from listing text only. They are not licensed market valuations.

## Optional AI Providers

AI is an enhancement, not a dependency.

Default:

```bash
AI_PROVIDER=none
```

Optional future providers:

```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=

AI_PROVIDER=gemini
GEMINI_API_KEY=

AI_PROVIDER=groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=
```

If a selected provider key is missing or the provider fails, the API falls back to the local analyzer.

Groq note: `meta-llama/llama-prompt-guard-2-86m` is a lightweight prompt-injection detection model, not a listing-analysis model. Keep it for a future guardrail layer. For enhanced listing analysis through Groq, use a chat/instruction model in `GROQ_MODEL`.

## Recommended Free Stack

- Hosting: Cloudflare Pages/Workers or Vercel free tier
- Database later: Supabase free tier
- Cache later: Cloudflare KV or Upstash free tier
- Current Phase 1 cache: in-memory 24-hour cache

## Requirements

- Node.js 20 or newer
- npm

Install Node.js from [nodejs.org](https://nodejs.org/) or use a version manager such as `nvm`.

## Local Setup

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

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## No-Scraping Policy

The product only analyzes:

- Text pasted by the user
- Screenshot text that the user manually pastes
- Vehicle details entered by the user

There is no marketplace scraping, automated crawling, browser scraping, or third-party listing extraction in this Phase 1 build.

## Privacy and Trust

- AI keys are optional and server-only.
- Only `NEXT_PUBLIC_*` variables are used client-side.
- The UI labels market values as rough estimates.
- DealScan provides estimates based on listing information, not guarantees.
- Always verify title status, inspect the vehicle, and consider a mechanic inspection before buying.
- DealScan does not scrape marketplaces. It analyzes only information you provide.
- Market estimates may vary by location, condition, mileage, and demand.
- Missing details reduce confidence.
- Screenshot upload is preview-only in Phase 1 and does not perform OCR.

## Deploy

1. Push the project to GitHub.
2. Import the repository into Vercel or deploy to Cloudflare Pages.
3. Add environment variables from `.env.example`.
4. Keep `AI_PROVIDER=none` for the free local analyzer.
5. Add approved `NEXT_PUBLIC_*` affiliate URLs before launch.
6. Deploy.

## Current Limitations

- No live licensed market data yet.
- No VIN decoding or vehicle history API yet.
- No OCR extraction from screenshots yet.
- No saved accounts, saved cars, alerts, or Supabase persistence yet.
- Affiliate URLs are placeholders unless replaced with approved links.
- Local scoring is a heuristic, not a real pricing engine.

## Future Integration Hooks

- Licensed market data API for local comps and depreciation curves.
- VIN and history report API for title, ownership, and accident checks.
- OCR API for screenshot text extraction.
- Supabase for saved analyses, saved cars, buyer outcomes, and feedback.
- Optional AI providers for enhanced explanations.
