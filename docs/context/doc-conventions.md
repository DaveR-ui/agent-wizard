---
last_updated: 2026-08-24
description: Documentation conventions for this project — frontmatter, registration, one-topic-per-file, nesting, status markers, post-change audit (canonical spec, formerly ia-docs-gen).
tags: [docs, conventions, frontmatter, registration]
status: active
---

# Doc Conventions

How `docs/` is written and maintained (canonical spec — this file, formerly ia-docs-gen). The `documenter` subagent is the sole dedicated writer for `docs/`.

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

## Principles (AI-optimized, salvaged from retired ia-docs-gen)

All docs follow: concise over verbose (bullets/tables over paragraphs), patterns over prose (show code patterns), consistent headers with max 3 nesting levels, include real project code examples where possible, status markers `(WIP)`/`(TODO)`/`(DEPRECATED)`, English only.

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

- Format spec: `docs/context/doc-conventions.md` (this file — former ia-docs-gen merged 2026-08-24)
- Indexing: `docs/context/indexing-strategy.md`
- Context budget: `docs/context/context-engineering.md`