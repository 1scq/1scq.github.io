import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = (await readFile(new URL('../src/flow/effects/splash-cursor.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/m, '').replaceAll('export ', '');

function setup({ reduced = false, supported = true, width = 390, height = 844, floating = true } = {}) {
  const pending = new Map(), uniforms = new Map();
  let next = 0, draws = 0, deleted = 0, intersection;
  const events = () => {
    const handlers = new Map();
    return { handlers, addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const names = ['light', 'dt', 'strength', 'colorA', 'colorB'];
  const save = (name, ...values) => {
    const value = values.length === 1 ? values[0] : values;
    uniforms.set(name, typeof value === 'number' ? value : Array.from(value));
  };
  const gl = new Proxy({
    getShaderParameter: () => true,
    checkFramebufferStatus: () => floating ? "FRAMEBUFFER_COMPLETE" : "INCOMPLETE",
    isContextLost: () => false,
    getProgramParameter: (_, flag) => flag === 'ACTIVE_UNIFORMS' ? names.length : true,
    getActiveUniform: (_, index) => ({ name: names[index] }),
    getUniformLocation: (_, name) => name,
    drawArrays: () => draws++, deleteTexture: () => deleted++,
    uniform1f: save, uniform1fv: save, uniform3f: save, uniform3fv: save, uniform3f: save, uniform4fv: save
  }, { get(obj, name) {
    if (name === "drawingBufferWidth") return canvas.width;
    if (name === "drawingBufferHeight") return canvas.height;
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
    performance: { now: () => 0 },
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


test('splash input injects fluid, while pause and hidden/offscreen states stop it', () => {
  const s = setup();
  s.window.handlers.get('pointerdown')({ clientX: 120, clientY: 300, button: 0 });
  s.tick(40);
  assert.equal(s.uniforms.get('strength'), 1100);
  s.env.animation.setPaused(true);
  const before = s.draws();
  s.window.handlers.get('pointerdown')({ clientX: 120, clientY: 300, button: 0 });
  s.tick(1000);
  assert.equal(s.draws(), before);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  s.visible(false);
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.document.hidden = true;
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
  for (const target of [s.window, s.media, s.canvas, s.document, s.document.documentElement]) assert.equal(target.handlers.size, 0);
});

test('reduced motion keeps visible fluid still and theme changes do not simulate', () => {
  const s = setup({ reduced: true });
  assert.ok(s.draws() > 0);
  assert.equal(s.pending.size, 0);
  const dt = s.uniforms.get('dt');
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.equal(s.uniforms.get('light'), 0);
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.equal(s.uniforms.get('light'), 1);
  assert.equal(s.uniforms.get('dt'), dt);
  assert.equal(s.pending.size, 0);
  s.media.handlers.get('change')({ matches: false });
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
});

test('fluid texture formats and WebGL are checked before mounting', () => {
  assert.throws(() => setup({ supported: false }), /requires WebGL 2/);
  assert.throws(() => setup({ floating: false }), /floating-point/);
});

test('context restoration retains theme and pause and respects the mobile pixel cap', () => {
  const s = setup({ width: 390, height: 844 });
  assert.ok(s.canvas.width * s.canvas.height <= 1.8e6 + 2000);
  s.env.animation.setPaused(true);
  s.env.animation.setColors({ paper: '240 6% 7%' });
  s.canvas.handlers.get('webglcontextlost')({ preventDefault() {} });
  s.canvas.handlers.get('webglcontextrestored')();
  assert.equal(s.uniforms.get('light'), 0);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
});
