# Repository Guidelines

## Project Structure & Module Organization
This repository is currently a blank workspace. Keep the root minimal and introduce structure as code is added.

- Place application or library code in `src/`.
- Place tests in `tests/`, mirroring `src/` paths where practical.
- Place static assets in `assets/`.
- Place project notes or design docs in `docs/`.

Example layout:

```text
src/
tests/
assets/
docs/
```

## Build, Test, and Development Commands
No build system is configured yet. When adding one, document the canonical commands here and in the project README.

- `make build` or equivalent: create production artifacts.
- `make test` or equivalent: run the full automated test suite.
- `make lint` or equivalent: run formatting and lint checks.

If the project uses a language-specific toolchain, prefer a single entry point so contributors do not need to guess which command is authoritative.

## Coding Style & Naming Conventions
Use consistent, readable defaults until a formatter is introduced.

- Indentation: 2 spaces for front-end files, 4 spaces for Python or other back-end code.
- File names: use `kebab-case` for docs and assets, `snake_case` for Python modules, and `PascalCase` only for class/type names.
- Keep modules focused and avoid large multi-purpose files.

Adopt an automatic formatter and linter early, and treat their output as the source of truth once configured.

## Testing Guidelines
Add tests alongside new functionality; do not defer test coverage for core behavior.

- Name test files after the unit under test, such as `tests/test_parser.py` or `tests/button.spec.ts`.
- Cover happy-path behavior, edge cases, and regressions for reported bugs.
- Run the full test suite before opening a pull request.

## Commit & Pull Request Guidelines
Git history is not available in this workspace yet, so use a simple, consistent commit style.

- Write commit subjects in the imperative mood, such as `Add initial parser tests`.
- Keep commits scoped to one logical change.
- In pull requests, include a short summary, test evidence, and any screenshots for UI changes.
- Link the relevant issue or task ID when one exists.

## Configuration & Secrets
Do not commit secrets, local credentials, or machine-specific config files. Keep environment overrides in ignored files such as `.env.local` and document required variables in `README.md`.
