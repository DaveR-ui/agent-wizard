---
last_updated: 2026-09-24
description: The canCall delegation graph from refined-source/graph.json — 11 nodes, 20 edges, 7 groups, v1.2.0. Edge kinds and routing.
tags: [graph, delegation, canCall, edges, routing, fan-out]
status: active
---

# Agent Delegation Graph

The delegation graph in `refined-source/graph.json` models who can call whom via the `task` tool. Nodes = agents, edges = `canCall` (from `permission.task` frontmatter).

## Graph shape

| Aspect | Value |
|---|---|
| Nodes | **11** (one per agent; `project-context` removed) |
| Edges | **20** |
| Groups | 7 with colors (coordination, analysis, guardians, coders, exploration, quality, writers) |
| Layout hint | Force-directed: coordination top, guardians middle, coders/quality/writers leaves, exploration periphery |
| Meta | `version 1.2.0`, `generated 2026-09-24`, source `agent-system (installed global config; flat agents/, 6 protocols)` |

## Edge kinds

| Kind | Count | Meaning | Examples |
|---|---|---|---|
| `always` | 1 | Mandatory first call | delivery → interpreter (Step 0) |
| `non-trivial` | 1 | Only for non-trivial packets | delivery → orchestrator |
| `direct` | 8 | Trivial post-Step-0 delegation | delivery → coder, tester, reviewer, architect, explorer, external-scout, analista, documenter |
| `fan-out` | 2 | Split work across instances | orchestrator → coder, explorer |
| `parallel` | 6 | Same-type parallel delegation | orchestrator → tester, reviewer, architect, external-scout, analista, documenter |
| `recursive-fanout` | 2 | Self-loop, chunked recursion | explorer → explorer (CHUNK_SIZE 20), reviewer → reviewer |

> v1.2.0 (2026-09-24): the graph is re-synced to the installed agent system — 11 nodes / 20 edges / 7 groups. `project-context` removed (its node and both edges gone); `delivery` canCall **10**, `orchestrator` canCall **8**. Edge kinds sum: 1 + 1 + 8 + 2 + 6 + 2 = 20.

## Routing

- **Delivery** routes by `permission.task` allow-list + the Delegation table (action type → agent). Interpreter-first is the hard gate on every turn. `delivery` canCall 10 (interpreter, orchestrator, coder, tester, reviewer, architect, explorer, external-scout, analista, documenter).
- **Orchestrator** fans out when input exceeds a window: split the file list into chunks of 10–20, run N parallel `task` calls, de-duplicate results, promote severity to max. `orchestrator` canCall 8 (coder, tester, reviewer, architect, explorer, external-scout, analista, documenter).
- **Leaf agents** (`canCall: []`) do the work and return structured JSON: interpreter, coder, tester, architect, analista, documenter, external-scout. `explorer` and `reviewer` retain recursive self-fan-out.

## Cost note

Fan-out multiplies cost. Use it only when input is too large for one instance; default to the cheap tier (subagents inherit the primary's model).

## References

- Catalog: `docs/context/agent-catalog.md`
- Protocols: `docs/context/protocols.md`
- Data schema: `docs/context/refined-source-data.md`
