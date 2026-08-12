import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DealScan Privacy Policy",
  description: "How DealScan handles listing text, browser storage, third-party services, affiliate links, advertising, and cookies.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--ivory)] px-5 py-6 text-[var(--graphite)] sm:px-8">
      <div className="mx-auto max-w-3xl">

        <section className="py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(169,130,83,0.35)] bg-[var(--paper)] px-4 py-2 text-sm font-black text-[var(--graphite)] shadow-sm">
            <ShieldCheck className="h-4 w-4 text-[var(--champagne)]" aria-hidden="true" />
            Privacy
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Clear about what DealScan stores.
          </h1>
        </section>

        <section className="space-y-6 text-base leading-7 text-[var(--text-body)]">
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">What DealScan collects</h2>
            <ul className="list-inside list-disc space-y-2">
              <li><strong>Listing text you provide:</strong> Pasted text, extracted URLs, or manually entered details are processed to generate a deal analysis. They are not stored permanently on our servers.</li>
              <li><strong>Browser history:</strong> Full analysis results, watchlist items, and comparisons are saved in your browser storage.</li>
              <li><strong>Scan metadata:</strong> We store limited fields such as vehicle title, score, verdict, confidence, input type, and analysis source for service analytics and aggregate research.</li>
              <li><strong>Listing memory:</strong> When available, we store the VIN or a one-way hash of the normalized listing URL, plus vehicle year, make, model, mileage, price, and scan timestamps. This powers repeat-scan and price-drop features without storing the raw listing URL.</li>
              <li><strong>No account required:</strong> You can use DealScan without creating an account or providing personal information.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">What DealScan does not do</h2>
            <ul className="list-inside list-disc space-y-2">
              <li>We do not sell your personal data.</li>
              <li>We do not require an account to use the analyzer.</li>
              <li>We do not store your listing text or raw listing URL after analysis is complete.</li>
              <li>We do not attach names, email addresses, IP addresses, or exact locations to the scan dataset.</li>
              <li>We do not require cookies for core functionality.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">Local storage</h2>
            <p className="text-sm leading-6">
              DealScan uses your browser&apos;s local storage to save scan history, watchlist items, and comparison results.
              That browser history stays on your device. Separate limited scan metadata and listing-memory fields are stored as described above.
              You can clear browser history at any time using the &quot;Clear all&quot; buttons in the Dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">Email signups</h2>
            <p className="text-sm leading-6">
              If you sign up for fee alerts and deal tips, we store your email address, the signup date, and where on the site you
              signed up. We use it only to send that content, we never sell or share it, and every email we send includes an
              unsubscribe link. To be removed at any time, unsubscribe or write to hello@dealscan.dev.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">Third-party services</h2>
            <p className="text-sm leading-6">
              DealScan uses Groq for AI-powered analysis when configured. Listing text may be sent to Groq to generate a score and explanation,
              and that processing is governed by Groq&apos;s own terms and privacy policy. Marketplace and buyer-tool links may be affiliate links;
              clicking them opens the respective site under its own privacy policy.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">Advertising and cookies</h2>
            <p className="text-sm leading-6">
              DealScan may display ads when advertising services are configured. Third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s prior visits to DealScan or other websites. Google and its partners may use advertising cookies, web beacons, IP addresses, device identifiers, and similar technologies to serve, personalize, measure, and improve ads.
              You can review how Google uses ad data at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--racing-green)] underline">Google partner sites policy</a>,
              manage Google ad personalization at <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--racing-green)] underline">Google Ad Settings</a>,
              and review additional cookie details on our <Link href="/cookies" className="font-bold text-[var(--racing-green)] underline">Cookie Policy</Link>.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--paper)] p-6">
            <h2 className="mb-3 text-lg font-black">Disclaimer</h2>
            <p className="text-sm leading-6">
              DealScan provides informational estimates only. Deal scores, fair-value ranges, and negotiation guidance
              are based on listing data and general heuristics. They are not a substitute for professional inspection,
              title verification, or financial advice. Always verify critical details independently before making a purchase.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
