import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = (await readFile(new URL('../src/flow/effects/antigravity.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/m, '').replaceAll('export ', '');

function setup({ reduced = false, supported = true, width = 390, height = 844 } = {}) {
  const pending = new Map(), uniforms = new Map();
  let next = 0, draws = 0, deleted = 0, intersection, resizeCallback, particles = [], palette = [], count = 0;
  const events = () => {
    const handlers = new Map();
    return { handlers, addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const names = ['uTime', 'uHue', 'uCharge', 'uCursor', 'uRing', 'uReveal'];
  const gl = new Proxy({
    getShaderParameter: () => true,
    getProgramParameter: (_, flag) => flag === 'ACTIVE_UNIFORMS' ? names.length : true,
    getActiveUniform: (_, index) => ({ name: names[index] }),
    getUniformLocation: (_, name) => name,
    uniform1f: (name, value) => uniforms.set(name, value),
    uniform2f: (name, x, y) => uniforms.set(name, [x, y]),
    bufferSubData: (_, __, data) => { particles = Array.from(data); },
    texImage2D: (...args) => { palette = Array.from(args.at(-1)); },
    drawArraysInstanced: (_, __, ___, total) => { draws++; count = total; },
    deleteBuffer: () => deleted++, isContextLost: () => false
  }, { get(obj, name) {
    if (name in obj) return obj[name];
    if (/^[A-Z_0-9]+$/.test(name)) return name;
    if (name.startsWith('create')) return () => ({});
    return () => {};
  }});
  const canvas = { ...events(), width: 0, height: 0, clientWidth: width,
    getContext: () => supported ? gl : null,
    getBoundingClientRect: () => ({ left: 0, top: 0, right: width, bottom: height, width, height }) };
  const document = { ...events(), visibilityState: 'visible', documentElement: events() };
  const media = { ...events(), matches: reduced };
  const window = { ...events(), devicePixelRatio: 3, matchMedia: () => media };
  const env = vm.createContext({ canvas, document, window, console, Float32Array, Uint8Array,
    performance: { now: () => 0 },
    hslToRgb: value => value?.includes('100%') ? '255, 255, 255' : '17, 17, 17',
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { constructor(fn) { resizeCallback = fn; } observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(`${source}\nglobalThis.animation = mount(canvas);`, env);
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { env, canvas, document, window, media, pending, uniforms, tick,
    draws: () => draws, deleted: () => deleted, particles: () => particles,
    palette: () => palette, count: () => count,
    visible: value => intersection([{ isIntersecting: value }]),
    resize(w, h) { width = w; height = h; canvas.clientWidth = w; resizeCallback(); } };
}

const energy = values => values.reduce((sum, value, index) => sum + (index % 4 >= 2 ? value * value : 0), 0);

test('holding charges and releasing bursts; pointer cancellation avoids a burst', () => {
  const s = setup();
  s.window.handlers.get('pointerdown')({ clientX: 195, clientY: 422, pointerType: 'mouse', button: 0 });
  for (let t = 40; t <= 1000; t += 40) s.tick(t);
  assert.ok(s.uniforms.get('uCharge') > 0.9);
  const before = energy(s.particles());
  s.window.handlers.get('pointerup')({ pointerType: 'mouse' });
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.ok(energy(s.particles()) > before * 2);
  s.window.handlers.get('pointerdown')({ clientX: 195, clientY: 422 });
  const cancelBefore = s.particles();
  s.window.handlers.get('pointercancel')();
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.deepEqual(s.particles(), cancelBefore);
  s.env.animation.destroy();
});

test('pause and live theme changes preserve particle positions and timeline', () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const before = s.particles(), time = s.uniforms.get('uTime');
  const palette = s.palette();
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.notDeepEqual(s.palette(), palette);
  assert.deepEqual(s.particles(), before);
  assert.equal(s.uniforms.get('uTime'), time);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  s.visible(false);
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.document.visibilityState = 'hidden';
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 0);
  s.document.visibilityState = 'visible';
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.equal(s.pending.size, 0);
  assert.equal(s.deleted(), 3);
  for (const target of [s.window, s.canvas, s.media, s.document, s.document.documentElement]) assert.equal(target.handlers.size, 0);
});

test('reduced motion starts with visible static particles and rejects interactive motion', () => {
  const s = setup({ reduced: true });
  assert.equal(s.uniforms.get('uReveal'), 1);
  assert.ok(s.particles().some(value => value !== 0));
  const before = s.particles();
  s.window.handlers.get('pointerdown')({ clientX: 50, clientY: 200 });
  s.window.handlers.get('pointermove')({ clientX: 50, clientY: 200 });
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.deepEqual(s.particles(), before);
  assert.equal(s.pending.size, 0);
  s.media.handlers.get('change')({ matches: false });
  assert.equal(s.pending.size, 1);
  s.tick(40);
  s.media.handlers.get('change')({ matches: true });
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});

for (const [width, height] of [[390, 844], [2560, 1440]]) {
  test(`particle simulation remains finite during interaction at ${width}×${height}`, () => {
    const s = setup({ width, height });
    assert.ok(s.canvas.width * s.canvas.height <= 2.4e6 + 3000);
    assert.equal(s.count(), width < 600 ? 1000 : 1500);
    for (let t = 50; t <= 2000; t += 50) {
      s.window.handlers.get('pointermove')({ clientX: (t / 2000) * width, clientY: height / 2 });
      s.tick(t);
      assert.ok(s.particles().every(Number.isFinite));
    }
    s.env.animation.destroy();
  });
}

test('context restoration retains theme and pause; absent WebGL allows fallback', () => {
  const s = setup();
  s.env.animation.setPaused(true);
  s.env.animation.setColors({ paper: '240 6% 7%' });
  const palette = s.palette();
  s.canvas.handlers.get('webglcontextlost')({ preventDefault() {} });
  assert.equal(s.pending.size, 0);
  s.canvas.handlers.get('webglcontextrestored')();
  assert.deepEqual(s.palette(), palette);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.throws(() => setup({ supported: false }), /requires WebGL 2/);
});

test('resizing recenters and settles the ring without retaining a burst or offscreen cursor', () => {
  const s = setup({ width: 1440, height: 900 });
  s.window.handlers.get('pointerdown')({ clientX: 1300, clientY: 700 });
  for (let t = 40; t <= 800; t += 40) s.tick(t);
  s.window.handlers.get('pointerup')({ pointerType: 'mouse' });
  s.env.animation.setPaused(true);
  s.resize(390, 844);
  assert.equal(s.count(), 1000);
  assert.deepEqual(s.uniforms.get('uCursor'), [195, 422]);
  assert.equal(s.uniforms.get('uCharge'), 0);
  assert.ok(s.particles().every(Number.isFinite));
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});
