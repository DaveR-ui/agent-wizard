---
last_updated: 2026-08-23
description: External Scout — live docs fetcher for external libraries, one library + version + one question (exploration)
tags: [diagram-agent, exploration, external-scout]
status: active
---

# External Scout

> Navigate from graph: this file is the click target for node `external-scout` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Fetches live docs for external libraries on demand. One library + version + one focused question → compact structured answer with API signatures, breaking changes, usage patterns. No edits, no shell, no exploration.

| Field | Value |
|---|---|
| **Group** | `exploration` (order 4, color `#CA8A04`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.1`, mode `subagent` |
| **Permission** | `edit: deny`, `bash: deny`, `webfetch: allow` |

## Can call

_(none)_ — leaf.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `external-scout`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `external-scout` | direct | — |
| incoming | `orchestrator` | `external-scout` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/external-scout.md`

## Curated prose

Source: `refined-source/agents/external-scout.md` (verbatim, English):

---

# External Scout — Live External Docs Fetcher

**Group**: exploration | **Temp**: 0.1 | **Webfetch**: allow | **Edit/Bash**: deny

## What it is
One library + version + one focused question → compact answer with API signatures/breaking changes/usage.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Sources: official docs version-pinned → GitHub releases → npm/README
- Fetch only what needed; unreachable → one line and stop; no fallback

## Related files
- `.opencode/agents/subagents/external-scout.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/external-scout.md (trimmed)</summary>

External Scout is a single-purpose documentation scout that takes one package name, one version, and one focused question, fetches the version-pinned official docs (fallback to GitHub releases or npm README) via webfetch, and returns one compact answer with signatures or breaking changes — no edits, no shell, no exploration, and a one-line stop if unreachable.

Source: `.opencode/agents/subagents/external-scout.md` (61 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

