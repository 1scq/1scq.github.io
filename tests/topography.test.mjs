import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = (await readFile(new URL('../src/flow/effects/topography.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/m, '').replaceAll('export ', '');

function setup({ reduced = false, supported = true, floating = true, width = 1440, height = 900 } = {}) {
  const pending = new Map(), uniforms = new Map();
  let next = 0, draws = 0, deleted = 0, intersection, resizeCallback;
  const events = () => {
    const handlers = new Map();
    return { handlers, addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const names = ['uTime', 'uMorph', 'uPulses', 'uViewProj', 'uEye', 'uColor', 'uLightMode', 'uHeat', 'uBrush'];
  const save = (name, ...values) => {
    const value = values.length === 1 ? values[0] : values;
    const list = typeof value === 'number' ? [value] : Array.from(value);
    assert.ok(list.every(Number.isFinite), `finite uniform ${name}`);
    uniforms.set(name, typeof value === 'number' ? value : list);
  };
  const gl = new Proxy({
    getExtension: name => name === 'EXT_color_buffer_float' && floating,
    getShaderParameter: () => true,
    getProgramParameter: (_, flag) => flag === 'ACTIVE_UNIFORMS' ? names.length : true,
    getActiveUniform: (_, index) => ({ name: names[index] }),
    getUniformLocation: (_, name) => name,
    uniform1f: save, uniform2f: save, uniform3fv: save, uniform4fv: save, uniform4f: save,
    uniformMatrix4fv: (name, _, value) => save(name, value),
    drawArrays: () => draws++,
    drawArraysInstanced: (_, __, vertices, instances) => {
      assert.ok(Number.isInteger(vertices) && vertices > 0);
      assert.ok(Number.isInteger(instances) && instances > 0);
      assert.ok(vertices * instances <= 700000);
      draws++;
    },
    deleteTexture: () => deleted++
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
  const window = { ...events(), devicePixelRatio: 3, matchMedia: () => media };
  const env = vm.createContext({ canvas, document, window, console, Float32Array,
    hslToRgb: value => value?.includes('100%') ? '255, 255, 255' : '17, 17, 17',
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { constructor(fn) { resizeCallback = fn; } observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(`${source}\nglobalThis.animation = mount(canvas);`, env);
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { env, canvas, document, window, media, pending, uniforms, tick,
    draws: () => draws, deleted: () => deleted,
    visible: value => intersection([{ isIntersecting: value }]),
    resize(w, h) { width = w; height = h; canvas.clientWidth = w; canvas.clientHeight = h; resizeCallback(); } };
}

test('paused terrain repaints its theme without advancing the map', () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const morph = s.uniforms.get('uMorph'), time = s.uniforms.get('uTime');
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.equal(s.uniforms.get('uLightMode'), 0);
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.equal(s.uniforms.get('uLightMode'), 1);
  assert.deepEqual(s.uniforms.get('uMorph'), morph);
  assert.equal(s.uniforms.get('uTime'), time);
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});

test('terrain suspends out of view or in hidden tabs and cleans up', () => {
  const s = setup();
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
  assert.ok(s.deleted() > 0);
  for (const target of [s.window, s.canvas, s.media, s.document, s.document.documentElement]) assert.equal(target.handlers.size, 0);
});

test('reduced motion renders complete static terrain and rejects pointer motion', () => {
  const s = setup({ reduced: true });
  const before = s.draws();
  const matrix = s.uniforms.get('uViewProj');
  s.window.handlers.get('pointerdown')({ clientX: 600, clientY: 600 });
  s.window.handlers.get('pointermove')({ clientX: 600, clientY: 600 });
  assert.equal(s.draws(), before);
  assert.equal(s.pending.size, 0);
  s.media.handlers.get('change')({ matches: false });
  s.tick(40);
  assert.ok(s.draws() > before);
  assert.deepEqual(s.uniforms.get('uViewProj'), matrix);
  s.media.handlers.get('change')({ matches: true });
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});

for (const [width, height, floating] of [[390, 844, false], [2560, 1440, true]]) {
  test(`terrain has finite geometry and a bounded pixel budget at ${width}×${height}, float targets ${floating}`, () => {
    const s = setup({ width, height, floating });
    assert.ok(s.canvas.width * s.canvas.height <= 1.8e6 + 3000);
    s.window.handlers.get('pointermove')({ clientX: width * 0.6, clientY: height * 0.65 });
    s.window.handlers.get('pointerdown')({ clientX: width * 0.6, clientY: height * 0.65 });
    s.tick(40); s.tick(80);
    assert.ok(s.uniforms.get('uPulses').some(value => value !== 0));
    s.resize(390, 844);
    s.tick(120);
    assert.ok(s.draws() > 10);
    s.env.animation.destroy();
  });
}

test('WebGL restoration preserves paused theme and unavailable WebGL allows fallback', () => {
  const s = setup();
  s.env.animation.setPaused(true);
  s.env.animation.setColors({ paper: '240 6% 7%' });
  s.canvas.handlers.get('webglcontextlost')({ preventDefault() {} });
  assert.equal(s.pending.size, 0);
  s.canvas.handlers.get('webglcontextrestored')();
  assert.equal(s.uniforms.get('uLightMode'), 0);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
  assert.throws(() => setup({ supported: false }), /requires WebGL 2/);
});
