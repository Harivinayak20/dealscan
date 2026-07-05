# Visor.vin Teardown & DealScan War Plan

_Researched July 2026. Companion to `GROWTH_PLAN.md` (traffic engine) — this doc covers the competitive strategy and the product roadmap derived from it. Note: visor.vin (car search) is unrelated to visor.us (spreadsheet tool); ignore the latter in any research._

---

## 1. What Visor is

Visor.vin is a buyer-side car search engine covering the US and Canada. Listings are scraped **directly from dealer websites** (not bought as dealer feeds), which lets Visor stay independent: no dealer ads, no boosted placement, no lead selling. On top of raw listings it layers market context — days on market, price-drop history, sold listings, nationwide comps — and wraps it in fast search (VIN, plate, URL, filters, map view).

Built by two brothers (a car enthusiast and a data scientist) starting late 2024. iOS and Android apps (≈4.2★). Public changelog and feature-request board on Featurebase. A paid data API at visor.vin/api.

## 2. Traction (as of March 2026, SEMrush)

| Metric | Value |
|---|---|
| Monthly visits | ~1.39M (+136% MoM) |
| Avg session duration | 12:35 |
| Traffic mix | 77% direct, ~9% Google |
| Claimed users | 1,000,000+ |
| Referring domains | 264 (+98% in one month) |

The traffic mix is the headline: **77% direct** means word-of-mouth and retention, not SEO, built this. Multiple public reviews trace discovery to Reddit threads where the founders personally engage.

## 3. Business model

- **Free tier** (ad-supported): full search, map, basic filters.
- **Visor Plus**, from ~$5/week (weekly / monthly / annual): sold-listing data, filtering by installed factory options, unlimited saved searches, price alerts, inventory tracking.
- Weekly billing fits the episodic nature of car shopping (a 2–8 week burst, then churn without hard feelings).
- Explicit anti-lead-gen positioning: "built to help you buy a car, not to help a dealer sell one."

## 4. Why it grew fast (the five mechanics)

1. **A persistent data moat.** Price history, days-on-market, and sold comps only get better with time and make the site a *destination people check daily* (12-minute sessions), not a one-shot tool.
2. **Radical buyer-side positioning.** No lead selling, no dealer ads — a trust wedge every incumbent (Autotrader, Cars.com, CarGurus) structurally cannot copy.
3. **Founder-led Reddit virality.** Genuine, personal engagement in car-buying subreddits; users became evangelists ("told as many people as I could").
4. **Visible shipping velocity.** Public changelog + feature board; users watch their requests get built.
5. **Episodic pricing.** $5/week converts shoppers mid-episode without subscription guilt.

## 5. Visor's weaknesses (our openings)

- **No deal score.** Visor shows data; it does not *judge* a listing. CarGurus-style deal ratings are their most-cited missing feature. Judgment is DealScan's entire product.
- **No negotiation layer.** No offer ranges, seller questions, or scripts.
- **No risk analysis.** No red flags, title-status parsing, or scam patterns.
- Recurring app complaints: crashes, clunky UI (esp. iPad), subscription-management friction, ads on free tier.
- Coverage is dealer-inventory only — private-party listings (Craigslist, FB Marketplace), where risk is highest, are out of scope. DealScan scans anything.

## 6. Strategy: the judgment layer

Do **not** fight Visor on listing aggregation — nationwide scraping infrastructure is their moat and a capital sink. Instead:

> **Visor (and every search site) helps you find the car. DealScan tells you whether it's a good deal.**
> "Found it on Visor, CarGurus, or Facebook? Scan it with DealScan before you call."

Steal their *mechanics* (memory, market context, alerts, public shipping, episodic pricing) and aim them at the judgment problem they don't solve.

## 7. Roadmap

### Wave 1 — Moat foundation ✅ (built July 2026, this branch)
- **Listing memory**: `listings` + `listing_snapshots` D1 tables; every scan upserts by VIN (or URL hash). Re-scans surface *days since first scan* and *price drops* — Visor's stickiest mechanic, pointed at scanned listings.
- **Market context in the score**: once ≥10 same-model (±1 year) listings have been scanned, results show "priced above X% of similar listings" with the median — the deal-context Visor lacks entirely.
- **Free VIN hub** (`/vin`, `/vin/[vin]`): specs (NHTSA vPIC), open recalls (NHTSA), crash-test ratings (NHTSA), MPG (EPA). All keyless government APIs — free forever, a huge SEO query class, and a feeder into the analyzer.
- **Public `/changelog`**: the ship-in-the-open trust loop.
- **`/about` buyer-side manifesto**: no leads, no pay-for-score, free means free.

### Wave 2 — Destination mechanics ✅ (built July 2026, this branch)
- Server-side watch subscriptions with email price-drop / "listing gone (probably sold)" alerts — Resend-backed, flagged on `RESEND_API_KEY`; cron sweep at `/api/cron/check-watches` (set `CRON_SECRET`, point a Cloudflare cron or any scheduler at it). "Probably sold at $X" is a poor-man's answer to Visor Plus's sold data.
- Extractor hardening: fixture tests for Cars.com/CarGurus/Carvana/Autotrader/dealer-JSON-LD/Craigslist markup patterns; shared parsers extracted to `listing-parsers.ts`.
- "Challenge the price" one-click copy format built for forum pasting and seller messages.
- Admin dashboard growth KPIs: listings tracked, active watches, alerts sent.
- Still open: public deal-score API + embed v2 (deferred — build when there's B2B pull).

### Wave 3 — Traffic bombardment ✅ (built July 2026, this branch; see GROWTH_PLAN.md §3)
- ~590 per-model-year problem pages (`/cars/[slug]/problems/[year]`) generated from curated years-to-avoid data only — no fabricated facts, honest empty states.
- Head-to-head landers shipped as guides: "DealScan vs Visor", "Visor alternatives", "best free VIN check".
- `/research` hub with the live DealScan Index (verdict mix, median asking by model) — publishes automatically past a minimum sample; llms.txt updated for GEO citation.
- Still open: Remotion content factory verticals (the comps exist; wire scan-props rendering when the posting cadence starts).

### Wave 4 — Monetization ✅ scaffold (built July 2026, this branch)
- **DealScan Pro**: $4.99/week or $9.99/month at `/pricing`. Stripe Checkout + webhook behind `STRIPE_*` env vars; a founding-member waitlist renders until they're set. Entitlement = signed HttpOnly cookie backed by a `pro_members` D1 row.
- Gating is deliberately thin: Pro lifts the watch cap (3 → 50) and scan rate limits. Scanning, scoring, and VIN checks stay free — the buyer-side promise is the moat.

## 8. The human 20% (owner's jobs — cannot be automated)

1. **Reddit founder presence, 30 min/day** (r/UsedCars, r/whatcarshouldIbuy, r/askcarsales, r/personalfinance): genuinely answer questions; mention the tool only where it truly helps. This exact behavior built Visor's 77% direct traffic.
2. **Accounts/keys (~1 hour once)**: Resend, Stripe, Google Search Console, Cloudflare cron trigger.
3. **Post the generated videos** 3×/week (TikTok / Shorts / Reels).
4. **Send the drafted PR pitches** for each data study.
5. **Decide**: Pro pricing, brand voice, and sign-off on each SEO tranche.

## 9. KPIs

Return-visit rate, watchlist adds, email signups, scans/day, indexed pages, referring domains, and (Wave 4) Pro conversions. North star: **weekly returning scanners** — the metric Visor's mechanics are designed to move.

## 10. Sources

- https://visor.vin/ · https://visor.vin/subscribe · https://visor.vin/api · https://visor.vin/changelog
- App Store: https://apps.apple.com/us/app/visor-smarter-car-search/id6742114429
- Google Play: https://play.google.com/store/apps/details?id=com.visorvin.app
- Traffic: https://www.semrush.com/website/visor.vin/overview/
- Review sentiment: https://marlvel.ai/apps/com-visor-app · https://grand-screen.com/apps/visor-smarter-car-search/
- Third-party writeups: https://www.wheelprice.com/blog/how-to-use-visor-vin-to-buy-your-next-car · https://blog.glass.net/partners/visor-simplifies-your-car-search/ · https://getdealguard.com/post/car-buying-help
- Feature board: https://visor.featurebase.app/changelog
