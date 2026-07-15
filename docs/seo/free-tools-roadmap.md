# DealScan Free-Tools & Keyword Growth Roadmap

Date: 2026-07-15. Companion sheet: `keyword-research.csv`.

## Method & honesty note

Exact Ahrefs/Semrush volumes are paywalled and not retrievable via free web research. All
volume figures in the sheet are **ranges with a confidence label**, triangulated from public
SERP competition, known head-term magnitudes, and which sites bother to build tools for a
term (companies don't build free VIN decoders for keywords nobody searches). Before building
anything expensive, spot-check the top ~10 terms in Google Keyword Planner (free with a
Google Ads account) or Ahrefs' free Keyword Generator (shows volume for the first few
results per seed).

Key market insight: **CarEdge** is the closest business model to DealScan (free car-buying
calculators → paid concierge/data products) and ranks by owning mid-difficulty calculator
keywords like *car depreciation calculator* and *out-the-door price calculator*. That is the
playbook to copy.

---

## The Council

### 🧭 Advisor (practical SEO)
DealScan is a low-authority domain. Ignore head terms ("vin decoder", "car payment
calculator") — you will not outrank NHTSA or KBB this year. Win order: (1) exact-match
low-competition terms where DealScan *is* the answer ("used car deal checker", "is this a
good deal on a used car", "car scam checker"); (2) mid-tail calculator terms with one
beatable competitor ("out the door price calculator", "car depreciation calculator");
(3) programmatic long-tail off the existing `/cars` and `/fees` data ("dealer fees in Texas",
"how many miles does a Honda Civic last"). Every tool page needs real text content, FAQ
schema, and internal links from guides.

### 🧱 First-Principles
The goal is Pro revenue, not traffic. Work backwards: Pro buyers are people *mid-purchase*
who are anxious about overpaying or getting scammed. Keywords with purchase-anxiety intent
("is this a good deal", "out the door price", "car scam") convert; curiosity keywords ("vin
decoder" for insurance claims, "car payment calculator" for budgeting) mostly don't. A
smaller tool that lands anxious buyers beats a bigger tool that lands browsers. Prioritize
by intent-to-Pro distance, not raw volume.

### 🔪 Critic
Three challenges. (1) The volume numbers in the sheet are estimates — do not make build
decisions on "1M+" without a Keyword Planner check; the plan survives this because the
top picks were chosen for low competition, not volume. (2) "Build more free tools" can
become a treadmill: five half-maintained calculators rank worse than two excellent ones.
Cap the roadmap at 3 new tools before measuring. (3) SEO takes 3–6 months to pay; if cash
matters now, the embeddable widget (`/embed/price-checker` already exists!) and posting the
tools to Reddit/car forums deliver traffic in weeks, not quarters.

### 🎨 Out-of-the-Box
The repo already has the assets for **programmatic SEO**: the `/cars` database can generate
hundreds of pages like "Is a 2018 Toyota Camry with 90k miles a good deal?" — each embedding
the analyzer with prefilled data. The `/fees` data can generate 50 state pages for
"out-the-door price in {state}". The embed widget is a **link-building machine**: pitch it
to car blogs and dealer sites ("free price-checker widget for your readers") — every embed
is a backlink, which fixes the domain-authority problem every other persona is worried
about. Also: the analyzer's red-flag output is secretly a *scam detector* — "car scam
checker" has almost zero tool competition and high anxiety intent.

### 📈 Growth Economist
Rough funnel math: a page-1 ranking on the cluster of exact/low-difficulty terms (~10–30K
combined monthly searches) at 15% CTR → ~2–4K visits/mo → at 2–4% free-tool→Pro-checkout
conversion for high-anxiety intent → tens of Pro subscriptions/mo. That's a real business
foundation, and it compounds. The same effort spent chasing "vin decoder" yields ~0 because
position 30 gets no clicks. Conclusion: the low-difficulty/high-intent plan isn't just
easier, it's strictly higher expected revenue.

### ⚖️ Council verdict
Unanimous: own the "deal anxiety" niche (exact-match, low competition, high intent), build
at most 3 new tools that reuse existing data, use the embed widget for backlinks, and add
programmatic pages from `/cars` + `/fees`. Verify volumes in Keyword Planner before any
build that takes more than a week.

---

## Recommended build order

| # | Tool / action | Target keywords | Difficulty | Effort | Why |
|---|---|---|---|---|---|
| 1 | **Out-the-door price calculator** (`/otd-calculator`) — reuses `/fees` state data | "out the door price calculator", "dealer fees by state" | Low-Med | Low (data exists) | Exact intent, one beatable competitor (CarEdge), feeds Pro |
| 2 | **Reframe landing copy + dedicated pages** for "used car deal checker", "is this a good deal on a used car", "car scam checker" — the analyzer already IS these tools | exact-match cluster | Low | Very low (copy + routes) | Zero build cost, DealScan is the literal answer |
| 3 | **Car depreciation calculator** (`/depreciation`) | "car depreciation calculator" | Medium | Medium | 30–80K/mo, CarEdge-beatable, natural analyzer upsell |
| 4 | **Programmatic pages** from `/cars` ("how many miles does a {model} last", "{model} {year} good deal?") and `/fees` (50 state OTD pages) | long-tail | Low | Medium (template once) | Compounding long-tail traffic |
| 5 | **Widget/embed outreach** — pitch `/embed/price-checker` to car blogs | (backlinks, not keywords) | — | Low | Fixes domain authority, immediate referral traffic |
| 6 | Interactive **used-car inspection checklist** | "used car inspection checklist" | Low-Med | Low | Content+tool hybrid, links into analyzer |

**Deprioritized:** loan/payment calculator, insurance estimator, lease-vs-buy (Very High
difficulty, weak Pro intent — see Critic/Economist).

## Measurement
Add Search Console tracking per tool page; review rankings + tool→Pro conversion after 60
and 120 days before building anything beyond item 3.
