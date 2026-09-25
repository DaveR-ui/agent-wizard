---
last_updated: 2026-09-24
description: Local development for agent-wizard — Angular dev server, tests, build, data validation, refined-source editing.
tags: [local, dev, serve, test, build, jq]
status: active
---

# Local Development

agent-wizard is an Angular 22 SPA skeleton plus an opencode agent system. There is no backend and no default test user.

> [!CAUTION] The workspace root is `/run/media/admin/Datos/projects/agent-wizard` — always quote paths in bash (sibling paths may contain spaces).

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
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json && jq empty refined-source/protocols.json
```

## Working with refined-source

- Manual edits only — no auto-scripts (see `docs/protocols/refined-source-curation.md`).
- Keep JSON pretty-printed and jq-valid.
- `relatedFiles` in `agents.json`: agent-system paths (`agents/…`, `protocols/…`) resolve against the `agent-system` reference; in-repo paths (`docs/…`, `refined-source/…`) must resolve.

## Agent-system tests

When changing the installed agent system (subject to the review loop), validate it inside the clone (`~/.config/opencode`):

```bash
bash scripts/validate-agent.sh
```

## References

- Commands: `docs/project.md`
- Data layer: `docs/context/refined-source-data.md`