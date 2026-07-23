# DealScan.dev Growth Baseline
Date: 2026-07-11

## Google Search Console (last 28 days, sc-domain:dealscan.dev)
- Impressions: 2,268
- Clicks: 7
- CTR: 0.31%
- Avg position: 27.6

**Top queries (by impressions, all near-zero clicks):**
1. "2007 chevrolet silverado 1500 hd value" — 11 impr, pos 24.7
2. "2007 chevrolet c/k 1500 value" — 4 impr, pos 26.5
3. "2007 toyota tacoma value" — 2 impr, pos 20.5
4. "2008 tahoe value" — 1 impr, pos 19
5. "2008 toyota tacoma price" — 1 impr, pos 62
6. "2008 toyota tacoma value" — 1 impr, pos 29
7. "2009 jeep wrangler price" — 1 impr, pos 59
8. "2009 toyota rav4 blue book value" — 1 impr, pos 30
9. "2009 toyota rav4 value" — 1 impr, pos 41
10. "2010 equinox value" — 1 impr, pos 32

**Top pages (by clicks):**
1. dealscan.dev/ — 3 clicks, 36 impr, pos 5.7
2. .../cars/used-toyota-prius/years-to-avoid — 1 click, 68 impr, pos 24.4
3. .../cars/used-toyota-sienna/2012-value — 1 click, 37 impr, pos 15.2
4. dealscan.dev/price-checker — 1 click, 6 impr, pos 4.3
5. www.dealscan.dev/ (dupe host) — 1 click, 26 impr, pos 7.8
6-10. /about, /cars, and several /cars/used-chevrolet-equinox/*-value pages — 0 clicks each

## Index Coverage (critical finding)
- Sitemap (sitemap.xml): **1,400 URLs submitted, 0 indexed**
- 0 errors, 0 warnings — Google is crawling but not indexing yet (site is new/thin trust signal, normal for <2 weeks post-launch)

## Site Inventory
Sitemap (src/app/sitemap.ts) generates ~1,400 URLs from:
- Static routes: ~19
- Car model pages: 42 models (+ years-to-avoid variants: 42, + value-year and problem-year variants, count varies by model)
- Guides: 27
- Dealer fee pages: 10
- Comparisons: 47
- Best lists: 75
- State fee pages: 3 (data file young, likely incomplete — only 3 slugs found vs 50 states)
- GSC-confirmed total matches sitemap submission of 1,400

## Backlinks
Web search for "dealscan.dev" (excluding self) and site:reddit.com found **no external mentions or backlinks**. All top results are for the unrelated LSEG/Refinitiv "DealScan" loan database product — a false-positive/branding collision to watch for in future SEO/PR work. Zero referring domains found today.

## D1 Analytics
Skipped — not attempted per task scope (would require `wrangler d1 execute` auth check not run this pass). Known caveat if used later: pageview events with null referrer are largely owner dev traffic, not real visitors.

## What Success Looks Like

**+4 weeks (by 2026-08-08):**
- Sitemap: meaningful fraction indexed (target 300+ of 1,400 URLs, not 0)
- 10+ referring domains (currently 0) — even low-authority links/mentions count
- Avg position improving on car-value queries (sub-20 for top 10 queries)

**+8 weeks (by 2026-09-05):**
- Organic clicks trajectory toward 100/day (currently ~0.25/day at 7 clicks/28 days)
- CTR above 2% on indexed pages (currently 0.31%)
- Top query set shifting from near-zero-click long-tail to some page-1 rankings
