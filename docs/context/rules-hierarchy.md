---
last_updated: 2026-08-23
description: The 3-level rule hierarchy in refined-source/rules.json — 12 global rules, 6 group families, 6 agent-specific rule sets.
tags: [rules, hierarchy, global, groups, agent-specific, severity]
status: active
---

# Rules Hierarchy

`refined-source/rules.json` organizes rules in 3 levels. Global rules apply to every agent; group rules apply to a family; agent-specific rules apply to one agent. Every rule cites its `source` file.

## Global rules (12)

| id | Rule | Severity |
|---|---|---|
| global-01 | Inter-agent language is English | hard |
| global-02 | Interpreter-first hard gate | hard |
| global-03 | Coordinators never implement | hard |
| global-04 | Delegation via permission.task + Dispatch table | hard |
| global-05 | One question block | medium |
| global-06 | Hard STOP on subagent failure | hard |
| global-07 | Structured returns via EventV2, not markdown files | hard |
| global-08 | Agent-system changes require review loop | hard |
| global-09 | Never run tests/typecheck/lint from repo root | hard |
| global-10 | Quote paths with spaces | medium |
| global-11 | Cost discipline: cheap tier default | medium |
| global-12 | All documentation and comments in English | medium |

## Group rules (6 families)

| Group | Members | Rules | Focus |
|---|---|---|---|
| `coders` | coder-angular, coder-go | 4 | Complexity review + slice routing; read docs/context not src/ legacy; canonical test/lint/build; stack conventions |
| `guardians` | reviewer, architect, analista | 4 | Read-only analysis with structured JSON verdict; severity-ordered review; concrete files + simplicity; two alternatives + calibrated confidence |
| `exploration` | explorer, project-context, external-scout, vision-relay | 5 | Read-only; fan-out thresholds; sole doc hierarchy; one library/version/question; one image/question/answer |
| `quality` | tester | 2 | Canonical runner per package dir; behavior assertions not mock verification |
| `writers` | documenter | 2 | Sole writer with registration; post-change audit |
| `coordination` | delivery, orchestrator | 2 | Decision hierarchy + slices routing; orchestrator owns Phase 2 Reduce |

## Agent-specific rules (6 agents)

| Agent | Rules | Focus |
|---|---|---|
| `delivery` | 2 | Owns human conversation and translation; Skill Loading Contract (exact file paths) |
| `orchestrator` | 2 | Fan-out aggregation + cost note; Context Budget trim → delegate slice → restart |
| `interpreter` | 1 | Vocabulary reconciliation via grep/glob only |
| `explorer` | 1 | Slices-first routing before searching |
| `reviewer` | 1 | No nitpicking style while correctness issues exist |
| `analista` | 1 | Canonical-only spec, no twin in .opencode/agents/ |

## References

- Catalog: `docs/context/agent-catalog.md`
- Project rules: `docs/context/project-rules.md`
- Data schema: `docs/context/refined-source-data.md`