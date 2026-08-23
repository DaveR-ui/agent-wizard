---
last_updated: 2026-08-23
description: Local development for agent-wizard — Angular dev server, tests, build, data validation, refined-source editing.
tags: [local, dev, serve, test, build, jq]
status: active
---

# Local Development

agent-wizard is an Angular 21 SPA skeleton plus an opencode agent system. There is no backend and no default test user.

> [!CAUTION] The workspace path contains spaces (`/run/media/admin/Datos/Matafuegos necochea/agent-wizard`) — quote every path in bash.

## Angular dev server

```bash
npm start        # or: ng serve
```

Serves at `http://localhost:4200/` with live reload.

## Tests

```bash
ng test          # Vitest via @angular/build
```

## Build

```bash
ng build         # outputs to dist/
```

## Data validation (refined-source)

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
```

## Working with refined-source

- Manual edits only — no auto-scripts (see `docs/protocols/refined-source-curation.md`).
- Keep JSON pretty-printed and jq-valid.
- `relatedFiles` in `agents.json` must resolve to real paths.

## Agent-system tests

When touching `.opencode/` (subject to the review loop):

```bash
bash .opencode/tests/run-tests.sh
```

## References

- Commands: `docs/project.md`
- Data layer: `docs/context/refined-source-data.md`