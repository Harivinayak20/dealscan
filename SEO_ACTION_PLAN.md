# DealScan SEO Gap Analysis & Action Plan

Data pulled from Google Search Console (`sc-domain:dealscan.dev`) on 2026-07-24.
Analysis window: 2026-04-23 to 2026-07-21 (90 days). Prior 90 days: 2026-01-23 to 2026-04-22.

---

## 1. Where we actually are

**The prior 90-day period returned zero rows.** The first impression the site ever recorded was
2026-06-12. Every number below comes from roughly six weeks of history, so there is no
period-over-period comparison to make and no "rankings dropped" story. There is nothing to have
dropped from.

| Metric (90d) | Value |
|---|---|
| Impressions | 3,798 |
| Clicks | 10 |
| CTR | 0.26% |
| Avg position | 32.1 |
| Queries with ≥1 impression | 531 |
| Pages with ≥1 impression | 365 (of 1,838 submitted) |

Device split: mobile 2,020 impressions at position 22.0 (8 clicks); desktop 1,751 impressions at
position 44.0 (2 clicks). Desktop rankings are far worse, which is what you expect when desktop
SERPs for car queries are packed with KBB/Edmunds/CarGurus above the fold.

62% of impressions (2,365) are attributed to anonymised long-tail queries, so query-level tables
below cover only about a third of real demand.

### Weekly impressions

| Week of | Impressions | Clicks |
|---|---|---|
| 2026-06-08 | 34 | 0 |
| 2026-06-15 | 691 | 2 |
| 2026-06-22 | 362 | 0 |
| 2026-06-29 | 1,102 | 3 |
| 2026-07-06 | 410 | 3 |
| 2026-07-13 | 1,192 | 2 |
| 2026-07-20 | 7 (partial, data lag) | 0 |

Volatile, not trending. The swings track Google sampling deep-ranked compare pages in and out, not
genuine growth.

---

## 2. The bottleneck: indexation, not ranking

This is the whole story. **12 of the 13 URLs inspected came back `Discovered - currently not
indexed`.**

| URL | Coverage state |
|---|---|
| `/price-checker` | **Submitted and indexed** (crawled 2026-07-20) |
| `/cars/used-chevrolet-silverado-1500/2017-value` | **Submitted and indexed** (crawled 2026-07-14) |
| `/compare/honda-cr-v-vs-toyota-rav4` | **Submitted and indexed** (crawled 2026-06-24) |
| `/deal-checker` | Discovered - currently not indexed |
| `/good-deal` | Discovered - currently not indexed |
| `/scam-checker` | Discovered - currently not indexed |
| `/otd-calculator` | Discovered - currently not indexed |
| `/otd-calculator/california` | Discovered - currently not indexed |
| `/vin` | Discovered - currently not indexed |
| `/depreciation` | Discovered - currently not indexed |
| `/inspection-checklist` | Discovered - currently not indexed |
| `/fees/states/california` | Discovered - currently not indexed |
| `/cars/used-toyota-camry/mileage` | Discovered - currently not indexed |
| `/cars/used-toyota-camry/problems/2015` | Discovered - currently not indexed |
| `/cars/used-toyota-camry/2015-value` | Discovered - currently not indexed |

**Every single conversion page except `/price-checker` is missing from Google's index.** The pages
that would actually turn a visitor into a scan (deal checker, good-deal checker, scam checker,
OTD calculator, VIN lookup) cannot rank because they are not in the index at all.

`Discovered - currently not indexed` means Google knows the URL exists and has chosen not to spend
crawl budget on it. On a six-week-old domain with effectively no backlink profile, that is Google
rationing. Dumping 1,838 URLs into the sitemap at once made the rationing worse, not better.

Note: the sitemap report shows `submitted: 1838, indexed: 0`. Ignore the `indexed: 0`. Google
deprecated that field and it reads zero for everyone. The URL inspections above are the real signal.

---

## 3. Template performance

| Template | In sitemap | With impressions | Impressions | Clicks | Avg pos |
|---|---|---|---|---|---|
| `/cars/{model}/{year}-value` | 734 | 285 (39%) | 2,424 | 3 | 17.9 |
| `/compare/{a-vs-b}` | 44 | 24 | 854 | 0 | 69.9 |
| `/cars/{model}/years-to-avoid` | 52 | 9 | 176 | 1 | 30.1 |
| `/guides/{slug}` | 25 | 4 | 96 | 0 | 14.1 |
| `/` (homepage) | 1 | 1 | 49 | 4 | 7.3 |
| `/fees/{slug}` | 9 | 3 | 36 | 0 | 10.4 |
| `/cars/{model}` | 52 | 12 | 26 | 0 | 49.0 |
| `/fees/states/{state}` | 50 | 4 | 25 | 0 | 49.3 |
| **`/cars/{model}/problems/{year}`** | **734** | **11 (1.5%)** | **19** | **0** | **49.1** |
| `/cars/{model}/mileage` | 52 | 0 | 0 | 0 | — |
| `/otd-calculator/{state}` | 51 | 0 | 0 | 0 | — |
| `/best/{slug}` | 9 | 1 | 4 | 0 | 147.0 |

Three conclusions:

1. **Value pages are the one thing that works.** 285 of 734 earn impressions, 158 rank in the top 20,
   43 rank in the top 10. This is the proven template.
2. **Problems pages are 40% of the sitemap and produced 19 impressions and zero clicks.** 734 URLs
   of near-identical 471-word content is precisely the pattern that triggers site-wide crawl
   rationing. They are actively harming the pages that do work.
3. **Compare pages are vanity impressions.** 854 impressions (22% of the site total), zero clicks,
   ever, at an average position of 69.9 and a *best* position of 34.6. They target head terms
   ("rav4 vs cr-v", "honda accord vs toyota camry") owned by Edmunds, KBB and MotorTrend. A
   six-week-old domain will not win these.

---

## 4. CTR diagnosis

Site-wide CTR of 0.26% is mostly explained by an average position of 32. That is normal for page 3.
But a specific set of pages rank genuinely well and still get nothing:

| Page | Impressions | Clicks | Position |
|---|---|---|---|
| `/cars/used-chevrolet-silverado-1500/2017-value` | 179 | 0 | 11.3 |
| `/guides/offerup-car-scams` | 87 | 0 | 9.1 |
| `/cars/used-toyota-prius/2013-value` | 52 | 0 | 14.5 |
| `/cars/used-chevrolet-silverado-1500/2019-value` | 49 | 0 | 12.8 |
| `/cars/used-toyota-sienna/2015-value` | 40 | 0 | 10.9 |
| `/cars/used-nissan-rogue/2014-value` | 39 | 0 | 13.5 |
| `/cars/used-honda-civic/2018-value` | 33 | 0 | 12.9 |
| `/cars/used-toyota-rav4/2024-value` | 32 | 0 | 10.6 |
| `/cars/used-honda-accord/2016-value` | 31 | 0 | 14.4 |
| `/cars/used-toyota-sienna/2016-value` | 29 | 0 | 13.2 |

A page at position 11 with 179 impressions and zero clicks is a title problem, not a ranking problem.
The search is "2017 chevrolet silverado 1500 value" and the competing results all display a dollar
figure. Our title asks the question back at the user instead of answering it.

### Two title bugs found in code

**Doubled brand suffix.** [layout.tsx:32](src/app/layout.tsx#L32) sets `template: "%s | DealScan.dev"`,
but several pages hardcode `| DealScan` into their own title, producing
`... | DealScan | DealScan.dev`. Affected: [price-checker](src/app/price-checker/page.tsx#L9),
[otd-calculator](src/app/otd-calculator/page.tsx#L9), [fees](src/app/fees/page.tsx#L9),
[fees/states](src/app/fees/states/page.tsx#L10), [best](src/app/best/page.tsx#L10),
[depreciation](src/app/depreciation/page.tsx#L9),
[research/dealer-fees-by-state](src/app/research/dealer-fees-by-state/page.tsx#L17).
This burns ~15 characters of SERP width on exactly the money pages.

**`www` is not redirected.** `https://www.dealscan.dev/` returns 200 rather than a 301 to the apex.
The canonical tag correctly points to apex and Google mostly honours it, but GSC still shows
`www.dealscan.dev/` as a separate row with 26 impressions and 1 click, against 49 impressions and
4 clicks on the apex homepage. That is a third of the homepage's signal sitting on the wrong host.

---

## 5. Striking distance

There is almost nothing here, which is itself the finding. Only **four** queries sit in positions
5–20 with 5 or more impressions:

| Query | Impressions | Position | Page |
|---|---|---|---|
| `2017 chevrolet silverado 1500 value` | 18 | 19.3 | `/cars/used-chevrolet-silverado-1500/2017-value` |
| `dealscan ai` | 6 | 6.7 | brand |
| `2024 jeep cherokee value` | 5 | 19.8 | `/cars/used-jeep-cherokee/2024-value` |
| `deal scan` | 5 | 15.8 | brand |

Two of the four are brand queries. Do not build a strategy around striking distance yet. There is
no striking distance to work with. Page-level is more useful: **13 value pages rank in the top 20
with 20+ impressions**, and those are the real upgrade candidates (full list in section 4).

Queries confirming which intents are landing:

| Query | Impressions | Position |
|---|---|---|
| `2007 chevrolet silverado 1500 hd value` | 17 | 25.1 |
| `what is a 2007 silverado 1500 worth?` | 14 | 28.1 |
| `2011 chevrolet silverado 1500 hd value` | 12 | 23.6 |
| `how much is a 2012 toyota sienna le worth?` | 11 | 22.4 |
| `how much is a 2013 chevrolet worth?` | 11 | 27.0 |
| `how much is a used 2014 volkswagen jetta worth?` | 9 | 27.1 |
| `how much is a 2013 prius worth today?` | 8 | 22.4 |
| `what year to stay away from a vw jetta?` | 7 | 32.6 |
| `what year to stay away from prius?` | 5 | 22.4 |

Natural-language "how much is X worth" and "what year to avoid" phrasing is what converts into
impressions. That should drive both titles and any new content.

---

## 6. Keyword gaps

Caveat stated plainly: GSC only reports queries we already have impressions for. Everything in this
section is inference from the product and from what is already landing, not measured data. With an
Ahrefs or Semrush connection this could be replaced with real competitor gap data.

| Theme | Current coverage | Verdict |
|---|---|---|
| "is this used car a good deal" | `/good-deal` exists, **not indexed** | Fix indexation, do not build |
| "used car price checker" | `/price-checker`, indexed, pos 8.1 | Working. Protect it |
| "[year] [make] [model] value/worth" | 734 value pages | Working. Core asset |
| "[make] years to avoid" | 52 pages, pos 30.1 | Under-performing, fixable via titles |
| "craigslist car deal analyzer" | None | **Build**. Direct product match |
| "facebook marketplace car price check" | None | **Build**. Direct product match |
| "used car negotiation script" | None | Build later |
| "car listing red flags" | `/scam-checker`, **not indexed** | Fix indexation |
| "vin check free" | `/vin`, **not indexed** | Fix indexation; hard SERP regardless |
| "out the door price calculator" | `/otd-calculator` + 51 states, **all not indexed** | Fix indexation |

The important pattern: most of the "gaps" are not content gaps at all. The pages already exist and
Google simply has not indexed them. Building more pages before fixing that would make the problem
worse.

---

## 7. Prioritised action plan (ICE)

Scored Impact × Confidence ÷ Effort, each 1–10, effort inverted so lower is cheaper.

| # | Action | I | C | E | ICE | Type |
|---|---|---|---|---|---|---|
| 1 | Request indexing for 8 money pages in GSC | 9 | 9 | 1 | **81** | Manual, today |
| 2 | Internal links from homepage + value pages to money pages | 8 | 8 | 2 | **32** | Code |
| 3 | Drop 734 problems URLs from sitemap, noindex that template | 9 | 7 | 2 | **31.5** | Code |
| 4 | Fix doubled `\| DealScan \| DealScan.dev` suffix | 3 | 9 | 1 | **27** | Code |
| 5 | 301 `www` → apex | 3 | 9 | 1 | **27** | Config |
| 6 | Put the price range in value-page titles | 7 | 7 | 2 | **24.5** | Code |
| 7 | Put the bad years in years-to-avoid titles | 6 | 7 | 2 | **21** | Code |
| 8 | Freeze compare pages (stop expanding) | 2 | 8 | 1 | **16** | Decision |
| 9 | Build Craigslist + FB Marketplace checker pages | 7 | 6 | 4 | **10.5** | Content |
| 10 | Consolidate 734 problems pages → 52 model pages | 6 | 6 | 5 | **7.2** | Code |
| 11 | Backlink acquisition | 9 | 6 | 8 | **6.75** | Ongoing |
| 12 | Used-car negotiation page | 5 | 5 | 4 | **6.25** | Content |

### Quick wins (this week)

**1. Request indexing manually.** GSC → URL Inspection → Request Indexing, one at a time:
`/deal-checker`, `/good-deal`, `/scam-checker`, `/otd-calculator`, `/vin`, `/depreciation`,
`/inspection-checklist`, `/fees`. Quota is roughly 10/day. This is the single highest-leverage hour
available and it requires no code.

**2. Fix the doubled brand suffix.** Strip `| DealScan` from the seven hardcoded titles listed in
section 4; the layout template already appends the brand.

| Page | Current | Proposed |
|---|---|---|
| `/price-checker` | `Used Car Value & Fair Price Checker — Free, No Signup \| DealScan \| DealScan.dev` | `Used Car Value & Fair Price Checker — Free, No Signup` |
| `/otd-calculator` | `Out-the-Door Price Calculator — Free Used Car OTD Estimate \| DealScan \| DealScan.dev` | `Out-the-Door Price Calculator: Real Cost With Tax & Fees` |
| `/fees` | `Dealer Fees Explained: Doc Fees, Add-Ons & Junk Fees \| DealScan \| DealScan.dev` | `Dealer Fees Explained: Which Ones You Can Refuse` |
| `/best` | `Best Used Cars by Budget & Type (2026) \| DealScan \| DealScan.dev` | `Best Used Cars by Budget: What $10k–$30k Actually Buys` |
| `/depreciation` | `Car Depreciation Calculator — Free Resale Value Estimate \| DealScan \| DealScan.dev` | `Car Depreciation Calculator: What It'll Be Worth in 5 Years` |

**3. Rewrite the guide title that ranks at position 9 and gets nothing.**

| Page | Current | Proposed |
|---|---|---|
| `/guides/offerup-car-scams` | `OfferUp car scams: what to watch for before you meet a seller` (76 chars, truncates) | `OfferUp Car Scams: 9 Red Flags to Spot Before You Meet` (54) |

**4. 301 `www` → apex** in the Cloudflare Workers route or `middleware.ts`.

### Template changes (next)

**5. Put the answer in the value-page title.** The estimate is already computed inside
`generateMetadata` at [cars/[slug]/[yearValue]/page.tsx:42](src/app/cars/[slug]/[yearValue]/page.tsx#L42)
- it just is not used in the title.

```
Current:  2017 Chevrolet Silverado 1500 Value: What's a Used One Worth? | DealScan.dev   (76 chars, truncated)
Proposed: 2017 Chevrolet Silverado 1500 Value: $14,200–$19,800 | DealScan.dev            (67 chars, fits)
```

Template: `${year} ${make} ${model} Value: ${money(est.privateLow)}–${money(est.privateHigh)}`.
Falls back to the current string when `est` is null. Affects 734 pages from one file. Google may
rewrite some of these, but showing a number against KBB and Edmunds is the only way to earn the click
at position 11.

**6. Put the bad years in the years-to-avoid title.**

```
Current:  Toyota Prius Years to Avoid (and the Best Years to Buy Used)
Proposed: Toyota Prius Years to Avoid: 2010–2012 (and What to Buy Instead)
```

Template: `${make} ${model} Years to Avoid: ${badYears}`. The query is a question
("what year to stay away from prius?") and the title should contain the answer.

**7. Cut the sitemap from 1,838 to 1,104 URLs.** Remove `/cars/{model}/problems/{year}` (734) from
`sitemap.xml` and add `robots: { index: false, follow: true }` to that template. The pages stay live
for users and keep passing link equity; they just stop competing for crawl budget with pages that
convert.

The 52 `/cars/{model}/mileage` pages stay in the sitemap, contrary to the first draft of this plan.
"How many miles does a Honda Civic last" is a real query with real volume, the pages are 580 words,
and 52 URLs is not what caused the crawl rationing. 734 was.

**8. Internal linking.** Every indexed value page should link to `/deal-checker` and `/good-deal`
in-body, not just from the nav. Currently
[cars/[slug]/[yearValue]/page.tsx](src/app/cars/[slug]/[yearValue]/page.tsx) links only sideways to
adjacent years and to `years-to-avoid`. Value pages are the only pages with crawl equity. Spend it
on the money pages.

### New content (only after indexation is fixed)

**`/craigslist-car-price-checker`**
- Target: "craigslist car price checker", "is this craigslist car a good deal"
- H1: Is That Craigslist Car Actually a Good Deal?
- Outline: paste-a-link tool embed → how Craigslist pricing differs from dealer pricing → the five
  red flags specific to Craigslist listings (no VIN, stock photos, curbstoners, wire transfer,
  "selling for a friend") → what a fair private-party price looks like → FAQ

**`/facebook-marketplace-car-price-checker`**
- Target: "facebook marketplace car price check", "facebook marketplace car scams"
- H1: Facebook Marketplace Car Price Checker
- Outline: tool embed → why Marketplace prices skew high → seller-profile checks → meeting safely →
  FAQ. Cross-link the existing `/guides/facebook-marketplace-car-buying-safety`.

**`/cars/{model}/common-problems`** (52 pages, replacing the 734 year-specific ones)
- Target: "[make] [model] common problems", "[make] [model] reliability"
- H1: Common {Make} {Model} Problems (and Which Years Are Worst)
- One page per model consolidating all year data into a table. Same content, 93% fewer URLs,
  genuinely more useful than 471 words per year.

### The thing that actually unblocks everything

`Discovered - currently not indexed` at this scale is a site-authority symptom. DealScan has no
meaningful backlink profile, and no amount of title and sitemap work fully fixes that. What it does is raise the
ceiling on what Google will crawl. The on-page items above are worth doing and will help, but the
constraint is external links. The `/research/dealer-fees-by-state` doc-fee study is the most
linkable asset already built and is the obvious thing to pitch. That is a separate workstream from
this document.

---

## 8. What would change this analysis

- Only six weeks of data. Re-pull in 30 days before drawing trend conclusions.
- 62% of impressions are anonymised, so query-level tables understate real demand.
- No competitor keyword data. An Ahrefs or Semrush connection would replace section 6's inference
  with measured gaps against CarGurus, CoPilot and Edmunds.
- URL inspection is a 15-URL sample, not a full coverage export. The pattern is consistent enough to
  act on, but the exact indexed count is unknown.
