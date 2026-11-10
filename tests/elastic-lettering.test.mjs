import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = (await readFile(new URL('../src/elastic-lettering.js', import.meta.url), 'utf8')).replaceAll('export ', '');
const context = vm.createContext({});
vm.runInContext(`${source}\nglobalThis.create = createElasticBand;`, context);
const create = options => context.create(Array.from({ length: 9 }, (_, i) => i * 0.65), options);

test('dragging one letter bends its neighbors with diminishing displacement', () => {
  const band = create();
  band.pull(4, 0.3, 2);
  for (let i = 0; i < 180; i++) band.step(1 / 120);
  assert.equal(band.letters[4].y, 2);
  assert.ok(band.letters[3].y > band.letters[2].y);
  assert.ok(band.letters[2].y > band.letters[1].y);
  assert.ok(band.letters[1].y > 0);
  assert.ok(Math.abs(band.letters[3].y - band.letters[5].y) < 1e-8);
});

test('a fling overshoots and settles exactly at rest without a running animation', () => {
  const band = create();
  band.pull(4, 0, 1.8);
  for (let i = 0; i < 60; i++) band.step(1 / 60);
  band.release(2, 12);
  let crossed = false;
  for (let i = 0; i < 600; i++) {
    band.step(1 / 60);
    crossed ||= band.letters[4].y < 0;
  }
  assert.ok(crossed);
  assert.equal(band.active, false);
  assert.ok(band.letters.every(l => l.x === 0 && l.y === 0 && l.vx === 0 && l.vy === 0));
});

test('extreme drags and delayed frames remain bounded', () => {
  const band = create();
  band.pull(0, 1e6, -1e6);
  assert.ok(Math.hypot(band.letters[0].x, band.letters[0].y) < 3.9);
  band.release(1e6, -1e6);
  for (let i = 0; i < 300; i++) band.step(i % 2 ? 5 : 1 / 240);
  assert.ok(band.letters.every(l => [l.x, l.y, l.vx, l.vy].every(Number.isFinite)));
  assert.ok(band.letters.every(l => Math.abs(l.x) <= 5 && Math.abs(l.y) <= 5));
});

test('reduced motion responds directly and releases without oscillation', () => {
  const band = create({ reduced: true });
  band.pull(4, 0, 2);
  assert.equal(band.letters[4].y, 2);
  assert.ok(band.letters[3].y > band.letters[2].y);
  assert.equal(band.step(1 / 60), false);
  band.release(10, 10);
  assert.equal(band.active, false);
  assert.ok(band.letters.every(l => l.y === 0));
  band.pluck();
  assert.equal(band.active, false);
});

test('cancellation and motion preference changes clear held state and momentum', () => {
  const band = create();
  band.pull(4, 1, 2);
  band.reset();
  assert.equal(band.held, -1);
  assert.equal(band.active, false);
  band.pluck();
  assert.equal(band.active, true);
  band.setReduced(true);
  assert.equal(band.active, false);
  assert.ok(band.letters.every(l => l.vy === 0));
});
