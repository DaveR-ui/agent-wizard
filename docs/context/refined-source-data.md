---
last_updated: 2026-09-24
description: The refined-source data layer — agents.json (11), rules.json (passive-first with kind), graph.json (11 nodes / 20 edges, v1.2.0), protocols.json (6 protocols) schemas, hover contract, relatedFiles resolution rule, jq validation, and manual curation workflow.
tags: [refined-source, data-layer, json, agents.json, rules.json, graph.json, protocols.json, jq, passive, active]
status: active
---

# Refined Source Data

`refined-source/` is the curated presentation layer for the Agent Wizard UI. Source of truth: the **installed global agent system** (`~/.config/opencode`, via the `agent-system` reference) — never the repo's stale `.opencode/` vendored copy. See `docs/protocols/refined-source-curation.md` for the evolution workflow.

## Files

| File | Content |
|---|---|
| `agents.json` | 11 agent cards |
| `rules.json` | Rule cards, 3 levels (global 2, groups 6 families, agentSpecific 6 agents) — `kind` tagged, passive-first |
| `graph.json` | Delegation graph (11 nodes, 20 edges, 7 groups, v1.2.0) |
| `protocols.json` | Protocol cards (6 agent-system protocols) — drives the Protocolos tab |
| `agents/*.md` | Per-agent detail prose (11 actual) |
| `README.md` | Overview + hover contract |

## agents.json schema

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case agent id |
| `displayName` | string | Human label (Borges names are display-only, in `lore.md`) |
| `role` | string | One-line role |
| `group` | string | One of 7 groups |
| `essence` | string | What the agent is |
| `model` | string \| null | `inherit` or the resolved default (delivery) |
| `temperature` | number \| null | `null` everywhere (dead config on V2) |
| `mode` | string | `primary` or `subagent` |
| `permission` | object | Tool allow/deny + `task` allow-list |
| `canCall` | string[] | Delegation targets (empty = leaf) |
| `specificBeyondGeneral` | string | What the agent does beyond global rules |
| `relatedFiles` | string[] | Bare agent-system paths or in-repo paths (see resolution rule) |

**relatedFiles resolution rule**: `relatedFiles` uses two vocabularies.

- **Agent-system assets** — bare agent-system-relative paths (`agents/<id>.md`, `agents/<id>.schema.json`, `protocols/<name>.md`, `opencode.json`, `readme.md`, `lore.md`) resolve against the `agent-system` reference root. This is a **documented exception** to the must-resolve rule — like sibling-project refs (`frontend/`, `backend/`), they are display-only in the UI.
- **In-repo paths** — `docs/…`, `refined-source/…` must resolve inside the repo (post-change audit).

**Coder language param**: `coder` is language-parameterized — `language=angular|go` branches to Angular docs+MCP or Go docs+gofmt/vet. Single entry `id=coder`.

## protocols.json schema

Object with `meta`, `protocols[]` (one card per agent-system protocol, 6 total), and a `protocolVsSkill` comparison block. `meta` holds `source`, `version`, `generated`, `count`, `description`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case protocol id (`dispatch`, `prompt-pipeline`, …) |
| `file` | string | Bare agent-system-relative path `protocols/<id>.md` |
| `title` | string | Human label |
| `category` | string | Protocol class (`turn-entry`, `pipeline`, `thinking`, `template`, `recovery`) |
| `owner` | string | Seat(s) that run it (`delivery`, `orchestrator`, `interpreter`, …) |
| `highlight` | bool | `true` only for `dispatch` (pinned as the read-first card) |
| `summary` | string | One-line what the protocol is for |
| `steps` | string[] | Optional in-protocol outline (present on `dispatch` only) |

`dispatch` is the only card carrying `highlight: true`. `protocolVsSkill` compares `protocol{nature, mechanism}` (flexible prose markdown) vs `skill{nature, mechanism}` (strict-text, runtime-injected) plus a `why` note.

The 6 entries: `dispatch`, `prompt-pipeline`, `orchestrate`, `subagent-spec-template`, `session-recovery`, `broad-investigation-template`. See `docs/context/protocols.md`.

## rules.json structure

| Level | Key | Count | Notes |
|---|---|---|---|
| Global | `global` | 2 | Applies to every agent; each has `severity` (hard/medium) + `kind` (`passive`) |
| Group | `groups` | 6 families | `coders` (4), `guardians` (4), `exploration` (3: `0021` passive, `0022`/`0024` active — `0023` removed), `quality` (2 passive), `writers` (2), `coordination` (6) |
| Agent-specific | `agentSpecific` | 6 agents | `delivery` (3), `orchestrator` (2), `interpreter` (1), `explorer` (1), `reviewer` (1), `analista` (1) |

Every rule cites `source` (the file it comes from) and carries `kind` (`passive` = invariant, `active` = behavioral) — see `docs/context/rules-hierarchy.md#passive-vs-active-ordering`. Physical JSON order is passive-first within each level/family, then by `id` ascending.

## graph.json structure

| Key | Content |
|---|---|
| `meta` | `version 1.2.0`, `generated 2026-09-24`, `source agent-system (installed global config; flat agents/, 6 protocols)`, `description 11 nodes 20 edges, 7 groups`, `layoutHint` |
| `groups` | 7 groups with `id`, `label`, `color`, `order`, `race`, `flavor` (`race`/`flavor` = display-only RPG layer) |
| `nodes` | 11 nodes with `id`, `label`, `group`, `level`, `isPrimary` — one per agent (`project-context` removed) |
| `edges` | 20 edges with `from`, `to`, `kind`, optional `label` |

## Hover contract (per card)

1. **Can call** — `canCall` / `edges`; empty `[]` = leaf; self-loop = recursive fan-out.
2. **Beyond general rules** — `specificBeyondGeneral`; global rules deliberately not repeated.
3. **Related files** — `relatedFiles[]` rendered as clickable chips; `if applicable` (`external-scout` has a minimal surface).

## Validation

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json && jq empty refined-source/protocols.json
# counts (v1.2.0):
# jq length refined-source/agents.json            # 11
# jq '.protocols | length' refined-source/protocols.json # 6
# jq '.nodes | length' refined-source/graph.json  # 11
# jq '.edges | length' refined-source/graph.json  # 20
# jq '.groups | length' refined-source/graph.json # 7
# jq '.meta.version' refined-source/graph.json    # "1.2.0"
```

## Curation workflow

1. Change originates in the **installed agent system** (`~/.config/opencode`: `agents/<id>.md`, `protocols/*.md`, `opencode.json` — resolved via the `agent-system` reference; subject to the review loop, `docs/context/project-rules.md`). Never curate from the repo's stale `.opencode/`.
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` / `protocols.json` (pretty-printed, jq-checked; `rules.json` ordered passive-first with `kind`).
3. Add/update `agents/<id>.md` prose when needed.
4. Bump `graph.json → meta.version` and `meta.generated` (current: `1.2.0` / `2026-09-24`).
5. Validate with jq and confirm `relatedFiles` resolution.

## References

- Workflow: `docs/protocols/refined-source-curation.md`
- Catalog: `docs/context/agent-catalog.md`
- Protocols: `docs/context/protocols.md`
- Rules: `docs/context/rules-hierarchy.md`
