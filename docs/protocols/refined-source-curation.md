---
last_updated: 2026-08-23
description: Project protocol — how to evolve refined-source/ (agents.json, rules.json, graph.json, agents/*.md) without breaking the data layer.
tags: [protocol, refined-source, curation, jq, data-layer]
status: active
---

# Protocol: Refined Source Curation

How to evolve the curated data layer in `refined-source/`. The change always originates in `.opencode/` (the source of truth), flows through `source/`, and is reflected manually in `refined-source/`.

## Purpose

Keep `refined-source/` in sync with the agent system without auto-scripts. Manual curation was chosen deliberately (`curado manual, iterativo`) to allow professionalization later.

## Steps

1. **Change originates in `.opencode/`** — edit `.opencode/agents/subagents/<id>.md`, `.opencode/protocols/*.md`, etc. (subject to the no-mutate review loop, `docs/context/project-rules.md`).
2. **Update `source/` copy** — mirror the change in `source/` (clean copy, node_modules removed).
3. **Reflect in `refined-source/`** — manually update:
   - `refined-source/agents.json` — card fields (`role`, `essence`, `canCall`, `specificBeyondGeneral`, `relatedFiles`, frontmatter).
   - `refined-source/rules.json` — global / groups / agentSpecific rules.
   - `refined-source/graph.json` — nodes, edges, groups, meta.
   - `refined-source/agents/<id>.md` — detail prose when needed.
4. **Bump graph meta** — `graph.json → meta.version` and `meta.generated`.
5. **Validate**:

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
```

6. **Verify relatedFiles** — every path in `agents.json → relatedFiles` must resolve (see `docs/context/refined-source-data.md`).

## Constraints

- No auto-script; edits are manual and pretty-printed.
- All JSON/MD content in English.
- Do NOT mutate `.opencode/` at the workspace root silently — review loop applies.
- `relatedFiles` pointing at `docs/` must resolve after the change (post-change audit).

## References

- Data schema: `docs/context/refined-source-data.md`
- Rules: `docs/context/rules-hierarchy.md`
- Graph: `docs/context/agent-delegation-graph.md`