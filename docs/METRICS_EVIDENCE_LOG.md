# DealScan Metrics Evidence Log (internal — never publish)

Private, dated record of traction. Purpose: contemporaneous documentation of the
product's growth (traffic, users, revenue) for future evidence needs. Update
monthly from the admin dashboard (`/admin`) and payment/ad dashboards. Do not
share publicly, do not cite in marketing.

How to fill a row: admin dashboard → visitors/scans; Search Console → clicks/impressions;
AdSense/affiliate dashboards → revenue; Stripe → Pro subscribers (once live).

| Month | Visitors/mo | Scans/mo | Listings tracked | Active watches | Indexed pages | Referring domains | Ad/affiliate rev | Pro rev | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 2026-07 | | | | | | | | | Waves 1-4 built (branch, not yet deployed) |
| 2026-08 | | | | | | | | | |
| 2026-09 | | | | | | | | | |

## GSC snapshots (dated, from Search Console API)

### 2026-07-11 (window 2026-06-12 to 2026-07-09)
- Clicks 7, impressions 1,824 (page-level), CTR 0.38%, avg position 17.7 (page-weighted).
- 96% of impressions come from `/cars/` pages; `[year] [model] value` pages are the working template.
- Top page: `/cars/used-chevrolet-silverado-1500/2017-value`, 137 impressions at position 11.4 (just off page 1).
- ~10 value pages sit at position 11-16 (striking distance); `vs` comparison queries rank 60-93 (authority-blocked).
- Sitemap: 1,400 submitted; "0 indexed" counter is lagging, per-URL inspection confirms key pages indexed.
- `www.` variant correctly canonicalizes to apex (verified via URL inspection).
- Referring domains: 0. First outreach wave drafted 2026-07-11 (`outreach/first-wave-emails.md`).

## Milestones (dated, factual)
- 2026-07-13 — Deployed value-pages tranche 2: 12 new models, 176 new pages (sitemap 1,400 → 1,729 URLs). Sitemap resubmitted to GSC same day. Version 1f715dcb.
- 2026-06-10 — dealscan.dev launched (analyzer, scoring, guides).
- 2026-07-05 — Waves 1-4 completed on branch: listing memory, market context, VIN hub, watch alerts, ~590 problem pages, research hub, Pro scaffold. Not yet deployed.

## Third-party recognition (log any as they happen)
- (none yet — log press mentions, citations, embeds, notable backlinks here with dates and URLs)
