---
last_updated: 2026-08-23
description: Interpreter — Step 0 normalization helper that reconciles vocabulary and returns routing packet (analysis)
tags: [diagram-agent, analysis, interpreter]
status: active
---

# Interpreter

> Navigate from graph: this file is the click target for node `interpreter` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Lightweight pre-routing helper. Reconciles vocabulary via mandatory grep/glob lookups against docs, captures constraints, and returns a compact routing packet. Every ambiguous term lands in exactly one of `resolved_by_lookup` or `unresolved_questions`.

| Field | Value |
|---|---|
| **Group** | `analysis` (order 1, color `#06B6D4`) |
| **Level** | 1, `isPrimary: false` |
| **Model** | `inherit` — temperature `0.1`, mode `subagent` |
| **Permission** | `edit: deny`, `bash: deny`, `task: [interpreter]` (self only for recursion, not used) |

## Can call

_(none)_ — leaf. May call `question` tool ONCE batched (not a task edge). Returns packet to `delivery`/`orchestrator`.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `interpreter`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `interpreter` | always | Step 0 |
| incoming | `orchestrator` | `interpreter` | optional | — |

No outgoing task edges (leaf).

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/interpreter.md`
- `.opencode/agents/subagents/interpreter.schema.json`
- `.opencode/protocols/prompt-pipeline.md`
- `docs/project.md`
- `docs/context/README.md`

## Curated prose

Source: `refined-source/agents/interpreter.md` (verbatim, English):

---

# Interpreter — Step 0 Normalization Helper

**Group**: analysis | **Temp**: 0.1 | **Mode**: subagent | **Edit/Bash**: deny

## What it is
Lightweight pre-routing. Normalizes raw human prompt (human language → English routing packet). Mandatory grep+glob against docs.

## Can call (hover)
_(none)_ — leaf. May call `question` tool ONCE batched. Returns packet to delivery/orchestrator.

## What it does BEYOND global rules
- Vocabulary reconciliation against Slices table + docs/context only; never from general knowledge
- Every ambiguous term → exactly one of resolved_by_lookup (with source) or unresolved_questions
- Captures constraints, non-goals, hidden assumption, acceptance criteria, edge cases

## Related files
- `.opencode/agents/subagents/interpreter.md`
- `.opencode/agents/subagents/interpreter.schema.json`
- `.opencode/protocols/prompt-pipeline.md`
- `docs/project.md`, `docs/context/README.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/interpreter.md (trimmed)</summary>

Interpreter is the tiny Step 0 normalization helper invoked by `delivery` on every prompt that takes the raw human prompt, runs mandatory grep/glob reconciliation against the Slices table in `docs/project.md` and `docs/context/`, and returns a compact English routing packet (normalized_goal, modules as slice IDs, constraints, hidden_assumption, acceptance criteria, resolved_by_lookup vs unresolved_questions). It never implements or explores beyond lookup depth and asks at most one batched round of clarifying questions. See `.opencode/agents/subagents/interpreter.md` (132 lines) for the full packet schema and core process.

Source: `.opencode/agents/subagents/interpreter.md` (132 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

