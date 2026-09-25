---
last_updated: 2026-09-24
description: Layered architecture of agent-wizard — the installed global agent system (flat agents/, protocols/), the refined-source data layer, and the Angular UI (4-tab shell), plus dependency flow and the graph UI.
tags: [architecture, layers, agent-system, data-layer, angular, graph-ui]
status: active
---

# Architecture

agent-wizard is three layers: the **agent system** (the installed global opencode config), the **data layer** (curated presentation), and the **Angular UI** (rendered page). The wiring is done — `refined-source/*.json` → Angular components → rendered cards/graph/protocols.

## Layers

### Agent system (installed global config — sole source of truth)

The opencode agent runtime configuration, installed once per machine at `~/.config/opencode` and resolved through the `agent-system` reference. It is the `cyborges` fork of DaverAgent (Borges display names live only in `lore.md`). The repo's own `.opencode/` is a **stale, gitignored vendored copy — never the source of truth**.

| Area | Path | Contents |
|---|---|---|
| Agents | `agents/` | **11 FLAT** `agents/<id>.md` + sibling `agents/<id>.schema.json` where the return is typed. No `subagents/` subdir, no `workflows/`, no per-agent scrolls |
| Protocols | `protocols/` | **6** shared prose protocols: `dispatch`, `prompt-pipeline`, `orchestrate`, `subagent-spec-template`, `session-recovery`, `broad-investigation-template` |
| Runtime config | `opencode.json` | Top-level runtime only: `model`, `default_agent`, `permissions` (global array), `references`, `compaction`, `mcp`, `experimental`, and the built-in `agents.title.model` slot |
| Scripts | `scripts/` | `validate-agent.sh` (the single integrity gate) |
| Lore / docs | `lore.md`, `readme.md` | Fork identity (display-only Borges names) + system readme |

Flow: `delivery` (human interface) → `interpreter` (Step 0, every prompt) → `orchestrator` (Phase 2 Reduce, non-trivial) → subagents (`coder` [language-param], `tester`, `reviewer`, `architect`, `explorer`, `external-scout`, `analista`, `documenter`).

### Data layer (`refined-source/`)

Curated, human-maintained JSON + MD that power the UI. Source of truth is the **installed agent system**; `refined-source/` is the presentation layer.

| File | Drives |
|---|---|
| `agents.json` | Agent cards (11 agents) |
| `rules.json` | Rule cards, 3 levels (`kind` tagged, passive-first) |
| `graph.json` | Delegation graph (11 nodes, 20 edges, 7 groups, v1.2.0) |
| `protocols.json` | Protocol cards (6 protocols) — drives the Protocolos tab |
| `agents/*.md` | Per-agent detail prose |

### Angular skeleton (`src/`)

Angular 22.1.x standalone-component app (CLI 22.1.5). Renders agent cards, a filterable rules list, the 6 protocols, and the delegation graph from `refined-source/` inside a 4-tab **Angular Material** shell (`MatTabs`): Agentes → agent-cards, Reglas → rules-panel, Protocolos → protocols-panel, Pipeline → pipeline-panel, with `<router-outlet />` kept outside the tabs for future pages (the live diagram viewer at `/diagram-agent/:id`). Material uses the prebuilt **indigo-pink** theme (`src/styles.css`) and `provideAnimationsAsync()` in `app.config.ts`. Graph rendering uses **@swimlane/ngx-graph ^13.0.0** (pulls d3 ^7.x transitively; peer deps @angular/cdk + @angular/animations); **@joint/core ^4.3.2** supplies diagram primitives for the Pipeline tab (lazy-loaded via `@defer (on idle)`). Angular 22 makes OnPush the default; existing components are stamped `ChangeDetectionStrategy.Eager` to preserve pre-22 behavior.

| File | Purpose |
|---|---|
| `src/main.ts` | Bootstrap |
| `src/app/app.ts` | Root component (`app-root`) + Material tab shell (Agentes / Reglas / Protocolos / Pipeline) |
| `src/app/app.config.ts` | `ApplicationConfig` with router + `provideAnimationsAsync()` |
| `src/app/app.routes.ts` | Routes for the diagram viewer (`/diagram-agent/:id`) |
| `src/app/app.html` / `app.css` | Root template / styles |
| `src/app/app.spec.ts` | Vitest smoke test |
| `src/app/agent-cards/` | Agent cards, mini cards, detail panel + hover contract (11 agents) |
| `src/app/rules-panel/` | 3-level filterable rules |
| `src/app/protocols-panel/` | Protocol cards from `refined-source/protocols.json` |
| `src/app/pipeline-panel/` | Pipeline visualization (@joint/core) |
| `src/app/diagram-agent/` | Live diagram viewer (`/diagram-agent/:id`) rendering `refined-source/*` |
| `src/app/models/refined-source.ts` | Typed models + JSON imports |
| `src/app/testing/` | jsdom shims for graph specs |
| `src/index.html`, `src/styles.css` | Shell + global styles |

> Table is non-exhaustive — component directories also contain their `.html` / `.css` / `.spec.ts` files.

## Dependency flow

```
installed agent system (~/.config/opencode)
        │  manual curation (hand-made, jq-validated)
        ▼
refined-source/  (agents.json, rules.json, graph.json, protocols.json, agents/*.md)
        │  imported as TS modules at build time (resolveJsonModule)
        ▼
src/app components ──▶ rendered cards / graph / protocols / pipeline
```

- installed agent system → `refined-source/`: manual curation (no auto-script).
- `refined-source/` → `src/`: wired — the Angular app imports `refined-source/*.json` as TS modules at build time (`resolveJsonModule`).

## What is future

- **Additional routes** — only the diagram viewer is routed; no other pages exist.
- **Diagram-agent mirror** — the `diagram-agent/` static mirror is `deprecated`; the live viewer at `/diagram-agent/:id` (`src/app/diagram-agent/diagram-agent-viewer.ts`) renders `refined-source/*` instead. See `diagram-agent/README.md` (`status: deprecated`).

## References

- Slices: `docs/project.md` → `agent-system`, `protocols`, `refined-source`, `frontend-skeleton`, `graph-ui`
- Agents: `docs/context/agent-catalog.md`
- Protocols: `docs/context/protocols.md`
- Data layer: `docs/context/refined-source-data.md`
