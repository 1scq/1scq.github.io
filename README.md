# 1scq.github.io

Local preview: `python3 -m http.server 8000 --bind 127.0.0.1`, then open
`http://127.0.0.1:8000`. No production build is required.

Run the automated animation checks with `node --test tests/*.test.*`.
See [opening animation notes](docs/opening-animation.md) for behavior and attribution.

The homepage uses a RubberSegment-style elastic control for System (default),
Light, and Dark. It supports clicks, thumb dragging, arrow keys, Home/End and
reduced motion. Manual choices
are saved locally; System follows appearance changes automatically. The opening
animation, content, and dialogs share the selected theme.

See [theme control notes](docs/theme-control.md) for interaction details.

The ChengqiShi heading supports elastic letter dragging, touch interaction,
and keyboard plucking. See [elastic lettering notes](docs/elastic-lettering.md).

The opening includes a draggable, flippable 3D portrait badge. Its renderer is
adapted from the user-supplied Lanyard component and uses the existing local
Three.js dependency. `src/badge-artwork.js` composes the illustrated portrait and
contact reverse; `src/danny-lettering.js` draws the original animated Danny
wordmark. Enter or Space flips the focused badge. Reduced motion disables idle
sway and handwriting animation; an HTML portrait remains if WebGL is unavailable.
The full-screen canvas allows dragging across the centered introduction without
clipping or intercepting input outside the card.
