---
last_updated: 2026-08-24
description: Curated JSON + MD presentation layer for the Agent Wizard graph UI — 12 agents, 22 edges, 7 groups v1.1.0 with race+flavor, sole source .opencode.
tags: [refined-source, data-layer, agents.json, graph.json, rules.json, hover-contract, curation]
status: active
---

# Refined Source — Agent Wizard Graph Data

> **Purpose**: Curated, human-maintained JSON + MD that power the Agent Wizard graph UI. Source of truth lives in `.opencode/` (sole source; `source/` clean copy deleted 2026-08-24); this folder is the **presentation layer** — manually curated, pretty-printed, `jq`-validated.

## What's here

| File | Drives |
|---|---|
| `agents.json` | Cards: one per agent — `id`, `displayName`, `role`, `essence`, `group`, `canCall[]`, `specificBeyondGeneral`, `relatedFiles[]`, frontmatter (`model`, `temperature`, `mode`, `permission`) — 12 agents v1.1.0 (single `coder` with `language` param, `vision-relay` removed) |
| `rules.json` | Rule cards: 3 levels — `global[]`, `groups[]` (group rules), `agentSpecific[]` — each rule cites `source` file and carries `kind` (`passive`/`active`) |
| `graph.json` | Visualization: `nodes[]` (12) + `edges[]` (22) + `groups[]` (7 with `race`+`flavor` display-only RPG layer, v1.1.0) — delegation graph via `task` tool |
| `agents/*.md` | Per-agent markdown for detailed card view / future MD rendering — 12 actual (coder.md replaces coder-angular/go, vision-relay removed, interpreter expanded with image inspection) |
| `README.md` | This overview |

## How to use (Angular 22.1.x, CLI 22.1.5)

```ts
import agents from './refined-source/agents.json';
import rules from './refined-source/rules.json';
import graph from './refined-source/graph.json';
// agents -> cards grid (12 agents)
// graph.nodes/edges/groups -> force-directed graph via @swimlane/ngx-graph ^13.0.0 (d3 ^7.x transitively) inside Angular Material indigo-pink tab shell
// rules -> 3-level filterable list (global 2, groups 6 families, agentSpecific 6 agents)
// Card hover: canCall (delegation) + specificBeyondGeneral (what makes this agent unique beyond global rules) + relatedFiles section
```

Stack installed: **Angular 22.1.x** (CLI 22.1.5, standalone components), **@swimlane/ngx-graph ^13.0.0**, **@angular/material 22.1.x** (prebuilt indigo-pink theme, `provideAnimationsAsync()`), Vitest ^4.0.8.

## Hover contract (per card)

1. **Can call** — `canCall` from `agents.json` / `edges` from `graph.json` (via `task` tool). Empty `[]` = leaf (does work, returns JSON, doesn't delegate). Self-loop = recursive fan-out (explorer CHUNK_SIZE 20, reviewer partition).
2. **What it does beyond general rules** — `specificBeyondGeneral` short paragraph; global rules deliberately NOT repeated here (they live in `rules.json → global`).
3. **Related files** — `relatedFiles[]` with `.opencode/...` and `docs/...` paths. Render as clickable chips; `if applicable` — some agents (external-scout) have minimal file surface; interpreter now also shows image-inspection fallback.

## Relationship to `.opencode/` (sole source)

```
agent-wizard/
├── .opencode/             # sole source of truth (runtime config — agents, protocols, workflows, scripts, tests)
│   ├── agents/subagents/*.md  (12 flat, Branch B)
│   ├── protocols/<id>/*.md    (per-agent scrolls, 12 dirs) + shared protocols
│   ├── workflows/, scripts/, tests/
│   └── opencode.json
└── refined-source/        # this folder (manually curated presentation, evolvable)
    ├── agents.json        (12 agents)
    ├── rules.json         (global 2, groups 6, agentSpecific 6)
    ├── graph.json         (12 nodes, 22 edges, 7 groups, v1.1.0 race+flavor)
    ├── README.md
    └── agents/*.md        (12 actual)
```

> `source/` (clean copy of `.opencode` with `node_modules` removed) was **deleted 2026-08-24** — verified `ls` → No such file. Do not reference `../source/` or `source/` in new docs. See `docs/context/architecture.md` Dependency flow and `docs/context/refined-source-data.md`.

**Do NOT mutate** `.opencode` at the workspace root silently — review loop applies (`docs/context/project-rules.md`).

## How to evolve (manual curation)

No auto-script. Edit by hand:

1. Change originates in `.opencode/` (sole source — no `source/` copy step; deleted 2026-08-24).
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` — keep them valid JSON (pretty-printed, `jq` checked; `rules.json` ordered passive-first with `kind`).
3. Add or update `agents/<id>.md` if the card detail needs prose (12 actual; `vision-relay` removed, `coder.md` unified).
4. Bump `graph.json → meta.version` to `1.1.0` and `meta.generated` to `2026-08-24` (current: `1.1.0` / `2026-08-24` — race+flavor added, display-only).
5. Validate: `jq empty agents.json && jq empty rules.json && jq empty graph.json && ls -R` and counts (see Verification).

## Verification (v1.1.0)

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
# counts (v1.1.0):
# jq length refined-source/agents.json            # 12
# jq '.nodes | length' refined-source/graph.json  # 12
# jq '.edges | length' refined-source/graph.json  # 22
# jq '.groups | length' refined-source/graph.json # 7 (each with race+flavor)
# jq '.meta.version' refined-source/graph.json    # "1.1.0"
# jq '.meta.generated' refined-source/graph.json  # "2026-08-24"
ls -R refined-source
jq . refined-source/graph.json | head -n 40
```

## Design decisions

- **Manual curation over script**: user chose `curado manual, iterativo` to allow later professionalization (polished writing, grouping, colors, race/flavor) without fighting generator output.
- **Kebab-case path**: `agent-wizard/refined-source` (NOT `refined source` with space) per clarification.
- **English data**: all JSON/MD content in English per `doc_language: english`; Spanish UI labels are a display layer only.
- **Graph + UI libs installed**: **@swimlane/ngx-graph ^13.0.0** (force-directed, pulls d3 ^7.x) and **@angular/material 22.1.x** indigo-pink tab shell are now installed (explicit decisions 2026-08-23); previously "no graph lib pre-installed" is stale — integrator no longer chooses.

## Open extensions

- Add `agents.json → position {x,y}` if a fixed layout is desired (current: layoutHint force-directed).
- Split `rules.json → groups` into separate file per group if it grows.
- Add `metadata.json` for version history if tracking deltas becomes useful.
