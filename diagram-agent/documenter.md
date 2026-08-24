---
last_updated: 2026-08-23
description: Documenter — sole dedicated writer for docs/, reads/writes docs/ on demand (writers)
tags: [diagram-agent, writers, documenter]
status: active
---

# Documenter

> Navigate from graph: this file is the click target for node `documenter` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Sole dedicated writer for `docs/` — project metadata, strategic context docs, and indexes. Never modifies code or `.opencode/` runtime config. Returns `DocumenterOutput` JSON.

| Field | Value |
|---|---|
| **Group** | `writers` (order 6, color `#EA580C`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.2`, mode `subagent` |
| **Permission** | `task: [documenter]` |

## Can call

_(none)_

## Edges

From `refined-source/graph.json` (27 edges) — incident to `documenter`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `documenter` | direct | — |
| incoming | `orchestrator` | `documenter` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/documenter.md`
- `.opencode/agents/subagents/documenter.schema.json`
- `docs/project.md`
- `docs/context/README.md`
- `docs/_TAG-INDEX.md`
- `docs/context/doc-conventions.md` (canonical spec)

## Curated prose

Source: `refined-source/agents/documenter.md` (verbatim, English):

---

# Documenter — Docs Writer (sole for docs/)

**Group**: writers | **Temp**: 0.2

## What it is
Sole dedicated writer for docs/. Reads/writes docs/ on demand; never code or .opencode config. Returns DocumenterOutput JSON.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Every page needs frontmatter (last_updated, status, description, tags); new doc registered in README, _TAG-INDEX, Slices if needed
- One topic per file; cross-reference, don't duplicate
- Post-change audit: routing-table sync, date freshness (>30/>90), link integrity

## Related files
- `.opencode/agents/subagents/documenter.md`
- `.opencode/agents/subagents/documenter.schema.json`
- `docs/project.md`, `docs/context/README.md`, `docs/_TAG-INDEX.md`
- `docs/context/doc-conventions.md` (canonical spec)

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/documenter.md (trimmed)</summary>

Documenter is the sole dedicated write interface for `docs/` that maintains `docs/project.md`, `docs/context/*.md`, and indexes — each page with frontmatter (last_updated, status, description, tags), one topic per file, registration in `docs/context/README.md` and `docs/_TAG-INDEX.md`, and a three-dimension post-change audit (routing-table sync, date freshness >30/>90, link integrity).

Source: `.opencode/agents/subagents/documenter.md` (85 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

