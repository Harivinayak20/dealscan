import type { Metadata } from "next";
import { Archivo, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { WebMcpTools } from "@/components/WebMcpTools";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/adsense";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Used Car Listing Analyzer & Deal Score | DealScan.dev",
    template: "%s | DealScan.dev",
  },
  description:
    "Paste any used car listing and get a clear deal score, red flags, market price range, and negotiation guidance before you message the seller.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "DealScan",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#f7f1e9",
    ...(ADSENSE_ENABLED && ADSENSE_CLIENT_ID
      ? { "google-adsense-account": ADSENSE_CLIENT_ID }
      : {}),
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  openGraph: {
    title: "Used Car Listing Analyzer & Deal Score | DealScan.dev",
    description:
      "Score any used car listing in seconds. Know the car, not the hype.",
    url: appUrl,
    siteName: "DealScan.dev",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Used Car Listing Analyzer & Deal Score | DealScan.dev",
    description:
      "Score any used car listing in seconds. Know the car, not the hype.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DealScan",
  url: appUrl,
  logo: `${appUrl}/dealscan-logo.png`,
  description:
    "DealScan is a free AI tool that scores used car listings, flags risks, estimates fair prices, and helps buyers negotiate.",
  email: "hello@dealscan.dev",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DealScan",
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
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DealScan",
    url: appUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${appUrl}/cars?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  organization,
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${bricolage.variable} ${plexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Owns the cookie decision and renders Analytics/AdSense only on consent. */}
        <CookieConsent />
        <Analytics />
        <WebMcpTools />
        <SiteChrome />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
