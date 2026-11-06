# Ripple opening screen

The opening displays Danny.Shi above the robot scene and a perspective water
surface adapted from Axi404/todo, `web/lib/heroes/ripple.js`, revision
`14f7579bfb9cd646dd94531d588b2a4290c141e7` (retrieved 2026-11-06).
Source: https://github.com/Axi404/todo/blob/main/web/lib/heroes/ripple.js
The upstream ripple and shared animation stage use the MIT license retained in
`src/flow/LICENSE`. The previous Flow Matching particle algorithm has been removed.

The water uses rows of waves in perspective. Pointer movement creates small
ripples; clicks drop a pebble and create expanding rings with burgundy crests.
The original opaque row masks are retained for correct wave occlusion; multiply
blending lets the robot scene remain visible through the white water surface.
The page retains the existing shared pause button and reduced-motion still frame.
Rendering is capped at 30 fps and 1.5× pixel density.

A single-screen introduction fades naturally with native scrolling to reveal the
homepage. Scrolling up restores it; after leaving the opening, both animations
stop. Direct section links and the enter arrow remain usable.

Robot source and library provenance: [robot background](robot-background.md).
Preview: `python3 -m http.server 8000 --bind 127.0.0.1`.
Tests: `node --test tests/*.test.*`.
