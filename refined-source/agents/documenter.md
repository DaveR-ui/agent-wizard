# Documenter — Docs Writer (sole for docs/)

**Group**: writers | **Temp**: 0.2

## What it is
Sole dedicated writer for docs/. Reads/writes docs/ on demand; never code or .opencode config. Returns DocumenterOutput JSON.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Every page needs frontmatter (last_updated, status, description, tags); new doc registered in README, _TAG-INDEX, Slices if needed
- One topic per file; cross-reference, don't duplicate
- Post-change audit: routing-table sync, date freshness (>30/>90), link integrity

## Related files
- `.opencode/agents/subagents/documenter.md`
- `.opencode/agents/subagents/documenter.schema.json`
- `docs/project.md`, `docs/context/README.md`, `docs/_TAG-INDEX.md`
- `.opencode/protocols/ia-docs-gen.md`, `.opencode/protocols/ia-catalog-manager.md`
