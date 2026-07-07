/**
 * Schema.org JSON-LD builders for AI discoverability.
 * Currently provides BreadcrumbList markup so agents and crawlers can read the
 * site hierarchy on deep pages.
 */

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

/**
 * Breadcrumb JSON-LD for any page.
 * Helps AI understand site hierarchy and context.
 */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const position = index + 1;
      const breadcrumb: Record<string, unknown> = {
        "@type": "ListItem",
        position,
        name: item.name,
      };
      if (item.href) {
        breadcrumb.item = `${appUrl}${item.href}`;
      }
      return breadcrumb;
    }),
  };
}
