import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const controller = (await readFile(new URL("../src/flow/banner.js", import.meta.url), "utf8"))
  .replace(/^import .*;\n/gm, "");
const math = (await readFile(new URL("../src/flow/intro-progress.js", import.meta.url), "utf8"))
  .replaceAll("export ", "");

async function setup() {
  let top = 0;
  let frame;
  const events = new Map();
  const properties = new Map();
  const classes = new Set();
  const media = { matches: false, addEventListener() {} };
  const toggle = { addEventListener() {}, hidden: true };
  const animation = { setScatter(value) { this.scatter = value; }, setColors() {}, setPaused(value) { this.paused = value; } };
  const intro = {
    offsetHeight: 800,
    dataset: {},
    classList: { add: (key) => classes.add(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) },
    style: { setProperty: (key, value) => properties.set(key, value) },
    getBoundingClientRect: () => ({ top }),
    querySelector: (key) => key === ".flow-toggle" ? toggle : { addEventListener() {} },
  };
  const env = vm.createContext({
    document: { querySelector: (key) => key === "#intro" ? intro : { getContext: () => ({}) } },
    window: { addEventListener: (key, fn) => events.set(key, fn) },
    matchMedia: () => media,
    loadEffect: async () => ({id: "flow", mount: () => animation}),
    requestAnimationFrame: (fn) => { frame = fn; return 1; },
  });
  await vm.runInContext(`${math}\n${controller}\nready;`, env);
  const scroll = (distance) => { top = -distance; events.get("scroll")(); frame(); };
  return { intro, classes, properties, animation, media, scroll };
}

test("scrolling down releases the homepage and scrolling back restores the opening", async () => {
  const s = await setup();
  assert.equal(s.properties.get("--effect-opacity"), 1);
  s.scroll(400);
  assert.equal(s.animation.scatter, 0.5);
  assert.equal(s.properties.get("--stage-clip"), "400px");
  assert.equal(s.properties.get("--copy-opacity") < 1, true);
  assert.equal(s.animation.paused, false);
  s.scroll(800);
  assert.equal(s.properties.get("--effect-opacity"), 0);
  assert.equal(s.animation.paused, true);
  assert.equal(s.intro.inert, true);
  assert.equal(s.classes.has("is-exited"), true);
  assert.equal(s.properties.get("--stage-clip"), "800px");
  assert.equal(s.properties.get("--stage-opacity"), 0);
  s.scroll(400);
  assert.equal(s.properties.get("--copy-opacity") < 1, true);
  assert.equal(s.animation.paused, false);
  assert.equal(s.intro.inert, false);
  assert.equal(s.classes.has("is-exited"), false);
  s.scroll(0);
  assert.equal(s.properties.get("--stage-opacity"), 1);
  assert.equal(s.properties.get("--stage-clip"), "0px");
});

test("reduced motion still releases the homepage and restores the opening on return", async () => {
  const s = await setup();
  s.media.matches = true;
  s.scroll(800);
  assert.equal(s.properties.get("--effect-opacity"), 0);
  assert.equal(s.animation.scatter, 0);
  assert.equal(s.animation.paused, true);
  assert.equal(s.intro.inert, true);
  s.scroll(0);
  assert.equal(s.properties.get("--stage-opacity"), 1);
  assert.equal(s.properties.get("--copy-offset"), "0px");
  assert.equal(s.animation.paused, false);
  assert.equal(s.intro.inert, false);
});
