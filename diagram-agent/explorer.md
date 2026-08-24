---
last_updated: 2026-08-23
description: Explorer — read-only codebase exploration with recursive fan-out (exploration)
tags: [diagram-agent, exploration, explorer]
status: active
---

# Explorer

> Navigate from graph: this file is the click target for node `explorer` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Read-only codebase exploration, file search, and dependency analysis. Finds and reports; never modifies. Recursively fans out into parallel explorer instances when input exceeds the sample window. Returns `ExplorerOutput` JSON.

| Field | Value |
|---|---|
| **Group** | `exploration` (order 4, color `#CA8A04`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.1`, mode `subagent` |
| **Permission** | `edit: deny`, `task: [explorer]` (self) |

## Can call

`explorer` — self recursive fan-out (SAMPLE_WINDOW 10, CHUNK_SIZE 20, MAX_DEPTH 3).

## Edges

From `refined-source/graph.json` (27 edges) — incident to `explorer`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `explorer` | direct | — |
| incoming | `orchestrator` | `explorer` | fan-out | — |
| self | `explorer` | `explorer` | recursive-fanout | CHUNK_SIZE 20 |

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/explorer.md`
- `.opencode/agents/subagents/explorer.schema.json`
- `.opencode/protocols/broad-investigation-template.md`
- `docs/project.md`
- `docs/context/architecture.md`

## Curated prose

Source: `refined-source/agents/explorer.md` (verbatim, English):

---

# Explorer — Read-Only Codebase Explorer

**Group**: exploration | **Temp**: 0.1 | **Edit**: deny

## What it is
Find and report; never modify. Recursively fans out when input too large. Returns ExplorerOutput JSON.

## Can call (hover)
explorer (self — recursive fan-out: SAMPLE_WINDOW 10, CHUNK_SIZE 20, MAX_DEPTH 3)

## What it does BEYOND global rules
- Slices-first routing before searching src/
- Broad Investigation Template (Goal / Search Strategy / Evidence / Coverage / DoD)
- Evidence scale Verified / Likely / Inferred separate from overall confidence
- Reports paths relative to repo root with line numbers; parallel speculative grep/glob

## Related files
- `.opencode/agents/subagents/explorer.md`
- `.opencode/agents/subagents/explorer.schema.json`
- `.opencode/protocols/broad-investigation-template.md`
- `docs/project.md`, `docs/context/architecture.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/explorer.md (trimmed)</summary>

Explorer is the read-only exploration subagent that maps the codebase with parallel speculative grep/glob, reports paths relative to repo root with line numbers, and honors the Broad Investigation Template for broad-coverage audits. When input exceeds SAMPLE_WINDOW=10 it samples then fans out into CHUNK_SIZE=20 recursive `explorer` instances up to MAX_DEPTH=3, aggregating `ExplorerOutput` JSON. It never modifies code or guesses coverage.

Source: `.opencode/agents/subagents/explorer.md` (103 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

