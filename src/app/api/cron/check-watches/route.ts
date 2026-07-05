import { NextResponse } from "next/server";
import { scrapeListingUrl } from "@/lib/listing-scraper";
import { detectVehicle } from "@/lib/local-analyzer";
import { dueWatches, endWatch, markChecked } from "@/lib/watch-store";
import { isEmailConfigured, listingGoneEmail, priceDropEmail, sendAlertEmail } from "@/lib/alerts-email";

// Alert sweep: re-checks watched listings for price drops or disappearance.
// Trigger it with a Cloudflare cron (or any scheduler) hitting this endpoint
// with the CRON_SECRET header. Batch-limited so a run always fits in a Worker.

const BATCH_SIZE = 20;
const MIN_DROP_DOLLARS = 100;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const watches = await dueWatches(BATCH_SIZE);
  let checked = 0;
  let drops = 0;
  let gone = 0;

  for (const watch of watches) {
    if (!watch.listing_url) continue;
    checked += 1;
    const title = watch.vehicle_title ?? "The car you're watching";

    try {
      const listing = await scrapeListingUrl(watch.listing_url);
      const detected = detectVehicle({ inputType: "text", listingText: listing.text });
      const price = detected.price && detected.price > 100 ? Math.round(detected.price) : null;

      const dropped =
        price !== null && watch.last_price !== null && watch.last_price - price >= MIN_DROP_DOLLARS;

      if (dropped && isEmailConfigured()) {
        const email = priceDropEmail({
          vehicleTitle: title,
          from: watch.last_price as number,
          to: price as number,
          listingUrl: watch.listing_url,
          token: watch.token,
        });
        const sent = await sendAlertEmail({ to: watch.email, ...email });
        if (sent) drops += 1;
        await markChecked(watch.id, { price, alerted: sent });
      } else {
        await markChecked(watch.id, { price });
      }
    } catch (error) {
      const status = error instanceof Error ? error.message.match(/HTTP (\d+)/)?.[1] : null;
      if (status === "404" || status === "410") {
        // Listing removed: most likely sold. Tell the watcher and end the watch.
        if (isEmailConfigured()) {
          const email = listingGoneEmail({ vehicleTitle: title, lastPrice: watch.last_price, token: watch.token });
          await sendAlertEmail({ to: watch.email, ...email });
        }
        await endWatch(watch.token, "listing_gone");
        gone += 1;
      } else {
        // Transient failure (blocked, timeout): just record the attempt.
        await markChecked(watch.id, {});
      }
    }
  }

  return NextResponse.json({ ok: true, checked, drops, gone, emailConfigured: isEmailConfigured() });
}
