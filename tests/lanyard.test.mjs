import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as THREE from '../assets/vendor/three/three.module.min.js';

const source = (await readFile(new URL('../src/lanyard.js', import.meta.url), 'utf8'))
  .replace(/^import .*;$/gm, '').replaceAll('export ', '');
const context = vm.createContext({ THREE, Float64Array });
vm.runInContext(`${source}\nglobalThis.badge = {cardLayout, buildCardGeometry, createSimulation, configureSimulation, placeHanging, stepSimulation};`, context);
const { cardLayout, buildCardGeometry, createSimulation, configureSimulation, placeHanging, stepSimulation } = context.badge;

test('badge has finite beveled geometry with a strap slot in both orientations', () => {
  for (const orientation of ['portrait', 'landscape']) {
    const layout = cardLayout(orientation, 0.45);
    const geometry = buildCardGeometry(layout);
    for (const mesh of Object.values(geometry)) {
      assert.ok(mesh.attributes.position.count > 0);
      for (const n of mesh.attributes.position.array) assert.ok(Number.isFinite(n));
      mesh.dispose();
    }
  }
});

test('a thrown badge settles while the strap anchor stays fixed', () => {
  const layout = cardLayout('portrait', 0.45);
  const sim = createSimulation();
  sim.anchor.set(2, 3, 0);
  configureSimulation(sim, layout, 1.4);
  placeHanging(sim, layout, false);
  sim.body.velocity.set(-12, 4, 2);
  sim.body.angular.set(0, 9, 2);
  const physics = {gravity:40, hold:154, stiffness:1600, spring:40, bandDamping:30,
    linearDrag:2, angularDrag:3, air:0.15, broadside:0.5, spinAir:0.03,
    nodeDrag:2, nodeAir:0.2, twist:30, twistDamping:3, grip:40, gripDamping:6, breeze:0};
  for (let i=0; i<600; i++) stepSimulation(sim, 1/60, physics, i/60);
  assert.ok(sim.body.position.toArray().every(Number.isFinite));
  assert.ok(sim.body.velocity.length() < 0.2);
  assert.ok(sim.nodes[0].distanceTo(sim.anchor) < 1e-9);
  assert.ok(Math.abs(sim.body.quaternion.length() - 1) < 1e-6);
});
