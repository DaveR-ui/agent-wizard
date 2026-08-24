---
last_updated: 2026-08-24
description: Layered architecture of agent-wizard — agent system (.opencode sole source, Branch B flat), data layer, and Angular UI, plus dependency flow and the graph UI.
tags: [architecture, layers, agent-system, data-layer, angular, graph-ui]
status: active
---

# Architecture

agent-wizard is three layers: the **agent system** (runtime config), the **data layer** (curated presentation), and the **Angular UI** (rendered page). The wiring is done — `refined-source/*.json` → Angular components → rendered cards/graph.

## Layers

### Agent system (`.opencode/` — sole source of truth)

The opencode agent runtime. `.opencode/` is the live config the runtime loads and the **sole maintained source** (since 2026-08-24 `source/` was deleted — verified `ls` → No such file; previously `source/` was an identical clean copy with `node_modules` removed and the only maintained copy).

| Area | Path | Contents |
|---|---|---|
| Agents | `.opencode/agents/subagents/` | 12 flat `.md` (Branch B — flat-loader precedent, probe `_probe/probe.md` not discovered per `docs/plans/rpg-agent-organization-plan.md` Phase 0; single `coder.md` + `coder.schema.json` preserved, vision-relay removed, interpreter image inspection) + 7 `.schema.json` — per-agent protocol scrolls live under `.opencode/protocols/<id>/*.md` (12 dirs, e.g. `.opencode/protocols/coder/coder-toolkit.md`); see `.opencode/protocols/README.md` Per-agent scrolls |
| Protocols | `.opencode/protocols/` | 5 shared agent protocols + `README.md` (retired 4 ia-* + references/ on 2026-08-24) — per-agent scrolls now under `.opencode/protocols/<id>/` (12 dirs, Branch B) |
| Workflows | `.opencode/workflows/` | `dispatch.md`, `orchestrate.md` |
| Scripts | `.opencode/scripts/` | `install-agent.ps1`, `session-recover.ps1`, `validate-agent.sh` |
| Tests | `.opencode/tests/` | `run-tests.sh`, schema contract tests, fixtures |

Flow: `delivery` (human interface) → `interpreter` (Step 0, every prompt, now also image-inspection fallback) → `orchestrator` (Phase 2 Reduce, non-trivial) → subagents (coder [language-param], guardians, quality, writers, exploration).

### Data layer (`refined-source/`)

Curated, human-maintained JSON + MD that power the graph UI. Source of truth is `.opencode/` (previously `source/` clean copy, deleted 2026-08-24); `refined-source/` is the presentation layer.

| File | Drives |
|---|---|
| `agents.json` | Agent cards (12 actual — single coder, vision-relay removed; Branch B scrolls in `relatedFiles`) |
| `rules.json` | Rule cards, 3 levels (passive-first, `kind` tagged) |
| `graph.json` | Delegation graph (12 nodes, 22 edges, 7 groups, v1.1.0 with display-only `race` + `flavor`) |
| `agents/*.md` | Per-agent detail prose (12 actual) |

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
| `src/app/agent-cards/` | Agent cards + hover contract (13 spec / 12 actual) |
| `src/app/rules-panel/` | 3-level filterable rules |
| `src/app/graph-panel/` | Force-directed delegation graph via @swimlane/ngx-graph |
| `src/app/pipeline-panel/` | Pipeline visualization |
| `src/app/models/refined-source.ts` | Typed models + JSON imports |
| `src/app/testing/ngx-graph-test-env.ts` | jsdom shims for graph specs |
| `src/index.html`, `src/styles.css` | Shell + global styles |

> Table is non-exhaustive — component directories also contain their `.html` / `.css` / `.spec.ts` files.

## Dependency flow

```
.opencode/ (sole source, runtime) ──manual curation──▶ refined-source/ (JSON + MD)
                                                         │
                                                         └──▶ src/app components → rendered cards/graph
```
> `source/` deleted 2026-08-24 (was `.opencode/` ↔ `source/` clean copy, node_modules removed).

- `.opencode/` → `refined-source/`: manual curation (no auto-script; `source/` step removed 2026-08-24).
- `refined-source/` → `src/`: wired — the Angular app imports `refined-source/*.json` as TS modules at build time (`resolveJsonModule`).

## What is future

- **Routes** — `app.routes.ts` is empty; no pages exist.
- **Diagram-agent mirror** — `diagram-agent/` static mirror (v1.0.0, 14 nodes / 27 edges) is `deprecated` since Phase 3; superseded by live RPG card at `/diagram-agent/:id` (`src/app/diagram-agent/diagram-agent-viewer.ts`) rendering `refined-source/*` v1.1.0 (race/flavor, passives, weapons, scrolls) with no static `.md` links — see `diagram-agent/README.md` (`status: deprecated`).

## References

- Slices: `docs/project.md` → `agent-system`, `refined-source`, `frontend-skeleton`, `graph-ui`
- Agents: `docs/context/agent-catalog.md`
- Data layer: `docs/context/refined-source-data.md`
