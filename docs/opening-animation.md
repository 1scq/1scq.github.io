# Randomized profile opening

The opening centers ChengqiShi horizontally and vertically in the viewport.
石澄錡 appears below it, followed by two centered rows of contact tags:
Email / Google Scholar, then GitHub / WeChat / CV.
Contact tags use approximately 40-pixel heights, 14-pixel desktop text, and
10-pixel gaps. Narrow screens stack the identity above the two compact rows.
Destinations come from `siteData.profile`; WeChat opens the existing QR dialog.

## Effects

Every ordinary page load randomly selects one of nineteen animations. Eleven
are adapted from Axi404/todo: argus (mesh), relay (robot-arm relay), flow, ripple, scan
(point-cloud scan), cloth, landscape, lidar, filings, growth, and blackhole. One original scene is also included: neural (signal propagation).
Liquid Chrome, adapted from the supplied React Bits component, adds flowing
metal ribbons and pointer-driven fluid ripples.
Only the selected module is loaded. Session storage remembers the last choice
to avoid an immediate repeat; blocked storage does not prevent loading. A module
load failure falls back to flow. `?effect=<id>` selects a deterministic preview.
There are no extra captions or scene-selection controls on the page.

Upstream source: https://github.com/Axi404/todo/tree/main/web/lib/heroes
The MIT notice for the scenes and shared stage is in `src/flow/LICENSE`.
Per-file revisions for the ten imported scenes are recorded in
`src/flow/effects/source-manifest.json`. The customized flow scene derives from
revision `53f5f3f26302a639da75f35608fc6197dafa9cb5`.

Flow repeatedly gathers particles into an oversized Danny centered behind the
foreground profile, then disperses back to Gaussian noise. The word fills nearly
the viewport width. Counts scale from 1400 to 6200 particles with viewport area.

## Behavior and validation

All scenes share the theme palette, pause control, reduced-motion still
artwork, hidden-tab suspension, and scroll-to-homepage transition. Rendering is
capped at 30 fps and 1.5× pixel density with automatic quality adjustment.
Scrolling down fades the opening and stops its animation after exit; returning
to the top restores it. Flow additionally scatters the particles with scrolling.
The enter arrow and direct section links remain usable.

The former 3D robot scene, model files, and URDF dependencies have been removed.
Hyperspeed uses a local Three.js module, loaded only when that scene is selected.
AeroShards uses a local vgpu module for WebGPU. The remaining scenes use local
Canvas 2D or WebGL 2 modules without additional libraries.

Preview: `python3 -m http.server 8000 --bind 127.0.0.1`.
Tests: `node --test tests/*.test.*`.


## Original addition: neural pulses

The neural scene draws sparse curved axon bundles carrying traveling signals.
Nearby nodes are repelled by the pointer; clicking propagates a burst from the
nearest node through the downstream network. The implementation is original to
this site and reuses only the existing MIT-licensed stage and math helpers.
No extra libraries or model assets are loaded. All nineteen scenes participate
in the same random selection, pause, reduced-motion, and scroll behavior.

## Liquid Chrome

Preview with `?effect=liquid-chrome`. The original supplied GLSL shaders and
floating-point fluid simulation are retained, adapted to the existing `mount`
interface without adding React or a build step. Shaders are from the user-supplied
React Bits LiquidChrome component (https://reactbits.dev/backgrounds/liquid-chrome).
Light mode uses cool silver and soft studio contours; dark mode uses cold silver
highlights. Both follow the existing Light / Dark / System selector immediately,
even while paused. A radial clearing keeps the centered profile readable.

Rendering is capped at 30 fps, 1.5× density and 2.4 million pixels. Fluid grids
are capped at 512×512. Reduced motion renders static artwork; paused, offscreen
and hidden-page states stop the animation. WebGL context restoration rebuilds
resources. Without floating-point targets, chrome still renders without fluid
ripples; unavailable WebGL 2 falls back to the existing flow scene.

## Hyperspeed

Preview with `?effect=hyperspeed`. Adapted from the user-supplied React Bits
Hyperspeed source, preserving its winding road, paired car-light trails, roadside
poles, reflections, airborne streaks and bloom. Press and hold the background to
boost; release, cancel, leave the canvas or blur the window to stop boosting.
The camera gently follows the pointer. Links and controls remain independent.

The Light / Dark / System selector switches between burgundy/blue trails on a
pale road and pink/ice-blue glowing trails on a dark background, including when
paused. Reduced motion renders a finished static scene and disables boosting and
steering. Paused, hidden-tab and offscreen states stop the frame loop; WebGL
context restoration redraws and respects the current pause state. The banner's
existing renderer-failure handler falls back to flow if WebGL is unavailable.

Rendering is capped at 30 fps, 1.5× pixel density and 1.8 million pixels, with
28 cars per side on narrow screens and 40 on desktop. Three.js 0.180.0 is vendored
under `assets/vendor/three/` with its MIT license; no React runtime, package
installation, build step or external CDN is needed to serve the site.

## GridScan

Preview with `?effect=grid-scan`. Adapted from the supplied React Bits GridScan
source: a perspective grid room, moving scan plane, sparkling wall points,
floor reflections and bloom. Pointer movement shifts the viewpoint; clicking the
background sends a ring across the wall or floor. Profile links and controls do
not trigger pings. The room starts fully visible with a scan already in progress.

Light mode uses pale gray lines with a deep blue scan. Dark mode uses subdued
gray lines with an ice-blue scan. Colors follow Light / Dark / System even while
paused. Reduced motion presents static artwork and disables pointer motion and
pings. Hidden-tab, offscreen and paused states stop the frame loop. Context
restoration rebuilds the renderer and retains theme and pause settings. Missing
WebGL 2 or shader initialization failure uses the existing flow fallback.

The scene uses local WebGL 2 with no extra libraries. Rendering is capped at
30 fps, 1.5× pixel density and approximately 1.8 million pixels; bloom uses
quarter-resolution targets. The optional webcam and device-orientation features
from the supplied component are omitted from this opening scene.

## Antigravity

Preview with `?effect=antigravity`. Adapted from the supplied React Bits source,
retaining its spring-driven particle field, capsule-shaped instanced particles,
rippled magnetic ring, depth softness and Oklab palette interpolation. The ring
follows the pointer and drifts automatically after inactivity. Press and hold the
background to charge the ring; release to send particles outward. Pointer cancel,
leaving the page, blur or pausing clears the press without an unintended burst.
Links and controls remain independent.

Colors follow Light / Dark / System: violet, rose and ice-blue on dark pages,
with deeper purple, burgundy and blue on light pages. Theme changes repaint
paused or static artwork without advancing the physics. The field settles into
a complete ring before its first frame. Reduced motion disables the frame loop
and pointer effects while retaining visible artwork. Hidden-tab, offscreen and
paused states stop animation; context restoration retains theme and pause.

Rendering uses local WebGL 2 with no added dependencies, capped at 30 fps,
1.5× pixel density and approximately 2.4 million pixels. Narrow screens use
1000 particles and desktop uses 1500. Unavailable WebGL 2 or shader failure
uses the banner's existing flow fallback.

## Topography

Preview with `?effect=topography`. Adapted from the supplied React Bits source,
retaining its procedural contour terrain, indexed major lines, camera glide,
terrain morphing, depth of field, distance fog and bloom. Pointer hover raises
and lights the terrain; clicks send an expanding light pulse over its surface.
The foreground stays low to keep the profile readable, and links/controls do
not trigger pulses. The scene starts with fully risen terrain.

Light / Dark / System switches between blue-gray ink with subdued bloom and
cool blue glowing contours, even while paused. Reduced motion displays static
terrain and disables pointer effects. Pausing, hidden tabs and leaving the
opening stop the frame loop. WebGL restoration rebuilds the renderer and retains
the theme and pause state. No dependencies or external assets are added.

Rendering is capped at 30 fps, 1.5× density and approximately 1.8 million pixels.
The source's adaptive terrain grid budget is retained. Floating-point targets
provide baked terrain and local sculpting; browsers without them still draw
procedural contours, hover light and click pulses. Missing WebGL 2 or failed
shader initialization uses the existing flow fallback.

## AeroShards

Preview with `?effect=aero-shards`. Adapted from the supplied React Bits source,
retaining its five layers of glass-prism ribbons, reflections/refraction, edge
highlights, depth blur, floating survey markers and bloom. The pointer parts the
ribbons and gently leans the camera. A short click sends a light ring through
all depths; holding gathers nearby shards into a swirl and releasing scatters
them back. Cancel, blur, leave and pause clear the press without creating a
spurious click pulse. Profile controls and links remain independent.

Colors follow Light / Dark / System, with muted violet glass on pale pages and
lavender highlights on dark pages. Paused theme changes repaint the same geometry.
Reduced motion renders complete static ribbons and disables pointer effects.
Paused, hidden-tab and offscreen states stop the frame loop. Rendering is capped
at 30 fps, 1.25× density and approximately 1.4 million pixels, with 800 shards on
narrow-screen mounts and 1300 on desktop.

This scene uses WebGPU and local `vgpu` 0.6.0. The banner awaits asynchronous
initialization and falls back to flow if WebGPU or shader preparation fails.
Device loss also switches to flow with the latest theme and pause setting.
Only this scene loads the vendored runtime. Its editable WGSL, prepared shader
reflection, runtime and licenses are checked in; serving the site needs no
build or external CDN. See `assets/vendor/vgpu/README.md` for maintenance.

## SplashCursor

Preview with `?effect=splash-cursor`. Adapted from the supplied React Bits
SplashCursor source. The original velocity/dye simulation, pressure solver,
vorticity, rainbow trail, click crown and bloom shaders are retained. Input is
contained in the opening and leaves a fluid trail; clicking the background adds
a splash. Links and controls do not trigger click splashes.

The scene starts with two fluid clouds and an introductory sweep. It settles
and clears when idle, then wakes on new pointer input. Light mode renders ink on
paper; dark mode renders luminous color. Theme changes repaint the existing
fluid, including while paused. Reduced motion keeps a finished static fluid
composition and disables input-driven motion. Paused, hidden-tab and offscreen
states stop simulation. Context restoration rebuilds the resources and retains
theme and pause settings.

Rendering is capped at 30 fps, 1.5× pixel density and approximately 1.8 million
pixels. Narrow screens use the low-quality fluid grid; desktop uses medium.
WebGL 2 and renderable half-float targets are checked before mounting, with the
existing flow fallback used when unavailable. No external dependency is added.
