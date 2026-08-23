---
last_updated: 2026-08-23
description: Layered architecture of agent-wizard — agent system, data layer, and Angular UI, plus dependency flow and the graph UI.
tags: [architecture, layers, agent-system, data-layer, angular, graph-ui]
status: active
---

# Architecture

agent-wizard is three layers: the **agent system** (runtime config), the **data layer** (curated presentation), and the **Angular UI** (rendered page). The wiring is done — `refined-source/*.json` → Angular components → rendered cards/graph.

## Layers

### Agent system (`.opencode/` ↔ `source/`)

The opencode agent runtime. `.opencode/` is the live config the runtime loads; `source/` is an identical clean copy with `node_modules` removed (verified via diff) and is the only maintained copy.

| Area | Path | Contents |
|---|---|---|
| Agents | `.opencode/agents/subagents/` | 14 agent `.md` definitions, 8 with `.schema.json` (`coder.schema.json` shared by both coders) |
| Protocols | `.opencode/protocols/` | 11 agent protocols + `references/` (3 refs) |
| Workflows | `.opencode/workflows/` | `dispatch.md`, `orchestrate.md` |
| Scripts | `.opencode/scripts/` | `install-agent.ps1`, `session-recover.ps1`, `validate-agent.sh` |
| Tests | `.opencode/tests/` | `run-tests.sh`, schema contract tests, fixtures |

Flow: `delivery` (human interface) → `interpreter` (Step 0, every prompt) → `orchestrator` (Phase 2 Reduce, non-trivial) → subagents (coders, guardians, quality, writers, exploration).

### Data layer (`refined-source/`)

Curated, human-maintained JSON + MD that power the graph UI. Source of truth is `source/`; `refined-source/` is the presentation layer.

| File | Drives |
|---|---|
| `agents.json` | Agent cards (14) |
| `rules.json` | Rule cards, 3 levels |
| `graph.json` | Delegation graph (14 nodes, 27 edges, 7 groups) |
| `agents/*.md` | Per-agent detail prose (14) |

### Angular skeleton (`src/`)

Angular 22.1.x standalone-component app (CLI 22.1.5). Renders agent cards, a filterable rules list, and the delegation graph from `refined-source/` inside a 4-tab **Angular Material** shell (`MatTabs`): Agentes → agent-cards, Reglas → rules-panel, Grafo de delegación → graph-panel, Pipeline → pipeline-panel, with `<router-outlet />` kept outside the tabs for future pages. Material uses the prebuilt **indigo-pink** theme (`src/styles.css`) and `provideAnimationsAsync()` in `app.config.ts` — explicit decision made by the human on 2026-08-23. The graph library is **@swimlane/ngx-graph ^13.0.0** (pulls d3 ^7.x transitively; peer deps @angular/cdk + @angular/animations). Angular 22 makes OnPush the default; the 6 existing components are stamped `ChangeDetectionStrategy.Eager` to preserve pre-22 behavior.

| File | Purpose |
|---|---|
| `src/main.ts` | Bootstrap |
| `src/app/app.ts` | Root component (`app-root`) + Material tab shell (Agentes / Reglas / Grafo de delegación / Pipeline) |
| `src/app/app.config.ts` | `ApplicationConfig` with router + `provideAnimationsAsync()` |
| `src/app/app.routes.ts` | Empty routes |
| `src/app/app.html` / `app.css` | Root template / styles |
| `src/app/app.spec.ts` | Vitest smoke test |
| `src/app/agent-cards/` | 14 agent cards + hover contract |
| `src/app/rules-panel/` | 3-level filterable rules |
| `src/app/graph-panel/` | Force-directed delegation graph via @swimlane/ngx-graph |
| `src/app/pipeline-panel/` | Pipeline visualization |
| `src/app/models/refined-source.ts` | Typed models + JSON imports |
| `src/app/testing/ngx-graph-test-env.ts` | jsdom shims for graph specs |
| `src/index.html`, `src/styles.css` | Shell + global styles |

> Table is non-exhaustive — component directories also contain their `.html` / `.css` / `.spec.ts` files.

## Dependency flow

```
.opencode/ (runtime) ──clean copy──▶ source/ (maintained)
        │
        └──manual curation──▶ refined-source/ (JSON + MD)
                                   │
                                   └──▶ src/app components → rendered cards/graph
```

- `.opencode/` → `source/`: copy, node_modules removed.
- `source/` → `refined-source/`: manual curation (no auto-script).
- `refined-source/` → `src/`: wired — the Angular app imports `refined-source/*.json` as TS modules at build time (`resolveJsonModule`).

## What is future

- **Routes** — `app.routes.ts` is empty; no pages exist.

## References

- Slices: `docs/project.md` → `agent-system`, `refined-source`, `frontend-skeleton`, `graph-ui`
- Agents: `docs/context/agent-catalog.md`
- Data layer: `docs/context/refined-source-data.md`