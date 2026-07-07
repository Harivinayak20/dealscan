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
