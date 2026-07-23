# DealScan Distribution Growth Plan

Status: EXECUTED 2026-07-11 (wave 1: WP0-WP9, WP12 done; WP10/WP11 pending week 2).
Deploy of branches growth/widget-kit and growth/fee-study awaits approval.
Written: 2026-07-11.

## Why this plan
Site has ~530 indexable URLs, solid schema, guides, comparisons, fee glossary, model pages.
Bottleneck (per 2026-06-22 audit): young domain, ~zero backlinks, ~6 real organic visits/week.
Building more pages is explicitly NOT the fix. Everything below is distribution: indexing,
backlinks, communities, social, and compounding loops.

## Execution model
- Orchestrator (this session or a fresh one) spawns one subagent per work package via the
  Agent tool with an explicit `model` param. No package needs Hari's judgment mid-task.
- Default model: **Sonnet, low effort** (tasks are scoped small and specced here).
  **Opus low** only where marked (strategy-heavy packages).
- "go" from Hari = approval to: replicate skills locally, make code changes on a branch,
  write all outreach/social/community content, and publish through any account already
  connected via Composio. Saying "go, deploy too" additionally covers production deploys.
- Anything not connectable ends as a ready-to-paste/upload package in `Car IQ/social/ready/`
  or `Car IQ/outreach/` so Hari's fallback involvement is copy-paste minutes, not work.

## One-time setup Hari may choose to do (only true involvement)
~10 min total, once: OAuth connections via Composio for Reddit, X, LinkedIn, YouTube,
Google Search Console, Gmail. Every connected account converts a "paste-pack" package into
a fully autonomous one. Zero connections still works; it just leaves pasting to him.

## Guardrails (from global rules + project memory)
- No more pSEO page sets. No AggregateRating/star schema (deferred on purpose, penalty risk).
- Promos only show what dealscan.dev actually does today. Viral OK, vulgar not.
- No paid ads, no spend of any kind without a separate explicit yes.
- No fake engagement, no astroturfing: community posts must be genuinely helpful,
  value-first, link only where it answers the question. Respect per-subreddit self-promo rules.
- Light theme for anything visual. No deploy to prod without explicit approval.
- Never install third-party skills; replicate as clean local SKILL.md (WP0).

---

## Phase 0 — Prep (first hour after "go")

### WP0 · Replicate missing distribution skills — Sonnet low
Write clean local SKILL.md files (from scratch, informed by the public repo's descriptions,
never cloned/installed) at `~/.claude/skills/`:
- `community-marketing` — Reddit/Quora/forum value-first playbook, subreddit rule checks.
- `social-content` — text posts for X/LinkedIn/Threads from existing site content.
- `email-newsletter` — capture + weekly send structure.
- `launch` — Product Hunt / directory launch packaging.
- `referrals` — in-product share/refer loop patterns.
Reference source (do not install): coreyhaines31/marketingskills on GitHub.
Done when: 5 SKILL.md files exist, each under ~150 lines, no external code.

### WP1 · Baseline + measurement — Sonnet low
Record current numbers so growth is provable: D1 pageviews by referrer (excluding
Hari/dev traffic per known caveats), GSC impressions/clicks if connected, backlink count
(free checkers). Output: `docs/growth-baseline.md`. Re-run logic becomes WP12's cron.

---

## Phase 1 — Indexing + owned assets (week 1)

### WP2 · Get indexed — Sonnet low
If GSC connected via Composio: verify property, submit sitemap, request indexing for top
~50 URLs (home, /fees hub, top guides, top comparisons, top model pages). If not connected:
output an exact click-by-click 10-min checklist for Hari (his only fallback task here).
Done when: sitemap submitted + index requests filed, or checklist delivered.

### WP3 · Widget distribution kit — Sonnet low (code on a branch)
The `/embed/price-checker` widget is the best backlink machine we own (every embed = a link).
- Polish `/embed` docs page: copy-paste snippet, live preview, "free for your site" pitch.
- Add a visible "Embed this tool" link on /price-checker.
- Build target list: 50 car blogs / dealer-adjacent sites / personal-finance blogs that
  could embed it, with contact info. Output: `outreach/widget-targets.md`.
Code stays on branch `growth/widget-kit` until deploy approval.

---

## Phase 2 — Authority + backlinks (weeks 1-4)

### WP4 · Linkable data study — **Opus low**
"Used Car Dealer Fees by State (2026)" — one citable, journalist-friendly study page built
from `dealer-fees.ts` + researched state-by-state doc/reg fee caps. Tables, a ranked list
(worst/best states), methodology section, embeddable chart image. This is the asset every
outreach email below points to. New route `/research/dealer-fees-by-state` (research/ exists).
Branch: `growth/fee-study`. Article + Dataset schema. No star ratings.

### WP5 · Digital PR + outreach engine — Sonnet low (uses link-building skill)
- 100-target list: auto/personal-finance writers, car YouTubers' blogs, resource pages
  ("car buying tools"), broken-link candidates. Output: `outreach/pr-targets.md`.
- Personalized pitch per target (leads with WP4 study or widget, never "please link me").
- If Gmail connected: send 10-15/day with follow-up cadence, log replies to
  `outreach/log.md`. Else: ready-to-send drafts, batched.

### WP6 · Directory + tool-listing sweep — Sonnet low
Submit dealscan.dev to free tool directories and lists (AlternativeTo, free-tool roundups,
SaaS/tool directories, "car buying resources" pages). Where submission is a public form,
agent submits; where login is needed, output prefilled text. Target: 30+ submissions.
Output: `outreach/directories.md` with per-site status.

---

## Phase 3 — Community + social engine (ongoing, weekly cadence)

### WP7 · Reddit/Quora answer engine — Sonnet low (community-marketing skill)
Weekly: find 10-15 live threads in r/UsedCars, r/askcarsales, r/whatcarshouldibuy,
r/personalfinance, Quora car-buying questions where DealScan genuinely answers the question
(fee checks, "is this price fair", years-to-avoid). Write full helpful answers; tool link
only where it fits, max ~1 in 3 answers linked. If Reddit connected: post on an aged-in
schedule. Else: weekly paste-pack in `outreach/community/`.
Hard rule: value-first, never spam, follow each sub's rules.

### WP8 · Video social autopilot — Sonnet low (existing dealscan-social skill)
Weekly batch as the skill defines, with one change: "go" pre-approves concepts, so agent
self-screens scripts (virality predictor + guardrails), renders, and packages to
`social/ready/`. If YouTube connected: auto-upload Shorts. TikTok/Reels remain
Hari's ~5 min/week upload unless connected later.

### WP9 · Text social engine — Sonnet low (new social-content skill)
3-5 posts/week for X + LinkedIn from existing content: fee facts, state comparisons,
"years to avoid" nuggets, comparison verdicts. Auto-post if connected, else queue file.

---

## Phase 4 — Compounding loops (weeks 2-6)

### WP10 · Launch package (Product Hunt + friends) — **Opus low** (launch skill)
Full PH launch kit: tagline, gallery copy, first comment, hunter outreach list, launch-day
checklist, cross-post plan (HN Show HN, r/InternetIsBeautiful, BetaList). GATED: actual
launch day needs Hari's account + a date he picks. Everything else is prepped.

### WP11 · Email capture + weekly newsletter — Sonnet low (code), branch `growth/newsletter`
Lightweight email capture (footer + exit intent on guides), stored in D1. Weekly
"fee alert / deal check" email template. Sending stays OFF until list > 50 and Hari
approves the send path. This is the retention loop for traffic the other WPs create.

### WP12 · Weekly growth report cron — Sonnet low
Scheduled cloud agent (schedule skill), Mondays: pull D1 referrer data + GSC + outreach log,
write a 10-line report (what moved, what's working, what to double down on) to
`docs/growth-reports/`. Hari reads 1 email-length note a week; involvement stays 0.

---

## Sequencing on "go"
Hour 1: WP0 + WP1 (parallel).
Day 1: WP2, WP3, WP5-list, WP6 spawn (parallel, Sonnet).
Day 2-4: WP4 (Opus), WP7 first batch, WP9 first queue.
Week 1 end: WP8 first video batch, WP5 outreach starts sending/drafting.
Week 2: WP10 prep, WP11 branch, WP12 cron created.
Then: WP5/WP7/WP8/WP9 run as weekly loops; WP12 reports every Monday.

## Success metrics (measured by WP12, baseline from WP1)
- 4 weeks: sitemap fully indexed, 10+ referring domains, 3+ widget embeds live,
  first Reddit-referral visits in D1.
- 8 weeks: 50+ referring domains path, 100 organic clicks/day trajectory (per the
  6-10 week estimate in the 6/22 audit), 200+ email captures if WP11 deployed.
- Kill rule: any channel with zero referral visits after 3 weekly cycles gets dropped
  in favor of doubling the best performer.

## Rough cost posture
Sonnet-low for 10 of 12 packages, Opus-low for 2. Weekly loops are small scoped prompts.
No paid tools, no ad spend, video rendering via existing Veo flow only on weekly batch.
