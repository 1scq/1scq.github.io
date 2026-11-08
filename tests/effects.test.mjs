import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const source = await readFile(new URL("../src/flow/effects.js", import.meta.url), "utf8");
const { EFFECT_IDS, chooseEffect } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("all nineteen effects are present locally", async () => {
  assert.equal(EFFECT_IDS.length, 19);
  assert.equal(new Set(EFFECT_IDS).size, 19);
  for (const id of EFFECT_IDS) {
    await access(new URL(`../src/flow/${id === "flow" ? "flow" : `effects/${id}`}.js`, import.meta.url));
  }
});

test("random selection reaches every effect and excludes the previous one", () => {
  const reached = new Set();
  for (let i = 0; i < 120; i++) reached.add(chooseEffect(undefined, () => i / 120));
  assert.equal(reached.size, 19);
  for (const previous of EFFECT_IDS) {
    for (let i = 0; i <= 100; i++) {
      const next = chooseEffect(previous, () => i / 100);
      assert.ok(EFFECT_IDS.includes(next));
      assert.notEqual(next, previous);
    }
  }
});
