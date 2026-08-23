---
last_updated: 2026-08-23
description: Catalog of the 14 agents defined in refined-source/agents.json — id, group, role, model, mode, canCall count, key files.
tags: [agents, catalog, subagents, groups, canCall]
status: active
---

# Agent Catalog

The 14 agents defined in `refined-source/agents.json` (source of truth: `.opencode/agents/subagents/*.md`). Group colors come from `refined-source/graph.json → groups`.

## All agents

| id | displayName | group | role (one line) | model | mode | canCall | key relatedFiles |
|---|---|---|---|---|---|---|---|
| `delivery` | Delivery | coordination | Sole human ↔ agent interface; translates, routes, delegates — never implements | deepseek-v4-flash | primary | 13 | `delivery.md`, `workflows/dispatch.md`, `protocols/prompt-pipeline.md`, `docs/project.md` |
| `orchestrator` | Orchestrator | coordination | Persistent coordinator; Phase 2 Reduce, fan-out, aggregation | inherit | subagent | 12 | `orchestrator.md`, `workflows/orchestrate.md`, `docs/project.md`, `docs/context/README.md` |
| `interpreter` | Interpreter | analysis | Step 0 normalization; vocabulary reconciliation → routing packet | inherit | subagent | 0 | `interpreter.md`, `interpreter.schema.json`, `docs/project.md` |
| `explorer` | Explorer | exploration | Read-only codebase exploration, file search, dependency analysis | inherit | subagent | 1 | `explorer.md`, `explorer.schema.json`, `docs/context/architecture.md` |
| `project-context` | Project Context | exploration | READ-ONLY doc lookup and context assembly for docs/ | inherit | subagent | 0 | `project-context.md`, `docs/project.md`, `docs/context/README.md` |
| `external-scout` | External Scout | exploration | Fetches live docs for external libraries on demand | inherit | subagent | 0 | `external-scout.md` |
| `vision-relay` | Vision Relay | exploration | Cheap image inspection for non-vision models | inherit | subagent | 0 | `vision-relay.md` |
| `coder-angular` | Coder Angular | coders | Angular 21 SPA implementation specialist | deepseek-v4-flash | subagent | 0 | `coder-angular.md`, `coder.schema.json`, `docs/context/architecture.md`, `frontend/docs/context/README.md` |
| `coder-go` | Coder Go | coders | Go 1.24 API implementation specialist | deepseek-v4-flash | subagent | 0 | `coder-go.md`, `coder.schema.json`, `backend/docs/project.md` |
| `reviewer` | Reviewer | guardians | Code review, security audit, best practices, performance | deepseek-v4-flash | subagent | 1 | `reviewer.md`, `reviewer.schema.json`, `docs/context/architecture.md` |
| `architect` | Architect | guardians | System design, module boundaries, patterns | inherit | subagent | 0 | `architect.md`, `architect.schema.json`, `docs/context/architecture.md` |
| `analista` | Analista | guardians | Second-opinion advisor; read-only plan critique | inherit | subagent | 0 | `analista.md`, `analista.schema.json`, `protocols/session-recovery.md` |
| `tester` | Tester | quality | Unit, integration, coverage, e2e test author and runner | inherit | subagent | 0 | `tester.md`, `tester.schema.json`, `docs/context/project-rules.md`, `frontend/package.json` |
| `documenter` | Documenter | writers | Sole dedicated writer for docs/ | inherit | subagent | 0 | `documenter.md`, `documenter.schema.json`, `docs/project.md`, `docs/_TAG-INDEX.md` |

## Groups

### Coordination (delivery, orchestrator)

The human interface and the persistent coordinator. Delivery owns conversation and routing; orchestrator owns Phase 2 Reduce and fan-out. Both never implement.

### Analysis (interpreter)

Step 0 normalization. Reconciles vocabulary via grep/glob against the Slices table and returns a routing packet; never answers the request itself.

### Exploration (explorer, project-context, external-scout, vision-relay)

Read-only finders. Explorer searches code; project-context assembles doc context; external-scout fetches live library docs; vision-relay inspects one image.

### Coders (coder-angular, coder-go)

Implementation specialists. Thin adapters over the docs in `docs/context/`; never copy legacy `src/` patterns.

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