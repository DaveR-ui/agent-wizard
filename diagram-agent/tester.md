---
last_updated: 2026-08-23
description: Tester — unit, integration, coverage, e2e test author and runner (quality)
tags: [diagram-agent, quality, tester]
status: active
---

# Tester

> Navigate from graph: this file is the click target for node `tester` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Authors and runs tests via canonical commands from `docs/project.md`. Returns `TesterOutput` JSON. Handles flaky-test quarantine. Runs from package dir, never repo root.

| Field | Value |
|---|---|
| **Group** | `quality` (order 5, color `#9333EA`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.2`, mode `subagent` |
| **Permission** | `task: [tester]` |

## Can call

_(none)_ — leaf.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `tester`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `tester` | direct | — |
| incoming | `orchestrator` | `tester` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/tester.md`
- `.opencode/agents/subagents/tester.schema.json`
- `docs/project.md`
- `docs/context/project-rules.md`
- `frontend/package.json` (sibling, display-only)
- `frontend/playwright.config.ts` (sibling, display-only)

## Curated prose

Source: `refined-source/agents/tester.md` (verbatim, English):

---

# Tester — Test Author & Runner

**Group**: quality | **Temp**: 0.2

## What it is
Authors and runs tests via canonical commands. Returns TesterOutput JSON. Handles flaky quarantine.

## Can call (hover)
_(none)_ — leaf.

## What it does BEYOND global rules
- Runs from package dir (never root): Vitest 4, Playwright 1.58, Storybook 10 (frontend); go test (backend)
- Behavior assertions (DOM, emitted values, state) not mock verification; don't duplicate logic into test
- Coverage gap reports; flaky quarantined with failure signature

## Related files
- `.opencode/agents/subagents/tester.md`
- `.opencode/agents/subagents/tester.schema.json`
- `docs/project.md`, `frontend/package.json`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/tester.md (trimmed)</summary>

Tester authors and runs the suites configured in `docs/project.md` (Vitest, Playwright, Go tests) from the affected package directory, asserting on observable behavior not mocks, reporting coverage gaps and flaky-test quarantine with failure signatures, and returning validated `TesterOutput` JSON without writing summary files.

Source: `.opencode/agents/subagents/tester.md` (80 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

