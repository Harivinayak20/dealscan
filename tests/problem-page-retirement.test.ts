import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("legacy problem-year pages redirect without generating duplicate pages", () => {
  const config = read("next.config.ts");
  const middleware = read("middleware.ts");
  const problemPage = new URL("../src/app/cars/[slug]/problems/[year]/page.tsx", import.meta.url);

  assert.match(config, /source:\s*"\/cars\/:slug\/problems\/:year\(\\\\d\{4\}\)"/);
  assert.match(config, /destination:\s*"\/cars\/:slug\/years-to-avoid"/);
  assert.match(middleware, /legacyProblemPage/);
  assert.equal(existsSync(problemPage), false);
});
