---
last_updated: 2026-08-24
description: Catalog of the 12 agents defined in refined-source/agents.json — id, group, role, model, mode, canCall count, key files. (14→13 in 1.0.2: removed vision-relay, merged coders 2→1; Branch B flat with per-agent protocol scrolls under .opencode/protocols/<id>/ in v1.1.0)
tags: [agents, catalog, subagents, groups, canCall]
status: active
---

# Agent Catalog

The 12 agents defined in `refined-source/agents.json` (source of truth: `.opencode/agents/subagents/*.md` flat, Branch B). Group colors and RPG race/flavor come from `refined-source/graph.json → groups` (v1.1.0, 7 groups). Actual file count is 12 after 1.0.2 merge math (14−1 vision-relay −1 coder merge =12); per-agent protocol scrolls now live under `.opencode/protocols/<id>/*.md` (12 dirs) and are reflected in `refined-source/agents.json` v1.1.0 `relatedFiles` — see footnote after the table and `.opencode/protocols/README.md` Per-agent scrolls.

## All agents

| id | displayName | group | role (one line) | model | mode | canCall | key relatedFiles |
|---|---|---|---|---|---|---|---|
| `delivery` | Delivery | coordination | Sole human ↔ agent interface; translates, routes, delegates — never implements | deepseek-v4-flash | primary | 11 | `delivery.md`, `workflows/dispatch.md`, `protocols/prompt-pipeline.md`, `docs/project.md` |
| `orchestrator` | Orchestrator | coordination | Persistent coordinator; Phase 2 Reduce, fan-out, aggregation | inherit | subagent | 9 | `orchestrator.md`, `workflows/orchestrate.md`, `docs/project.md`, `docs/context/README.md` |
| `interpreter` | Interpreter | analysis | Step 0 normalization + cheap image inspection; vocabulary reconciliation → routing packet | inherit | subagent | 0 | `interpreter.md`, `interpreter.schema.json`, `docs/project.md` |
| `explorer` | Explorer | exploration | Read-only codebase exploration, file search, dependency analysis | inherit | subagent | 1 | `explorer.md`, `explorer.schema.json`, `docs/context/architecture.md` |
| `project-context` | Project Context | exploration | READ-ONLY doc lookup and context assembly for docs/ | inherit | subagent | 0 | `project-context.md`, `docs/project.md`, `docs/context/README.md` |
| `external-scout` | External Scout | exploration | Fetches live docs for external libraries on demand | inherit | subagent | 0 | `external-scout.md` |
| `coder` | Coder | coders | Language-parameterized implementation (Angular SPA | Go API) — branches by language param, thin adapter over docs/context/ | deepseek-v4-flash | subagent | 0 | `coder.md`, `coder.schema.json`, `docs/project.md`, `docs/context/architecture.md`, `.opencode/protocols/coder/coder-toolkit.md` |
| `reviewer` | Reviewer | guardians | Code review, security audit, best practices, performance | deepseek-v4-flash | subagent | 1 | `reviewer.md`, `reviewer.schema.json`, `docs/context/architecture.md` |
| `architect` | Architect | guardians | System design, module boundaries, patterns | inherit | subagent | 0 | `architect.md`, `architect.schema.json`, `docs/context/architecture.md` |
| `analista` | Analista | guardians | Second-opinion advisor; read-only plan critique | inherit | subagent | 0 | `analista.md`, `analista.schema.json`, `protocols/session-recovery.md` |
| `tester` | Tester | quality | Unit, integration, coverage, e2e test author and runner | inherit | subagent | 0 | `tester.md`, `tester.schema.json`, `docs/context/project-rules.md`, `frontend/package.json` |
| `documenter` | Documenter | writers | Sole dedicated writer for docs/ | inherit | subagent | 0 | `documenter.md`, `documenter.schema.json`, `docs/project.md`, `docs/_TAG-INDEX.md` |

> 1.0.1: `orchestrator` canCall 12→11 (interpreter removed); Edge count 27→26.
> 1.0.2: removed vision-relay, merged coders (2→1), nodes 14→13 (spec) / 14→12 actual, edges 26→22. Delivery canCall 13→11, orchestrator 11→9. Interpreter gained image-inspection capability (one image one question, text-over-image rule, unclear fallback).
> 1.1.0 (Branch B, 2026-08-24): flat-loader precedent — agents stay at `.opencode/agents/subagents/<id>.md` (12); per-agent protocol scrolls under `.opencode/protocols/<id>/*.md` (12 dirs, e.g. `.opencode/protocols/coder/coder-toolkit.md`, `.opencode/protocols/documenter/documenter-chronicle.md`) reflected in `refined-source/agents.json` `relatedFiles`; `graph.json` groups add display-only `race` + `flavor` (Herald, Diviner, Ranger, Artificer, Sentinel, Inquisitor, Lorekeeper). Single coder preserved — Artificer with two toolkits (`language=angular|go`). See `docs/plans/rpg-agent-organization-plan.md` Phases 1–2 and `.opencode/protocols/README.md` Per-agent scrolls.

## Groups

### Coordination (delivery, orchestrator)

The human interface and the persistent coordinator. Delivery owns conversation and routing; orchestrator owns Phase 2 Reduce and fan-out. Both never implement.

### Analysis (interpreter)

Step 0 normalization + cheap image inspection. Reconciles vocabulary via grep/glob against the Slices table and returns a routing packet; also handles one image + one question fallback. Never answers the request itself.

### Exploration (explorer, project-context, external-scout)

Read-only finders. Explorer searches code; project-context assembles doc context; external-scout fetches live library docs. Vision-relay removed in 1.0.2 — its one-image capability migrated to interpreter.

### Coders (coder)

Single language-parameterized implementation specialist. Thin adapter over the docs in `docs/context/`; branches by `language=angular|go`. Never copies legacy `src/` patterns.

### Guardians (reviewer, architect, analista)

Read-only quality gates. Reviewer audits diffs; architect designs; analista gives second opinions. All return structured JSON verdicts.

### Quality (tester)

Test author and runner via canonical commands from `docs/project.md`. Runs from the package dir, never the repo root.

### Writers (documenter)

Sole dedicated writer for `docs/`. Maintains `docs/project.md`, context docs, and indexes; never modifies code or `.opencode/` runtime config.

## References

- Delegation graph: `docs/context/agent-delegation-graph.md`
- Rules per agent: `docs/context/rules-hierarchy.md`
- Data schema: `docs/context/refined-source-data.md`
