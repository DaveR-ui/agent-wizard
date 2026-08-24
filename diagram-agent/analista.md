---
last_updated: 2026-08-23
description: Analista — second-opinion advisor for delivery and orchestrator, read-only (guardians)
tags: [diagram-agent, guardians, analista]
status: active
---

# Analista

> Navigate from graph: this file is the click target for node `analista` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Second-opinion advisor for `delivery` and `orchestrator`. Read-only. Critiques plans before execution, advises when stuck, compares 2–3 alternatives with tradeoffs and calibrated confidence. Returns `AnalystOutput` JSON. Re-routes out-of-scope work via `re_route_to`.

| Field | Value |
|---|---|
| **Group** | `guardians` (order 2, color `#DC2626`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, mode `subagent` |
| **Permission** | `edit: deny`, `bash: deny`, `task: [analista]` |

## Can call

_(none)_ — but `re_route_to` points to `coder-angular`, `coder-go`, `reviewer`, `architect`, `tester`, `explorer`.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `analista`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `analista` | direct | — |
| incoming | `orchestrator` | `analista` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/analista.md`
- `.opencode/agents/subagents/analista.schema.json`
- `.opencode/protocols/session-recovery.md`
- `.opencode/protocols/subagent-spec-template.md`

## Curated prose

Source: `refined-source/agents/analista.md` (verbatim, English):

---

# Analista — Second-Opinion Advisor

**Group**: guardians | **Edit/Bash**: deny | **Canonical-only spec**

## What it is
Second-opinion for delivery/orchestrator when lost or stuck. Read-only; returns AnalystOutput JSON. Re-routes implementation to owning subagents.

## Can call (hover)
_(none)_ — but re_route_to field points to correct owner (coder-*, reviewer, architect, tester, explorer)

## What it does BEYOND global rules
- Requires 2+ alternatives + calibrated confidence; <0.5 must state what evidence would raise it
- Verdict: proceed / reconsider / abandon; complements session-recovery.md
- Evidence-grounded: every recommendation cites files read

## Related files
- `.opencode/agents/subagents/analista.md`
- `.opencode/agents/subagents/analista.schema.json`
- `.opencode/protocols/session-recovery.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/analista.md (trimmed)</summary>

Analista is the read-only second-opinion advisor that critiques plans for `delivery`/`orchestrator`, weighs at least two alternatives with calibrated confidence, commits to proceed/reconsider/abandon, and re-routes implementation/review/design/tests/exploration to their owners via `re_route_to` — never implementing itself and always citing concrete files.

Source: `.opencode/agents/subagents/analista.md` (107 lines, canonical-only spec, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

