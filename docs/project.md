# Project Information

> **Single source of truth for project info, conventions, and architecture.**
> The opencode agent system reads from `docs/` directly.
> There is no `.github/agent-context/`, no `.opencode/project.md`, and no `AGENT.md`.

## Overview

- **Project Name**: agent-wizard
- **Description**: Angular 22 SPA that visualizes the **installed global opencode agent system** — the `cyborges` fork of DaverAgent (11 agents, flat layout). The page renders agent cards, rule cards, the 6 protocols, and the delegation graph. The data layer lives in `refined-source/` and is imported by the Angular app at build time.

## Slices

The orchestrator uses this table to route incoming tasks. Each slice is a vertical cross-section of the project. When a prompt arrives, match it against the **Keywords** column to identify the slice and start from the **Entry points**.

| Slice | Description | Keywords | Entry points | Primary agents |
|---|---|---|---|---|
| docs | Documentation maintenance: project.md, context docs, protocols, indexes | docs, README, context, protocol, convention, documentation, tag index, frontmatter | `docs/` | documenter |
| agent-system | Installed global opencode agent system: agent definitions, protocols, scripts, runtime config | agent, subagent, protocol, dispatch, orchestrate, script, permission, frontmatter, schema, review loop, agent-system, lore, cyborges | installed agent system (`agent-system` reference / `~/.config/opencode`) | reviewer, analista, tester |
| protocols | Protocols tab: the 6 agent-system protocols curated for the UI | protocol, protocolo, skill, dispatch, prompt-pipeline, orchestrate | `refined-source/protocols.json`, `src/app/protocols-panel/`, `docs/context/protocols.md` | documenter, coder |
| refined-source | Curated JSON + MD data layer for the UI | refined-source, agents.json, rules.json, graph.json, protocols.json, card, hover, curation, jq | `refined-source/` | documenter |
| frontend-skeleton | Angular 22 SPA skeleton (Material tab shell) | angular, component, route, src, app, serve, build, test, skeleton | `src/`, `angular.json`, `package.json` | coder, tester |
| graph-ui | Graph visualization of the agent system — implemented | graph, visualization, force-directed, d3, joint, ngx-graph, node, edge | `refined-source/graph.json`, `src/app/*` | coder, reviewer |

### Slice matching rules

1. **Match by keywords first**: scan the prompt for terms in the Keywords column.
2. **Multi-slice tasks**: if a task touches multiple slices (e.g., "add a rule card to the data layer" → refined-source + docs), list all relevant slices and let the orchestrator coordinate.
3. **New slice detection**: if a task does NOT match any slice, the orchestrator MUST propose a new slice row with rationale before starting work. New slices should be added to this table permanently.
4. **Cross-cutting concerns**: the agent system lives in the installed global opencode config (`~/.config/opencode`, resolved through the `agent-system` reference) and in `refined-source/` (curated presentation). If the task is about runtime config, agent definitions, or protocols, route to `agent-system`. If it is about their curated presentation, route to `refined-source` (agents/rules/graph) or `protocols` (the protocols tab).
5. **Each slice is a vertical slice**: understand the full path from entry point to output before working (e.g., `refined-source` = JSON → card → hover contract).

## Technology Stack

- **Frontend**: Angular 22.1.x (CLI 22.1.5), standalone components
- **Language**: TypeScript ~6.0.3
- **Reactive**: RxJS ~7.8
- **Unit tests**: Vitest ^4.0.8 (via `@angular/build`; `ng test`)
- **DOM for tests**: jsdom ^28
- **Formatting**: Prettier ^3.8.1
- **Package manager**: npm 12.0.2 (`packageManager` field)
- **Node**: 22+ required (local 26.7.0)
- **UI components**: @angular/material 22.1.x (prebuilt indigo-pink theme; @angular/cdk + @angular/animations 22.1.x)
- **Graph**: @swimlane/ngx-graph ^13.0.0 (pulls d3 ^7.x transitively; peer deps @angular/cdk + @angular/animations)
- **Diagrams**: @joint/core ^4.3.2 (diagram primitives for the protocols/pipeline views)

**Explicitly NOT in this project** (they belong to the sibling `frontend/` project): Tailwind, Biome, Playwright, Storybook.

## Architecture

- **Pattern**: Three independent layers — agent system, data layer, Angular skeleton.
- **Agent system**: the **installed global opencode config** (`~/.config/opencode`, resolved through the `agent-system` reference) — the `cyborges` fork of DaverAgent. Flat `agents/<id>.md` + sibling `agents/<id>.schema.json`, `protocols/*.md` (6), `opencode.json`, `scripts/`, `lore.md`. There is **no** `workflows/`, no `agents/subagents/`, and no per-agent scrolls. The repo's own `.opencode/` is a stale, gitignored vendored copy — **never** the source of truth.
- **Data layer**: `refined-source/*.json` + `agents/*.md` — manually curated presentation of the installed agent system.
- **Angular skeleton**: `src/` — standalone-component app with a 4-tab Material shell (Agentes → agent cards, Reglas → rules, Protocolos → protocols, Pipeline); `app.routes.ts` is empty.
- **Data flow**: `refined-source/*.json` imported as TS modules at build time (`resolveJsonModule`) → Angular components → rendered cards/graph/protocols.
- **Graph UI**: consumes `graph.json` (11 nodes, 20 edges, 7 groups, v1.2.0) with a force-directed layout via @swimlane/ngx-graph.

## Commands

### Development

```bash
npm start        # or: ng serve — dev server at http://localhost:4200
```

### Build

```bash
ng build         # outputs to dist/
```

### Tests

```bash
ng test          # Vitest via @angular/build
ng e2e           # no e2e framework configured
```

### Scaffolding

```bash
ng generate component component-name
```

### Data validation (refined-source)

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json && jq empty refined-source/protocols.json
```

### Agent-system tests

```bash
bash scripts/validate-agent.sh   # run inside the installed agent-system clone (~/.config/opencode)
```

## Environment Variables

No application environment variables are required. The Angular dev server defaults to port `4200` (`ng serve --port` to override).

## Key Conventions

- **English only** — `doc_language: english`; all docs, comments, routing packets, and structured returns in English.
- **Kebab-case paths** — `refined-source/`, `docs/_TAG-INDEX.md`, etc.
- **refined-source is manually curated** — no auto-scripts; edits are hand-made and jq-validated.
- **refined-source source = the installed agent system** — never the repo's stale `.opencode/` vendored copy. Curate from `~/.config/opencode` (the `agent-system` reference).
- **relatedFiles resolution** — agent-system assets use bare agent-system-relative paths (`agents/…`, `protocols/…`, `opencode.json`, `readme.md`) that resolve against the `agent-system` reference root (documented exception, like sibling-project refs); in-repo paths (`docs/…`, `refined-source/…`) must resolve in-repo.
- **Never hardcode machine paths** — resolve the agent-system root at runtime from the `agent-system` reference; never commit absolute paths.
- **Agent-system changes require review** — edits to the installed agent system go through the review loop (Draft → Review → Apply → Verify), never applied silently.
- **No external libs without an explicit decision** — @swimlane/ngx-graph (graph UI), @joint/core (protocols/pipeline diagrams), and Angular Material (tab shell) were chosen explicitly; any other library still requires an explicit decision.
- **Quote paths with spaces** — workspace root is `/run/media/admin/Datos/projects/agent-wizard`; always quote paths defensively.

## Domain Entities

The data layer entities (see `docs/context/refined-source-data.md`):

- **Agent** (`agents.json`) — id, displayName, role, group, essence, model, temperature, mode, permission, canCall, specificBeyondGeneral, relatedFiles (11 agents)
- **Rule** (`rules.json`) — global / groups / agentSpecific, each citing a source file
- **Protocol** (`protocols.json`) — the 6 agent-system protocols (dispatch, prompt-pipeline, orchestrate, subagent-spec-template, session-recovery, broad-investigation-template): id, file, title, category, owner, highlight, summary, optional steps
- **Graph** (`graph.json`) — meta, groups (7), nodes (11), edges (20) — v1.2.0
- **Agent card prose** (`agents/*.md`) — per-agent detail for the card view
- **Agent-system layout** — installed global config: flat `agents/<id>.md` + `agents/<id>.schema.json`, `protocols/*.md`, `opencode.json`, `scripts/`, `lore.md` (no `workflows/`, no `subagents/`, no per-agent scrolls)

## Context Index

The single source of truth for strategic knowledge is `docs/context/`:

- `docs/context/README.md` - index and philosophy
- `docs/context/architecture.md` - layered architecture and dependency flow
- `docs/context/project-rules.md` - development standards
- `docs/context/agent-catalog.md` - the 11 agents (flat layout)
- `docs/context/agent-delegation-graph.md` - canCall graph and routing
- `docs/context/protocols.md` - the 6 agent-system protocols and the protocol-vs-skill distinction
- `docs/context/refined-source-data.md` - data layer schemas and validation
- `docs/context/rules-hierarchy.md` - 3-level rule hierarchy
- `docs/context/doc-conventions.md` - documentation conventions
- `docs/context/indexing-strategy.md` - tag-based doc search
- `docs/context/context-engineering.md` - load-on-demand context discipline
- `docs/protocols/README.md` - project protocols index
- `docs/protocols/refined-source-curation.md` - how to evolve refined-source/
- `docs/plans/README.md` - index of improvement plans (currently: RPG agent organization plan)
- `docs/local-dev.md` - local setup and commands
- `docs/production.md` - production notes (static hosting)
- `docs/_TAG-INDEX.md` - tag lookup for the doc tree