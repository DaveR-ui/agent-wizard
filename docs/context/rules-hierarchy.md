---
last_updated: 2026-09-24
description: The 3-level rule hierarchy in refined-source/rules.json — 2 global rules, 6 group families, 6 agent-specific rule sets, ordered passive-first with kind tags. Sources resolve against the installed agent system.
tags: [rules, hierarchy, global, groups, agent-specific, severity, passive, active]
status: active
---

# Rules Hierarchy

`refined-source/rules.json` organizes rules in 3 levels. Global rules apply to every agent; group rules apply to a family; agent-specific rules apply to one agent. Every rule cites its `source` file and carries a `kind` tag (`passive` or `active`) for queryability. Rule `source` paths use the agent-system vocabulary (`agents/…`, `protocols/…`) and resolve against the installed agent system, plus `docs/…` for in-repo paths.

Counts: **global 2, groups 6 families, agentSpecific 6 agents / 9 rules.**

## Passive vs Active Ordering

**Taxonomy** (derived from an explorer rescan of common rules):

- **Passive / invariant** — state-independent constraint that applies always, regardless of task type or execution path. Examples: English-only docs (`documenter` must write in English), Structured returns via `output_schema`, review loop for the installed agent system, never run tests from repo root, quote paths with spaces, cost discipline, stack conventions, read-only analysis.
- **Active / behavioral** — rule triggered at a specific lifecycle point: dispatch, Phase 2 Reduce, fan-out, question batching, delegation, or failure handling. Examples: interpreter must reconcile vocabulary via `grep`/`glob` (Step 0), Slices Keywords routing, delegation via `permission.task` + Dispatch, orchestrator Phase 2 Reduce owns scope, fan-out chunking (`CHUNK_SIZE 20`), one question block batching, hard STOP on subagent failure.

**Mechanism**: `refined-source/rules.json` uses **physical order + `kind` tag** — every rule object carries `"kind": "passive"` or `"kind": "active"`; within each level/family passive rules sort first, then active, and within each kind by `id` ascending.

## Global rules (2)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0007` | Structured returns via `output_schema`, not markdown files (a prose contract, not runtime-enforced) | passive | hard | `agents/orchestrator.md / protocols/subagent-spec-template.md` |
| `0008` | Agent-system changes require review loop | passive | hard | `agents/delivery.md Agent-system changes` |

## Group rules (6 families)

| Group | Members | Rules | Passive / Active split | Focus |
|---|---|---|---|---|
| `coders` | coder | 4 | 1 passive (`0016` stack) → 3 active (`0013` slice routing, `0014` read-before-modify, `0015` canonical checks) | Complexity review + slice routing; read docs/context not legacy src/; canonical test/lint/build; stack conventions |
| `guardians` | reviewer, architect, analista | 4 | 3 passive (`0017` read-only, `0018` checklist order, `0019` concrete files) → 1 active (`0020` two alternatives) | Read-only analysis with structured JSON verdict; severity-ordered review; concrete files + simplicity; two alternatives + calibrated confidence |
| `exploration` | explorer, external-scout | 3 | 1 passive (`0021` read-only) → 2 active (`0022` fan-out thresholds, `0024` one library/version/question) | Read-only; fan-out thresholds; one library/version/question |
| `quality` | tester | 2 | 2 passive (`0026` canonical runner, `0027` behavior assertions) → 0 active | Canonical runner per package dir; behavior assertions not mock verification |
| `writers` | documenter | 2 | 1 passive (`0028` sole writer) → 1 active (`0029` post-change audit) | Sole writer with registration; post-change audit |
| `coordination` | delivery, orchestrator | 6 | 1 passive (`0003` never implement) → 5 active (`0004` delegation, `0005` one question block, `0006` hard STOP, `0030` hierarchy+routing, `0031` Phase 2 Reduce) | Decision hierarchy + slices routing; orchestrator owns Phase 2 Reduce; coordinators never implement; delegation via permission.task + Dispatch; one question block; hard STOP on failure |

> `0023` (sole doc hierarchy) was removed; `0025` (one image/question) was removed with `vision-relay`, its capability migrated to `interpreter` image-inspection. Physical order in `rules.json` is passive-first within each family.

### Coordination — 6 rules (detail)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0003` | Coordinators never implement | passive | hard | `agents/delivery.md / agents/orchestrator.md` |
| `0004` | Delegation via permission.task + Dispatch table | active | hard | `agents/delivery.md##Delegation / each agent frontmatter` |
| `0005` | One question block | active | medium | `protocols/prompt-pipeline.md / agents/delivery.md Session Preflight` |
| `0006` | Hard STOP on subagent failure | active | hard | `agents/delivery.md Hard STOP` |
| `0030` | Decision hierarchy and slices routing | active | hard | `agents/orchestrator.md / docs/project.md Slices` |
| `0031` | Orchestrator Phase 2 Reduce owns scope | active | hard | `protocols/prompt-pipeline.md Phase 2` |

## Agent-specific rules (6 agents, 9 rules)

| Agent | Rules | Passive / Active | Focus |
|---|---|---|---|
| `delivery` | 3 | 1 passive (`0032` owns conversation) → 2 active (`0002` interpreter-first, `0033` skill loading) | Owns human conversation and translation; skill loading contract (exact file paths); interpreter-first hard gate |
| `orchestrator` | 2 | 0 passive → 2 active (`0034` fan-out aggregation, `0035` context budget) | Fan-out aggregation + cost note; context budget trim → delegate slice → restart |
| `interpreter` | 1 | 0 passive → 1 active (`0036` grep/glob reconciliation) | Vocabulary reconciliation via grep/glob only |
| `explorer` | 1 | 0 passive → 1 active (`0037` slices-first routing) | Slices-first routing before searching |
| `reviewer` | 1 | 1 passive (`0038` no nitpicking while correctness issues) | No nitpicking style while correctness issues exist |
| `analista` | 1 | 1 passive (`0039` canonical-only spec) | Canonical-only spec, no twin in `agents/` |

### Delivery — 3 rules (detail)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0032` | Owns human conversation and translation | passive | — | `agents/delivery.md` |
| `0002` | Interpreter-first hard gate | active | hard | `protocols/dispatch.md / protocols/prompt-pipeline.md` |
| `0033` | Skill Loading Contract: pass exact file paths | active | — | `agents/delivery.md` |

## References

- Catalog: `docs/context/agent-catalog.md`
- Protocols: `docs/context/protocols.md`
- Project rules: `docs/context/project-rules.md`
- Data schema: `docs/context/refined-source-data.md`
