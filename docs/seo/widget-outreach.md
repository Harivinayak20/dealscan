# Widget outreach: getting `/embed/price-checker` embedded on other sites

Every site that embeds the DealScan widget links back to `dealscan.dev` (the
`Powered by DealScan.dev` credit line in the snippet, plus the "by DealScan.dev"
link inside the iframe itself). That's a real backlink from a page that stays
live indefinitely, not a one-off guest post — and it sends warm referral
traffic from people already reading about buying a car. This doc is the
practical playbook for getting more of them.

## Who to pitch

1. **Car blogs and car-buying advice sites** — any site publishing "how to buy
   a used car," "used car buying guide," or model-specific advice content.
   They already want an interactive element to break up long-form text and
   increase time-on-page; the widget is a drop-in answer.
2. **Dealer and dealer-group sites** — independent used car lots and small
   dealer groups, especially ones with a blog or "resources" page. Letting
   shoppers check *any* listing (including their own) is a credibility signal
   ("we have nothing to hide") that's an easier sell than it sounds.
3. **Personal-finance and money blogs** — sites that cover budgeting, big
   purchases, or "buy vs. lease" content. The widget fits naturally into a
   "how to buy a car without overpaying" post.
4. **Credit unions and small banks** — auto-loan pages and member-resources
   sections. A credit union has every incentive to help members avoid a bad
   loan on a bad deal; framing this as "an unbiased second opinion for your
   members" resonates.
5. **Forums and communities** — car-enthusiast forums (make/model-specific),
   r/whatcarshouldIbuy-style communities, Facebook groups for local car
   buying/selling. Look for a pinned "resources" post or wiki page a mod can
   add the embed or a link to.
6. **Car-buying course creators / YouTubers with show notes pages** — anyone
   teaching "how to buy a used car" wants a hands-on tool students can apply
   immediately; pitch it as a companion exercise linked from the show notes.

## Where to find them

- Search `"used car buying guide" -site:dealscan.dev` and similar queries for
  blogs already ranking on the target keywords.
- Search `"embed a calculator" OR "embed a tool" car blog` to find sites that
  have embedded other tools before (they're pre-sold on the concept).
- Check backlinks of adjacent tools (KBB, Edmunds calculators, other free
  car-buying widgets) for sites that already link to a similar resource.
- Credit union and dealer sites: search `site:*.creditunion.coop auto loan tips`
  or similarly for `"auto loan" resources` on dealer group domains.

## Copy-paste pitch email

Subject: `A free tool for your [used car buying / auto loan] page`

> Hi [name],
>
> I came across your post [\"post title\"] on [site] — solid breakdown of
> [specific detail from their post, to show you actually read it].
>
> I built [DealScan](https://dealscan.dev), a free tool that lets someone
> paste in a used car listing and get an instant fair-price estimate — no
> signup, no email required. I think it'd be a useful, concrete thing for your
> readers to actually *do* after reading your post, instead of just reading
> more theory.
>
> It embeds in one line:
>
> ```html
> <iframe
>   src="https://dealscan.dev/embed/price-checker"
>   title="DealScan used car price checker"
>   width="100%"
>   height="720"
>   style="border:0; border-radius:12px; max-width:640px;"
>   loading="lazy"
> ></iframe>
> ```
>
> No ads, no data collection from your visitors, and it's free indefinitely —
> happy to answer any questions or tweak the height/styling if it doesn't fit
> your layout. Would you be open to dropping it into that post, or is there a
> better page on your site for it?
>
> Thanks for the consideration either way,
> [name]

Keep it short, reference something specific from their content, and lead with
"free tool for your readers," not "backlink for me." If they say yes but want
something narrower, offer the deal checker angle instead ("a scam/red-flag
checker for your Craigslist safety post") — see `/deal-checker`, `/good-deal`,
and `/scam-checker` for pages that reframe the same underlying analyzer for
different intents, useful as pitch-specific landing pages to link instead of
the homepage.

## Embed snippet (copy exactly)

This is the real, current snippet from `/widget` (`src/app/widget/page.tsx`,
rendered live via `WidgetEmbedBlock`). Give this to partners as-is:

```html
<iframe
  src="https://dealscan.dev/embed/price-checker"
  title="DealScan used car price checker"
  width="100%"
  height="720"
  style="border:0; border-radius:12px; max-width:640px;"
  loading="lazy"
></iframe>
<p style="font-size:12px; margin-top:8px;">
  Powered by <a href="https://dealscan.dev" target="_blank" rel="noopener">DealScan.dev</a>
</p>
```

Notes for the partner:
- The iframe points at `/embed/price-checker` (a `noindex` page built for
  embedding — see `src/app/embed/price-checker/page.tsx`), not the marketing
  page, so it renders chrome-free with just the tool.
- `height="720"` is a safe default; the tool works fine narrower or shorter,
  so tell them to adjust to their layout — `max-width:640px` keeps it from
  stretching too wide in a full-bleed content column.
- The "Powered by DealScan.dev" line is the backlink. Ask partners not to
  strip it — it's the entire point of offering the widget for free, and most
  sites are happy to leave it since it reads as a normal tool attribution, not
  an ad.
- Full instructions and a live preview are always at
  [dealscan.dev/widget](https://dealscan.dev/widget) if a partner wants to see
  it running before committing.

## Why every embed is worth pursuing

- **A permanent, contextual backlink.** Unlike a guest post that can be
  edited or taken down, an embedded tool tends to stay on the page as long as
  the underlying post is useful — often years. It's also contextually
  relevant (a car-buying post linking to a car-buying tool), which matters
  more to search engines than raw link count.
- **Referral traffic that converts.** Someone who clicks through from an
  embedded widget already has a listing in hand and intent to check it — a
  much warmer visitor than someone landing on a blog post cold.
- **Compounding reach.** Each embed exposes DealScan to that site's existing
  audience indefinitely, at zero ongoing cost per placement, unlike paid
  acquisition.
- **Low friction for the partner.** One iframe, no JS bundle, no dependency
  to maintain, free forever — there's very little reason for a partner to say
  no once they see the sample email above and the live preview at `/widget`.

## Tracking

When following up on outreach, spot-check whether the placement actually went
live by checking the target page directly (search-engine cache or a manual
visit) — there's no separate analytics pixel on the embed today, so referral
traffic shows up as regular `dealscan.dev` sessions with `/embed/price-checker`
as the entry page if the iframe's Referer header passes through, or as direct
sessions to `/embed/price-checker` if it doesn't. If accurate attribution
becomes a priority, the next step would be a `?ref=` query param convention
added to each partner's specific embed URL.
