# GSC Indexing Status — dealscan.dev

Checked: 2026-07-11 via Google Search Console API (Composio), property `sc-domain:dealscan.dev`.

## Sitemap Status

- `https://dealscan.dev/sitemap.xml` — already submitted (last submitted 2026-07-07, last downloaded 2026-07-09).
- No errors, no warnings, not pending.
- 1,400 URLs submitted, **0 marked indexed** in the sitemap summary counter (this counter lags; per-URL inspection below shows some pages ARE indexed).
- No action taken — sitemap was already registered, so no resubmission was needed.

## URL Inspection Results (15 URLs)

| URL | Coverage State | Verdict |
|---|---|---|
| https://dealscan.dev/ | Submitted and indexed | PASS |
| https://dealscan.dev/fees | URL is unknown to Google | NEUTRAL |
| https://dealscan.dev/price-checker | Submitted and indexed | PASS |
| https://dealscan.dev/compare | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/guides | Submitted and indexed | PASS |
| https://dealscan.dev/vin | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/cars | Submitted and indexed | PASS |
| https://dealscan.dev/best | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/research | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/widget | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/fees/documentation-fee | URL is unknown to Google | NEUTRAL |
| https://dealscan.dev/fees/dealer-prep-fee | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/guides/used-car-red-flags | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/guides/pre-purchase-inspection-checklist | Discovered - currently not indexed | NEUTRAL |
| https://dealscan.dev/how-scoring-works | Submitted and indexed | PASS |

## Summary

- **Indexed: 5 / 15** (/, /price-checker, /guides, /cars, /how-scoring-works)
- **Discovered but not indexed: 8 / 15** (/compare, /vin, /best, /research, /widget, /fees/dealer-prep-fee, /guides/used-car-red-flags, /guides/pre-purchase-inspection-checklist)
- **Unknown to Google (not yet discovered): 2 / 15** (/fees, /fees/documentation-fee)

## Notes

- The Indexing API does not support request-indexing for normal (non-JobPosting/BroadcastEvent) pages, so no indexing requests were made via API — this is a documented Google restriction, not a tool limitation.
- Site is young (sitemap first submitted 2026-07-07) — "Discovered - currently not indexed" is expected/normal at this stage and typically resolves within days to weeks as Google recrawls.
- `/fees` and `/fees/documentation-fee` showing "unknown to Google" is notable since `/fees` is a main nav page — worth checking that it's properly linked from indexed pages (e.g., homepage nav) and has no noindex/robots issue.

## Recommended manual "Request Indexing" list (top priority, do in GSC UI)

Since these are unindexed/undiscovered but important for SEO, request indexing manually in the Search Console UI, in this order:

1. https://dealscan.dev/fees (main nav page, currently unknown to Google — highest priority)
2. https://dealscan.dev/fees/documentation-fee (unknown to Google)
3. https://dealscan.dev/compare (main nav page)
4. https://dealscan.dev/vin (main nav page)
5. https://dealscan.dev/best (main nav page)
6. https://dealscan.dev/research (main nav page)
7. https://dealscan.dev/widget (main nav page)
8. https://dealscan.dev/fees/dealer-prep-fee
9. https://dealscan.dev/guides/used-car-red-flags
10. https://dealscan.dev/guides/pre-purchase-inspection-checklist

(Only 10 candidates emerged from this 15-URL sample; the remaining ~1,385 sitemap URLs — mostly year-value pages — were not individually inspected. If broader unindexed-page volume needs checking, run a larger URL Inspection or Coverage report sweep in the GSC UI, or ask for a bigger inspection batch here.)
