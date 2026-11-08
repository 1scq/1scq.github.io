import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const source = (await readFile(new URL('../src/rubber-segment.js', import.meta.url), 'utf8')).replaceAll('export ', '');

function setup(reduced = false) {
  const changes = [], frames = [];
  const events = () => ({ handlers: {}, addEventListener(name, fn) { this.handlers[name] = fn; }, removeEventListener(name) { delete this.handlers[name]; } });
  let resize;
  const media = { ...events(), matches: reduced };
  const window = events();
  const thumb = { style: {}, append() {}, animate(keys) { frames.push(keys); return { cancel() {} }; } };
  const items = ['system', 'light', 'dark'].map((value, i) => ({
    dataset: { value }, attrs: {}, innerHTML: value,
    setAttribute(name, value) { this.attrs[name] = value; },
    closest: () => items[i], getBoundingClientRect: () => ({ left: 104 + i * 80, right: 184 + i * 80 }),
    setPointerCapture() {}, releasePointerCapture() {}, focus() {}
  }));
  const track = { ...events(), dataset: {}, getBoundingClientRect: () => ({ left: 100, width: 248 }),
    querySelectorAll: () => items, querySelector: () => thumb };
  const env = vm.createContext({ window, track, document: { createElement: () => ({}) },
    matchMedia: () => media, getComputedStyle: () => ({ clipPath: thumb.style.clipPath || 'none' }),
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() {} },
    onChange: value => changes.push(value) });
  vm.runInContext(`${source}\nglobalThis.control = mountRubberSegment(track,{value:'system',onChange});`, env);
  const fire = (name, data) => track.handlers[name]({ preventDefault() {}, ...data });
  return { control: env.control, track, items, thumb, media, changes, frames, fire, resize,
    selected: () => items.find(item => item.attrs['aria-checked'] === 'true').dataset.value };
}

test('rubber segment animates taps and exposes one keyboard tab stop', () => {
  const s = setup();
  s.fire('click', { target: s.items[2] });
  assert.equal(s.selected(), 'dark');
  assert.deepEqual(s.changes, ['dark']);
  assert.equal(s.frames.at(-1).length, 4);
  assert.deepEqual(s.items.map(item => item.tabIndex), [-1, -1, 0]);
  s.fire('keydown', { key: 'Home' });
  assert.equal(s.selected(), 'system');
  s.fire('keydown', { key: 'ArrowRight' });
  assert.equal(s.selected(), 'light');
  s.control.destroy();
});

test('drag release commits the target and suppresses the subsequent native click', () => {
  const s = setup();
  s.fire('pointerdown', { target: s.items[0], button: 0, pointerId: 1, clientX: 140, clientY: 42, timeStamp: 0 });
  s.fire('pointermove', { pointerId: 1, clientX: 310, timeStamp: 60 });
  s.fire('pointerup', { pointerId: 1, clientX: 310, clientY: 42, timeStamp: 80 });
  s.fire('click', { target: s.items[0] });
  assert.equal(s.selected(), 'dark');
  assert.deepEqual(s.changes, ['dark']);
  s.control.destroy();
});

test('cancel, resize and external updates restore selection without committing a drag', () => {
  const s = setup();
  s.fire('pointerdown', { target: s.items[0], button: 0, pointerId: 1, clientX: 140, clientY: 42, timeStamp: 0 });
  s.fire('pointermove', { pointerId: 1, clientX: 240, timeStamp: 60 });
  s.fire('pointercancel', { pointerId: 1 });
  assert.equal(s.selected(), 'system');
  assert.deepEqual(s.changes, []);
  s.control.setValue('dark');
  s.resize();
  assert.equal(s.selected(), 'dark');
  assert.deepEqual(s.changes, []);
  s.control.destroy();
});

test('reduced motion switches immediately without elastic animation', () => {
  const s = setup(true);
  s.fire('click', { target: s.items[1] });
  assert.equal(s.selected(), 'light');
  assert.equal(s.frames.length, 0);
  s.control.destroy();
});
