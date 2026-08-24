---
last_updated: 2026-08-23
description: Orchestrator — persistent coordinator for Phase 2 Reduce and fan-out (coordination)
tags: [diagram-agent, coordination, orchestrator]
status: active
---

# Orchestrator

> Navigate from graph: this file is the click target for node `orchestrator` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Persistent coordinator. Sole executor of Phase 2 Reduce (scope, complexity, hot spots, in/out, verification). Maintains state across delegations, fans out same-type subagents when input too large, aggregates structured JSON via EventV2 bus.

| Field | Value |
|---|---|
| **Group** | `coordination` (order 0, color `#4F46E5`) |
| **Level** | 1, `isPrimary: false` |
| **Model** | `inherit (delivery)` — `opencode-go/deepseek-v4-flash`, temperature `null`, mode `subagent` |
| **Permission** | `task: [interpreter, coder-angular, coder-go, tester, reviewer, architect, explorer, project-context, vision-relay, external-scout, analista, documenter]` |

## Can call

`interpreter`, `coder-angular`, `coder-go`, `tester`, `reviewer`, `architect`, `explorer`, `project-context`, `vision-relay`, `external-scout`, `analista`, `documenter` (12 targets; does NOT call `delivery`).

Hover detail (from `graph.json` + `agents.json`): Fan-out pattern — split file list into 20-file chunks, parallel N tasks, de-duplicate, promote severity. Cross-type parallelism + same-type fan-out.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `orchestrator`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `orchestrator` | non-trivial | delegate |
| outgoing | `orchestrator` | `interpreter` | optional | — |
| outgoing | `orchestrator` | `coder-angular` | fan-out | — |
| outgoing | `orchestrator` | `coder-go` | fan-out | — |
| outgoing | `orchestrator` | `tester` | parallel | — |
| outgoing | `orchestrator` | `reviewer` | parallel | — |
| outgoing | `orchestrator` | `architect` | parallel | — |
| outgoing | `orchestrator` | `explorer` | fan-out | — |
| outgoing | `orchestrator` | `project-context` | parallel | — |
| outgoing | `orchestrator` | `vision-relay` | parallel | — |
| outgoing | `orchestrator` | `external-scout` | parallel | — |
| outgoing | `orchestrator` | `analista` | parallel | — |
| outgoing | `orchestrator` | `documenter` | parallel | — |

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/orchestrator.md`
- `.opencode/workflows/orchestrate.md`
- `.opencode/protocols/prompt-pipeline.md`
- `.opencode/protocols/broad-investigation-template.md`
- `.opencode/protocols/session-recovery.md`
- `docs/project.md`
- `docs/context/README.md`

## Curated prose

Source: `refined-source/agents/orchestrator.md` (verbatim, English):

---

# Orchestrator — Persistent Coordinator

**Group**: coordination | **Model**: inherit (delivery)

## What it is
Sole executor of Phase 2 Reduce. Decomposes handoff, fans out subagents in parallel, aggregates EventV2 JSON, returns agent-snapshot.

## Can call (hover)
interpreter, coder-angular, coder-go, tester, reviewer, architect, explorer, project-context, vision-relay, external-scout, analista, documenter

Hover detail: *Does NOT call delivery. Fan-out pattern: split file list into 20-file chunks, parallel N tasks, de-duplicate, promote severity. Cross-type parallelism + same-type fan-out.*

## What it does BEYOND global rules
- Produces ## Scope block (complexity Baja→Muy Alta, hot spots, in/out, key files, verification path)
- Slices routing via Keywords → Repo → Entry points; pick coder by stack
- Decision Hierarchy (context > integrity > user decisions > objective > buildable > conventions > quality)
- Context Budget: trim → delegate slice → request restart with clean snapshot

## Related files
- `.opencode/agents/subagents/orchestrator.md`
- `.opencode/workflows/orchestrate.md`
- `.opencode/protocols/prompt-pipeline.md`
- `.opencode/protocols/broad-investigation-template.md`
- `.opencode/protocols/session-recovery.md`, `docs/project.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/orchestrator.md (trimmed)</summary>

Orchestrator is the persistent coordinator released by `delivery` with `background: true` that owns Phase 2 Reduce, decomposes handoffs, fans out subagents (cross-type and same-type fan-out with CHUNK_SIZE 20, MAX_DEPTH 3), and aggregates typed JSON via the EventV2 bus into an agent-snapshot. It is the only runner of prompt-pipeline Phase 2 and enforces Slices routing and the Decision Hierarchy. Trimmed from the 288-line source (includes Handoff Protocol, Fan-out, Context Budget, Hard Limits); see `.opencode/agents/subagents/orchestrator.md` for the full spec.

Source: `.opencode/agents/subagents/orchestrator.md` (288 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

