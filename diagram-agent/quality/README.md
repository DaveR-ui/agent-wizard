---
last_updated: 2026-08-23
description: Group index — quality (1 node, color #9333EA) — members and edges from refined-source/graph.json v1.0.0
tags: [diagram-agent, quality, index, graph]
status: active
---

# Group — Quality

> Navigate from graph: this index links to the flat files for the `quality` group. Source: [`refined-source/graph.json`](../../refined-source/graph.json) (v1.0.0, 14 nodes, 27 edges).

| Field | Value |
|---|---|
| **Group id** | `quality` |
| **Label** | Quality |
| **Color** | `#9333EA` |
| **Order** | 1 |
| **Members** | 1 |

## Members

| Node | Label | Level | Primary | Link |
|---|---|---|---|---|
| `tester` | Tester | 2 | no | [../tester.md](../tester.md) |

## Edges

Incident edges where `from` or `to` is a member of `quality` (from `refined-source/graph.json#edges`).

### Incoming to this group

| From | To | Kind | Label |
|---|---|---|---|
| `delivery` | `tester` | direct | — |
| `orchestrator` | `tester` | parallel | — |

### Outgoing from this group

No outgoing task edges — `tester` is a leaf.

### Visualization (Mermaid — optional)

```mermaid
flowchart TD
  delivery --> tester
  orchestrator --> tester
```

## References

- Flat file: [../tester.md](../tester.md)
- Graph source: [`refined-source/graph.json`](../../refined-source/graph.json)
- Overview: [../README.md](../README.md)
