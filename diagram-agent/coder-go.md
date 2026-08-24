---
last_updated: 2026-08-23
description: Coder Go — Go API implementation specialist, domain → handler → routes (coders)
tags: [diagram-agent, coders, coder-go]
status: active
---

# Coder Go

> Navigate from graph: this file is the click target for node `coder-go` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Thin adapter over Go docs in `docs/context/`. Implements backend domain → repository → service → handler → routes under `/api/v1`. Returns `CoderOutput` JSON.

| Field | Value |
|---|---|
| **Group** | `coders` (order 3, color `#16A34A`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `opencode-go/deepseek-v4-flash`, mode `subagent` |
| **Permission** | `task: [coder-go]` |

## Can call

_(none)_ — leaf worker.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `coder-go`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `coder-go` | direct | — |
| incoming | `orchestrator` | `coder-go` | fan-out | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/coder-go.md`
- `.opencode/agents/subagents/coder.schema.json`
- `docs/project.md`
- `backend/docs/project.md` (sibling, display-only)
- `backend/internal/domain/` (sibling, display-only)
- `backend/internal/transport/http/` (sibling, display-only)

## Curated prose

Source: `refined-source/agents/coder-go.md` (verbatim, English):

---

# Coder Go — Go 1.24 API Specialist

**Group**: coders | **Model**: opencode-go/deepseek-v4-flash

## What it is
Thin adapter over Go docs in docs/context/. Implements backend domain→repository→service→handler→routes under /api/v1. Returns CoderOutput JSON.

## Can call (hover)
_(none)_ — leaf worker.

## What it does BEYOND global rules
- Layered architecture, Gin v1.10, GORM v1.30 + PostgreSQL, Viper, JWT
- Seed logic + JSON data in internal/domain/jsons/ for new entities
- DB in development: backward compat NOT required; tables can be dropped
- gofmt/go vet clean, explicit error handling

## Related files
- `.opencode/agents/subagents/coder-go.md`
- `.opencode/agents/subagents/coder.schema.json`
- `backend/docs/project.md`, `backend/internal/domain/*`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/coder-go.md (trimmed)</summary>

Coder Go is the Go implementation specialist for the Go API backend that reads `docs/project.md` Slices table and Go docs in `docs/context/` as source of truth, implements domain→repository→service→handler→routes under `/api/v1`, follows gofmt/go vet clean and explicit error handling, runs canonical commands from `docs/project.md`, and returns validated `CoderOutput` JSON.

Source: `.opencode/agents/subagents/coder-go.md` (43 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

