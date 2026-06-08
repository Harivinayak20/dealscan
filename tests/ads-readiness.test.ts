import assert from "node:assert/strict";
import test from "node:test";
import { GET, normalizePublisherId } from "../src/app/ads.txt/route.ts";
import { getAdSenseSettings, isAdSenseReady, normalizeAdSenseClientId } from "../src/lib/adsense.ts";
import { getGuide, guides } from "../src/lib/guides.ts";

test("normalizes AdSense client IDs only when they use ca-pub format", () => {
  assert.equal(normalizeAdSenseClientId(" ca-pub-1234567890123456 "), "ca-pub-1234567890123456");
  assert.equal(normalizeAdSenseClientId("pub-1234567890123456"), "");
  assert.equal(normalizeAdSenseClientId("ca-pub-demo"), "");
  assert.equal(normalizeAdSenseClientId(""), "");
});

test("reads AdSense settings while keeping ads disabled by default", () => {
  const disabled = getAdSenseSettings({});
  assert.equal(disabled.enabled, false);
  assert.equal(disabled.clientId, "");
  assert.equal(isAdSenseReady("123", disabled), false);

  const enabled = getAdSenseSettings({
    NEXT_PUBLIC_ENABLE_ADSENSE: "true",
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: "ca-pub-1234567890123456",
    NEXT_PUBLIC_ADSENSE_HOME_SLOT: " 1112223334 ",
    NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT: "5556667778",
  });
  assert.equal(enabled.enabled, true);
  assert.equal(enabled.clientId, "ca-pub-1234567890123456");
  assert.equal(enabled.homeSlot, "1112223334");
  assert.equal(enabled.inArticleSlot, "5556667778");
  assert.equal(isAdSenseReady(enabled.homeSlot, enabled), true);
  assert.equal(isAdSenseReady("", enabled), false);
});

test("normalizes ads.txt publisher IDs from pub and ca-pub formats", () => {
  assert.equal(normalizePublisherId(" pub-1234567890123456 "), "pub-1234567890123456");
  assert.equal(normalizePublisherId("ca-pub-1234567890123456"), "pub-1234567890123456");
  assert.equal(normalizePublisherId("ca-pub-demo"), "");
  assert.equal(normalizePublisherId(""), "");
});

test("ads.txt route returns a Google seller line when publisher ID is configured", async () => {
  const original = {
    ADSENSE_PUBLISHER_ID: process.env.ADSENSE_PUBLISHER_ID,
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
    NEXT_PUBLIC_ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  };

  try {
    process.env.ADSENSE_PUBLISHER_ID = "pub-1234567890123456";
    delete process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

    const response = GET();
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await response.text(), "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n");
  } finally {
    if (original.ADSENSE_PUBLISHER_ID === undefined) {
      delete process.env.ADSENSE_PUBLISHER_ID;
    } else {
      process.env.ADSENSE_PUBLISHER_ID = original.ADSENSE_PUBLISHER_ID;
    }

    if (original.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID = original.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
    }

    if (original.NEXT_PUBLIC_ADSENSE_CLIENT_ID === undefined) {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    } else {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID = original.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    }
  }
});

test("buyer guides provide enough original article structure for crawlable content", () => {
  assert.ok(guides.length >= 4);
  assert.ok(getGuide("used-car-red-flags"));

  for (const guide of guides) {
    assert.match(guide.slug, /^[a-z0-9-]+$/);
    assert.ok(guide.title.length > 20);
    assert.ok(guide.description.length > 60);
    assert.ok(guide.quickChecks.length >= 4);
    assert.ok(guide.sections.length >= 3);

    for (const section of guide.sections) {
      assert.ok(section.heading.length > 10);
      assert.ok(section.body.length >= 2);
      assert.ok(section.body.every((paragraph) => paragraph.length > 80));
    }
  }
});
