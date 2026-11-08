# vgpu 0.6.0

Local browser bundle of the nine vgpu APIs used by AeroShards. The bundle is
loaded only when this effect is selected. It contains `vgpu`, `@vgpu/core`, and
`@vgpu/wgsl` 0.6.0; licenses are preserved alongside it.

Upstream: https://github.com/vercel-labs/vgpu

The site remains buildless. The checked-in WGSL reflection artifacts are required
by the pinned vgpu renderer. Edit `src/flow/effects/aero-shards-wgsl.js`, then
regenerate `aero-shards-shaders.js` if changing a shader.

For maintenance, create a temporary npm directory outside this checkout and
install `vgpu@0.6.0` and `esbuild@0.25.12` there with scripts disabled. Create
`entry.js` in that directory with:

```js
export { draw, effect, frame, init, sampler, storage, surface, target, uniforms } from 'vgpu';
```

Bundle it with that installation's esbuild using `--bundle --format=esm
--platform=browser --minify` and write the result to `assets/vendor/vgpu/vgpu.js`.
Keep the corresponding dependency licenses in `THIRD-PARTY-LICENSES.txt`.

Regenerate prepared shaders from the repository root with:

```sh
node src/flow/prepare-aero-shaders.mjs /path/to/temporary/node_modules/@vgpu/wgsl/dist/prepare.js
```

The editable WGSL and prepared artifacts are checked for consistency by the
normal test suite. No npm packages or shader compiler run on a visitor's device.
