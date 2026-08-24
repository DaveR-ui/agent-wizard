---
last_updated: 2026-08-23
description: Coder Angular — Angular SPA implementation specialist, thin adapter over Angular docs (coders)
tags: [diagram-agent, coders, coder-angular]
status: active
---

# Coder Angular

> Navigate from graph: this file is the click target for node `coder-angular` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Thin adapter over Angular docs in `docs/context/`. Implements features, bug fixes, refactors for the Angular frontend. Returns `CoderOutput` JSON. Reads `docs/project.md` + Angular docs, not `src/` legacy patterns.

| Field | Value |
|---|---|
| **Group** | `coders` (order 3, color `#16A34A`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `opencode-go/deepseek-v4-flash`, mode `subagent` |
| **Permission** | `task: [coder-angular]` |

## Can call

_(none)_ — leaf worker, does not delegate.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `coder-angular`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `coder-angular` | direct | trivial code |
| incoming | `orchestrator` | `coder-angular` | fan-out | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/coder-angular.md`
- `.opencode/agents/subagents/coder.schema.json`
- `docs/project.md`
- `docs/context/architecture.md`
- `frontend/docs/context/README.md`
- `frontend/src/features/<feature>/` (sibling reference, display-only)

## Curated prose

Source: `refined-source/agents/coder-angular.md` (verbatim, English):

---

# Coder Angular — Angular 21 SPA Specialist

**Group**: coders | **Model**: opencode-go/deepseek-v4-flash

## What it is
Thin adapter over Angular docs in docs/context/. Implements frontend features, bug fixes, refactors. Returns CoderOutput JSON.

## Can call (hover)
_(none)_ — leaf worker. Does not delegate.

## What it does BEYOND global rules
- Reads docs/project.md + Angular docs in docs/context/ (not src/ legacy patterns)
- Slice pattern: `<feature>.{routes,service,models}.ts` + `page/` + `ui/`
- Stack: Angular 21 standalone, signals/rxResource, Tailwind 4.1, Biome, Vitest/Playwright
- **Group rule**: complexity review is a coder trait (global example in prompt) — categorized as GROUP not GLOBAL

## Related files
- `.opencode/agents/subagents/coder-angular.md`
- `.opencode/agents/subagents/coder.schema.json`
- `docs/project.md`, `docs/context/architecture.md`
- `frontend/docs/context/*`, `frontend/src/features/<feature>/`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/coder-angular.md (trimmed)</summary>

Coder Angular is the Angular implementation specialist that reads `docs/project.md` Slices table and Angular docs in `docs/context/` as source of truth (never legacy `src/` anti-patterns), implements features/bugfixes/refactors, follows docs/context patterns, runs canonical test/lint/build commands, and returns validated `CoderOutput` JSON without writing summary files.

Source: `.opencode/agents/subagents/coder-angular.md` (42 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

