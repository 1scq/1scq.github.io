// Optional maintenance step; serving this static site requires no build.
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import * as shaders from './effects/aero-shards-wgsl.js';

if (!process.argv[2]) {
  throw new Error('Pass the path to @vgpu/wgsl 0.6.0 dist/prepare.js from a temporary npm installation.');
}
const { prepareShader } = await import(pathToFileURL(resolve(process.argv[2])).href);
let output = '// Generated from AeroShards WGSL using @vgpu/wgsl/prepare 0.6.0.\n';
output += '// Do not edit reflection by hand; run src/flow/prepare-aero-shaders.mjs.\n';
for (const [name, wgsl] of Object.entries(shaders)) {
  output += `export const ${name} = ${JSON.stringify(prepareShader(wgsl, name))};\n`;
}
await writeFile(new URL('./effects/aero-shards-shaders.js', import.meta.url), output);
