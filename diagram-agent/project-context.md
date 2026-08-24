---
last_updated: 2026-08-23
description: Project Context — read-only doc lookup and context assembly for docs/ (exploration)
tags: [diagram-agent, exploration, project-context]
status: active
---

# Project Context

> Navigate from graph: this file is the click target for node `project-context` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Read-only doc lookup and context assembly for the project's canonical `docs/`. Knows project structure and docs tree. Cites file path + line numbers for every fact. No writes, no edits.

| Field | Value |
|---|---|
| **Group** | `exploration` (order 4, color `#CA8A04`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.2`, mode `subagent` |
| **Permission** | `edit: deny`, `bash: deny`, `task: [project-context]` |

## Can call

_(none)_ — leaf, parallel invocable.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `project-context`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `project-context` | direct | — |
| incoming | `orchestrator` | `project-context` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/project-context.md`
- `docs/project.md`
- `docs/context/README.md`

## Curated prose

Source: `refined-source/agents/project-context.md` (verbatim, English):

---

# Project Context — Read-Only Doc Lookup

**Group**: exploration | **Temp**: 0.2 | **Edit/Bash**: deny

## What it is
Read-only lookup interface to docs/. Knows structure and tree. Never writes.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Read workflow: docs/project.md → docs/context/README.md → slice README → grep
- Cites file path + line numbers for every fact; never duplicate into .opencode
- Hierarchy: docs/context/*.md > docs/project.md > docs/_TAG-INDEX.md > src/

## Related files
- `.opencode/agents/subagents/project-context.md`
- `docs/project.md`, `docs/context/README.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/project-context.md (trimmed)</summary>

Project Context is the read-only lookup interface to `docs/` that assembles bounded reading lists on demand, always citing file path + line numbers, following the read workflow docs/project.md → docs/context/README.md → slice README → grep. It never writes or duplicates facts into `.opencode/`; doc writes route to `documenter` and code exploration to `explorer`.

Source: `.opencode/agents/subagents/project-context.md` (77 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

