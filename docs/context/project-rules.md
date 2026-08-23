---
last_updated: 2026-08-23
description: Development standards for agent-wizard — language, path quoting, cost discipline, test invocation, .opencode review loop, structured returns.
tags: [rules, standards, conventions, english, cost, review-loop]
status: active
---

# Project Rules

Development standards for THIS project. The full agent rule hierarchy (global / group / agent-specific) lives in `docs/context/rules-hierarchy.md` and `refined-source/rules.json`.

> [!CAUTION] This filename is referenced by `tester`'s `relatedFiles` in `refined-source/agents.json` — do not rename.

## Standards

| Rule | Severity | Detail |
|---|---|---|
| English only | hard | All docs, comments, routing packets, and structured returns in English (`doc_language: english`). Human ↔ delivery may be any language; delivery translates. |
| Quote paths with spaces | medium | Workspace root is `/run/media/admin/Datos/Matafuegos necochea` — every bash path with spaces must be quoted. |
| Cost discipline | medium | Default to the cheap tier (`opencode-go/deepseek-v4-flash`); escalate only when the task demands it. Fan-out multiplies cost. |
| Never run tests from repo root | hard | Run canonical commands from the affected package dir (`agent-wizard/`, `frontend/`, `backend/`). |
| No-mutate `.opencode/` review loop | hard | Changes to `.opencode/agents`, `.opencode/protocols`, `.opencode/workflows`, or `opencode.json` require Draft → Review (reviewer/analista) → Apply → Verify (tester). Single-line typo exempt. |
| Structured returns via EventV2 | hard | Subagents with `output_schema` return validated JSON via the `task` tool + EventV2 bus. Never write `summary.md` / `output-full.md` / `manifest.md` to disk. |
| Interpreter-first hard gate | hard | Every prompt passes Step 0 (interpreter) before any handling. Trivial vs non-trivial is an output of the routing packet, never a pre-classification. |
| Coordinators never implement | hard | `delivery` and `orchestrator` delegate ALL technical work via the `task` tool. |
| One question block | medium | Batch all blocking questions into a single `question` call; never ask across turns. |

## Cross-references

- Global rules (12): `refined-source/rules.json → global` and `docs/context/rules-hierarchy.md`
- Group rules (6 families): `refined-source/rules.json → groups`
- Agent-specific rules (6 agents): `refined-source/rules.json → agentSpecific`
- Source of truth hierarchy: `docs/context/*.md` > `docs/project.md` > `docs/_TAG-INDEX.md` > `src/`