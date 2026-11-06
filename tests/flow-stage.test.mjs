import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = (await readFile(new URL("../src/flow/flow-stage.js", import.meta.url), "utf8"))
  .replaceAll("export ", "");

function setup(reduced = false) {
  const frames = [];
  const pending = new Map();
  const handlers = new Map();
  let nextId = 0;
  let destroyed = 0;
  let intersection;
  const media = { matches: reduced, addEventListener: (_, fn) => handlers.set("reduce", fn), removeEventListener() {} };
  const context = new Proxy({}, { get: (_, name) => name === "setLineDash" || name === "setTransform" || name === "fillRect" ? () => {} : undefined, set: () => true });
  const document = { hidden: false, addEventListener: (name, fn) => handlers.set(name, fn), removeEventListener: (name) => handlers.delete(name) };
  const canvas = { clientWidth: 900, clientHeight: 160, getContext: () => context, addEventListener: (name, fn) => handlers.set(name, fn), removeEventListener: (name) => handlers.delete(name) };
  const env = vm.createContext({
    console, performance, document,
    window: { devicePixelRatio: 2, addEventListener() {}, removeEventListener() {} },
    matchMedia: () => media,
    requestAnimationFrame: (fn) => { pending.set(++nextId, fn); return nextId; },
    cancelAnimationFrame: (id) => pending.delete(id),
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() { destroyed++; } },
    ResizeObserver: class { observe() {} disconnect() { destroyed++; } },
    canvas,
    scene: { frame: (frame) => frames.push(frame), stillT: 5000 },
  });
  vm.runInContext(`${source}\nglobalThis.animation = stage(canvas, scene);`, env);
  const tick = (time) => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach((fn) => fn(time)); };
  return { env, document, handlers, frames, pending, tick, visible: (value) => intersection([{ isIntersecting: value }]), destroyed: () => destroyed };
}

test("runs only in view, pauses, and resumes without advancing through paused time", () => {
  const s = setup();
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.tick(100);
  const before = s.frames.at(-1).t;
  s.env.animation.setPaused(true);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  s.tick(10000);
  assert.equal(s.frames.at(-1).t - before, 16);
  s.visible(false);
  assert.equal(s.pending.size, 0);
});

test("suspends when the tab is hidden and cleans up on destruction", () => {
  const s = setup();
  s.visible(true);
  s.document.hidden = true;
  s.handlers.get("visibilitychange")();
  assert.equal(s.pending.size, 0);
  s.document.hidden = false;
  s.handlers.get("visibilitychange")();
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.equal(s.pending.size, 0);
  assert.equal(s.destroyed(), 2);
  assert.equal(s.handlers.has("visibilitychange"), false);
});

test("reduced motion renders finished artwork without starting an animation", () => {
  const s = setup(true);
  s.visible(true);
  assert.equal(s.pending.size, 0);
  assert.ok(s.frames.every((frame) => frame.still && frame.t === 5000));
  s.handlers.get("reduce")({ matches: false });
  assert.equal(s.pending.size, 1);
  s.handlers.get("reduce")({ matches: true });
  assert.equal(s.pending.size, 0);
});

test("sizes the canvas for both desktop and narrow high-density displays", () => {
  const s = setup();
  assert.equal(s.env.canvas.width, 1800);
  s.env.canvas.clientWidth = 320;
  s.visible(true);
  s.tick(100);
  assert.equal(s.env.canvas.width, 640);
  assert.equal(s.frames.at(-1).w, 320);
});

test("an opening scene can start from finished artwork instead of an empty noise frame", () => {
  const s = setup();
  s.env.scene.startT = 5200;
  s.env.animation.destroy();
  vm.runInContext("globalThis.animation = stage(canvas, scene);", s.env);
  assert.equal(s.frames.at(-1).t, 5200);
  s.visible(true);
  s.tick(100);
  assert.equal(s.frames.at(-1).t, 5216);
});
