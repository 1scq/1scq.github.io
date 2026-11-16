import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const source = await readFile(new URL("../src/certificate-viewer.js", import.meta.url), "utf8");
const context = vm.createContext({});
new vm.Script(source).runInContext(context);
const { bindCertificateViewer } = context;

test("local file pages load the certificate viewer as a classic script", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const tag = html.match(/<script\b[^>]*src="\.\/src\/certificate-viewer\.js"[^>]*>/)?.[0];
  assert.ok(tag);
  assert.doesNotMatch(tag, /type\s*=\s*["']module["']/);
  assert.ok(html.indexOf('src="./script.js"') < html.indexOf(tag));
});

function element() {
  const events = {}, attributes = {}, classes = new Set(), animations = [];
  return {
    events, attributes, classes, animations, style: {},
    decode: async () => {},
    getBoundingClientRect: () => ({ left: 100, top: 200, width: 600, height: 400 }),
    animate(frames, options) {
      const animation = { frames, options, finished: Promise.resolve(), cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    },
    classList: { toggle(name, on) { on ? classes.add(name) : classes.delete(name); }, add(name) { classes.add(name); }, remove(name) { classes.delete(name); } },
    addEventListener(name, callback) { events[name] = callback; },
    setAttribute(name, value) { attributes[name] = value; },
    getAttribute(name) { return attributes[name]; },
  };
}

test("certificate animates from its thumbnail, flips, and shrinks back on close", async () => {
  const selectors = Object.fromEntries([".certificate-book", ".certificate-inside", ".certificate-cover img", ".certificate-instruction", ".lightbox-close", ".certificate-backdrop"].map(name => [name, element()]));
  const dialog = element();
  dialog.querySelector = name => selectors[name];
  const covers = [selectors[".certificate-cover img"], element()];
  dialog.querySelectorAll = () => covers;
  dialog.showModal = () => dialog.open = true;
  dialog.close = () => { dialog.open = false; dialog.events.close(); };
  const thumbnail = { src: "inside.jpeg", alt: "Merit Award certificate", getBoundingClientRect: () => ({ left: 20, top: 50, width: 150, height: 100 }) };
  const trigger = { ...element(), dataset: { certificateCover: "cover.jpeg" }, querySelector: () => thumbnail, focus() { this.focused = true; } };
  const root = element();
  const motion = { matches: false };
  bindCertificateViewer({ querySelectorAll: () => [trigger], createElement: () => dialog, body: { append() {} }, documentElement: root,
    defaultView: { matchMedia: () => motion, getComputedStyle: () => ({ transform: "none", opacity: "1" }) } });
  await trigger.events.click();
  const book = selectors[".certificate-book"];
  assert.equal(dialog.open, true);
  assert.equal(selectors[".certificate-inside"].src, "inside.jpeg");
  assert.equal(selectors[".certificate-cover img"].src, "cover.jpeg");
  assert.equal(covers[1].src, "cover.jpeg");
  assert.equal(book.attributes["aria-expanded"], "false");
  assert.equal(book.animations[0].frames[0].transform, "translate(-80px, -150px) scale(0.25, 0.25)");
  assert.equal(book.animations[0].frames[1].transform, "none");
  assert.equal(book.animations[0].options.duration, 440);
  book.events.click();
  assert.equal(book.attributes["aria-expanded"], "true");
  assert.equal(book.classes.has("is-open"), true);
  book.events.click();
  assert.equal(book.attributes["aria-expanded"], "false");
  book.events.click();
  await selectors[".lightbox-close"].events.click();
  assert.equal(book.animations[1].frames[1].transform, "translate(-80px, -150px) scale(0.25, 0.25)");
  assert.equal(book.animations[1].options.duration, 320);
  assert.equal(trigger.focused, true);
  assert.equal(root.classes.has("lightbox-active"), false);
  motion.matches = true;
  await trigger.events.click();
  assert.equal(book.attributes["aria-expanded"], "false");
  assert.equal(book.animations[2].options.duration, 0);
  await selectors[".certificate-backdrop"].events.click();
  assert.equal(dialog.open, false);
  assert.equal(book.animations[3].options.duration, 0);
  await trigger.events.click();
  let prevented = false;
  dialog.events.cancel({ preventDefault() { prevented = true; } });
  await new Promise(setImmediate);
  assert.equal(prevented, true);
  assert.equal(dialog.open, false);
});
