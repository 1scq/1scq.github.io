# Elastic homepage lettering

The ChengqiShi heading uses an original, dependency-free implementation inspired
by the supplied draggable lettering reference. It does not include React Bits Pro
source and needs no registry credentials or build step.

Drag any letter with a mouse or touch pointer. Neighboring letters bend toward
the selected letter, rotate with the curve, and turn purple under tension.
Release to fling and spring back. Font-relative physics preserve the feel on
small screens; the existing heading font and light/dark colors are retained.

Keyboard: Tab to the heading, use Left/Right to choose a letter, Space/Enter to
pluck it, and Escape to reset. Reduced motion uses direct deformation and an
immediate reset on release. Pointer cancellation, window blur, resizing, hidden
tabs, and leaving the viewport clear the interaction. Animation frames stop
once the letters settle. The plain HTML heading remains readable without JS.

Implementation: `src/elastic-lettering.js`; entry point: `src/intro-lettering.js`.
Run `node --test tests/*.test.*` to check coupling, settling, extreme input,
reduced motion, and cancellation.
