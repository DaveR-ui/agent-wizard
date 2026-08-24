---
last_updated: 2026-08-25
description: 'Deprecated: superseded by live RPG card at /diagram-agent/:id — mirror of refined-source/graph.json (12 nodes, 22 edges, 7 groups) is frozen; use the live viewer instead.'
tags: [diagram-agent, graph, overview, refined-source]
status: deprecated
---

# Diagram Agent — Graph Mirror (Deprecated)

> **Deprecated — superseded by the live RPG card at `/diagram-agent/:id`.** This static `diagram-agent/` mirror (v1.0.0, 14 nodes, 27 edges) is frozen and will be removed by a human later (never-delete convention during implementation). The live viewer renders the same data at runtime from `refined-source/agents.json + graph.json + rules.json` (v1.1.0, 12 nodes, 22 edges, 7 groups with race+flavor) — no static `.md` links remain in the viewer.

Mirror of [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0, generated 2026-08-23, 14 nodes, 27 edges, 7 groups) — flat files + group indexes. Static, no runtime writes. Navigated from the `Grafo de delegación` tab in the Angular app. **Status is now `deprecated`; the live viewer is the source of truth.**

## Structure

- **Flat files** (14): `diagram-agent/<id>.md` — one per node, kebab-case id, frontmatter + curated prose + provenance + editable placeholder.
- **Group indexes** (7): `diagram-agent/<group>/README.md` — members, edges, relative links `../<id>.md`.

Prefer relative markdown links, not symlinks or duplicate copies (Windows + drift risk). Source of truth remains `refined-source/graph.json` + `refined-source/agents.json` + `refined-source/agents/*.md` + `.opencode/agents/subagents/*.md` (hybrid provenance).

## Live viewer (current)

- **Route:** `/diagram-agent/:id` → `src/app/diagram-agent/diagram-agent-viewer.ts` (lazy, `withComponentInputBinding`)
- **Data:** live from `refined-source/agents.json` + `refined-source/graph.json` + `refined-source/rules.json` (v1.1.0)
- **Renders:** race badge + flavor (graph groups race/flavor), passives (3 tiers: world/race/personal filtered `kind=passive`), skills (`kind=active`), weapons (permission entries) + summons (`permission.task`), protocol scrolls (`relatedFiles` filtered `.opencode/protocols/`), outgoing/incoming edges.
- **No static links:** `docHref` / `groupIndexHref` removed; no `/diagram-agent/*.md` hrefs remain.

## Groups

Source: `refined-source/graph.json#groups` (version 1.0.0, 7 groups)

| Order | Group | Label | Color | Members | Index |
|---|---|---|---|---|---|
| 0 | `coordination` | Coordination | `#4F46E5` | 2 | [coordination/README.md](coordination/README.md) |
| 1 | `analysis` | Analysis | `#06B6D4` | 1 | [analysis/README.md](analysis/README.md) |
| 2 | `guardians` | Guardians | `#DC2626` | 3 | [guardians/README.md](guardians/README.md) |
| 3 | `coders` | Coders | `#16A34A` | 2 | [coders/README.md](coders/README.md) |
| 4 | `exploration` | Exploration | `#CA8A04` | 4 | [exploration/README.md](exploration/README.md) |
| 5 | `quality` | Quality | `#9333EA` | 1 | [quality/README.md](quality/README.md) |
| 6 | `writers` | Writers | `#EA580C` | 1 | [writers/README.md](writers/README.md) |

## Nodes

Source: `refined-source/graph.json#nodes` (14 nodes) + `refined-source/agents.json`

| Node | Label | Group | Level | Primary | Flat file |
|---|---|---|---|---|---|
| `delivery` | Delivery | coordination | 0 | yes | [delivery.md](delivery.md) |
| `orchestrator` | Orchestrator | coordination | 1 | no | [orchestrator.md](orchestrator.md) |
| `interpreter` | Interpreter | analysis | 1 | no | [interpreter.md](interpreter.md) |
| `explorer` | Explorer | exploration | 2 | no | [explorer.md](explorer.md) |
| `project-context` | Project Context | exploration | 2 | no | [project-context.md](project-context.md) |
| `external-scout` | External Scout | exploration | 2 | no | [external-scout.md](external-scout.md) |
| `vision-relay` | Vision Relay | exploration | 2 | no | [vision-relay.md](vision-relay.md) |
| `coder-angular` | Coder Angular | coders | 2 | no | [coder-angular.md](coder-angular.md) |
| `coder-go` | Coder Go | coders | 2 | no | [coder-go.md](coder-go.md) |
| `reviewer` | Reviewer | guardians | 2 | no | [reviewer.md](reviewer.md) |
| `tester` | Tester | quality | 2 | no | [tester.md](tester.md) |
| `architect` | Architect | guardians | 2 | no | [architect.md](architect.md) |
| `analista` | Analista | guardians | 2 | no | [analista.md](analista.md) |
| `documenter` | Documenter | writers | 2 | no | [documenter.md](documenter.md) |

## Edges

Source: `refined-source/graph.json#edges` (27 edges) — `from → to (kind, label)`. Layout hint: `Force-directed with coordination layer top, guardians middle, coders/quality/writers leaves, exploration periphery`.

| # | From | To | Kind | Label |
|---|---|---|---|---|
| 1 | `delivery` | `interpreter` | always | Step 0 |
| 2 | `delivery` | `orchestrator` | non-trivial | delegate |
| 3 | `delivery` | `coder-angular` | direct | trivial code |
| 4 | `delivery` | `coder-go` | direct | — |
| 5 | `delivery` | `tester` | direct | — |
| 6 | `delivery` | `reviewer` | direct | — |
| 7 | `delivery` | `architect` | direct | — |
| 8 | `delivery` | `explorer` | direct | — |
| 9 | `delivery` | `project-context` | direct | — |
| 10 | `delivery` | `vision-relay` | direct | — |
| 11 | `delivery` | `external-scout` | direct | — |
| 12 | `delivery` | `analista` | direct | — |
| 13 | `delivery` | `documenter` | direct | — |
| 14 | `orchestrator` | `interpreter` | optional | — |
| 15 | `orchestrator` | `coder-angular` | fan-out | — |
| 16 | `orchestrator` | `coder-go` | fan-out | — |
| 17 | `orchestrator` | `tester` | parallel | — |
| 18 | `orchestrator` | `reviewer` | parallel | — |
| 19 | `orchestrator` | `architect` | parallel | — |
| 20 | `orchestrator` | `explorer` | fan-out | — |
| 21 | `orchestrator` | `project-context` | parallel | — |
| 22 | `orchestrator` | `vision-relay` | parallel | — |
| 23 | `orchestrator` | `external-scout` | parallel | — |
| 24 | `orchestrator` | `analista` | parallel | — |
| 25 | `orchestrator` | `documenter` | parallel | — |
| 26 | `explorer` | `explorer` | recursive-fanout | CHUNK_SIZE 20 |
| 27 | `reviewer` | `reviewer` | recursive-fanout | partition by independence |

Total: 27 edges. Verify: `jq '.edges|length' ../refined-source/graph.json` → 27.

## Validation

- `jq` not needed for MD, but ensure no broken links: every `../<id>.md` and `../refined-source/graph.json` must resolve; group indexes link via `../<id>.md`.
- Any change to `graph.json` (version bump, nodes/edges) must be manually mirrored here (manual curation, no auto-script per `docs/protocols/refined-source-curation.md`).

## References

- Source of truth: [`refined-source/graph.json`](../refined-source/graph.json) (v1.1.0), [`refined-source/agents.json`](../refined-source/agents.json), [`refined-source/README.md`](../refined-source/README.md) + [`refined-source/agents/*.md`](../refined-source/agents/) (12 files)
- Architecture: [`docs/context/architecture.md`](../docs/context/architecture.md) (layers, diagram-agent is static, no runtime API)
- Data layer: [`docs/context/refined-source-data.md`](../docs/context/refined-source-data.md)
- Curation: [`docs/protocols/refined-source-curation.md`](../docs/protocols/refined-source-curation.md)
