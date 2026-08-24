---
last_updated: 2026-08-23
description: Reviewer — code review, security audit, best practices, performance (guardians)
tags: [diagram-agent, guardians, reviewer]
status: active
---

# Reviewer

> Navigate from graph: this file is the click target for node `reviewer` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Analyzes diffs/PRs; never modifies. Returns `ReviewerOutput` JSON with verdict and issues. Can fan out into parallel reviewer instances when diff is large and naturally partitioned by independence.

| Field | Value |
|---|---|
| **Group** | `guardians` (order 2, color `#DC2626`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `opencode-go/deepseek-v4-flash`, mode `subagent` |
| **Permission** | `edit: deny`, `task: [reviewer]` |

## Can call

`reviewer` — self fan-out partitioned by independence (SAMPLE_WINDOW 5, CHUNK_SIZE 10, MAX_DEPTH 2). Coupling forbids fan-out.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `reviewer`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `reviewer` | direct | — |
| incoming | `orchestrator` | `reviewer` | parallel | — |
| self | `reviewer` | `reviewer` | recursive-fanout | partition by independence |

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/reviewer.md`
- `.opencode/agents/subagents/reviewer.schema.json`
- `docs/context/architecture.md`
- `backend/docs/context/permission-architecture.md` (sibling, display-only)
- `docs/project.md`

## Curated prose

Source: `refined-source/agents/reviewer.md` (verbatim, English):

---

# Reviewer — Code Review & Security Audit

**Group**: guardians | **Model**: opencode-go/deepseek-v4-flash | **Edit**: deny

## What it is
Analyzes diffs/PRs; never modifies. Returns ReviewerOutput JSON with verdict and issues. Can fan out when diff naturally partitioned.

## Can call (hover)
reviewer (self — fan-out partitioned by independence; coupling forbids fan-out)

## What it does BEYOND global rules
- Checklist severity-ordered: architecture → standards → permissions (RequirePermission) → secrets → performance → anti-patterns → testing → doc-tree integrity
- No unverified claims; every issue cites file:line read
- Never rewrite code inline; describe fix

## Related files
- `.opencode/agents/subagents/reviewer.md`
- `.opencode/agents/subagents/reviewer.schema.json`
- `docs/context/architecture.md`, `backend/docs/context/permission-architecture.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/reviewer.md (trimmed)</summary>

Reviewer is the read-only review subagent that judges diffs against `docs/context/*.md` and the Slices table, ordered by severity (architecture, standards, permissions/auth, secrets, performance, anti-patterns, testing, doc-tree integrity), never modifying code or approving with unverified claims. For large diffs it samples 5 files to test coupling then fans out by independence (CHUNK_SIZE 10, MAX_DEPTH 2) or runs three perspective reviews (security/performance/standards) when concerns separate.

Source: `.opencode/agents/subagents/reviewer.md` (128 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

