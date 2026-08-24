---
last_updated: 2026-08-23
description: Delivery — sole human ↔ agent interface (coordination, primary, level 0)
tags: [diagram-agent, coordination, delivery]
status: active
---

# Delivery

> Navigate from graph: this file is the click target for node `delivery` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Sole human ↔ agent interface. Coordinator, not executor. Enforces interpreter-first hard gate on every prompt and delegates ALL technical work via task tool. Owns human conversation, language translation, and session state.

| Field | Value |
|---|---|
| **Group** | `coordination` (order 0, color `#4F46E5`) |
| **Level** | 0, `isPrimary: true` |
| **Model** | `opencode-go/deepseek-v4-flash`, temperature `0.3`, mode `primary` |
| **Permission** | `webfetch: deny`, `task: [interpreter, orchestrator, coder-angular, coder-go, tester, reviewer, architect, explorer, project-context, vision-relay, external-scout, analista, documenter]` |

## Can call

`interpreter`, `orchestrator`, `coder-angular`, `coder-go`, `tester`, `reviewer`, `architect`, `explorer`, `project-context`, `vision-relay`, `external-scout`, `analista`, `documenter` (13 targets, per `agents.json` + graph edges).

Hover detail (from `graph.json`): Step 0 is always `interpreter` first; `orchestrator` for non-trivial (1+ files or multi-step); direct `coder`/`tester`/etc only for trivial scopes. `permission.task` frontmatter is the allow-list.

## Edges

From `refined-source/graph.json` (27 edges) — outgoing incident to `delivery`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| outgoing | `delivery` | `interpreter` | always | Step 0 |
| outgoing | `delivery` | `orchestrator` | non-trivial | delegate |
| outgoing | `delivery` | `coder-angular` | direct | trivial code |
| outgoing | `delivery` | `coder-go` | direct | — |
| outgoing | `delivery` | `tester` | direct | — |
| outgoing | `delivery` | `reviewer` | direct | — |
| outgoing | `delivery` | `architect` | direct | — |
| outgoing | `delivery` | `explorer` | direct | — |
| outgoing | `delivery` | `project-context` | direct | — |
| outgoing | `delivery` | `vision-relay` | direct | — |
| outgoing | `delivery` | `external-scout` | direct | — |
| outgoing | `delivery` | `analista` | direct | — |
| outgoing | `delivery` | `documenter` | direct | — |

No incoming edges (level 0 primary).

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/delivery.md`
- `.opencode/workflows/dispatch.md`
- `.opencode/protocols/prompt-pipeline.md`
- `.opencode/protocols/session-recovery.md`
- `opencode.json`
- `docs/project.md`

## Curated prose

Source: `refined-source/agents/delivery.md` (verbatim, English):

---

# Delivery — Sole Human ↔ Agent Interface

**Group**: coordination (primary) | **Model**: opencode-go/deepseek-v4-flash (0.3)

## What it is
Coordinator, not executor. Owns human conversation, language translation, and routing. Never implements.

## Can call (hover)
interpreter, orchestrator, coder-angular, coder-go, tester, reviewer, architect, explorer, project-context, vision-relay, external-scout, analista, documenter

Hover detail: *Step 0 is always interpreter first; orchestrator for non-trivial (1+ files or multi-step); direct coder/tester/etc only for trivial scopes. Permission.task in frontmatter is the allow-list.*

## What it does BEYOND global rules
- Trivial vs non-trivial is OUTPUT of interpreter packet (never pre-classified)
- Self-check gate + Hard STOP on subagent failure (report "delegación bloqueada" and stop)
- Agent-system changes review loop: Draft → Review (reviewer/analista) → Apply → Verify (tester)
- Session Preflight: batch all ambiguities into one decision event, cache answers
- Skill Loading Contract: pass exact file paths, not summaries, to subagents

## Related files
- `.opencode/agents/subagents/delivery.md`
- `.opencode/workflows/dispatch.md`
- `.opencode/protocols/prompt-pipeline.md`
- `.opencode/protocols/session-recovery.md`
- `opencode.json`, `docs/project.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/delivery.md (trimmed)</summary>

Delivery is the sole human ↔ agent interface (mode: primary) that translates between the human's language and English subagent calls, enforces the interpreter-first hard gate on every turn (Step 0 via `interpreter` before any classification), and delegates ALL technical work — never implementing itself. It owns the self-check gate, the hard STOP on subagent failure (report `delegación bloqueada` and halt), the agent-system review loop (Draft → Review → Apply → Verify), and session preflight batching. Trimmed from the 212-line source; see `.opencode/agents/subagents/delivery.md` for the full Dispatch, Delegation, and Reasoning Discipline sections.

Source: `.opencode/agents/subagents/delivery.md` (212 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

