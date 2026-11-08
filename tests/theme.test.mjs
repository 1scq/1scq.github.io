import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/theme.js", import.meta.url), "utf8");
function setup({ saved = null, dark = false, blocked = false } = {}) {
  const events = {}, mediaEvents = {};
  const root = { dataset: {}, style: {} };
  const buttons = ['system', 'light', 'dark'].map(value => ({
    dataset: { value }, attrs: {}, setAttribute(name, value) { this.attrs[name] = value; }
  }));
  const media = { matches: dark, addEventListener: (type, fn) => mediaEvents[type] = fn };
  const storage = new Map([["homepage-theme", saved]]);
  const env = {
    window: { matchMedia: () => media, addEventListener: (type, fn) => events[type] = fn, dispatchEvent() {} },
    document: { documentElement: root, querySelectorAll: () => buttons, addEventListener: (type, fn) => events[type] = fn },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    localStorage: {
      getItem: (key) => { if (blocked) throw Error("blocked"); return storage.get(key); },
      setItem: (key, value) => { if (blocked) throw Error("blocked"); storage.set(key, value); },
    },
  };
  vm.runInNewContext(source, env);
  const initial = root.dataset.theme;
  events.DOMContentLoaded();
  return { root, storage, initial, selected: () => buttons.find(item => item.attrs["aria-checked"] === "true")?.dataset.value,
    choose(value) { events.themepreference({ detail: { preference: value } }); },
    system(value) { media.matches = value; mediaEvents.change(); },
    sync(value, key = "homepage-theme") { events.storage({ key, newValue: value }); },
  };
}

test("first paint follows the system and responds to appearance changes", () => {
  const s = setup({ dark: true });
  assert.equal(s.initial, "dark");
  assert.equal(s.selected(), "system");
  s.system(false);
  assert.equal(s.root.dataset.theme, "light");
});

test("manual choices persist and override the system until System is chosen", () => {
  const s = setup({ saved: "light", dark: true });
  assert.equal(s.initial, "light");
  s.choose("dark");
  assert.equal(s.storage.get("homepage-theme"), "dark");
  s.system(false);
  assert.equal(s.root.dataset.theme, "dark");
  s.choose("system");
  assert.equal(s.root.dataset.theme, "light");
  s.system(true);
  assert.equal(s.root.dataset.theme, "dark");
});

test("invalid preferences and unavailable storage still allow switching", () => {
  assert.equal(setup({ saved: "invalid", dark: true }).initial, "dark");
  const s = setup({ blocked: true });
  s.choose("dark");
  assert.equal(s.root.style.colorScheme, "dark");
});

test("other tabs synchronize preference changes and storage resets", () => {
  const s = setup({ saved: "dark" });
  s.sync("light", "unrelated");
  assert.equal(s.selected(), "dark");
  s.sync("light");
  assert.equal(s.selected(), "light");
  assert.equal(s.root.dataset.theme, "light");
  s.sync(null, null);
  assert.equal(s.selected(), "system");
});
