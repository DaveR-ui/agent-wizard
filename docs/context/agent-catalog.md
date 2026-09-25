---
last_updated: 2026-09-24
description: Catalog of the 11 agents of the installed global opencode agent system (cyborges fork of DaverAgent) — id, group, role, model, mode, canCall count, key files. Flat agents/<id>.md layout.
tags: [agents, catalog, subagents, groups, canCall]
status: active
---

# Agent Catalog

The 11 agents defined in `refined-source/agents.json`. Source of truth: the **installed global agent system** (`~/.config/opencode`, via the `agent-system` reference) — a **FLAT** `agents/<id>.md` layout (no `agents/subagents/`, no `workflows/`, no per-agent scrolls). The system is the `cyborges` fork of DaverAgent; the Borges display names in `lore.md` are display-only. Group colors come from `refined-source/graph.json → groups` (v1.2.0, 7 groups).

## All agents

| id | displayName | group | role (one line) | model | mode | canCall |
|---|---|---|---|---|---|---|
| `delivery` | Delivery | coordination | Sole human ↔ agent interface; translates, routes, delegates — never implements | default (`opencode-go/qwen3.8-flash`) | primary | 10 |
| `orchestrator` | Orchestrator | coordination | Persistent coordinator; Phase 2 Reduce, fan-out, aggregation | inherit | subagent | 8 |
| `interpreter` | Interpreter | analysis | Step 0 normalization + cheap image inspection → routing packet | inherit | subagent | 0 |
| `explorer` | Explorer | exploration | Read-only codebase exploration, file search, dependency analysis | inherit | subagent | 1 |
| `external-scout` | External Scout | exploration | Fetches live docs for external libraries on demand | inherit | subagent | 0 |
| `coder` | Coder | coders | Language-parameterized implementation (Angular SPA \| Go API) | inherit | subagent | 0 |
| `reviewer` | Reviewer | guardians | Code review, security audit, best practices, performance | inherit | subagent | 1 |
| `architect` | Architect | guardians | System design, module boundaries, patterns | inherit | subagent | 0 |
| `analista` | Analista | guardians | Second-opinion advisor; read-only plan critique | inherit | subagent | 0 |
| `tester` | Tester | quality | Unit, integration, coverage, e2e test author and runner | inherit | subagent | 0 |
| `documenter` | Documenter | writers | Sole dedicated writer for docs/ | inherit | subagent | 0 |

> **No agent declares `model:` or `temperature:`** in its frontmatter. Subagents therefore `inherit` the invoking primary agent's model; `delivery` (primary) runs the top-level `model` from `opencode.json` (currently `opencode-go/qwen3.8-flash`). `temperature` is `null` everywhere — on opencode V2 an agent `temperature` is dead config and is omitted by design.
> `project-context` **no longer exists**; doc context is read on demand by the owning agents directly. There are no per-agent protocol scrolls and no `workflows/` layer.
> `delivery` canCall **10**, `orchestrator` canCall **8**; `explorer` and `reviewer` each self-fan-out (`canCall: [explorer]` / `[reviewer]`); the remaining 7 agents are leaves (`canCall: []`).

## Groups

### Coordination (delivery, orchestrator)

The human interface and the persistent coordinator. Delivery owns conversation and routing; orchestrator owns Phase 2 Reduce and fan-out. Both never implement.

### Analysis (interpreter)

Step 0 normalization + cheap image inspection. Reconciles vocabulary via grep/glob against the Slices table and returns a routing packet; also handles one image + one question fallback. Never answers the request itself.

### Exploration (explorer, external-scout)

Read-only finders. Explorer searches code; external-scout fetches live library docs.

### Coders (coder)

Single language-parameterized implementation specialist. Thin adapter over the docs in `docs/context/`; branches by `language=angular|go`. Never copies legacy `src/` patterns.

### Guardians (reviewer, architect, analista)

Read-only quality gates. Reviewer audits diffs; architect designs; analista gives second opinions. All return structured JSON verdicts.

### Quality (tester)

Test author and runner via canonical commands from `docs/project.md`. Runs from the package dir, never the repo root.

### Writers (documenter)

Sole dedicated writer for `docs/`. Maintains `docs/project.md`, context docs, and indexes; never modifies code or the installed agent system.

## relatedFiles vocabulary

`relatedFiles` in `refined-source/agents.json` mixes two vocabularies (see `docs/context/refined-source-data.md`):

- **agent-system assets** — bare agent-system-relative paths (`agents/<id>.md`, `agents/<id>.schema.json`, `protocols/<name>.md`, `opencode.json`, `readme.md`, `lore.md`) that resolve against the `agent-system` reference root (documented exception).
- **in-repo paths** — `docs/…`, `refined-source/…` that must resolve in the repo.

## References

- Delegation graph: `docs/context/agent-delegation-graph.md`
- Protocols: `docs/context/protocols.md`
- Rules per agent: `docs/context/rules-hierarchy.md`
- Data schema: `docs/context/refined-source-data.md`
