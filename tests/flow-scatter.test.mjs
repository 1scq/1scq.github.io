import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const kit = (await readFile(new URL("../src/flow/flow-stage.js", import.meta.url), "utf8")).replaceAll("export ", "");
const flow = (await readFile(new URL("../src/flow/flow.js", import.meta.url), "utf8"))
  .replace(/^import .*;$/m, "").replaceAll("export ", "");

for (const [width, height] of [[1440, 900], [390, 844]]) {
  test(`flow distributions stay finite and scroll scatters outward at ${width}×${height}`, () => {
    let radius = 0;
    let points = 0;
    class Path {
      moveTo(...values) { assert.ok(values.every(Number.isFinite)); }
      lineTo(...values) { assert.ok(values.every(Number.isFinite)); }
      rect(x, y, w, h) {
        assert.ok([x, y, w, h].every(Number.isFinite));
        radius += Math.hypot(x - width / 2, y - height / 2);
        points++;
      }
    }
    const words = [];
    const env = vm.createContext({
      document: { createElement: () => ({ getContext: () => ({
        fillText: (word) => words.push(word),
        getImageData: (_, __, w, h) => {
          const data = new Uint8ClampedArray(w * h * 4);
          for (let y = Math.floor(h * 0.25); y < h * 0.75; y++) {
            for (let x = Math.floor(w * 0.2); x < w * 0.8; x++) data[4 * (y * w + x) + 3] = 255;
          }
          return {data};
        },
      }) }) },
      Path2D: Path,
      ctx: { stroke() {}, fill() {}, beginPath() {}, arc(...values) { assert.ok(values.every(Number.isFinite)); }, setLineDash() {} },
      width, height,
    });
    vm.runInContext(`${kit}\nstage = (_, scene) => { globalThis.scene = scene; return {}; };\n${flow}\nglobalThis.animation = mount({});\nglobalThis.draw = (t) => scene.frame({ctx, w: width, h: height, t, dt: 16, q: 0, ptr: {sx: -9999, sy: -9999, k: 0}, ink: () => '#444', red: () => '#b23', still: false});\ndraw(5200);`, env);
    assert.ok(points > 0);
    assert.deepEqual(words, ["Danny"]);
    const gathered = radius / points;
    radius = points = 0;
    vm.runInContext("animation.setScatter(1); draw(5200);", env);
    assert.ok(radius / points > gathered * 1.5);
    vm.runInContext("animation.setScatter(0); for (const time of [100, 2200, 14300, 23400, 32500]) draw(time);", env);
  });
}
