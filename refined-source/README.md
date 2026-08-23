# Refined Source — Agent Wizard Graph Data

> **Purpose**: Curated, human-maintained JSON + MD that power the Agent Wizard graph UI. Source of truth lives in `../source/` (clean copy of `.opencode`); this folder is the **presentation layer** — no node_modules, no scripts noise.

## What's here

| File | Drives |
|---|---|
| `agents.json` | Cards: one per agent — `id`, `displayName`, `role`, `essence`, `group`, `canCall[]`, `specificBeyondGeneral`, `relatedFiles[]`, frontmatter (`model`, `temperature`, `mode`, `permission`) |
| `rules.json` | Rule cards: 3 levels — `global[]`, `groups[]` (group rules), `agentSpecific[]` — each rule cites `source` file |
| `graph.json` | Visualization: `nodes[]` + `edges[]` (delegation graph via `task` tool) + `groups[]` with colors/layout hints |
| `agents/*.md` | Per-agent markdown for detailed card view / future MD rendering |
| `README.md` | This overview |

## How to use (Angular 21)

```ts
import agents from './refined-source/agents.json';
import rules from './refined-source/rules.json';
import graph from './refined-source/graph.json';
// agents -> cards grid
// graph.nodes/edges -> force-directed graph (e.g., d3, vis-network, ngx-graph)
// rules -> 3-level filterable list
// Card hover: canCall (delegation) + specificBeyondGeneral (what makes this agent unique beyond global rules) + relatedFiles section
```

## Hover contract (per card)

1. **Can call** — `canCall` from `agents.json` / `edges` from `graph.json` (via `task` tool). Empty `[]` = leaf (does work, returns JSON, doesn't delegate). Self-loop = recursive fan-out.
2. **What it does beyond general rules** — `specificBeyondGeneral` short paragraph; global rules deliberately NOT repeated here (they live in `rules.json → global`).
3. **Related files** — `relatedFiles[]` with `.opencode/...` paths. Render as clickable chips; `if applicable` — some agents (vision-relay, external-scout) have minimal file surface.

## Rule categorization (3 levels)

- **GLOBAL** — applies to every agent (e.g., inter-agent language English, interpreter-first hard gate). Count: 12 rules in `rules.json → global`.
- **GROUP** — applies to a family (e.g., `coders: complexity review`, `exploration: fan-out thresholds`). See `rules.json → groups`.
- **AGENT-SPECIFIC** — unique to one agent (e.g., interpreter only does vocabulary reconciliation via grep+glob). See `rules.json → agentSpecific`.

## Relationship to `../source/`

```
agent-wizard/
├── source/                 # clean copy of .opencode (node_modules REMOVED, everything else preserved)
│   ├── agents/subagents/*.md
│   ├── protocols/*.md
│   ├── workflows/*.md
│   ├── scripts/, tests/
│   ├── package.json (+ lock), README.md, INSTALL.md
│   └── .git/
└── refined-source/         # this folder (manually curated, evolvable)
    ├── agents.json
    ├── rules.json
    ├── graph.json
    ├── README.md
    └── agents/*.md
```

**Do NOT mutate original** `.opencode` at workspace root (`/run/media/admin/Datos/Matafuegos necochea/.opencode`). `source/` is the only copy that was cleaned (only `node_modules` removed per user choice; `.git`, lockfiles, md kept).

## How to evolve (manual curation)

No auto-script. Edit by hand:

1. Change originates in `.opencode` (protocol or agent frontmatter) → update `source/` copy if needed.
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` — keep them valid JSON (pretty-printed, `jq` checked).
3. Add or update `agents/<id>.md` if the card detail needs prose.
4. Bump `graph.json → meta.version` and `meta.generated`.
5. Validate: `jq empty agents.json && jq empty rules.json && jq empty graph.json && ls -R`.

## Verification

```bash
find "../source" -name "node_modules" | wc -l   # must be 0
ls -la "../../.opencode"                         # must still have node_modules (untouched)
ls -R .
jq . agents.json | head
jq . rules.json
jq . graph.json
```

## Design decisions

- **Manual curation over script**: user chose `curado manual, iterativo` to allow later professionalization (polished writing, grouping, colors) without fighting generator output.
- **Kebab-case path**: `agent-wizard/refined-source` (NOT `refined source` with space) per clarification.
- **English data**: all JSON/MD content in English per `doc_language: english`; Spanish UI labels can be added as display layer later.
- **No external libs added**: Angular 21 skeleton untouched (no graph lib pre-installed; integrator chooses d3/vis/ngx-graph).

## Open extensions

- Add `agents.json → position {x,y}` if a fixed layout is desired (current: layoutHint force-directed).
- Split `rules.json → groups` into separate file per group if it grows.
- Add `metadata.json` for version history if tracking deltas becomes useful.
