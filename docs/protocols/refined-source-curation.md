---
last_updated: 2026-08-24
description: Project protocol — how to evolve refined-source/ (agents.json, rules.json, graph.json, agents/*.md) without breaking the data layer. Sole source .opencode, source/ deleted.
tags: [protocol, refined-source, curation, jq, data-layer]
status: active
---

# Protocol: Refined Source Curation

How to evolve the curated data layer in `refined-source/`. The change always originates in `.opencode/` (sole source of truth; `source/` clean copy deleted 2026-08-24) and is reflected manually in `refined-source/`. See `docs/context/architecture.md` Dependency flow and `docs/context/refined-source-data.md` for the canonical workflow.

## Purpose

Keep `refined-source/` in sync with the agent system without auto-scripts. Manual curation was chosen deliberately (`curado manual, iterativo`) to allow professionalization later.

## Steps

1. **Change originates in `.opencode/`** — edit `.opencode/agents/subagents/<id>.md`, `.opencode/protocols/*.md`, etc. (subject to the no-mutate review loop, `docs/context/project-rules.md`). No `source/` copy step — `source/` deleted 2026-08-24.
2. **Reflect in `refined-source/`** — manually update:
   - `refined-source/agents.json` — card fields (`role`, `essence`, `canCall`, `specificBeyondGeneral`, `relatedFiles`, frontmatter).
   - `refined-source/rules.json` — global / groups / agentSpecific rules (passive-first, `kind` tagged).
   - `refined-source/graph.json` — nodes (12), edges (22), groups (7 with `race`+`flavor`), meta.
   - `refined-source/agents/<id>.md` — detail prose when needed (12 actual; coder unified, vision-relay removed).
3. **Bump graph meta** — `graph.json → meta.version` to `1.1.0` and `meta.generated` to `2026-08-24` (current; race+flavor display-only).
4. **Validate**:

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json
```

5. **Verify relatedFiles** — every path in `agents.json → relatedFiles` must resolve (except sibling-project references; see `docs/context/refined-source-data.md`).

## Constraints

- No auto-script that generates curated content — edits are manual, hand-authored, and pretty-printed.
- All JSON/MD content in English.
- Do NOT mutate `.opencode/` at the workspace root silently — review loop applies.
- `relatedFiles` pointing at `docs/` must resolve after the change (post-change audit).

## References

- Data schema: `docs/context/refined-source-data.md`
- Rules: `docs/context/rules-hierarchy.md`
- Graph: `docs/context/agent-delegation-graph.md`
