---
last_updated: 2026-09-24
description: Development standards for agent-wizard — language, path quoting, cost discipline, test invocation, agent-system review loop, structured returns.
tags: [rules, standards, conventions, english, cost, review-loop, passive, active]
status: active
---

# Project Rules

Development standards for THIS project. The full agent rule hierarchy (global / group / agent-specific) lives in `docs/context/rules-hierarchy.md` and `refined-source/rules.json`.

> [!CAUTION] This filename is referenced by `tester`'s `relatedFiles` in `refined-source/agents.json` — do not rename.

## Standards

| Rule | Severity | Detail |
|---|---|---|
| English only | hard | All docs, comments, routing packets, and structured returns in English (`doc_language: english`). Human ↔ delivery may be any language; delivery translates. |
| Quote paths with spaces | medium | Workspace root is `/run/media/admin/Datos/projects/agent-wizard` — quote every bash path (sibling paths may contain spaces). |
| Cost discipline | discretionary | A discretionary decision (not a global rule) owned by `orchestrator`, `coder`, `analista`, `architect`: subagents inherit the primary's model (`opencode-go/qwen3.8-flash`); escalate only when the task demands it. Fan-out multiplies cost. |
| Never run tests from repo root | hard | Run canonical commands from the affected package dir (`agent-wizard/`, `frontend/`, `backend/`). |
| No-mutate agent-system review loop | hard | Changes to the installed agent system (`agents/`, `protocols/`, `opencode.json` under `~/.config/opencode`) require Draft → Review (reviewer/analista) → Apply → Verify (tester). Single-line typo exempt. |
| Structured returns via `output_schema` | hard | Subagents with `output_schema` return validated JSON through the `task` tool. Never write `summary.md` / `output-full.md` / `manifest.md` to disk. The structured return is a **prose contract, not runtime-enforced**. |
| Interpreter-first hard gate | hard | Every prompt passes Step 0 (interpreter) before any handling. Trivial vs non-trivial is an output of the routing packet, never a pre-classification. |
| Coordinators never implement | hard | `delivery` and `orchestrator` delegate ALL technical work via the `task` tool. |
| One question block | medium | Batch all blocking questions into a single `question` call; never ask across turns. |

> **Ordering note (2026-08-24):** `refined-source/rules.json` orders **passive/invariant** rules first within each level/family and adds an explicit `kind` field (`passive` or `active`) for queryability — physical order + kind tag is the chosen mechanism (robust, backwards compatible). Invariant example: `documenter`/writers must write in English (English-only) is passive; Interpreter's `grep`/`glob` reconciliation is active (triggered at Step 0). See `docs/context/rules-hierarchy.md#passive-vs-active-ordering`.

## Cross-references

- Global rules (2): `refined-source/rules.json → global` and `docs/context/rules-hierarchy.md`
- Group rules (6 families): `refined-source/rules.json → groups`
- Agent-specific rules (6 agents): `refined-source/rules.json → agentSpecific`
- Source of truth hierarchy: `docs/context/*.md` > `docs/project.md` > `docs/_TAG-INDEX.md` > `src/`
