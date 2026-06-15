import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { AdSenseScript } from "@/components/AdSenseScript";
import { SiteChrome } from "@/components/SiteChrome";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/adsense";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://dealscan.dev";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "DealScan — AI-Powered Used Car Listing Analyzer",
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
    "theme-color": "#faf8f3",
    ...(ADSENSE_ENABLED && ADSENSE_CLIENT_ID
      ? { "google-adsense-account": ADSENSE_CLIENT_ID }
      : {}),
  },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  openGraph: {
    title: "DealScan — Used Car Deal Checker",
    description:
      "Score any used car listing in seconds. Know the car, not the hype.",
    url: appUrl,
    siteName: "DealScan",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealScan — Used Car Deal Checker",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
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
        <AdSenseScript />
      </head>
      <body>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
