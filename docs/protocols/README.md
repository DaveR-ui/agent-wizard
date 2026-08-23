---
last_updated: 2026-08-23
description: Index of project protocols — facts and templates about how this specific project works.
tags: [protocols, index]
status: active
---

# Project Protocols

Reusable information fragments that document **how this specific project** works. These are not rules for the agent — they are facts and templates about the `agent-wizard` codebase that any agent (or human) can read and apply.

If a protocol mixes project facts with agent behavior, split it: project facts go here, agent behavior goes in `.opencode/protocols/`.

## Index

| Protocol | Purpose | Audience |
|---|---|---|
| [`refined-source-curation.md`](./refined-source-curation.md) | How to evolve `refined-source/` (agents.json, rules.json, graph.json, agents/*.md) in sync with `.opencode/` → `source/`. | `documenter`, `delivery`, `orchestrator` |

## When to add a new project protocol

- The information is specific to this project (its stack, layers, naming, conventions).
- The same recipe would be **wrong** in a different project.
- A future agent (or human) would re-derive the same conclusion from the codebase if the protocol didn't exist.

## When NOT to add a project protocol

- The information is about how the **agent system** works (prompt pipeline, session recovery) → use `.opencode/protocols/`.
- The information is about the **agent's reasoning process** (read this before writing code) → use `.opencode/workflows/`.
- The information is one-time reference (agent catalog, rule hierarchy) → already lives in `docs/context/`.