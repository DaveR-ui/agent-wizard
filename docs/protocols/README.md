---
last_updated: 2026-09-24
description: Index of project protocols — facts and templates about how this specific project works.
tags: [protocols, index]
status: active
---

# Project Protocols

Reusable information fragments that document **how this specific project** works. These are not rules for the agent — they are facts and templates about the `agent-wizard` codebase that any agent (or human) can read and apply.

If a protocol mixes project facts with agent behavior, split it: project facts go here, agent behavior goes to the **installed agent system's** `protocols/` (`~/.config/opencode/protocols/`).

## Index

| Protocol | Purpose | Audience |
|---|---|---|
| [`refined-source-curation.md`](./refined-source-curation.md) | How to evolve `refined-source/` (agents.json, rules.json, graph.json, protocols.json, agents/*.md) in sync with the installed agent system | `documenter`, `delivery`, `orchestrator` |

## When to add a new project protocol

- The information is specific to this project (its stack, layers, naming, conventions).
- The same recipe would be **wrong** in a different project.
- A future agent (or human) would re-derive the same conclusion from the codebase if the protocol didn't exist.

## When NOT to add a project protocol

- The information is about how the **agent system** works (prompt pipeline, dispatch, session recovery, orchestration) → use the installed agent system's `protocols/` (`~/.config/opencode/protocols/`).
- The information is about the **agent's reasoning process** → there is no `workflows/` layer; see the `orchestrate` protocol in the installed agent system.
- The information is one-time reference (agent catalog, rule hierarchy) → already lives in `docs/context/`.

## Protocols in the UI

The 6 agent-system protocols are curated into `refined-source/protocols.json` and rendered by the **Protocolos** tab (`src/app/protocols-panel/`) — see `docs/context/protocols.md`.
