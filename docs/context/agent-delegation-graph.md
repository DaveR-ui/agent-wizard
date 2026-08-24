---
last_updated: 2026-08-24
description: The canCall delegation graph from refined-source/graph.json — 12 nodes, 22 edges, 7 groups v1.1.0 with race+flavor, edge kinds and routing.
tags: [graph, delegation, canCall, edges, routing, fan-out]
status: active
---

# Agent Delegation Graph

The delegation graph in `refined-source/graph.json` models who can call whom via the `task` tool. Nodes = agents, edges = `canCall` (from `permission.task` frontmatter).

## Graph shape

| Aspect | Value |
|---|---|
| Nodes | 12 (v1.1.0 — was 14; `vision-relay` removed and `coder-angular`/`coder-go` merged to single `coder` with `language` param) |
| Edges | 22 (was 26; `delivery→vision-relay` and `orchestrator→vision-relay` removed, `delivery coder-angular/go→coder` and `orchestrator coder-angular/go→coder` merged) |
| Groups | 7 with colors + `race`+`flavor` display-only RPG layer v1.1.0 (coordination #4F46E5 Herald, analysis #06B6D4 Diviner, guardians #DC2626 Sentinel, coders #16A34A Artificer, exploration #CA8A04 Ranger, quality #9333EA Inquisitor, writers #EA580C Lorekeeper) |
| Layout hint | Force-directed: coordination top, guardians middle, coders/quality/writers leaves, exploration periphery |
| Meta | `version 1.1.0`, `generated 2026-08-24`, source `agent-wizard/.opencode (sole source; source/ deleted 2026-08-24)` |

## Edge kinds

| Kind | Count | Meaning | Examples |
|---|---|---|---|
| `always` | 1 | Mandatory first call | delivery → interpreter (Step 0) |
| `non-trivial` | 1 | Only for non-trivial packets | delivery → orchestrator |
| `direct` | 9 | Trivial post-Step-0 delegation | delivery → coder, tester, reviewer, documenter, ... (11→9 direct after coder merge) |
| `fan-out` | 2 | Split work across instances | orchestrator → coder, explorer (was 3: coder-angular, coder-go, explorer) |
| `parallel` | 7 | Same-type parallel delegation | orchestrator → tester, reviewer, architect, project-context, external-scout, analista, documenter (was 8) |
| `recursive-fanout` | 2 | Self-loop, chunked recursion | explorer → explorer (CHUNK_SIZE 20), reviewer → reviewer |

> 1.0.1 change: removed `optional` orchestrator→interpreter edge (1). Orchestrator canCall 12→11; delivery retains interpreter. Edge count 27→26.
> 1.0.2 change: removed delivery→vision-relay, orchestrator→vision-relay, merged delivery→coder-angular/go→coder and orchestrator→coder-angular/go→coder. Delivery canCall 13→11, orchestrator 11→9, edges 26→22, nodes 14→13 spec (12 actual).
> 1.1.0 change: display-only `race` + `flavor` per group (RPG layer); no node/edge change. Version bump 1.0.2→1.1.0, generated 2026-08-24.

## Routing

- **Delivery** routes by `permission.task` allow-list + the Delegation table (action type → agent). Interpreter-first is the hard gate on every turn. Single `coder` now handles both Angular and Go via `language` param.
- **Orchestrator** fans out when input exceeds a window: split file list into chunks of 10–20, run N parallel `task` calls, de-duplicate results, promote severity to max. Orchestrator→coder is now single fan-out (was two).
- **Leaf agents** (`canCall: []`) do the work and return structured JSON: interpreter (now also image inspection), coder, tester, architect, analista, documenter, project-context, external-scout. Explorer and reviewer retain recursive fan-out.

## Cost note

Fan-out multiplies cost. Use it only when input is too large for one instance; default to the cheap tier.

## References

- Catalog: `docs/context/agent-catalog.md`
- Data schema: `docs/context/refined-source-data.md`
