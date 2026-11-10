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
