# DealScan SEO & Link-Building Execution Plan (2026-07-10)

Owner: Hari. Executor: delegated agent. Status per task: TODO / DONE / BLOCKED.

## Hard guardrails (failsafe - do not violate)
- NO deploy, NO git commit/push, NO publishing anywhere. Work stays local; Hari reviews and ships.
- NO purchases, signups, or sending emails. Outreach assets are drafts for Hari to send.
- White-hat only: no buying links, no PBNs, no fake reviews/ratings, no fabricated stats. Every stat must come from real DealScan data or a cited source.
- Touch ONLY the files named in Task 4 and the new files under docs/link-building/. Nothing else in the repo.
- After any code change: run the build/typecheck. If it fails, revert and mark BLOCKED with the error.
- Brand phrasing in all assets: "DealScan.dev" (with .dev) - the naked "DealScan" term is owned by an unrelated loan database.

## Task 1 - Research-study promotion kit -> docs/link-building/research-pitch.md
Status: DONE — no static aggregate numbers in repo (research page is force-dynamic from D1), so pitch uses [PLACEHOLDER: stat] and instructs pulling live numbers before sending. 25 prospects + 3 templates written.
- Read src/app/research/page.tsx and its data source; extract 2-3 real headline stats. If real aggregate numbers are not available in the repo, write the pitch with [PLACEHOLDER: stat] and say so - do NOT invent numbers.
- Build a prospect list of 25 automotive / personal-finance writers & sites that cite car-buying data (use web search). Columns: site, why relevant, contact page URL, pitch angle.
- Write 2 pitch templates (journalist, blogger): first line personalized-slot, 1-2 lines why it fits, 1 link to /research, easy out. Under 120 words each. One follow-up template (send once, day 4-6).

## Task 2 - Free-tool distribution kit -> docs/link-building/tool-distribution.md
Status: DONE — 12 legitimate targets listed (stopped short of 15; noted why: remaining slots depend on communities Hari is already a member of, to avoid spammy cold-joins). Widget pitch written.
- List 10-15 legitimate submission targets for the price-checker tool and embeddable widget: Product Hunt, free-tools roundups, car-buying resource pages, niche directories. Skip anything selling placements.
- For each: URL, what to submit (tool page vs widget embed), 1-line blurb tailored to it.
- Draft the "embed this widget" pitch for bloggers who write car-negotiation how-tos.

## Task 3 - Resource-page & journalist-platform kit -> docs/link-building/outreach-kit.md
Status: DONE — 15 live resource pages found via search operators, resource-page + broken-link templates, 3 Featured/Qwoted/Connectively answer skeletons.
- Find 15 live "car buying resources / useful links" pages via search operators; list URL + which DealScan page fits (/fees, /guides, /price-checker) + one-sentence reason.
- Write the resource-page pitch template and the broken-link variant.
- Write 3 ready-to-adapt answer skeletons for Featured/Qwoted/Connectively car-buying queries (data point + one-line credential).

## Task 4 - Code fixes (smallest diffs, local only)
Status: DONE
- src/app/sitemap.ts: comparisons entries already used `c.updatedAt` (no change needed). allValueYears entries used `lastModified: now` - fixed to look up the car's `updatedAt` from carModels by slug, falling back to `now` only if no matching car is found.
- Sideways internal links: src/app/cars/[slug]/page.tsx already links to comparisons ("Compare the ..." section), best-lists ("best used car pick" section), and years-to-avoid (quick-answer box) - no change needed, requirement already satisfied.
- Ran `npx tsc --noEmit`: passed with no errors/output.

## Weekly cadence for Hari (after reviewing drafts)
- Wk1: send research pitches (5/day), submit 3 directories/day.
- Wk2: journalist platforms 3-5 answers/wk; start resource-page outreach (5/day).
- Wk3-4: follow-ups (once each); review Search Console -> Links for new referring domains.
- Measure: referring domains monthly; rankings of /best and /compare pages at week 4-8.
