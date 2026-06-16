import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// Guardrail: the old British-racing-green palette must never creep back into the
// source after the Warm Editorial Luxury redesign. If any of these literals
// reappear, a color regression has happened — fix it, don't update this list.
const FORBIDDEN: { pattern: RegExp; name: string }[] = [
  { pattern: /#123d33/i, name: "racing green #123d33" },
  { pattern: /#0f8f5e/i, name: "fx green #0f8f5e" },
  { pattern: /#2fc08c/i, name: "fx green #2fc08c" },
  { pattern: /#19c986/i, name: "fx green #19c986" },
  { pattern: /#0b0d10/i, name: "cold ink #0b0d10" },
  { pattern: /rgba\(\s*18\s*,\s*61\s*,\s*51/i, name: "racing green rgb(18,61,51)" },
  { pattern: /rgba\(\s*47\s*,\s*192\s*,\s*140/i, name: "fx green rgb(47,192,140)" },
  { pattern: /rgba\(\s*201\s*,\s*168\s*,\s*106/i, name: "old champagne rgb(201,168,106)" },
];

const ROOTS = ["src", "public"];
const EXTS = new Set([".ts", ".tsx", ".css", ".svg", ".json"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if ([...EXTS].some((e) => full.endsWith(e))) out.push(full);
  }
  return out;
}

test("no old racing-green / dark-green palette literals remain in source", () => {
  const files = ROOTS.flatMap((r) => walk(r));
  const offenders: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const { pattern, name } of FORBIDDEN) {
      if (pattern.test(text)) offenders.push(`${file}: ${name}`);
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Off-brand palette literals found (Warm Editorial Luxury only):\n${offenders.join("\n")}`
  );
});

test("core warm tokens are defined in globals.css", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  for (const token of ["--racing-green: #a8542e", "--canvas: #fcfbf8", "--champagne: #a98253"]) {
    assert.ok(css.includes(token), `globals.css missing warm token: ${token}`);
  }
});
