import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = (await readFile(new URL('../src/flow/effects/grid-scan.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/m, '').replaceAll('export ', '');

function setup({ reduced = false, supported = true, width = 390, height = 844 } = {}) {
  const pending = new Map(), uniforms = new Map();
  let next = 0, draws = 0, deleted = 0, intersection;
  const events = () => {
    const handlers = new Map();
    return { handlers, addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const names = ['uTime', 'uLight', 'uPing', 'uPingAlpha', 'uEye', 'uScanZ', 'uScanAlpha', 'uLineColor', 'uScanColor'];
  const save = (name, ...values) => {
    const value = values.length === 1 ? values[0] : values;
    uniforms.set(name, typeof value === 'number' ? value : Array.from(value));
  };
  const gl = new Proxy({
    getShaderParameter: () => true,
    getProgramParameter: (_, flag) => flag === 'ACTIVE_UNIFORMS' ? names.length : true,
    getActiveUniform: (_, index) => ({ name: names[index] }),
    getUniformLocation: (_, name) => name,
    drawArrays: () => draws++, deleteTexture: () => deleted++,
    uniform1f: save, uniform1fv: save, uniform3f: save, uniform3fv: save, uniform4fv: save
  }, { get(obj, name) {
    if (name in obj) return obj[name];
    if (/^[A-Z_0-9]+$/.test(name)) return name;
    if (name.startsWith('create')) return () => ({});
    return () => {};
  }});
  const canvas = { ...events(), width: 0, height: 0, clientWidth: width, clientHeight: height,
    getContext: () => supported ? gl : null,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }) };
  const document = { ...events(), hidden: false, documentElement: events() };
  const media = { ...events(), matches: reduced };
  const window = { ...events(), devicePixelRatio: 3, matchMedia: () => media,
    setTimeout: () => 1, clearTimeout() {} };
  const env = vm.createContext({ canvas, document, window, console, Float32Array,
    hslToRgb: value => value?.includes('100%') ? '255, 255, 255' : '17, 17, 17',
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(`${source}\nglobalThis.animation = mount(canvas);`, env);
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { env, canvas, document, window, media, pending, uniforms, tick,
    draws: () => draws, deleted: () => deleted,
    visible: value => intersection([{ isIntersecting: value }]) };
}

test('grid scan suspends while paused, hidden or offscreen and cleans up', () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const before = s.draws();
  s.tick(8000);
  assert.equal(s.draws(), before);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  s.visible(false);
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.document.hidden = true;
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 0);
  s.document.hidden = false;
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.equal(s.pending.size, 0);
  assert.equal(s.deleted(), 4);
  for (const target of [s.window, s.canvas, s.media, s.document, s.document.documentElement]) assert.equal(target.handlers.size, 0);
});

test('reduced motion renders a static room and themes repaint without advancing time', () => {
  const s = setup({ reduced: true });
  const before = s.uniforms.get('uTime');
  assert.ok(s.draws() > 0);
  assert.equal(s.pending.size, 0);
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.equal(s.uniforms.get('uLight'), 0);
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.equal(s.uniforms.get('uLight'), 1);
  assert.equal(s.uniforms.get('uTime'), before);
  s.window.handlers.get('pointerdown')({ clientX: 50, clientY: 200 });
  assert.equal(s.pending.size, 0);
  s.media.handlers.get('change')({ matches: false });
  s.tick(40);
  assert.ok(s.uniforms.get('uTime') > before);
  s.media.handlers.get('change')({ matches: true });
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});

for (const [width, height] of [[390, 844], [2560, 1440]]) {
  test(`click rays and parallax stay finite at ${width}×${height}`, () => {
    const s = setup({ width, height });
    assert.ok(s.canvas.width * s.canvas.height <= 1.8e6 + 2000);
    let now = 40;
    for (const [x, y] of [[0, 0], [width / 2, height / 2], [width, height], [width * 0.9, height * 0.1]]) {
      s.window.handlers.get('pointermove')({ clientX: x, clientY: y });
      s.window.handlers.get('pointerdown')({ clientX: x, clientY: y });
      s.tick(now); now += 40;
      assert.ok(s.uniforms.get('uPing').every(Number.isFinite));
      assert.ok(s.uniforms.get('uEye').every(Number.isFinite));
    }
    assert.ok(s.uniforms.get('uPingAlpha').some(value => value > 0));
    s.env.animation.destroy();
  });
}

test('control clicks do not create wall pings', () => {
  const s = setup();
  s.window.handlers.get('pointerdown')({ clientX: 50, clientY: 200, target: { closest: () => ({}) } });
  s.tick(40);
  assert.ok(s.uniforms.get('uPingAlpha').every(value => value === 0));
  s.env.animation.destroy();
});

test('WebGL restoration rebuilds the room and preserves pause', () => {
  const s = setup();
  s.env.animation.setPaused(true);
  s.env.animation.setColors({ paper: '240 6% 7%' });
  s.canvas.handlers.get('webglcontextlost')({ preventDefault() {} });
  assert.equal(s.pending.size, 0);
  s.canvas.handlers.get('webglcontextrestored')();
  assert.equal(s.uniforms.get('uLight'), 0);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
});

test('unavailable WebGL reports failure to the banner fallback', () => {
  assert.throws(() => setup({ supported: false }), /requires WebGL 2/);
});
