---
last_updated: 2026-08-25
description: The refined-source data layer — agents.json, rules.json (passive-first with kind), graph.json schemas, hover contract, jq validation, and manual curation workflow. (14→13 spec / 12 actual)
tags: [refined-source, data-layer, json, agents.json, rules.json, graph.json, jq, passive, active]
status: active
---

# Refined Source Data

`refined-source/` is the curated presentation layer for the Agent Wizard UI. Source of truth: `.opencode/` (sole source; `source/` clean copy deleted 2026-08-24, previously the presentation source). See `docs/protocols/refined-source-curation.md` for the evolution workflow.

## Files

| File | Content |
|---|---|
| `agents.json` | 13 agent cards (spec) / 12 actual — single `coder` with language param, vision-relay removed (was 14) |
| `rules.json` | Rule cards, 3 levels (global 2, groups 6 families, agentSpecific 6 agents) — coders members [coder], exploration [explorer, project-context, external-scout] |
| `graph.json` | Delegation graph (13 nodes spec / 12 actual, 22 edges, 7 groups, v1.0.2) — was 14 nodes, 26 edges v1.0.1 |
| `agents/*.md` | Per-agent detail prose (12 actual / 13 spec — coder.md replaces coder-angular/go, vision-relay removed, interpreter expanded) |
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

**Coder language param**: `coder` is language-parameterized — `language=angular|go` branches to Angular docs+MCP or Go docs+gofmt/vet. Single entry `id=coder` replaces `coder-angular`/`coder-go`; `relatedFiles` = [`.opencode/agents/subagents/coder.md`, `.opencode/agents/subagents/coder.schema.json`, `docs/project.md`, `docs/context/architecture.md`].

## rules.json structure

| Level | Key | Count | Notes |
|---|---|---|---|
| Global | `global` | 2 | Applies to every agent; each has `severity` (hard/medium) + `kind` (`passive`). Was 12 pre-1.0.1, 7 in 1.0.1, now 2: `0001`/`0009`/`0010`/`0012` removed from the formal set, `0011` demoted to a discretionary decision (2026-08-23) |
| Group | `groups` | 6 families | `coders` (4: 1 passive → 3 active, members [coder]), `guardians` (4: 3 passive → 1 active), `exploration` (4: 2 passive → 2 active, members [explorer, project-context, external-scout] — vision-relay rule 0025 removed, capability migrated to interpreter), `quality` (2 passive), `writers` (2: 1 passive → 1 active), `coordination` (6: 1 passive → 5 active: `0030,0031` + `0003-0006`); each has `members` + `rules` ordered passive-first |
| Agent-specific | `agentSpecific` | 6 agents | `delivery` (3: 1 passive → 2 active: `0032` + `0002,0033`), `orchestrator` (2 active), `interpreter` (1 active, now includes image-inspection fallback), `explorer` (1 active), `reviewer` (1 passive), `analista` (1 passive) |

Every rule cites `source` (the file it comes from) and carries `kind` (`passive` = invariant, `active` = behavioral) — see `docs/context/rules-hierarchy.md#passive-vs-active-ordering`. Physical JSON order is passive-first within each level/family, then by `id` ascending.

## graph.json structure

| Key | Content |
|---|---|
| `meta` | `version 1.0.2`, `generated 2026-08-25`, `source agent-wizard/.opencode (sole source)`, `description 13 nodes 22 edges (spec) / 12 actual`, `layoutHint` |
| `groups` | 7 groups with `id`, `label`, `color`, `order` |
| `nodes` | 12 actual (13 spec) nodes with `id`, `label`, `group`, `level`, `isPrimary` — single `coder` replaces `coder-angular`/`coder-go`, `vision-relay` removed |
| `edges` | 22 edges with `from`, `to`, `kind`, optional `label` (was 26; delivery→vision-relay, orchestrator→vision-relay removed, coder-angular/go merged to coder) |

## Hover contract (per card)

1. **Can call** — `canCall` / `edges`; empty `[]` = leaf; self-loop = recursive fan-out.
2. **Beyond general rules** — `specificBeyondGeneral`; global rules deliberately not repeated.
3. **Related files** — `relatedFiles[]` rendered as clickable chips; `if applicable` (external-scout has minimal surface; interpreter now also shows image-inspection).

**relatedFiles exception**: paths pointing into sibling projects (`frontend/`, `backend/`) are intentionally non-resolvable in-repo — they reference the sibling repo tree and are display-only in the UI. The must-resolve rule applies to in-repo paths (`.opencode/`, `docs/`, `opencode.json`, `refined-source/`). Note: `.opencode/agents/subagents/coder.md` and `coder.schema.json` are the new unified coder paths post-1.0.2; if runtime still carries `coder-angular.md`/`coder-go.md`, treat as legacy twin.

## Validation

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
# counts (spec vs actual):
# jq length refined-source/agents.json            # 12 actual (13 spec narrative)
# jq '.nodes | length' refined-source/graph.json  # 12 actual (13 spec)
# jq '.edges | length' refined-source/graph.json  # 22
```

## Curation workflow

1. Change originates in `.opencode/` (sole source; `source/` deleted 2026-08-24 — no copy step).
2. Manually reflect in `agents.json` / `rules.json` / `graph.json` (pretty-printed, jq-checked; `rules.json` ordered passive-first with `kind`).
3. Add/update `agents/<id>.md` if prose is needed.
4. Bump `graph.json → meta.version` and `meta.generated` (current: `1.0.2` / `2026-08-25`).
5. Validate with jq.

## References

- Workflow: `docs/protocols/refined-source-curation.md`
- Catalog: `docs/context/agent-catalog.md`
- Rules: `docs/context/rules-hierarchy.md`
