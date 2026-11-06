# Robot opening background

At the site owner's request, `src/flow/robots.js` adapts the scene at
https://ideal.cs.unc.edu/js/sim-hero.js (retrieved 2026-11-06).
The original scene and its arrangement are by IDEAL Lab, UNC-Chapel Hill,
whose page footer identifies copyright 2026 IDEAL Lab. No separate blanket
license for the scene or baked models was advertised in the downloaded files;
these files are not relicensed as this site's own artwork or under the ripple
animation's MIT license.

The four robot descriptions and their GLB link meshes are local copies from
https://ideal.cs.unc.edu/assets/robots/ : Unitree G1, Unitree Go2, and left/right
Franka FR3 with WUJI hands. Original model comments and metadata are retained.
`assets/robots/source-manifest.json` records source paths, sizes, and SHA-256 hashes.

Runtime libraries are pinned local copies from the npm registry: Three.js
0.170.0 (MIT) and urdf-loader 0.13.1 (Apache-2.0). Their license notices are
retained under `assets/vendor/`. Only Three.js modules needed by the scene and
loaders are included. No robot mesh or JavaScript library is hotlinked.

Integration changes: a paler floor, local asset paths, 30 fps, capped resolution,
a shared pause control, suspension after leaving the opening or hiding the tab,
and live reduced-motion support. The original wide-scene composition is retained;
portrait screens with an aspect below 0.75 use ripples alone and skip model
requests until the screen is widened or rotated. WebGL failure also falls back
to the ripple opening.

The ripple canvas sits above the robot scene and uses multiply blending so its
white surface does not cover the robots. The name is above both, with no extra
captions. The previous Flow Matching particles have been removed in favor of the
Axi404 ripple simulation. See [opening notes](opening-animation.md).
