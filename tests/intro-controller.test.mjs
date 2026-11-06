import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const controller = (await readFile(new URL("../src/flow/banner.js", import.meta.url), "utf8"))
  .replace(/^import .*;\n/gm, "");
const math = (await readFile(new URL("../src/flow/intro-progress.js", import.meta.url), "utf8"))
  .replaceAll("export ", "");

function setup() {
  let top = 0;
  let frame;
  const events = new Map();
  const properties = new Map();
  const classes = new Set();
  const media = { matches: false, addEventListener() {} };
  const toggle = { addEventListener() {}, hidden: true };
  const animation = { setColors() {}, setPaused(value) { this.paused = value; } };
  const intro = {
    offsetHeight: 800,
    classList: { add: (key) => classes.add(key), toggle: (key, on) => on ? classes.add(key) : classes.delete(key) },
    style: { setProperty: (key, value) => properties.set(key, value) },
    getBoundingClientRect: () => ({ top }),
    querySelector: (key) => key === ".flow-toggle" ? toggle : { addEventListener() {} },
  };
  const env = vm.createContext({
    document: { querySelector: (key) => key === "#intro" ? intro : { getContext: () => ({}) } },
    window: { addEventListener: (key, fn) => events.set(key, fn) },
    matchMedia: () => media,
    mount: () => animation,
    requestAnimationFrame: (fn) => { frame = fn; return 1; },
  });
  vm.runInContext(`${math}\n${controller}`, env);
  const scroll = (distance) => { top = -distance; events.get("scroll")(); frame(); };
  return { intro, classes, properties, animation, media, scroll };
}

test("scrolling down releases the homepage and scrolling back restores the opening", () => {
  const s = setup();
  assert.equal(s.properties.get("--effect-opacity"), 1);
  s.scroll(400);
  assert.equal(s.properties.get("--copy-opacity") < 1, true);
  assert.equal(s.animation.paused, false);
  s.scroll(800);
  assert.equal(s.properties.get("--effect-opacity"), 0);
  assert.equal(s.animation.paused, true);
  assert.equal(s.intro.inert, true);
  assert.equal(s.classes.has("is-exited"), true);
  assert.equal(s.properties.get("--stage-opacity"), 0);
  s.scroll(400);
  assert.equal(s.properties.get("--copy-opacity") < 1, true);
  assert.equal(s.animation.paused, false);
  assert.equal(s.intro.inert, false);
  assert.equal(s.classes.has("is-exited"), false);
  s.scroll(0);
  assert.equal(s.properties.get("--stage-opacity"), 1);
});

test("reduced motion keeps the opening static during ordinary page scrolling", () => {
  const s = setup();
  s.media.matches = true;
  s.scroll(800);
  assert.equal(s.properties.get("--effect-opacity"), 1);
  assert.equal(s.intro.inert, false);
});
