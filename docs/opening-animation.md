# Randomized profile opening

The opening centers ChengqiShi horizontally and vertically in the viewport.
石澄錡 appears below it, followed by two centered rows of contact tags:
Email / Google Scholar, then GitHub / WeChat / CV.
Contact tags use approximately 40-pixel heights, 14-pixel desktop text, and
10-pixel gaps. Narrow screens stack the identity above the two compact rows.
Destinations come from `siteData.profile`; WeChat opens the existing QR dialog.

## Effects

Every ordinary page load randomly selects one of all eleven header animations
from Axi404/todo: argus (mesh), relay (robot-arm relay), flow, ripple, scan
(point-cloud scan), cloth, landscape, lidar, filings, growth, and blackhole.
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

All scenes share the burgundy accent, pause control, reduced-motion still
artwork, hidden-tab suspension, and scroll-to-homepage transition. Rendering is
capped at 30 fps and 1.5× pixel density with automatic quality adjustment.
Scrolling down fades the opening and stops its animation after exit; returning
to the top restores it. Flow additionally scatters the particles with scrolling.
The enter arrow and direct section links remain usable.

The former 3D robot scene, model files, and Three.js/URDF dependencies have been
removed. The new effects use local Canvas 2D modules without external libraries.

Preview: `python3 -m http.server 8000 --bind 127.0.0.1`.
Tests: `node --test tests/*.test.*`.
