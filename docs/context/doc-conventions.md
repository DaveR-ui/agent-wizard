---
last_updated: 2026-08-23
description: Documentation conventions for this project, derived from the ia-docs-gen protocol — frontmatter, registration, one-topic-per-file, nesting, status markers.
tags: [docs, conventions, frontmatter, ia-docs-gen, registration]
status: active
---

# Doc Conventions

How `docs/` is written and maintained, per `source/protocols/ia-docs-gen.md` (the format spec). The `documenter` subagent is the canonical writer.

## Frontmatter

Every markdown file under `docs/` except `docs/project.md` starts with:

```yaml
---
last_updated: YYYY-MM-DD
description: brief one-line summary of the file's purpose
tags: [relevant, keywords]
status: [active | wip | deprecated]
---
```

Tags are for human lookup via `docs/_TAG-INDEX.md` — the workspace does not interpret them for routing.

## Registration

A new doc is done only when registered:

1. Row in `docs/context/README.md` (context docs) or `docs/protocols/README.md` (protocols).
2. Tag entries in `docs/_TAG-INDEX.md`.
3. Slices-table row in `docs/project.md` when the doc introduces a new slice.

## Rules

| Rule | Detail |
|---|---|
| One topic per file | Cross-reference instead of duplicating |
| Max 3 nesting levels | `#` / `##` / `###` only |
| English only | `doc_language: english` |
| Concise, table-first | Tables and checklists over narrative |
| Status markers | `(WIP)`, `(TODO)`, `(DEPRECATED)` for incomplete sections |
| Never delete files | Deletion is a human action; write the replacement and let the human remove the old one |

## Component-doc format

When documenting a component or feature flow:

1. **Path and overview** — where it lives, primary purpose.
2. **Data flow** — state management, inputs/outputs.
3. **Known anti-patterns (AVOID)** — incorrect usages found in source.
4. **Standard pattern (USE)** — the definitive implementation.
5. **Key issues fixed** — one line per issue the doc resolves.

## Post-change audit

After any doc change, run the three-dimension audit:

1. **Routing-table sync** — routing docs (`docs/project.md` Slices, `docs/context/README.md`, `docs/protocols/README.md`, `docs/_TAG-INDEX.md`) still agree. Never auto-fix discrepancies — ask the human.
2. **Date freshness** — `last_updated` older than 30 days → stale warning; older than 90 days → flag for review/removal.
3. **Link integrity** — every relative markdown link resolves.

## References

- Format spec: `source/protocols/ia-docs-gen.md`
- Indexing: `docs/context/indexing-strategy.md`
- Context budget: `docs/context/context-engineering.md`