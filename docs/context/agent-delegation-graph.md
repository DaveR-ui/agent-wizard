---
last_updated: 2026-08-23
description: The canCall delegation graph from refined-source/graph.json — 14 nodes, 27 edges, edge kinds, routing and fan-out behavior.
tags: [graph, delegation, canCall, edges, routing, fan-out]
status: active
---

# Agent Delegation Graph

The delegation graph in `refined-source/graph.json` models who can call whom via the `task` tool. Nodes = agents, edges = `canCall` (from `permission.task` frontmatter).

## Graph shape

| Aspect | Value |
|---|---|
| Nodes | 14 (agents) |
| Edges | 27 |
| Groups | 7 with colors (coordination #4F46E5, analysis #06B6D4, guardians #DC2626, coders #16A34A, exploration #CA8A04, quality #9333EA, writers #EA580C) |
| Layout hint | Force-directed: coordination top, guardians middle, coders/quality/writers leaves, exploration periphery |
| Meta | `version 1.0.0`, `generated 2026-08-23`, source `agent-wizard/source` |

## Edge kinds

| Kind | Count | Meaning | Examples |
|---|---|---|---|
| `always` | 1 | Mandatory first call | delivery → interpreter (Step 0) |
| `non-trivial` | 1 | Only for non-trivial packets | delivery → orchestrator |
| `direct` | 11 | Trivial post-Step-0 delegation | delivery → coder-angular, tester, reviewer, documenter, ... |
| `optional` | 1 | Conditional | orchestrator → interpreter |
| `fan-out` | 3 | Split work across instances | orchestrator → coder-angular, coder-go, explorer |
| `parallel` | 8 | Same-type parallel delegation | orchestrator → tester, reviewer, architect, ... |
| `recursive-fanout` | 2 | Self-loop, chunked recursion | explorer → explorer (CHUNK_SIZE 20), reviewer → reviewer |

## Routing

- **Delivery** routes by `permission.task` allow-list + the Delegation table (action type → agent). Interpreter-first is the hard gate on every turn.
- **Orchestrator** fans out when input exceeds a window: split file list into chunks of 10–20, run N parallel `task` calls, de-duplicate results, promote severity to max.
- **Leaf agents** (`canCall: []`) do the work and return structured JSON: interpreter, coders, tester, architect, analista, documenter, project-context, vision-relay, external-scout.

## Cost note

Fan-out multiplies cost. Use it only when input is too large for one instance; default to the cheap tier.

## References

- Catalog: `docs/context/agent-catalog.md`
- Data schema: `docs/context/refined-source-data.md`