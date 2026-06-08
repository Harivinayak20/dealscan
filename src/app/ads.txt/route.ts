export function normalizePublisherId(value?: string) {
  const trimmed = value?.trim() ?? "";

  if (/^pub-\d+$/.test(trimmed)) return trimmed;
  if (/^ca-pub-\d+$/.test(trimmed)) return trimmed.replace(/^ca-/, "");

  return "";
}

export function GET() {
  const publisherId = normalizePublisherId(
    process.env.ADSENSE_PUBLISHER_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  );

  const body = publisherId
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`
    : [
        "# Dealscan ads.txt",
        "# Add ADSENSE_PUBLISHER_ID=pub-0000000000000000 after AdSense approval.",
        "# Google line format: google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0",
        "",
      ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
