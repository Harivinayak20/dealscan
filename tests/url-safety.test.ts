import assert from "node:assert/strict";
import test from "node:test";
import { parseSafeHttpUrl } from "../src/lib/url-safety.ts";

test("parseSafeHttpUrl accepts public http URLs", () => {
  assert.equal(parseSafeHttpUrl("https://example.com/listing").hostname, "example.com");
});

test("parseSafeHttpUrl blocks private and local URLs", () => {
  for (const url of [
    "http://localhost:3000",
    "http://127.0.0.1/admin",
    "http://10.0.0.5/listing",
    "http://172.16.1.10/listing",
    "http://192.168.1.2/listing",
    "http://[::1]/listing",
    "http://[::ffff:127.0.0.1]/listing",
    "http://[::ffff:10.0.0.5]/listing",
    "http://2130706433/listing",
    "http://0x7f000001/listing",
  ]) {
    assert.throws(() => parseSafeHttpUrl(url), /blocked|private/i);
  }
});

test("parseSafeHttpUrl blocks unsupported protocols and credentials", () => {
  assert.throws(() => parseSafeHttpUrl("file:///etc/passwd"), /http/i);
  assert.throws(() => parseSafeHttpUrl("https://user:pass@example.com/listing"), /credentials/i);
});
