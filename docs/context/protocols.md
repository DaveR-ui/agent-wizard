---
last_updated: 2026-09-24
description: The 6 agent-system protocols — what each is, who runs it, its file — plus why this system ships protocols (flexible prose) instead of skills (strict text).
tags: [protocols, protocol, skill, dispatch, prompt-pipeline, orchestrate]
status: active
---

# Protocols

The installed agent system ships **6 protocols** as prose markdown under `protocols/` (agent-system-relative, resolved via the `agent-system` reference). A protocol is a convention an agent reads **on demand**; it is not auto-injected. See `docs/context/refined-source-data.md` for the `protocols.json` card schema that surfaces these in the Protocolos tab.

## The 6 protocols

| Protocol | File | Runs in | What it is |
|---|---|---|---|
| **dispatch** | `protocols/dispatch.md` | `delivery` | **Turn-entry protocol** — the interpreter-first hard gate, the "about to ask" tripwire, and the hand-off into the pipeline. Read first on every turn |
| prompt-pipeline | `protocols/prompt-pipeline.md` | `interpreter` (Step 0) + `orchestrator` (Phase 2) | Two-stage analysis: Step 0 (Interpret) → routing packet → Phase 2 (Reduce) → scope + plan |
| orchestrate | `protocols/orchestrate.md` | `orchestrator` | Pre-action thinking cadence: Protocol Discovery → Context Refresh → Proposal → Implementation → Verification → Documentation |
| subagent-spec-template | `protocols/subagent-spec-template.md` | spec authors / `orchestrator` | Canonical shape for subagent specs (frontmatter, 3-section shell) + the `output_schema` ↔ sibling-schema bridge |
| session-recovery | `protocols/session-recovery.md` | recovering `orchestrator` / human | API walk to recover an interrupted or STUCK session and produce a handoff snapshot |
| broad-investigation-template | `protocols/broad-investigation-template.md` | `explorer` (+ prompt builders) | 5-section scaffold for prompts that map, inventory, or audit the repo |

## dispatch — the delivery turn-entry protocol

`dispatch` is **highlighted** because it gates every turn. On **every prompt, without exception**, the `delivery` seat runs it before anything else:

1. **Interpreter first (hard gate)** — the first agent invocation of the turn is the `interpreter` subagent, before any other tool.
2. **No pre-classification** — trivial vs non-trivial is an *output* of the interpreter's routing packet, never a precondition for invoking it.
3. **The "about to ask" tripwire** — the urge to ask the human a clarifying question means the interpreter was skipped.
4. **Continue the pipeline** — with the packet in hand, follow `prompt-pipeline`.

The procedure is owned by the protocol; the seat's **enforcement** (FIRST-invocation rule, forbidden-tool list, never-classify rule) lives in `agents/delivery.md`.

## Protocol vs skill

| | Protocol | Skill |
|---|---|---|
| Form | Flexible **prose markdown** (`protocols/*.md`) | **Strict text**, runtime-injected |
| Loading | Read **on demand** by the agent | Injected by the runtime (`.opencode/skills/`) |
| Ownership | The agent system repo | The opencode runtime |
| Used for | Conventions, procedures, templates | Well-bounded capabilities with fixed contracts |
| Change cost | Edit prose, pick it up on next read | Runtime-owned names/contracts may change |

**Why this system prefers protocols** (verbatim, from the agent system `readme.md`):

> This repo ships no skills by design: conventions are `protocols/*.md` — intentionally prose markdown, not `.opencode/skills/`, because skills are strict-text and protocols are the preferred mechanism here.

The agent system therefore declares **no** skills; any built-in skill comes from the opencode runtime itself, not the repo.

## References

- Data schema: `docs/context/refined-source-data.md` (protocols.json)
- Catalog: `docs/context/agent-catalog.md`
- Architecture: `docs/context/architecture.md`
