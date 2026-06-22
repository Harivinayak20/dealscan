import { ChevronRight } from "lucide-react";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";

export type Crumb = {
  name: string;
  /** Path relative to the site root, e.g. "/guides". Omit on the current (last) page. */
  href?: string;
};

// Renders a visible breadcrumb trail plus matching BreadcrumbList JSON-LD.
// Schema mirrors the visible links exactly, per Google's structured-data guidelines.
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${appUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mt-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--text-muted)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-1.5">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="font-semibold transition hover:text-[var(--racing-green)]"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-semibold text-[var(--graphite)]" aria-current="page">
                    {item.name}
                  </span>
                )}
                {!isLast ? (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
