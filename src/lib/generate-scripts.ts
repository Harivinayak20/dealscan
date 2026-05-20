import type { AnalyzeListingResult } from "@/lib/analyzer-types";

export type DealScripts = {
  text: string;
  email: string;
  inPerson: string;
};

export function generateNegotiationScripts(result: AnalyzeListingResult, sourceText: string): DealScripts {
  const price = sourceText.match(/\$\s?[\d,]+/)?.[0] ?? "the asking price";
  const vehicle = sourceText.match(/\b(19|20)\d{2}\s+[A-Za-z]+\s+[A-Za-z0-9-]+/)?.[0] || "this vehicle";
  const topRedFlag = result.redFlags[0] ?? "the condition concerns";
  const topMissing = result.missingInfo[0]?.toLowerCase() ?? "service history";
  const offerTarget = result.suggestedOfferRange.high
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.suggestedOfferRange.high)
    : "a fair price";
  const fairRange = result.estimatedFairValueRange.low && result.estimatedFairValueRange.high
    ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.estimatedFairValueRange.low)} to ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(result.estimatedFairValueRange.high)}`
    : "market value";
  const isRisky = result.score < 55;

  if (isRisky) {
    return {
      text: `Hi — I'm interested in the ${vehicle} you have listed at ${price}. Before I make an offer, I noticed a few things I'd like to clarify: ${topRedFlag}. Could you confirm the title status and send the VIN so I can run a history report? Also, would you be open to a pre-purchase inspection? Thanks.`,
      email: `Subject: Question about ${vehicle} listed at ${price}\n\nHi,\n\nI'm interested in the ${vehicle} you have listed. I've done some research and I want to be transparent — ${topRedFlag} is a concern for me. Before I can move forward, I need to verify ${topMissing}.\n\nCould you please:\n1. Send a clear photo of the title\n2. Provide the VIN\n3. Share any available service or maintenance records\n4. Allow a pre-purchase inspection\n\nI'd love to make this work if the details check out. Looking forward to your response.`,
      inPerson: `"I've done my research on this ${vehicle}. ${topRedFlag} is something I want to understand better before we talk numbers. Could we go through the service records together and take it for a PPI? If everything checks out, I'm ready to make a serious offer."`,
    };
  }

  const greenFlags = result.greenFlags.slice(0, 2).join(" and ").toLowerCase();

  return {
    text: `Hi — I'm interested in the ${vehicle} listed at ${price}. Based on my research, the fair market range is ${fairRange}. I notice ${greenFlags}, which is great. Would you consider ${offerTarget}? I'm pre-approved and can move quickly. Would you be open to a PPI?`,
    email: `Subject: Offer on ${vehicle} — ${offerTarget}\n\nHi,\n\nI'm writing about the ${vehicle} listed at ${price}. After researching comparable listings, I see the fair market range is ${fairRange}. I also noticed ${greenFlags}, which tells me you've taken good care of it.\n\nI'd like to make an offer of ${offerTarget}. I'm pre-approved and can close within the week. I'd just ask to have a PPI done before we finalize.\n\nLet me know if you'd like to discuss. Thanks for your time!`,
    inPerson: `"I've done my homework on this ${vehicle}. The market data says fair value is ${fairRange}, and you're asking ${price}. I'd like to offer ${offerTarget} — I'm pre-approved and can sign today. Let's take it for a PPI and if everything looks good, we have a deal."`,
  };
}
