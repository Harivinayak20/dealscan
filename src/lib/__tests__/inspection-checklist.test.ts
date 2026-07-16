import assert from "node:assert/strict";
import test from "node:test";
import { inspectionChecklist, totalChecklistItems } from "../inspection-checklist.ts";

test("every group has a non-empty title and at least one item", () => {
  for (const group of inspectionChecklist) {
    assert.ok(group.id.length > 0);
    assert.ok(group.title.length > 0);
    assert.ok(group.items.length > 0, `group ${group.id} should not be empty`);
  }
});

test("group ids are unique", () => {
  const ids = inspectionChecklist.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("item ids are unique across the whole checklist", () => {
  const ids = inspectionChecklist.flatMap((g) => g.items.map((i) => i.id));
  assert.equal(new Set(ids).size, ids.length);
});

test("every item has a non-empty label", () => {
  for (const group of inspectionChecklist) {
    for (const item of group.items) {
      assert.ok(item.label.length > 0, `item ${item.id} should have a label`);
    }
  }
});

test("totalChecklistItems matches the sum of all group items", () => {
  const sum = inspectionChecklist.reduce((acc, g) => acc + g.items.length, 0);
  assert.equal(totalChecklistItems, sum);
  assert.ok(totalChecklistItems >= 35 && totalChecklistItems <= 45);
});
