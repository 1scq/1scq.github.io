import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = (await readFile(new URL("../src/flow/effects/liquid-chrome.js", import.meta.url), "utf8"))
  .replace(/^import .*;$/m, "").replaceAll("export ", "");

function setup({ reduced = false, fluid = true, supported = true } = {}) {
  const pending = new Map(), handlers = new Map(), uniforms = new Map();
  let next = 0, draws = 0, deleted = 0, intersection;
  const target = () => ({
    addEventListener: (name, fn) => handlers.set(name, fn),
    removeEventListener: name => handlers.delete(name)
  });
  const names = ["uTime", "uLight", "uTint", "uExposure", "uRipple"];
  const gl = new Proxy({
    getShaderParameter: () => true,
    getProgramParameter: (_, flag) => flag === "ACTIVE_UNIFORMS" ? names.length : true,
    getActiveUniform: (_, index) => ({ name: names[index] }),
    getUniformLocation: (_, name) => name,
    getExtension: () => fluid,
    isContextLost: () => false,
    getShaderInfoLog: () => "", getProgramInfoLog: () => "",
    drawArrays: () => draws++,
    deleteTexture: () => deleted++,
    uniform1f: (name, value) => uniforms.set(name, value)
  }, { get(obj, name) {
    if (name in obj) return obj[name];
    if (/^[A-Z_0-9]+$/.test(name)) return name;
    if (name.startsWith("create")) return () => ({});
    return () => {};
  }});
  const canvas = { ...target(), width: 0, height: 0,
    getContext: () => supported ? gl : null,
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 390, bottom: 844, width: 390, height: 844 }) };
  const document = { ...target(), visibilityState: "visible", documentElement: target() };
  const media = { ...target(), matches: reduced };
  const env = vm.createContext({ canvas, document, console, Uint8Array,
    window: { ...target(), devicePixelRatio: 3, matchMedia: () => media },
    performance: { now: () => 0 },
    hslToRgb: value => value?.includes("100%") ? "255, 255, 255" : "17, 17, 17",
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(`${source}\nglobalThis.animation = mount(canvas);`, env);
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { env, canvas, document, pending, handlers, uniforms, tick,
    draws: () => draws, deleted: () => deleted,
    visible: value => intersection([{ isIntersecting: value }]) };
}

test("chrome freezes when paused, hidden or offscreen, and cleans up", () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const before = s.draws();
  assert.equal(s.pending.size, 0);
  s.tick(4000);
  assert.equal(s.draws(), before);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.visible(false);
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.document.visibilityState = "hidden";
  s.handlers.get("visibilitychange")();
  assert.equal(s.pending.size, 0);
  s.document.visibilityState = "visible";
  s.handlers.get("visibilitychange")();
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.equal(s.pending.size, 0);
  assert.equal(s.handlers.size, 0);
  assert.equal(s.deleted(), 4);
});

test("reduced-motion chrome stays static and can resume when preference changes", () => {
  const s = setup({ reduced: true });
  assert.ok(s.draws() > 0);
  assert.equal(s.pending.size, 0);
  s.env.animation.setColors({ paper: "0 0% 100%" });
  assert.equal(s.pending.size, 0);
  s.handlers.get("change")({ matches: false });
  assert.equal(s.pending.size, 1);
  s.handlers.get("change")({ matches: true });
  assert.equal(s.pending.size, 0);
});

test("mobile resolution is capped and chrome works without float targets", () => {
  const s = setup({ fluid: false });
  assert.equal(s.canvas.width, 585);
  assert.equal(s.canvas.height, 1266);
  s.tick(40);
  assert.ok(s.draws() > 1);
  s.env.animation.destroy();
  assert.equal(s.deleted(), 1);
});

test("context restoration rebuilds resources and preserves pause and theme updates", () => {
  const s = setup();
  s.env.animation.setPaused(true);
  s.env.animation.setColors({ paper: "240 6% 7%" });
  let prevented = false;
  s.handlers.get("webglcontextlost")({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
  assert.equal(s.pending.size, 0);
  s.handlers.get("webglcontextrestored")();
  assert.equal(s.pending.size, 0);
  s.env.animation.setColors({ paper: "0 0% 100%" });
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.tick(80);
  s.env.animation.destroy();
  assert.equal(s.handlers.size, 0);
});

test("missing WebGL reports failure so the banner can use flow", () => {
  assert.throws(() => setup({ supported: false }), /requires WebGL 2/);
});

test("theme updates repaint paused chrome without changing its timeline", () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const time = s.uniforms.get("uTime"), before = s.draws();
  s.env.animation.setColors({ paper: "240 6% 7%" });
  assert.equal(s.uniforms.get("uLight"), 0);
  assert.equal(s.uniforms.get("uExposure"), 0.95);
  s.env.animation.setColors({ paper: "0 0% 100%" });
  assert.equal(s.uniforms.get("uLight"), 1);
  assert.equal(s.uniforms.get("uExposure"), 0.88);
  assert.equal(s.uniforms.get("uTime"), time);
  assert.equal(s.draws(), before + 2);
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});
