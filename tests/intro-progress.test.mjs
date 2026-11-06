import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/flow/intro-progress.js", import.meta.url), "utf8");
const { introProgress, introAppearance } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("scroll progress clamps overscroll and completes when the homepage reaches the top", () => {
  assert.equal(introProgress(-20, 800), 0);
  assert.equal(introProgress(400, 800), 0.5);
  assert.equal(introProgress(800, 800), 1);
  assert.equal(introProgress(1600, 800), 1);
  assert.equal(introProgress(0, 0), 0);
});

test("the opening starts visible and fully releases the homepage at the end", () => {
  const start = introAppearance(0);
  assert.equal(start.copyOpacity, 1);
  assert.equal(start.stageOpacity, 1);
  assert.equal(start.effectOpacity, 1);
  const end = introAppearance(1);
  assert.equal(end.copyOpacity, 0);
  assert.equal(end.stageOpacity, 0);
  assert.equal(end.effectOpacity, 0);
  assert.equal(end.hintOpacity, 0);
});

test("the reveal stays continuous, bounded, and reverses with scrolling", () => {
  let previous = introAppearance(0);
  for (let index = 1; index <= 100; index++) {
    const current = introAppearance(index / 100);
    for (const key of ["copyOpacity", "effectOpacity", "hintOpacity", "stageOpacity"]) {
      assert.ok(current[key] >= 0 && current[key] <= 1);
      assert.ok(current[key] <= previous[key]);
      assert.ok(Math.abs(current[key] - previous[key]) < 0.08);
    }
    previous = current;
  }
  assert.deepEqual(introAppearance(0.4), introAppearance(introProgress(320, 800)));
});
