import assert from "node:assert/strict";
import test from "node:test";

import { checkRateLimit } from "../src/lib/rate-limit.ts";

test("local rate-limit fallback isolates counters by route", async () => {
  const headers = { "cf-connecting-ip": "203.0.113.42" };
  const request = (path: string) => new Request("http://localhost" + path, { headers });

  const first = await checkRateLimit(request("/api/example"), 2);
  const second = await checkRateLimit(request("/api/example"), 2);
  const blocked = await checkRateLimit(request("/api/example"), 2);

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(blocked.allowed, false);

  const otherRoute = await checkRateLimit(request("/api/other"), 2);
  assert.equal(otherRoute.allowed, true);
});
