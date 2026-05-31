import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Dealscan — AI-Powered Used Car Listing Analyzer",
  description:
    "Paste any used car listing and get a clear deal score, red flags, market price range, and negotiation guidance before you message the seller.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  appleWebApp: {
    capable: true,
    title: "Dealscan",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#0b0d10",
  },
  openGraph: {
    title: "Dealscan — Used Car Deal Checker",
    description:
      "Score any used car listing in seconds. Know the car, not the hype.",
    url: appUrl,
    siteName: "Dealscan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dealscan — Used Car Deal Checker",
    description:
      "Score any used car listing in seconds. Know the car, not the hype.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Dealscan",
  url: appUrl,
  description:
    "AI-powered used car listing analyzer that scores listings, detects red flags, estimates fair prices, and provides negotiation guidance.",
  applicationCategory: "Automotive",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
