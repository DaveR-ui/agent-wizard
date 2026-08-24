---
last_updated: 2026-08-23
description: Group index — writers (1 node, color #EA580C) — members and edges from refined-source/graph.json v1.0.0
tags: [diagram-agent, writers, index, graph]
status: active
---

# Group — Writers

> Navigate from graph: this index links to the flat files for the `writers` group. Source: [`refined-source/graph.json`](../../refined-source/graph.json) (v1.0.0, 14 nodes, 27 edges).

| Field | Value |
|---|---|
| **Group id** | `writers` |
| **Label** | Writers |
| **Color** | `#EA580C` |
| **Order** | 6 |
| **Members** | 1 |

## Members

| Node | Label | Level | Primary | Link |
|---|---|---|---|---|
| `documenter` | Documenter | 2 | no | [../documenter.md](../documenter.md) |

## Edges

Incident edges where `from` or `to` is a member of `writers` (from `refined-source/graph.json#edges`).

### Incoming to this group

| From | To | Kind | Label |
|---|---|---|---|
| `delivery` | `documenter` | direct | — |
| `orchestrator` | `documenter` | parallel | — |

### Outgoing from this group

No outgoing task edges — `documenter` is a leaf.

### Visualization (Mermaid — optional)

```mermaid
flowchart TD
  delivery --> documenter
  orchestrator --> documenter
```

## References

- Flat file: [../documenter.md](../documenter.md)
- Graph source: [`refined-source/graph.json`](../../refined-source/graph.json)
- Overview: [../README.md](../README.md)
