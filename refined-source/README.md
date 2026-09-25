---
last_updated: 2026-09-24
description: Curated JSON + MD presentation layer for the Agent Wizard UI — 11 agents, 20 edges, 7 groups, 6 protocols, source = installed agent-system.
tags: [refined-source, data-layer, agents.json, graph.json, rules.json, protocols.json, hover-contract, curation]
status: active
---

# Refined Source — Agent Wizard Graph Data

> **Purpose**: Curated, human-maintained JSON + MD that power the Agent Wizard UI. The source of truth is the **installed agent system** (the global opencode config, `~/.config/opencode`, resolved at runtime through the `agent-system` reference). This folder is the **presentation layer** — manually curated, pretty-printed, `jq`-validated.

## What's here

| File | Drives |
|---|---|
| `agents.json` | Cards: one per agent — `id`, `displayName`, `role`, `essence`, `group`, `canCall[]`, `specificBeyondGeneral`, `relatedFiles[]`, frontmatter (`model`, `temperature`, `mode`, `permission`) — 11 agents v1.2.0 (flat `agents/`, `project-context` removed) |
| `rules.json` | Rule cards: 3 levels — `global[]`, `groups[]` (group rules), `agentSpecific[]` — each rule cites `source` file and carries `kind` (`passive`/`active`) |
| `graph.json` | Visualization: `nodes[]` (11) + `edges[]` (20) + `groups[]` (7 with `race`+`flavor` display-only RPG layer, v1.2.0) — delegation graph via `task` tool |
| `protocols.json` | Protocols tab: the 6 `protocols/*.md` of the installed system (dispatch highlighted) + the Protocolo-vs-Skill comparison |
| `agents/*.md` | Per-agent markdown for the detailed card view — 11 actual |
| `README.md` | This overview |

## How to use (Angular 22.1.x, CLI 22.1.5)

```ts
import agents from './refined-source/agents.json';
import rules from './refined-source/rules.json';
import graph from './refined-source/graph.json';
import protocols from './refined-source/protocols.json';
// agents -> cards grid (11 agents)
// graph.nodes/edges/groups -> force-directed graph via @swimlane/ngx-graph ^13.0.0 (d3 ^7.x transitively) inside Angular Material indigo-pink tab shell
// rules -> 3-level filterable list (global 2, groups 6 families, agentSpecific 6 agents)
// protocols -> Protocols tab (6 entries, dispatch highlighted, protocol-vs-skill block)
// Card hover: canCall (delegation) + specificBeyondGeneral + relatedFiles section
```

Stack installed: **Angular 22.1.x** (CLI 22.1.5, standalone components), **@swimlane/ngx-graph ^13.0.0**, **@angular/material 22.1.x** (prebuilt indigo-pink theme, `provideAnimationsAsync()`), Vitest ^4.0.8.

## Hover contract (per card)

1. **Can call** — `canCall` from `agents.json` / `edges` from `graph.json` (via `task` tool). Empty `[]` = leaf (does work, returns JSON, doesn't delegate). Self-loop = recursive fan-out (explorer CHUNK_SIZE 20, reviewer partition).
2. **What it does beyond general rules** — `specificBeyondGeneral` short paragraph; global rules deliberately NOT repeated here (they live in `rules.json → global`).
3. **Related files** — `relatedFiles[]` rendered as clickable chips.

## relatedFiles resolution rule

`relatedFiles` mixes two path vocabularies:

- **Agent-system assets** — bare, agent-system-relative paths (`agents/…`, `protocols/…`, `opencode.json`). These resolve against the installed agent system (the `agent-system` reference root), **not** in this repo. They are display-only in the UI.
- **Project documents** — in-repo paths (`docs/…`, `refined-source/…`). These must resolve in this repository.

Never emit `.opencode/...` paths: that tree is a stale, gitignored vendored copy, not the source of truth.

## Relationship to the installed agent system (sole source)

```
~/.config/opencode/        # installed agent system (read-only source of truth)
├── agents/*.md            # 11 flat agents + *.schema.json
├── protocols/*.md         # 6 protocols
├── opencode.json, readme.md, lore.md
└── ...

agent-wizard/
└── refined-source/        # this folder (manually curated presentation)
    ├── agents.json        # 11 agents
    ├── rules.json         # global 2, groups 6, agentSpecific 6
    ├── graph.json         # 11 nodes, 20 edges, 7 groups, v1.2.0
    ├── protocols.json     # 6 protocols + protocol-vs-skill
    ├── README.md
    └── agents/*.md        # 11 actual
```

The system is the **cyborges** fork of **DaverAgent** (identity layer only; agent ids, prompts, permissions and routing are unchanged).

## How to evolve (manual curation)

No auto-script. Edit by hand:

1. Change originates in the installed agent system (`agents/`, `protocols/`, `opencode.json`).
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` / `protocols.json` — keep them valid JSON (pretty-printed, `jq` checked; `rules.json` ordered passive-first with `kind`).
3. Add or update `agents/<id>.md` if the card detail needs prose (11 actual).
4. Bump `graph.json → meta.version` and `meta.generated` (current: `1.2.0` / `2026-09-24`).
5. Validate: `jq empty agents.json && jq empty rules.json && jq empty graph.json && jq empty protocols.json` and counts (see Verification).

## Verification (v1.2.0)

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json && jq empty refined-source/protocols.json
# counts (v1.2.0):
# jq length refined-source/agents.json               # 11
# jq '.nodes | length' refined-source/graph.json     # 11
# jq '.edges | length' refined-source/graph.json     # 20
# jq '.groups | length' refined-source/graph.json    # 7 (each with race+flavor)
# jq '.protocols | length' refined-source/protocols.json # 6
# jq '.meta.version' refined-source/graph.json       # "1.2.0"
# jq '.meta.generated' refined-source/graph.json     # "2026-09-24"
ls -R refined-source
```

## Design decisions

- **Manual curation over script**: user chose `curado manual, iterativo` to allow later professionalization (polished writing, grouping, colors, race/flavor) without fighting generator output.
- **Kebab-case path**: `agent-wizard/refined-source` (NOT `refined source` with space) per clarification.
- **English data**: all JSON/MD content in English per `doc_language: english`; Spanish UI labels are a display layer only.
- **No `.opencode/` references**: the repo's vendored `.opencode/` is stale and gitignored; the installed agent system is the sole source.
- **Protocols are flexible, skills are strict**: the system ships no skills by design — conventions are prose `protocols/*.md`.

## Open extensions

- Add `agents.json → position {x,y}` if a fixed layout is desired (current: layoutHint force-directed).
- Split `rules.json → groups` into separate file per group if it grows.
- Add `metadata.json` for version history if tracking deltas becomes useful.
