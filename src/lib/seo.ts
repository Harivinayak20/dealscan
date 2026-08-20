// Shared SEO helpers so meta descriptions never truncate mid-word in the SERP.

// Trim to <=max chars on a sentence boundary; fall back to a word boundary + ellipsis.
export function truncateMeta(text: string, max = 160): string {
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const sentence of sentences) {
    if ((out + sentence).length > max) break;
    out += sentence;
  }
  out = out.trim();
  if (out.length >= Math.min(120, max - 40)) return out;
  // No usable sentence boundary: cut on the last whole word before max.
  const clipped = text.slice(0, max - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

const TITLE_STEM_MAX = 50;
const BRAND_SUFFIX = /\s*[|—-]\s*dealscan(?:\.dev)?\s*$/i;

// The root layout adds " | DealScan.dev". Keep the page-specific stem concise
// and remove any legacy brand suffix so titles never repeat the brand.
export function compactTitle(title: string, fallback?: string, max = TITLE_STEM_MAX): string {
  const clean = (value: string) => value.replace(BRAND_SUFFIX, "").trim();
  const primary = clean(title);
  if (primary.length <= max) return primary;

  const alternate = fallback ? clean(fallback) : "";
  if (alternate && alternate.length <= max) return alternate;

  const clipped = primary.slice(0, max + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return clipped.slice(0, lastSpace > 0 ? lastSpace : max).replace(/[,:;\-–—]+$/, "").trim();
}
