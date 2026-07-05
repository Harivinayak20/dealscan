# DealScan Growth Plan: 0 → 10,000 visitors/day

_Drafted July 2026. Traffic/revenue figures are planning estimates from industry norms — validate against Search Console and real AdSense RPMs as data comes in._

---

## 1. Where DealScan stands today

**Indexable assets (~110 content pages):**
- 42 car-model buyer-check pages (`/cars/[slug]`)
- 31 comparison pages (`/compare`)
- 24 buyer guides (`/guides`)
- Dealer-fee glossary (`/fees`), price checker, how-scoring-works
- The analyzer tool itself + an **embeddable widget** (`/embed`) — this is an underused link-building weapon
- First-party analytics (D1) + scan history — the seed of a **proprietary data asset**

**Honest read:** ~110 pages on a young domain will not reach 10k/day. Sites doing 300k organic visits/month in this niche have 1,000–5,000 quality pages plus real authority (100+ referring domains). The good news: the niche is long-tail heavy, the tool is genuinely differentiated, and the page templates already exist.

## 2. The math to 10k/day

10k/day = ~300k visits/month. Working backwards:
- Long-tail car pages typically earn 50–500 visits/mo each once ranking (months 4–12 after publish, faster as authority grows).
- **Target: ~1,500–2,500 live quality pages averaging 100–200 visits/mo.**
- Realistic timeline: **12–24 months** with consistent weekly shipping. Anyone promising 90 days is selling something.
- Milestones: 500/day (mo 3–5) → 2k/day (mo 6–10) → 5k/day (mo 10–16) → 10k/day (mo 16–24).

## 3. Traffic engine (goal 1: organic visitors ASAP)

### 3a. Programmatic SEO expansion (biggest lever)
Priority order by intent-to-volume ratio:

| Page set | Pattern | Count | Why |
|---|---|---|---|
| **Year-model problem pages** | "[year] [make] [model] common problems / years to avoid" | 500–1,000 | Highest volume + intent in the niche; feeds the analyzer |
| Year-model price pages | "how much is a [year] [model] worth used" | 500+ | Price-checker already computes this — render it as pages |
| Expanded comparisons | "[model] vs [model] used" incl. year variants | 200–500 | 31 → 300; existing template |
| Model reliability by mileage | "is a [model] with 100k miles reliable" | 200 | Weak competition, perfect tool tie-in |
| State dealer-fee pages | "dealer fees in [state] on used cars" | 50 | Fees glossary × 50 states; doc-fee caps differ by state = real per-page data |
| Scam/red-flag patterns | "[platform] used car scams to avoid" | 20–40 | Links + shares magnet |

Rules (see `programmatic-seo` skill): ship in tranches of 50–200, watch indexation ≥60% before scaling, every page answers in the first two sentences and routes to the analyzer.

### 3b. Data moat → the "DealScan Index"
Publish quarterly stats from anonymized scan data: average overpricing by model, most common red flags, % of listings with title issues, "most overpriced used cars this quarter." This is the single best link + press magnet available — journalists cite data, and nobody else has this data. Create `/research` hub. This also powers the big-company collabs below.

### 3c. Link building (see `link-building` skill)
- **Embed widget distribution:** pitch credit unions, dealership blogs, personal-finance bloggers, car-buying course creators to embed the checker (attribution link built in). Each embed = a quality backlink + referral traffic.
- **Data-study PR:** each DealScan Index release pitched to auto press (The Drive, Jalopnik, CarScoops), local TV consumer segments ("used car scams up X%"), and personal-finance newsletters.
- Journalist request platforms weekly (car-buying, scams, negotiation topics).
- Unlinked mentions + resource-page outreach monthly.
- Target: **10–15 new referring domains/month**; authority is what un-sticks the programmatic pages.

### 3d. AI search (GEO)
Growing share of "is this a good deal on a used car" queries happen in ChatGPT/Perplexity. Make DealScan citable: statistics pages with clean claims + numbers, consistent entity info (Organization schema already present), llms.txt, and the research hub. AI citations also drive the "as seen in" credibility loop.

### 3e. Non-SEO kindling (while SEO compounds)
> ⚠️ Quiet-operator constraint (July 2026, see VISOR_TEARDOWN.md §8): no owner-identifiable founder posture anywhere public. Everything below runs under the DealScan brand or a delegate, or is deferred pending the attorney consult.
- Reddit (r/UsedCars, r/whatcarshouldIbuy, r/personalfinance threads): genuinely helpful answers with scan results, tool mention only where natural. 2–3/week — brand/delegate account only.
- Short-form video: the `/dealscan-social` pipeline already exists — "I scanned this sketchy Craigslist ad" content format. Brand-voiced, no personal face/name.
- An email capture ("price-drop / new-scam alerts") so traffic becomes an owned audience. ✅ Shipped (watch alerts, Wave 2).
- Revenue priority under the constraint: ads/affiliate (passive) before Pro subscriptions (active operation).

## 4. Big-company collaborations (see `co-marketing` skill)

**Who to target (audience overlap, no revenue conflict):**

| Tier | Partner type | The pitch | What DealScan gets |
|---|---|---|---|
| Start now | Credit unions & community banks (auto-loan teams) | Free embedded deal-checker for their members' car-buying pages | Embeds/backlinks, trusted-brand halo |
| Start now | Personal-finance blogs/newsletters | Exclusive DealScan Index data for their content | Links, audience |
| Month 3+ | Insurance comparators (The Zebra, Jerry, Insurify) | Co-branded "total cost of this deal" content; affiliate deal both ways | Revenue + links |
| Month 3+ | YourMechanic / inspection networks | Post-scan inspection handoff; co-branded checklist | Affiliate revenue, legitimacy |
| Month 6+ | Carfax/AutoCheck affiliate teams | Deeper placement than the current link (API-verified history in results) | Higher CPA, product moat |
| Month 6+ | Auto press (The Drive, CarEdge, CarScoops) | Quarterly data exclusives | Authority links at scale |

Rules: pitch a person (content/PR lead, not BD); first ask tiny ("one dataset for one article, we do the work"); get promotion commitments in writing. Big marketplaces (CarGurus/AutoTrader) are *data subjects*, not partners — DealScan reviews their listings; independence is the brand.

## 5. Monetization → reinvestment loop (goal: fund growth from revenue)

**Realistic revenue at each stage (US-heavy traffic assumed):**

| Traffic | AdSense (est. $5–15 RPM blended) | Affiliates (VIN reports, insurance, loans) | Total/mo |
|---|---|---|---|
| 1k/day | $150–450 | $200–600 | ~$350–1,000 |
| 5k/day | $750–2,250 | $1k–3k | ~$2k–5k |
| 10k/day | $1.5k–4.5k | $2k–8k | ~$4k–12k |

Notes: automotive *content* pages (problems, fees, comparisons) carry much higher RPMs than the tool page — the pSEO expansion is also the monetization expansion. Upgrade from AdSense to Mediavine Journey (~10k sessions/mo minimum) then Raptive later; premium networks roughly double RPM. Affiliates likely out-earn display long-term; keep the one-sponsored-row discipline so trust (the product) isn't spent.

**Reinvestment ladder (put 100% back in until 10k/day):**
1. First $200/mo → data/API costs (better VIN/pricing data), keyword tool (one, not three)
2. $500/mo → freelance editor/fact-checker to raise page quality + E-E-A-T (bylines, review process)
3. $1k/mo → data-study production + PR pushes each quarter
4. $3k/mo+ → licensed market-pricing data feed (defensibility) and paid distribution experiments

## 6. Umbrella expansion (after 10k/day)

Sequenced by leverage, not all at once:
1. **Geo expansion:** UK/Canada/Australia versions (same engine, local pricing/fee data; hreflang). Doubles the addressable market cheaply.
2. **Vertical clones:** BikeScan (motorcycles), RVScan, BoatScan — same scoring engine, new data + domains under the DealScan umbrella brand; cross-linked but on their own merits.
3. **Owned-audience products:** saved-search price-drop alerts, "deal of the week" newsletter → repeat visitors that no algorithm can take away.
4. **B2B/API:** deal-scoring API for credit unions, insurtechs, and car-buying services; the consumer site becomes the marketing for a real revenue line.
5. **Pro tier:** deeper paid report (history + market + inspection checklist bundle) once free traffic is large enough that 0.5–1% conversion matters.

## 7. 90-day action plan

**Weeks 1–2:** Ship year-model problems template + first 50-page tranche. Set up Search Console tranche monitoring. Publish first mini data study from existing scan analytics.
**Weeks 3–4:** Tranche 2 (50 pages). Embed-widget pitch page + first 10 credit-union/blogger pitches. Sign up for journalist-request platforms; answer 3/week.
**Weeks 5–8:** Price pages tranche (100). State fee pages (50). First DealScan Index release + PR push to 30 outlets. Comparisons 31→100.
**Weeks 9–12:** Review indexation; double down on the winning page set. 10 co-marketing pitches from the scored shortlist. Email capture live. Apply learnings, plan next quarter.

**KPIs (weekly):** pages live, % indexed, impressions, clicks, referring domains, embeds live, revenue. If impressions grow but clicks lag → fix titles. If pages don't index → template too thin. If pages index but don't rank → authority gap, shift effort to links.
