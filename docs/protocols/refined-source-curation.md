---
last_updated: 2026-09-24
description: Project protocol — how to evolve refined-source/ (agents.json, rules.json, graph.json, protocols.json, agents/*.md) without breaking the data layer. Source is the installed agent system.
tags: [protocol, refined-source, curation, jq, data-layer]
status: active
---

# Protocol: Refined Source Curation

How to evolve the curated data layer in `refined-source/`. The change always originates in the **installed agent system** (`~/.config/opencode`, resolved via the `agent-system` reference) and is reflected manually in `refined-source/`. See `docs/context/architecture.md` Dependency flow and `docs/context/refined-source-data.md` for the canonical workflow. Never curate from the repo's stale `.opencode/` vendored copy.

## Purpose

Keep `refined-source/` in sync with the agent system without auto-scripts. Manual curation was chosen deliberately (`curado manual, iterativo`) to allow professionalization later.

## Steps

1. **Change originates in the installed agent system** — edit `agents/<id>.md`, `protocols/*.md`, `opencode.json` in `~/.config/opencode` (subject to the review loop, `docs/context/project-rules.md`). Validate there with `bash scripts/validate-agent.sh`.
2. **Reflect in `refined-source/`** — manually update:
   - `refined-source/agents.json` — card fields (11 agents: `role`, `essence`, `canCall`, `specificBeyondGeneral`, `relatedFiles`, frontmatter).
   - `refined-source/rules.json` — global / groups / agentSpecific rules (passive-first, `kind` tagged).
   - `refined-source/graph.json` — nodes (11), edges (20), groups (7), meta.
   - `refined-source/protocols.json` — the 6 protocol cards.
   - `refined-source/agents/<id>.md` — detail prose when needed (11 actual).
3. **Bump graph meta** — `graph.json → meta.version` to `1.2.0` and `meta.generated` to `2026-09-24` (current).
4. **Validate**:

```bash
jq empty refined-source/agents.json && jq empty refined-source/rules.json && jq empty refined-source/graph.json && jq empty refined-source/protocols.json
```

5. **Verify relatedFiles** — agent-system assets use bare agent-system-relative paths (`agents/…`, `protocols/…`, `opencode.json`, `readme.md`) resolving against the `agent-system` reference; in-repo paths (`docs/…`, `refined-source/…`) must resolve (see `docs/context/refined-source-data.md`).

## Constraints

- No auto-script that generates curated content — edits are manual, hand-authored, and pretty-printed.
- All JSON/MD content in English.
- Do NOT mutate the installed agent system silently — review loop applies.
- `relatedFiles` pointing at `docs/` must resolve after the change (post-change audit).

## References

- Data schema: `docs/context/refined-source-data.md`
- Protocols: `docs/context/protocols.md`
- Rules: `docs/context/rules-hierarchy.md`
- Graph: `docs/context/agent-delegation-graph.md`
