---
last_updated: 2026-08-23
description: The refined-source data layer — agents.json, rules.json, graph.json schemas, hover contract, jq validation, manual curation workflow.
tags: [refined-source, data-layer, json, agents.json, rules.json, graph.json, jq]
status: active
---

# Refined Source Data

`refined-source/` is the curated presentation layer for the Agent Wizard UI. Source of truth: `source/` (clean copy of `.opencode/`). See `docs/protocols/refined-source-curation.md` for the evolution workflow.

## Files

| File | Content |
|---|---|
| `agents.json` | 14 agent cards |
| `rules.json` | Rule cards, 3 levels |
| `graph.json` | Delegation graph |
| `agents/*.md` | Per-agent detail prose (14) |
| `README.md` | Overview + hover contract |

## agents.json schema

| Field | Type | Notes |
|---|---|---|
| `id` | string | kebab-case agent id |
| `displayName` | string | Human label |
| `role` | string | One-line role |
| `group` | string | One of 7 groups |
| `essence` | string | What the agent is |
| `model` | string \| null | `inherit` or explicit model |
| `temperature` | number \| null | Sampling temperature |
| `mode` | string | `primary` or `subagent` |
| `permission` | object | Tool allow/deny + `task` allow-list |
| `canCall` | string[] | Delegation targets (empty = leaf) |
| `specificBeyondGeneral` | string | What the agent does beyond global rules |
| `relatedFiles` | string[] | Real paths; must resolve |

## rules.json structure

| Level | Key | Count | Notes |
|---|---|---|---|
| Global | `global` | 12 | Applies to every agent; each has `severity` (hard/medium) |
| Group | `groups` | 6 families | `coders`, `guardians`, `exploration`, `quality`, `writers`, `coordination`; each has `members` + `rules` |
| Agent-specific | `agentSpecific` | 6 agents | `delivery`, `orchestrator`, `interpreter`, `explorer`, `reviewer`, `analista` |

Every rule cites `source` (the file it comes from).

## graph.json structure

| Key | Content |
|---|---|
| `meta` | `version`, `generated`, `source`, `description`, `layoutHint` |
| `groups` | 7 groups with `id`, `label`, `color`, `order` |
| `nodes` | 14 nodes with `id`, `label`, `group`, `level`, `isPrimary` |
| `edges` | 27 edges with `from`, `to`, `kind`, optional `label` |

## Hover contract (per card)

1. **Can call** — `canCall` / `edges`; empty `[]` = leaf; self-loop = recursive fan-out.
2. **Beyond general rules** — `specificBeyondGeneral`; global rules deliberately not repeated.
3. **Related files** — `relatedFiles[]` rendered as clickable chips; `if applicable` (vision-relay, external-scout have minimal surface).

## Validation

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
```

## Curation workflow

1. Change originates in `.opencode/` → update `source/` copy if needed.
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` (pretty-printed, jq-checked).
3. Add/update `agents/<id>.md` if prose is needed.
4. Bump `graph.json → meta.version` and `meta.generated`.
5. Validate with jq.

## References

- Workflow: `docs/protocols/refined-source-curation.md`
- Catalog: `docs/context/agent-catalog.md`
- Rules: `docs/context/rules-hierarchy.md`