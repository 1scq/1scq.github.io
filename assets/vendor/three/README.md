# Three.js 0.180.0

Local ES modules from the official npm `three@0.180.0` package. Only the Hyperspeed
opening scene imports them. Both build files are required because the renderer
module imports `./three.core.min.js`.

Upstream: https://github.com/mrdoob/three.js/tree/r180
Package: https://www.npmjs.com/package/three/v/0.180.0
License: MIT; see `LICENSE` in this directory.

To reproduce, run `npm pack three@0.180.0` outside the checkout and copy
`package/build/three.module.min.js`, `package/build/three.core.min.js` and
`package/LICENSE` from the archive. The site itself requires no npm setup.
