/**
 * Simple localStorage cache for successful URL extractions.
 * Keys are normalized URLs, values are the extracted text and title.
 */
export class ExtractionCache {
  private static readonly CACHE_PREFIX = "dealscan:extraction:";
  private static readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

  static get(url: string): { title: string; text: string } | null {
    if (typeof window === "undefined") return null;

    try {
      const normalizedUrl = this.normalizeUrl(url);
      const key = this.CACHE_PREFIX + normalizedUrl;
      const cached = window.localStorage.getItem(key);

      if (!cached) return null;

      const { value, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > this.TTL_MS) {
        window.localStorage.removeItem(key);
        return null;
      }

      return value;
    } catch {
      return null;
    }
  }

  static set(url: string, value: { title: string; text: string }): void {
    if (typeof window === "undefined") return;

    try {
      const normalizedUrl = this.normalizeUrl(url);
      const key = this.CACHE_PREFIX + normalizedUrl;
      const payload = {
        value,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // Silently fail - cache is optional
    }
  }

  private static normalizeUrl(url: string): string {
    try {
      const u = new URL(url);
      // Remove query params and hash for caching consistency
      u.search = "";
      u.hash = "";
      // Remove trailing slash for consistency
      let pathname = u.pathname;
      if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);
      u.pathname = pathname;
      return u.toString();
    } catch {
      return url.toLowerCase().trim();
    }
  }
}