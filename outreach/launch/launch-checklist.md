# Launch Checklist - Dealscan.dev

Prep only. Complete every pre-launch item before picking a date. Nothing is submitted here.

## Pre-launch site checklist

### Must work end-to-end for a stranger with zero context
- [ ] Core flow: paste a listing -> fair-price verdict renders correctly, on a fresh session with no account.
- [ ] Fee breakdown / glossary (/fees) loads and is accurate.
- [ ] /research/dealer-fees-by-state is DEPLOYED, live, and accurate. This is the flagship hook for HN and Reddit - it must be up before any launch.
- [ ] 28 model comparison pages load.
- [ ] "Years to avoid" pages load.
- [ ] Embeddable widget works when embedded on an external page.
- [ ] No signup wall anywhere (this is a selling point and required for r/InternetIsBeautiful).

### OG / social images
- [ ] Homepage has an OG image (title, one-line value prop, clean).
- [ ] /research/dealer-fees-by-state has its own OG image showing the 11x / $85-$999 finding - this is what gets shared on HN/Reddit/X, so it matters most.
- [ ] Model comparison and /fees pages have sensible OG images or a good default.
- [ ] Verify OG tags render correctly (title, description, image) via a link-preview check on X, LinkedIn, and iMessage.

### Load speed
- [ ] Homepage and the research study load fast on a cold visit (target sub-2.5s LCP). Launch traffic is unforgiving and will not return.
- [ ] The study page (likely image/chart-heavy) is optimized - compressed images, no giant blocking assets.
- [ ] Test under a traffic spike assumption (it is on Cloudflare Workers via OpenNext, so confirm the study page is cached/edge-served, not re-rendering per request).

### Mobile
- [ ] Core paste-and-verdict flow works on mobile.
- [ ] The state fee study / map is readable and interactive on a phone (much launch traffic is mobile).
- [ ] No horizontal scroll, tap targets are usable, tables scroll inside their container.

### Analytics / readiness
- [ ] Analytics is live so launch-day traffic and the core-action completion rate are measured.
- [ ] A way to receive feedback/bug reports fast (the maker comments invite it).

## Recommended launch date logic

1. Gate: do not launch until /research/dealer-fees-by-state is deployed, fast, and accurate. It is the strongest hook and appears in every venue's copy. No study live = no launch.
2. Day of week for Product Hunt: launch Tuesday, Wednesday, or Thursday. Avoid Mon (crowded), Fri-Sun (low traffic). Tuesday or Wednesday is the safe default.
3. Time: PH day resets 12:01am PT - submit right at reset to get a full day in the ranking window.
4. Show HN: schedule 1-2 weeks after the PH launch, on a weekday, early US morning (roughly 7-9am ET). Never weekends.
5. BetaList: submit whenever, but if wanted, submit 1-4 weeks ahead of everything else because the review queue is slow.
6. Reddit + newsletters: spread across the PH launch week, 1-2 days apart, each with its own framing (see crosspost-plan.md).

## Recommended sequence at a glance

Week 0 (prep): finish site checklist, deploy the fee study, prepare all copy and assets. Submit BetaList if using it (slow queue).
Launch day (Tue/Wed): Product Hunt at 12:01am PT + owned channels + one allowed community. Self-hunt.
Launch week: r/InternetIsBeautiful (study angle) and 1-2 tailored newsletter pitches, spaced out.
Week +1 or +2: Show HN, weekday early morning, data-study-first framing.

## Hard rules
- Never buy upvotes/votes anywhere.
- No paid submission or external send (BetaList fee, sponsored slots) without explicit owner approval.
- Launch requires the owner's own accounts and a date he picks. This kit is prep only.
