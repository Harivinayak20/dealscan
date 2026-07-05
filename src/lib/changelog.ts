export type ChangelogEntry = {
  date: string; // YYYY-MM-DD
  title: string;
  items: string[];
};

// Newest first. Keep entries user-facing: what shoppers can now do, not
// internal refactors. This page is part of the trust loop — ship visibly.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-07-05",
    title: "Market intelligence + free VIN reports",
    items: [
      "Scans now remember every listing: re-scan one and DealScan shows how long it has been sitting and whether the price dropped.",
      "Deal results show how the asking price compares against similar listings scanned on DealScan (once enough data exists for that model).",
      "New free VIN lookup at /vin: factory specs, open NHTSA recalls, crash-test ratings, and EPA fuel economy — no signup, no paywall.",
      "This public changelog, so you can see exactly what ships and when.",
    ],
  },
  {
    date: "2026-07-03",
    title: "50-state fee pages, best-of lists, and a warmer design",
    items: [
      "Dealer-fee guides for all 50 states, including doc-fee caps where they exist.",
      "New best-used-cars lists by budget and body type.",
      "16 more head-to-head model comparisons.",
      "Refreshed warm paper + burnt orange design across the site.",
    ],
  },
  {
    date: "2026-06-21",
    title: "28 model-vs-model comparison pages",
    items: [
      "High-intent \"X vs Y\" used-car comparisons at /compare.",
      "Better mobile layout, scroll-to-top, and richer FAQs.",
    ],
  },
  {
    date: "2026-06-15",
    title: "Dealer-fee glossary and first-party analytics",
    items: [
      "Every junk fee explained at /fees, with what is negotiable and what is not.",
      "Cookieless first-party analytics — we measure pages, not people.",
    ],
  },
  {
    date: "2026-06-13",
    title: "Free price checker + ~580 model-year value pages",
    items: [
      "Transparent used-car value estimator at /price-checker — the depreciation model is shown, not hidden.",
      "Per-model-year value pages with price tables and risk flags.",
      "Embeddable price-checker widget for any site.",
      "Installable as a PWA on your phone.",
    ],
  },
  {
    date: "2026-06-12",
    title: "Buyer-check pages for 40 models",
    items: [
      "Model-by-model known issues, years to avoid, and pre-purchase checks at /cars.",
      "Honest handling of Facebook Marketplace links (we tell you when a site can't be fetched instead of pretending).",
    ],
  },
  {
    date: "2026-06-10",
    title: "DealScan launches",
    items: [
      "Paste a listing URL, text, or screenshot and get a 0-100 deal score, red flags, missing info, seller questions, and a negotiation plan.",
      "Guarded server-side listing extraction — public pages only, no logins bypassed.",
      "Share any report with a link.",
    ],
  },
];
