# DealScan Newsletter — Templates (drafts, not live)

Sending is OFF. Do not schedule or send any of this until the `subscribers`
table has 50+ active (non-unsubscribed) rows and the owner explicitly
approves a send path (ESP integration, sender domain/SPF-DKIM, unsubscribe
link wiring).

## Welcome email (sent immediately on signup)

**Subject:** You're in — here's what to expect

Hey,

Thanks for signing up for DealScan fee alerts and deal tips. One email a
week, max — no spam, unsubscribe anytime with one click.

Quick thing you can use right now: before you sign anything at a dealership,
run the listing through the [DealScan fee checker](https://dealscan.dev/fees)
to see which "dealer fees" are normal and which ones are padding.

If you're mid-shop for a specific car, [scan the listing](https://dealscan.dev)
and I'll tell you if the price is fair for the mileage, year, and condition.

Reply to this email if you have a question about a deal — I read these.

— DealScan

## Weekly newsletter structure

- **Subject line**: specific, under ~50 characters, no spam trigger words
  (e.g. "3 dealer fees that aren't real fees").
- **One-line opener**: what prompted this issue, human voice.
- **Main item**: one genuinely useful thing — a new feature, a data finding
  from the DealScan Index, or a guide — lead with this.
- **Secondary items**: 1-3 short bullets/links (a guide, a fee explainer, a
  model comparison).
- **One CTA max**: usually "scan a listing" or "check dealer fees."
- Keep it skimmable in under 90 seconds. Plain-text-leaning, not a heavy
  branded template.

## Subject-line options (draft pool for first real send)

1. "3 dealer fees that aren't real fees"
2. "The $400 fee most buyers don't question"
3. "How to tell a fair price from a padded one"
4. "What we saw in 10,000 used-car listings"
5. "One number to check before you sign"

## List hygiene notes

- `subscribers.unsubscribed_at` is the suppression flag — never send to rows
  where it's set.
- Every future send needs a working unsubscribe link (CAN-SPAM/GDPR).
- No purchased or scraped lists, ever — only rows from the on-site opt-in
  form (`/api/subscribe`).
