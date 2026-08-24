---
last_updated: 2026-08-24
description: The 3-level rule hierarchy in refined-source/rules.json — 7 global rules, 6 group families, 6 agent-specific rule sets (delivery 3).
tags: [rules, hierarchy, global, groups, agent-specific, severity]
status: active
---

# Rules Hierarchy

`refined-source/rules.json` organizes rules in 3 levels. Global rules apply to every agent; group rules apply to a family; agent-specific rules apply to one agent. Every rule cites its `source` file. Scoped migration (Phase C, 2026-08-24): globals `0002-0006` moved out of `global` → `groups/coordination` (`0003-0006`) and `agentSpecific/delivery` (`0002`); global count 12→7.

## Global rules (7)

| id | Rule | Severity | Source |
|---|---|---|---|
| `0001` | Inter-agent language is English | hard | `.opencode/agents/subagents/orchestrator.md / .opencode/agents/subagents/delivery.md / docs/project.md doc_language` |
| `0007` | Structured returns via EventV2, not markdown files | hard | `.opencode/agents/subagents/orchestrator.md / subagent-spec-template.md` |
| `0008` | Agent-system changes require review loop | hard | `.opencode/agents/subagents/delivery.md Agent-system changes` |
| `0009` | Never run tests/typecheck/lint from repo root | hard | `.opencode/workflows/orchestrate.md / docs/project.md Common Commands` |
| `0010` | Quote paths with spaces | medium | `Handoff constraints / docs/project.md` |
| `0011` | Cost discipline: cheap tier default | medium | `.opencode/agents/subagents/orchestrator.md / subagent frontmatters` |
| `0012` | All documentation and comments in English | medium | `docs/project.md / .opencode/workflows/orchestrate.md Language Rule` |

> Removed from global in 1.0.1: `0002` → `agentSpecific/delivery`, `0003-0006` → `groups/coordination` (see below). Source citations unchanged from `refined-source/rules.json`.

## Group rules (6 families)

| Group | Members | Rules | Focus |
|---|---|---|---|
| `coders` | coder-angular, coder-go | 4 | Complexity review + slice routing; read docs/context not src/ legacy; canonical test/lint/build; stack conventions |
| `guardians` | reviewer, architect, analista | 4 | Read-only analysis with structured JSON verdict; severity-ordered review; concrete files + simplicity; two alternatives + calibrated confidence |
| `exploration` | explorer, project-context, external-scout, vision-relay | 5 | Read-only; fan-out thresholds; sole doc hierarchy; one library/version/question; one image/question/answer |
| `quality` | tester | 2 | Canonical runner per package dir; behavior assertions not mock verification |
| `writers` | documenter | 2 | Sole writer with registration; post-change audit |
| `coordination` | delivery, orchestrator | 6 | Decision hierarchy + slices routing; orchestrator owns Phase 2 Reduce; coordinators never implement; delegation via permission.task + Dispatch; one question block; hard STOP on failure |

### Coordination — 6 rules (detail)

| id | Rule | Severity | Source |
|---|---|---|---|
| `0030` | Decision hierarchy and slices routing | hard | `.opencode/agents/subagents/orchestrator.md / docs/project.md Slices` |
| `0031` | Orchestrator Phase 2 Reduce owns scope | hard | `.opencode/protocols/prompt-pipeline.md Phase 2` |
| `0003` | Coordinators never implement | hard | `.opencode/agents/subagents/delivery.md / .opencode/agents/subagents/orchestrator.md` |
| `0004` | Delegation via permission.task + Dispatch table | hard | `.opencode/agents/subagents/delivery.md##Delegation / each agent frontmatter` |
| `0005` | One question block | medium | `.opencode/protocols/prompt-pipeline.md / delivery.md Session Preflight` |
| `0006` | Hard STOP on subagent failure | hard | `.opencode/agents/subagents/delivery.md Hard STOP` |

## Agent-specific rules (6 agents, 9 rules)

| Agent | Rules | Focus |
|---|---|---|
| `delivery` | 3 | Owns human conversation and translation; Skill Loading Contract (exact file paths); Interpreter-first hard gate |
| `orchestrator` | 2 | Fan-out aggregation + cost note; Context Budget trim → delegate slice → restart |
| `interpreter` | 1 | Vocabulary reconciliation via grep/glob only |
| `explorer` | 1 | Slices-first routing before searching |
| `reviewer` | 1 | No nitpicking style while correctness issues exist |
| `analista` | 1 | Canonical-only spec, no twin in .opencode/agents/ |

### Delivery — 3 rules (detail)

| id | Rule | Severity | Source |
|---|---|---|---|
| `0032` | Owns human conversation and translation | — | `.opencode/agents/subagents/delivery.md` |
| `0033` | Skill Loading Contract: pass exact file paths | — | `.opencode/agents/subagents/delivery.md` |
| `0002` | Interpreter-first hard gate | hard | `.opencode/workflows/dispatch.md / .opencode/protocols/prompt-pipeline.md` |

> `0002` source is scoped to delivery (dispatch + prompt-pipeline hard gate). Previous global `0002-0006` now live in coordination/delivery as above; `refined-source/rules.json` is source of truth (global 7, groups coordination 6, agentSpecific delivery 3).

## References

- Catalog: `docs/context/agent-catalog.md`
- Project rules: `docs/context/project-rules.md`
- Data schema: `docs/context/refined-source-data.md`
