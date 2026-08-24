---
last_updated: 2026-08-23
description: Architect — system design, module boundaries, patterns (guardians)
tags: [diagram-agent, guardians, architect]
status: active
---

# Architect

> Navigate from graph: this file is the click target for node `architect` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Produces design decisions and phased plans, not code. Returns `ArchitectOutput` JSON with `decisions[]` and `files_to_touch`. Follows `docs/context/architecture.md` layering.

| Field | Value |
|---|---|
| **Group** | `guardians` (order 2, color `#DC2626`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, mode `subagent` |
| **Permission** | `task: [architect]` |

## Can call

_(none)_

## Edges

From `refined-source/graph.json` (27 edges) — incident to `architect`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `architect` | direct | — |
| incoming | `orchestrator` | `architect` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/architect.md`
- `.opencode/agents/subagents/architect.schema.json`
- `docs/context/architecture.md`
- `docs/project.md`

## Curated prose

Source: `refined-source/agents/architect.md` (verbatim, English):

---

# Architect — System Design & Patterns

**Group**: guardians

## What it is
Designs module boundaries, layering, patterns. Returns ArchitectOutput JSON with decisions[] and files_to_touch.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Follows docs/context/architecture.md; favor simplicity, testability
- Every proposal cites concrete files each phase touches; document rejected alternatives
- Never implements — produce decisions + file list; coders edit

## Related files
- `.opencode/agents/subagents/architect.md`
- `.opencode/agents/subagents/architect.schema.json`
- `docs/context/architecture.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/architect.md (trimmed)</summary>

Architect is the system-design subagent that produces module boundaries and patterns without implementing — every proposal cites concrete files, favors simplicity and testability, documents rejected alternatives, and returns validated `ArchitectOutput` JSON for coders to execute.

Source: `.opencode/agents/subagents/architect.md` (84 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

