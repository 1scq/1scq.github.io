import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = (await readFile(new URL('../src/flow/banner.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/gm, '').replace('await import("./flow.js")', 'flowModule');

function setup(mount) {
  const events = () => ({ addEventListener() {} });
  const toggle = { ...events(), hidden: true };
  const intro = { ...events(), dataset: {}, classList: { add() {}, remove() {}, toggle() {} },
    style: { setProperty() {} }, offsetHeight: 900,
    getBoundingClientRect: () => ({ top: 0 }),
    querySelector: name => name === '.flow-toggle' ? toggle : events() };
  const calls = [];
  const animation = { setColors: () => calls.push('colors'), setPaused: () => calls.push('paused') };
  const replacement = {};
  const canvas = { cloneNode: () => replacement, replaceWith: value => calls.push(value) };
  const env = vm.createContext({
    console: { warn() {}, error() {} },
    document: { documentElement: { dataset: { theme: 'dark' } },
      querySelector: selector => selector === '#intro' ? intro : canvas },
    window: events(), matchMedia: () => ({ ...events(), matches: false }),
    requestAnimationFrame() {},
    introProgress: () => 0, introAppearance: () => ({}),
    loadEffect: async () => ({ id: 'aero-shards', mount: () => mount(animation) }),
    flowModule: { mount: () => animation }
  });
  vm.runInContext(source, env);
  return { ready: vm.runInContext('ready', env), toggle, intro, calls, replacement };
}

test('banner waits for asynchronous renderers before applying colors and enabling controls', async () => {
  let resolve, enteredResolve;
  const entered = new Promise(done => { enteredResolve = done; });
  const s = setup(animation => new Promise(done => { resolve = () => done(animation); enteredResolve(); }));
  await entered;
  assert.equal(s.toggle.hidden, true);
  assert.deepEqual(s.calls, []);
  resolve();
  await s.ready;
  assert.equal(s.toggle.hidden, false);
  assert.equal(s.intro.dataset.effect, 'aero-shards');
  assert.deepEqual(s.calls, ['colors', 'paused']);
});

test('asynchronous renderer failures replace the claimed canvas and mount flow', async () => {
  const s = setup(async () => { throw new Error('no WebGPU adapter'); });
  await s.ready;
  assert.equal(s.intro.dataset.effect, 'flow');
  assert.equal(s.toggle.hidden, false);
  assert.deepEqual(s.calls, [s.replacement, 'colors', 'paused']);
});
