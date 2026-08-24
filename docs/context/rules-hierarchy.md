---
last_updated: 2026-08-24
description: The 3-level rule hierarchy in refined-source/rules.json — 2 global rules, 6 group families, 6 agent-specific rule sets, ordered passive-first with kind tags.
tags: [rules, hierarchy, global, groups, agent-specific, severity, passive, active]
status: active
---

# Rules Hierarchy

`refined-source/rules.json` organizes rules in 3 levels. Global rules apply to every agent; group rules apply to a family; agent-specific rules apply to one agent. Every rule cites its `source` file and carries a `kind` tag (`passive` or `active`) for queryability. Scoped migration (Phase C, 2026-08-24): globals `0002-0006` moved out of `global` → `groups/coordination` (`0003-0006`) and `agentSpecific/delivery` (`0002`); global count 12→7. On 2026-08-23 `0001/0009/0010/0012` were removed from the formal global set and `0011` (cost discipline) was demoted to a discretionary decision (see note below); global count is now 2. On 2026-08-24 rules were reordered passive-first within each level/family and tagged with `kind`.

## Passive vs Active Ordering

**Taxonomy** (proposed 2026-08-24, derived from explorer rescan of common rules):

- **Passive / invariant** — state-independent constraint that applies always, regardless of task type or execution path. Examples: English-only docs (`documenter` must write in English), Structured returns via EventV2, Review loop for `.opencode`, Never run tests from repo root, Quote paths with spaces, Cost discipline (discretionary invariant), Stack conventions, Read-only analysis. Passive rules are invariants you can check without triggering a lifecycle.
- **Active / behavioral** — rule triggered at a specific lifecycle point: dispatch, Phase 2 Reduce, fan-out, question batching, delegation, or failure handling. Examples: Interpreter must reconcile vocabulary via `grep`/`glob` (Step 0), Slices Keywords routing, Delegation via `permission.task` + Dispatch, Orchestrator Phase 2 Reduce owns scope, Fan-out chunking (`CHUNK_SIZE 20`), One question block batching, Hard STOP on subagent failure.

**Mechanism** (decision 2026-08-24): `refined-source/rules.json` uses **physical order + `kind` tag** — every rule object carries `"kind": "passive"` or `"kind": "active"` and within each level/family passive rules are sorted first, then active, and within each kind sorted by `id` ascending. Physical order gives quick scanning; `kind` tag enables future queryability and filtering. Backwards compatible: consumers that ignore `kind` still get passive-first scanning; consumers that filter can use the tag explicitly.

Counts remain: global 2, groups 6 families, agentSpecific 6 agents / 9 rules.

## Global rules (2)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0007` | Structured returns via EventV2, not markdown files | passive | hard | `.opencode/agents/subagents/orchestrator.md / subagent-spec-template.md` |
| `0008` | Agent-system changes require review loop | passive | hard | `.opencode/agents/subagents/delivery.md Agent-system changes` |

> **2026-08-23**: `0011` (cost discipline: cheap tier default) was demoted from a global rule to a **discretionary decision** owned by `orchestrator`, `coder`, `analista`, and `architect` (they decide tier by complexity; `reviewer` observes/flags only). `0001`, `0009`, `0010`, `0012` were removed from the formal global rules set — their operational guidance (English-only, never run tests from repo root, quote paths with spaces, docs in English) remains embedded in the workflows/protocols.

> Removed from global in 1.0.1: `0002` → `agentSpecific/delivery`, `0003-0006` → `groups/coordination` (see below). Source citations unchanged from `refined-source/rules.json`.

## Group rules (6 families)

| Group | Members | Rules | Passive / Active split | Focus |
|---|---|---|---|---|
| `coders` | coder | 4 | 1 passive (`0016` stack) → 3 active (`0013` slice routing, `0014` read-before-modify, `0015` canonical checks) | Complexity review + slice routing; read docs/context not src/ legacy; canonical test/lint/build; stack conventions |
| `guardians` | reviewer, architect, analista | 4 | 3 passive (`0017` read-only, `0018` checklist order, `0019` concrete files) → 1 active (`0020` two alternatives) | Read-only analysis with structured JSON verdict; severity-ordered review; concrete files + simplicity; two alternatives + calibrated confidence |
| `exploration` | explorer, project-context, external-scout | 4 | 2 passive (`0021` read-only, `0023` sole hierarchy) → 2 active (`0022` fan-out thresholds, `0024` one library/version/question) | Read-only; fan-out thresholds; sole doc hierarchy; one library/version/question — `0025` (one image/question) removed with `vision-relay`, capability migrated to `interpreter` image-inspection fallback |
| `quality` | tester | 2 | 2 passive (`0026` canonical runner, `0027` behavior assertions) → 0 active | Canonical runner per package dir; behavior assertions not mock verification |
| `writers` | documenter | 2 | 1 passive (`0028` sole writer) → 1 active (`0029` post-change audit) | Sole writer with registration; post-change audit |
| `coordination` | delivery, orchestrator | 6 | 1 passive (`0003` never implement) → 5 active (`0004` delegation, `0005` one question block, `0006` hard STOP, `0030` hierarchy+routing, `0031` Phase 2 Reduce) | Decision hierarchy + slices routing; orchestrator owns Phase 2 Reduce; coordinators never implement; delegation via permission.task + Dispatch; one question block; hard STOP on failure |

> Physical order in `rules.json` is passive-first within each family; see `kind` field per rule.

### Coordination — 6 rules (detail)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0003` | Coordinators never implement | passive | hard | `.opencode/agents/subagents/delivery.md / .opencode/agents/subagents/orchestrator.md` |
| `0004` | Delegation via permission.task + Dispatch table | active | hard | `.opencode/agents/subagents/delivery.md##Delegation / each agent frontmatter` |
| `0005` | One question block | active | medium | `.opencode/protocols/prompt-pipeline.md / delivery.md Session Preflight` |
| `0006` | Hard STOP on subagent failure | active | hard | `.opencode/agents/subagents/delivery.md Hard STOP` |
| `0030` | Decision hierarchy and slices routing | active | hard | `.opencode/agents/subagents/orchestrator.md / docs/project.md Slices` |
| `0031` | Orchestrator Phase 2 Reduce owns scope | active | hard | `.opencode/protocols/prompt-pipeline.md Phase 2` |

> `0030`/`0031` now carry `severity: hard` (fixed 2026-08-24; previously missing vs this doc's table).

## Agent-specific rules (6 agents, 9 rules)

| Agent | Rules | Passive / Active | Focus |
|---|---|---|---|
| `delivery` | 3 | 1 passive (`0032` owns conversation) → 2 active (`0002` interpreter-first, `0033` skill loading) | Owns human conversation and translation; Skill Loading Contract (exact file paths); Interpreter-first hard gate |
| `orchestrator` | 2 | 0 passive → 2 active (`0034` fan-out aggregation, `0035` context budget) | Fan-out aggregation + cost note; Context Budget trim → delegate slice → restart |
| `interpreter` | 1 | 0 passive → 1 active (`0036` grep/glob reconciliation) | Vocabulary reconciliation via grep/glob only |
| `explorer` | 1 | 0 passive → 1 active (`0037` slices-first routing) | Slices-first routing before searching |
| `reviewer` | 1 | 1 passive (`0038` no nitpicking while correctness issues) | No nitpicking style while correctness issues exist |
| `analista` | 1 | 1 passive (`0039` canonical-only spec) | Canonical-only spec, no twin in .opencode/agents/ |

### Delivery — 3 rules (detail)

| id | Rule | Kind | Severity | Source |
|---|---|---|---|---|
| `0032` | Owns human conversation and translation | passive | — | `.opencode/agents/subagents/delivery.md` |
| `0002` | Interpreter-first hard gate | active | hard | `.opencode/workflows/dispatch.md / .opencode/protocols/prompt-pipeline.md` |
| `0033` | Skill Loading Contract: pass exact file paths | active | — | `.opencode/agents/subagents/delivery.md` |

> `0002` source is scoped to delivery (dispatch + prompt-pipeline hard gate). Previous global `0002-0006` now live in coordination/delivery as above; `refined-source/rules.json` is source of truth (global 2, groups coordination 6, agentSpecific delivery 3). Order is passive-first (`0032`) then active by id (`0002`, `0033`).

## References

- Catalog: `docs/context/agent-catalog.md`
- Project rules: `docs/context/project-rules.md`
- Data schema: `docs/context/refined-source-data.md`
