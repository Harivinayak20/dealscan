# Dealscan Comparison Redesign FRD

## 1. Purpose

Make Dealscan easier to use for comparing two cars or two listings from different websites. The main user should be able to paste two listing links, review extracted details, run analysis, and see a clear side-by-side winner without manually scanning one car, saving it, starting over, scanning another car, then opening Compare.

## 2. Testing Summary

Test date: 2026-05-24

Current tested behavior:
- The home page loads at `http://localhost:3000`.
- The primary input supports one listing link.
- Pasting two links into the listing link field is treated as one URL attempt.
- A two-link compare flow is not visible on the page.
- Compare exists, but it works through saved analysis results after scanning listings one at a time.
- The Compare page sorts saved cars by score, but it does not make entry easy from the first screen.
- The "Find it elsewhere" area is wired for marketplace links, but the current generator returns reference links such as KBB, Carfax, NHTSA, NICB, and insurance.
- A public listing scrape can fail on marketplace anti-bot or permission responses, shown during testing as an HTTP 403 for a pasted Cars.com style URL.

Validation run:
- `npm run typecheck` passed.
- `npm test` passed with 25 tests.
- `npm run build` could not complete in this sandbox because Turbopack hit `Operation not permitted` while trying to bind to a port during CSS processing. This matches a known sandbox limitation, not a confirmed app regression.

## 3. Problem Statement

The app says it can help with listings across marketplaces, but the current comparison workflow is indirect. Users who want to compare a Cars.com listing against an Autotrader listing must understand the save-to-compare pattern and repeat the scan flow manually.

This creates three problems:
- Too much friction for the core use case.
- Users may not realize comparison exists until after a scan.
- The page has several secondary sections and actions that compete with the main job.

## 4. Goals

- Let users compare two listings from different websites from the first screen.
- Support two cars even when only one or neither URL can be scraped.
- Make the comparison result clear: better deal, safer deal, cheaper deal, missing proof, and next action.
- Reduce visible clutter around the main scan flow.
- Make the UI feel more premium and animated without hurting performance or accessibility.

## 5. Non-Goals

- Do not guarantee live scraping from every marketplace. Many listing sites block automated page reads.
- Do not claim licensed valuation accuracy.
- Do not remove existing features without approval where they may affect business, monetization, or retention.
- Do not add a heavy animation library unless the implementation plan explicitly accepts the dependency cost.

## 6. Primary User Flow

### Flow A: Compare Two Links

1. User opens Dealscan.
2. User sees a default "Compare two listings" mode.
3. User pastes Listing A URL.
4. User pastes Listing B URL.
5. User clicks "Compare listings."
6. App extracts details where possible.
7. If extraction fails for either listing, app asks for pasted seller notes or manual fields for that side only.
8. App analyzes both listings.
9. App shows a side-by-side result with a winner and reasons.

### Flow B: Compare Two Cars Manually

1. User switches one or both sides to manual entry.
2. User enters year, make, model, mileage, price, title, seller notes.
3. App analyzes both cars.
4. App shows the same side-by-side comparison result.

### Flow C: Add Third Listing Later

1. User clicks "Add another car."
2. App adds a compact third column or moves to a ranked list.
3. Default scope for first release should stay two cars unless this is easy to extend from current saved-results code.

## 7. Functional Requirements

### FR-1: Dual Listing Input

The analyzer must support two side-by-side listing inputs:
- Listing A
- Listing B

Each listing input must support:
- URL
- pasted seller notes
- manual details
- optional screenshot later, if keeping screenshot input is approved

Acceptance criteria:
- User can paste two different marketplace links at once.
- The UI does not treat two links as one URL.
- Each side has its own extraction state, error state, and editable details.
- The compare button stays disabled until both sides have enough details or a clear fallback prompt is shown.

### FR-2: Link Parsing

The app must detect multiple URLs in pasted text.

Acceptance criteria:
- If the user pastes two URLs into one field, split them into Listing A and Listing B.
- If the user pastes more than two URLs, keep the first two and show a compact note that only two are compared in this version.
- If a URL is unsafe or unsupported, show the error on that listing only.

### FR-3: Extraction Fallback

Marketplace pages may block extraction, so the product must gracefully recover.

Acceptance criteria:
- If URL extraction fails for Listing A, Listing B can still proceed.
- A failed side changes to "Paste seller notes for this listing" with the original URL preserved.
- The user can paste text and continue without restarting.
- Error copy must be buyer-friendly, for example: "That site blocked the page read. Paste the seller notes and we can still compare it."

### FR-4: Compare Analysis API

Add a compare-level API or client orchestration that analyzes both listings and returns a single comparison object.

Minimum output:
- `listingA.result`
- `listingB.result`
- `winner`
- `winnerReason`
- `priceDelta`
- `scoreDelta`
- `riskDelta`
- `missingInfoComparison`
- `recommendedNextStep`

Acceptance criteria:
- Both listings are analyzed using the same scoring rules.
- The result explains why one car wins or why the comparison is inconclusive.
- The response remains useful when prices, mileage, or title status are missing.

### FR-5: Side-by-Side Result View

Create a comparison result view that prioritizes decision-making.

Required sections:
- Winner banner: "Better deal", "Safer buy", or "Too close to call"
- Two comparison columns
- Score, verdict, price, mileage, title, estimated fair range
- Red flags and green flags
- Missing information
- Seller questions for each listing
- "What to ask next" combined checklist

Acceptance criteria:
- The better option is visually obvious within 5 seconds.
- The user can still inspect full analysis for either car.
- The view works on mobile by stacking cards with a sticky winner summary.

### FR-6: Saved Comparison

Use the existing saved-results storage pattern, but save the comparison as a first-class object.

Acceptance criteria:
- User can save a comparison.
- Saved comparison stores both source URLs, extracted text, analysis results, and timestamp.
- Existing single-car compare should not break.

### FR-7: Marketplace Reference Links

Improve "Find it elsewhere" so it actually helps compare across websites.

Acceptance criteria:
- Generate search links for Cars.com, Autotrader, CarGurus, Craigslist, Facebook Marketplace search when make, model, year, and location are available.
- Label these as "Search similar listings", not as verified matches.
- Keep Carfax, KBB, NHTSA, and NICB under "Verify this car."

### FR-8: Clutter Reduction

The first screen should focus on one job: compare or check a car.

Recommended first-pass removals or moves:
- Move "Buyer tools" below the result page or into a compact footer.
- Move "How it helps" below the main input and shorten it to one compact row.
- Hide sample listings behind a small "Try sample data" button.
- Remove "Engine" from the top nav visible copy and rename it to "How it works" if kept.
- Move FAQ below footer-level content or keep only 3 questions.

Requires user confirmation before removing:
- Affiliate/buyer tools page
- Waitlist/email capture
- Dashboard/admin links
- Screenshot upload
- Watch button
- Report JSON download
- PDF/print
- Share by email
- Negotiation scripts

## 8. UX Requirements

### Main Screen

Recommended layout:
- Left: short brand/value copy.
- Right: two-listing comparison panel.
- Default tab: "Compare two listings."
- Secondary mode: "Check one listing."

The comparison panel should have:
- Two labeled columns: Car A and Car B.
- URL fields at the top.
- "Paste notes instead" toggle per side.
- Compact extracted detail preview.
- One primary action: "Compare listings."

### Result Screen

Recommended layout:
- Sticky top comparison summary.
- Winner badge with concise reason.
- Side-by-side cards with score rings.
- A difference table: price, mileage, title, confidence, risk flags.
- Combined next steps.

### Empty States

Examples:
- "Paste two listing links to compare them."
- "Site blocked the read. Paste seller notes for this side."
- "We need price or mileage on at least one side to compare value."

### Error States

Errors must appear next to the affected listing, not as a global page error unless both sides fail.

## 9. Visual Design Direction

The current page reads warm, beige, and white-heavy. It needs stronger visual hierarchy, more contrast, and motion.

Recommended direction:
- Keep the premium buyer-trust tone, but shift from mostly white cards to a deeper automotive dashboard feel.
- Use graphite, deep green, ivory, and champagne as the base palette, with more dark surfaces near the primary comparison panel.
- Add subtle automotive cues: split-lane dividers, odometer-style numbers, inspection checklist strips, and score movement.
- Reduce nested cards. Use full-width sections, thin dividers, and data rows.
- Make the primary compare panel feel like the product, not a form embedded in a landing page.

Design concepts:
- "Garage desk": dark graphite comparison console with ivory input fields and champagne highlights.
- "Two-lane inspection": Car A and Car B sit in two lanes with animated score markers.
- "Buyer cockpit": compact data strips, sticky score summary, minimal marketing sections.

## 10. Motion Requirements

Use CSS-first animation unless a future implementation explicitly adds Framer Motion.

Required interactions:
- Buttons press down slightly on active state.
- Primary button has a soft directional sheen on hover.
- Tabs slide an underline or pill indicator instead of hard switching.
- Compare result cards reveal in staggered sequence.
- Score ring counts up from 0 to final score.
- Winner badge slides in after both analyses complete.
- Error states shake subtly once, then settle.
- Loading state uses skeleton rows matching the comparison layout.

Performance rules:
- Animate `transform` and `opacity`, not width, height, top, or left.
- Respect `prefers-reduced-motion`.
- Do not add constant background motion that distracts from reading results.

## 11. Content Requirements

Keep copy shopper-facing. Avoid internal implementation language.

Use:
- "Compare listings"
- "Paste seller notes"
- "Site blocked the page read"
- "What to ask the seller"
- "Better deal"
- "Safer buy"

Avoid:
- "URL extraction"
- "OCR"
- "Groq"
- "Engine"
- "API"
- "Heuristic"

## 12. Technical Notes

Likely files to touch:
- `src/components/AnalyzerApp.tsx`
- `src/components/CompareView.tsx`
- `src/components/ResultSummary.tsx`
- `src/lib/cross-platform-search.ts`
- `src/lib/analyzer-types.ts`
- `src/app/api/analyze-listing/route.ts`
- Optional new component: `src/components/CompareInputPanel.tsx`
- Optional new component: `src/components/ComparisonResultView.tsx`
- Optional new lib: `src/lib/compare-listings.ts`

Recommended approach:
1. Add shared listing draft type for URL, text, manual details, extraction state, and error.
2. Build a `CompareInputPanel` with two independent listing drafts.
3. Reuse the existing single-listing analyzer for each side.
4. Add a compare function that computes deltas and recommendation text.
5. Replace the current saved-results-first compare entry with the new direct compare flow.
6. Keep current saved compare page as a secondary "Saved cars" view until user approves removal or consolidation.

## 13. Release Plan

### Phase 1: Make Comparison Work

- Add two-link input.
- Add independent extraction fallback.
- Add side-by-side comparison result.
- Add basic comparison tests.

### Phase 2: Reduce Clutter

- Collapse samples.
- Rename or remove "Engine" from nav.
- Move buyer tools lower or behind one link.
- Trim homepage sections after user approval.

### Phase 3: Improve Motion and Visual Design

- Add animated button states.
- Add score count-up.
- Add staggered result reveals.
- Improve dark comparison panel styling.
- Add responsive mobile polish.

## 14. Test Plan

Unit tests:
- Multi-URL parsing splits two links.
- Unsafe URLs are rejected per listing.
- Compare function chooses winner correctly from score and risk deltas.
- Marketplace search links generate expected URLs.

Integration tests:
- Two text listings can be compared.
- One blocked URL plus pasted notes can be compared.
- Two manual car entries can be compared.
- Saved comparisons persist and reload.

Browser tests:
- Desktop first screen has two visible listing inputs.
- Mobile stacks Listing A and Listing B cleanly.
- Primary CTA remains visible.
- Error appears on one side only when one URL fails.
- Result view clearly shows winner and next action.

## 15. Open Questions

- Should the homepage default to "Compare two listings" instead of "Check one listing"?
- Should screenshot upload stay in the first version of comparison, or move behind "More ways to add details"?
- Should saved-results compare be replaced or renamed to "Saved cars"?
- Which sections can be removed immediately: Buyer tools, FAQ, waitlist, dashboard link, report/PDF/share/watch?
- Should we rename the visible brand to `motorcheck.app` in this redesign?

## 16. Recommendation

Build Phase 1 first. Do not start with a full redesign. The highest-impact change is a direct two-listing compare flow with graceful fallback when marketplace pages block extraction. After that works, reduce clutter and add motion around the working comparison path.
