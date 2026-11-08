import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as shaders from '../src/flow/effects/aero-shards-shaders.js';
import * as rawShaders from '../src/flow/effects/aero-shards-wgsl.js';

const source = (await readFile(new URL('../src/flow/effects/aero-shards.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/gm, '').replaceAll('export ', '');

async function setup({ reduced = false, supported = true, width = 1440, height = 900 } = {}) {
  const pending = new Map(), frames = [], uploads = [];
  let next = 0, intersection, errorListener, disposed = 0, shardData = [], fallback;
  const events = () => {
    const handlers = new Map();
    return { handlers, addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const canvas = { ...events(), clientWidth: width, clientHeight: height,
    getBoundingClientRect: () => ({ left: 0, top: 0, right: width, bottom: height, width, height }),
    cloneNode: () => ({ closest: () => ({ setAttribute() {} }) }), replaceWith() {} };
  const document = { ...events(), hidden: false, documentElement: events() };
  const media = { ...events(), matches: reduced };
  const window = { ...events(), devicePixelRatio: 3, matchMedia: () => media };
  let sceneData;
  const valid = data => {
    for (const value of Object.values(data)) {
      const list = Array.isArray(value) || ArrayBuffer.isView(value) ? value : [value];
      if (typeof list[0] === 'number') assert.ok(Array.from(list).every(Number.isFinite));
    }
  };
  const descriptor = shader => {
    assert.equal(shader.version, 2, 'vgpu requires prepared shaders');
    assert.ok(shader.sourceChecksum);
    return { set(bindings) { if (bindings.shards) bindings.shards.kind = 'shards'; },
      compile: async () => {} };
  };
  const sized = options => ({ size: Array.from(options.size), depth: {},
    resize(size) { this.size = Array.from(size); } });
  const env = vm.createContext({ ...shaders, canvas, window, document, console: { warn() {} },
    navigator: supported ? { gpu: { getPreferredCanvasFormat: () => 'bgra8unorm' } } : {},
    Element: class {}, Float32Array, Float64Array,
    hslToRgb: value => value?.includes('100%') ? '255, 255, 255' : '17, 17, 17',
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} },
    init: async () => ({ onError(fn) { errorListener = fn; return () => { errorListener = null; }; }, dispose() { disposed++; } }),
    sampler: () => ({}), target: (_, options) => sized(options),
    surface: (_, __, options) => { const result = sized(options); uploads.push(result); return result; },
    storage: () => ({ write(data) {
      assert.ok(Array.from(data).every(Number.isFinite));
      if (this.kind === 'shards') shardData = Array.from(data);
    }}),
    draw: (_, options) => descriptor(options.shader), effect: (_, shader) => descriptor(shader),
    uniforms: (_, values) => {
      valid(values);
      return { set(data) {
        valid(data);
        if ('eye' in data) sceneData = structuredClone(data);
      }};
    },
    frame: (_, callback) => {
      callback({ pass: (_, run) => run({ draw(_draw, options) {
        if (options) assert.ok(Number.isInteger(options.instances) && options.instances >= 0);
      }}) });
      frames.push(sceneData);
    },
    mountFlow: () => { fallback = { setColors(value) { this.colors = value; }, setPaused(value) { this.paused = value; }, destroy() {} }; return fallback; }
  });
  vm.runInContext(`${source}\nglobalThis.ready = mount(canvas);`, env);
  const animation = await env.ready;
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { animation, canvas, document, window, media, pending, frames, tick,
    shards: () => shardData, output: () => uploads[0], disposed: () => disposed,
    visible: value => intersection([{ isIntersecting: value }]),
    fail: () => errorListener(new Error('device lost')), fallback: () => fallback };
}

test('AeroShards repaints paused themes without advancing geometry or time', async () => {
  const s = await setup();
  s.tick(40); s.tick(80);
  s.animation.setPaused(true);
  const data = s.shards(), before = s.frames.at(-1).view[3];
  s.animation.setColors({ paper: '240 6% 7%' });
  assert.equal(s.frames.at(-1).up[3], 0);
  s.animation.setColors({ paper: '0 0% 100%' });
  assert.equal(s.frames.at(-1).up[3], 1);
  assert.deepEqual(s.shards(), data);
  assert.equal(s.frames.at(-1).view[3], before);
  assert.equal(s.pending.size, 0);
  s.animation.destroy();
});

test('AeroShards suspends offscreen, in hidden tabs, and cleans up', async () => {
  const s = await setup();
  s.visible(false);
  assert.equal(s.pending.size, 0);
  s.visible(true);
  s.document.hidden = true;
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 0);
  s.document.hidden = false;
  s.document.handlers.get('visibilitychange')();
  assert.equal(s.pending.size, 1);
  s.animation.destroy();
  assert.equal(s.pending.size, 0);
  assert.equal(s.disposed(), 1);
  for (const target of [s.window, s.media, s.document, s.document.documentElement]) assert.equal(target.handlers.size, 0);
});

test('reduced motion produces complete static ribbons and rejects pointer animation', async () => {
  const s = await setup({ reduced: true });
  assert.ok(s.shards().some(value => value !== 0));
  const before = s.frames.length;
  s.window.handlers.get('pointerdown')({ clientX: 300, clientY: 300, button: 0, pointerType: 'mouse' });
  s.window.handlers.get('pointerup')();
  assert.equal(s.frames.length, before);
  assert.equal(s.pending.size, 0);
  s.media.matches = false;
  s.media.handlers.get('change')();
  assert.equal(s.pending.size, 1);
  s.tick(40); s.tick(80);
  s.media.matches = true;
  s.media.handlers.get('change')();
  assert.equal(s.pending.size, 0);
  s.animation.destroy();
});

for (const [width, height] of [[390, 844], [2560, 1440]]) {
  test(`ribbon data stays finite during gathering and release at ${width}×${height}`, async () => {
    const s = await setup({ width, height });
    assert.equal(s.shards().length, (width < 600 ? 800 : 1300) * 24);
    assert.ok(s.output().size[0] * s.output().size[1] <= 1.4e6 + 3000);
    s.window.handlers.get('pointerdown')({ clientX: width * 0.4, clientY: height * 0.55, button: 0, pointerType: 'mouse' });
    for (let t = 40; t <= 1000; t += 40) s.tick(t);
    s.window.handlers.get('pointerup')();
    for (let t = 1040; t <= 1200; t += 40) s.tick(t);
    assert.ok(s.shards().every(Number.isFinite));
    s.animation.destroy();
  });
}

test('device errors fall back to flow with the latest theme and pause; unavailable WebGPU rejects', async () => {
  const s = await setup();
  const colors = { paper: '240 6% 7%' };
  s.animation.setColors(colors);
  s.animation.setPaused(true);
  s.fail();
  assert.equal(s.disposed(), 1);
  assert.deepEqual(s.fallback().colors, colors);
  assert.equal(s.fallback().paused, true);
  assert.equal(s.pending.size, 0);
  s.animation.setPaused(false);
  assert.equal(s.fallback().paused, false);
  s.animation.destroy();
  await assert.rejects(setup({ supported: false }), /WebGPU is not available/);
});

test('prepared shader artifacts match the editable WGSL sources', () => {
  assert.equal(Object.keys(shaders).length, 9);
  for (const [name, source] of Object.entries(rawShaders)) {
    assert.equal(shaders[name].version, 2);
    assert.equal(shaders[name].wgsl, source);
  }
});
