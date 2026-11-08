import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as THREE from '../assets/vendor/three/three.module.min.js';

const source = (await readFile(new URL('../src/flow/effects/hyperspeed.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/gm, '').replaceAll('export ', '');

function setup({ reduced = false, width = 1440, height = 900 } = {}) {
  const pending = new Map(), frames = [];
  let next = 0, intersection, disposed = 0;
  const events = () => {
    const handlers = new Map();
    return { handlers,
      addEventListener: (name, fn) => handlers.set(name, fn),
      removeEventListener: name => handlers.delete(name) };
  };
  const canvas = { ...events(), clientWidth: width, clientHeight: height,
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height }) };
  const media = { ...events(), matches: reduced };
  const window = { ...events(), devicePixelRatio: 3, matchMedia: () => media };
  const document = { ...events(), hidden: false,
    createElement: () => ({ getContext: () => ({ fillStyle: '#000000' }) }) };
  class Renderer {
    constructor({ canvas }) { this.domElement = canvas; this.extensions = { has: () => false }; }
    setPixelRatio(ratio) { this.ratio = ratio; }
    setSize(w, h) { canvas.width = Math.floor(w * this.ratio); canvas.height = Math.floor(h * this.ratio); }
    setRenderTarget() {} setClearColor() {} clear() {}
    render(scene, camera) {
      if (!camera.isPerspectiveCamera) return;
      const uniforms = scene.children[0].material.uniforms;
      frames.push({ time: uniforms.uTime.value, stretch: uniforms.uStretch.value,
        fov: camera.fov, position: camera.position.toArray(),
        blending: scene.children[1].material.blending,
        cars: scene.children[1].geometry.instanceCount });
      for (const object of scene.children) {
        for (const value of object.geometry.attributes.position.array) assert.ok(Number.isFinite(value));
      }
    }
    dispose() { disposed++; }
  }
  const env = vm.createContext({ THREE: { ...THREE, WebGLRenderer: Renderer },
    canvas, window, document, Float32Array, console,
    performance: { now: () => 0 },
    hslToRgb: value => value?.includes('100%') ? '255, 255, 255' : '17, 17, 17',
    requestAnimationFrame: fn => { pending.set(++next, fn); return next; },
    cancelAnimationFrame: id => pending.delete(id),
    ResizeObserver: class { observe() {} disconnect() {} },
    IntersectionObserver: class { constructor(fn) { intersection = fn; } observe() {} disconnect() {} }
  });
  vm.runInContext(`${source}\nglobalThis.animation = mount(canvas);`, env);
  const tick = now => { const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach(fn => fn(now)); };
  return { env, canvas, window, document, media, pending, frames, tick,
    visible: value => intersection([{ isIntersecting: value }]), disposed: () => disposed };
}

test('hyperspeed boosts while held and releases on cancel or blur', () => {
  const s = setup();
  s.tick(40);
  const cruise = s.frames.at(-1);
  s.canvas.handlers.get('pointerdown')({ button: 0, pointerType: 'mouse' });
  for (let t = 80; t <= 800; t += 40) s.tick(t);
  const boost = s.frames.at(-1);
  assert.ok(boost.stretch > 0.9);
  assert.ok(boost.fov > cruise.fov + 20);
  s.window.handlers.get('pointercancel')();
  for (let t = 840; t <= 4000; t += 40) s.tick(t);
  assert.ok(s.frames.at(-1).stretch < boost.stretch / 10);
  s.canvas.handlers.get('pointerdown')({ button: 0, pointerType: 'touch' });
  s.window.handlers.get('blur')();
  s.tick(4040);
  assert.ok(s.frames.at(-1).stretch < 0.1);
  s.env.animation.destroy();
});

test('pause and hidden/offscreen suspension preserve the simulation timeline', () => {
  const s = setup();
  s.tick(40);
  s.env.animation.setPaused(true);
  const before = s.frames.at(-1).time;
  assert.equal(s.pending.size, 0);
  s.tick(8000);
  s.env.animation.setPaused(false);
  assert.equal(s.frames.at(-1).time, before);
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
  assert.equal(s.canvas.handlers.size + s.window.handlers.size + s.media.handlers.size + s.document.handlers.size, 0);
  assert.equal(s.disposed(), 1);
});

test('reduced motion stays static, including input and live theme changes', () => {
  const s = setup({ reduced: true });
  assert.ok(s.frames.length > 0);
  assert.equal(s.pending.size, 0);
  const before = s.frames.at(-1).time;
  s.canvas.handlers.get('pointerdown')({ button: 0, pointerType: 'mouse' });
  s.env.animation.setColors({ paper: '240 6% 7%' });
  assert.equal(s.frames.at(-1).blending, THREE.AdditiveBlending);
  assert.equal(s.frames.at(-1).time, before);
  s.env.animation.setColors({ paper: '0 0% 100%' });
  assert.equal(s.frames.at(-1).blending, THREE.NormalBlending);
  assert.equal(s.frames.at(-1).stretch, 0);
  assert.equal(s.pending.size, 0);
  s.media.handlers.get('change')({ matches: false });
  assert.equal(s.pending.size, 1);
  s.tick(40);
  assert.ok(s.frames.at(-1).time > before);
  s.media.handlers.get('change')({ matches: true });
  assert.equal(s.pending.size, 0);
  s.env.animation.destroy();
});

for (const [width, height] of [[390, 844], [2560, 1440]]) {
  test(`hyperspeed renders finite geometry within its pixel budget at ${width}×${height}`, () => {
    const s = setup({ width, height });
    s.tick(40);
    assert.ok(s.canvas.width * s.canvas.height <= 1.8e6);
    assert.ok(s.frames.every(frame => frame.position.every(Number.isFinite)));
    assert.equal(s.frames.at(-1).cars, width < 600 ? 56 : 80);
    s.env.animation.destroy();
  });
}

test('context loss stops drawing and restores without overriding pause', () => {
  const s = setup();
  let prevented = false;
  s.canvas.handlers.get('webglcontextlost')({ preventDefault() { prevented = true; } });
  assert.ok(prevented);
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(true);
  s.canvas.handlers.get('webglcontextrestored')();
  assert.equal(s.pending.size, 0);
  s.env.animation.setPaused(false);
  assert.equal(s.pending.size, 1);
  s.env.animation.destroy();
});
