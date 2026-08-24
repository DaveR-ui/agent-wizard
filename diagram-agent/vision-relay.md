---
last_updated: 2026-08-23
description: Vision Relay — cheap image inspection, one image + one question → compact answer (exploration)
tags: [diagram-agent, exploration, vision-relay]
status: active
---

# Vision Relay

> Navigate from graph: this file is the click target for node `vision-relay` in [`refined-source/graph.json`](../refined-source/graph.json) (v1.0.0). Graph UI wiring is visual only — no runtime API, no auto-sync. Static hosting.

## What it is

Cheap image inspection for non-vision models. One image + one focused question → compact textual answer. No edits, no shell, no web, no chain-of-thought. Unreadable image → one-line failure.

| Field | Value |
|---|---|
| **Group** | `exploration` (order 4, color `#CA8A04`) |
| **Level** | 2, `isPrimary: false` |
| **Model** | `inherit`, temperature `0.1`, mode `subagent` |
| **Permission** | `edit: deny`, `bash: deny`, `webfetch: deny` |

## Can call

_(none)_ — pure leaf.

## Edges

From `refined-source/graph.json` (27 edges) — incident to `vision-relay`:

| Direction | From | To | Kind | Label |
|---|---|---|---|---|
| incoming | `delivery` | `vision-relay` | direct | — |
| incoming | `orchestrator` | `vision-relay` | parallel | — |

No outgoing task edges.

## Related files

From `refined-source/agents.json`:

- `.opencode/agents/subagents/vision-relay.md`

## Curated prose

Source: `refined-source/agents/vision-relay.md` (verbatim, English):

---

# Vision Relay — Cheap Image Inspection

**Group**: exploration | **Temp**: 0.1 | **Edit/Bash/Webfetch**: deny

## What it is
One image + one focused question → compact textual answer. No edits, no shell, no chain-of-thought.

## Can call (hover)
_(none)_ — pure leaf.

## What it does BEYOND global rules
- OCR screenshot, read diagram, extract PDF text
- If caller already vision-capable, don't invoke; unreadable → one line

## Related files
- `.opencode/agents/subagents/vision-relay.md`

---

## Provenance

<details>
<summary>Provenance — .opencode/agents/subagents/vision-relay.md (trimmed)</summary>

Vision Relay is a minimal relay that receives one absolute image path and one focused question, reads the image once, and replies with a compact answer (OCR, diagram reading, PDF text extraction) — no file edits, no shell, no web, and a one-line stop if unreadable; callers already vision-capable should not invoke it.

Source: `.opencode/agents/subagents/vision-relay.md` (35 lines, not copied in full to avoid drift)

</details>

<!-- editable-section -->
<!-- Add custom notes below — static hosting, no auto-sync. This block is intentionally not synchronized with refined-source/graph.json or .opencode/. -->

