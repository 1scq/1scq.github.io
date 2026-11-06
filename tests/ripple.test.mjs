import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const kit = (await readFile(new URL("../src/flow/flow-stage.js", import.meta.url), "utf8")).replaceAll("export ", "");
const ripple = (await readFile(new URL("../src/flow/ripple.js", import.meta.url), "utf8"))
  .replace(/^import .*;$/m, "").replaceAll("export ", "");

for (const [width, height] of [[1440, 900], [360, 780]]) {
  test(`water stays finite and clicking creates red wave crests at ${width}×${height}`, () => {
    let points = 0;
    let red = 0;
    const finite = (...values) => { assert.ok(values.every(Number.isFinite)); points++; };
    const env = vm.createContext({
      ctx: { beginPath() {}, closePath() {}, moveTo: finite, lineTo: finite, stroke() {}, fill() {} },
      width, height,
      red: () => { red++; return "#be123c"; },
    });
    vm.runInContext(`${kit}\nstage = (_, scene) => { globalThis.scene = scene; return {}; };\n${ripple}\nmount({});\nglobalThis.draw = (t, still = false) => scene.frame({ctx, w: width, h: height, t, ptr: {inside: false}, ink: () => '#333', red, paper: '#fff', still});\ndraw(5200);\nscene.click(width * 0.5, height * 0.65, 5200);\ndraw(5500);\ndraw(6000);\ndraw(5200, true);`, env);
    assert.ok(points > 1000);
    assert.ok(red > 0);
    vm.runInContext("draw(15000);", env);
  });
}
