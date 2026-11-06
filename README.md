# 1scq.github.io

Local preview: `python3 -m http.server 8000 --bind 127.0.0.1`, then open
`http://127.0.0.1:8000`. No production build is required.

Run the automated animation checks with `node --test tests/*.test.*`.
See [opening animation notes](docs/opening-animation.md) for behavior and attribution.

The homepage theme selector offers System (default), Light, and Dark. Manual choices
are saved locally; System follows appearance changes automatically. The opening
animation, content, and dialogs share the selected theme.
