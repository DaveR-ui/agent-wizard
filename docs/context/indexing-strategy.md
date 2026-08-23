---
last_updated: 2026-08-23
description: How docs/_TAG-INDEX.md works — purpose, tag conventions, tag-to-doc mapping, maintenance.
tags: [indexing, tags, _TAG-INDEX, search, lookup]
status: active
---

# Indexing Strategy

`docs/_TAG-INDEX.md` is the fast tag lookup for the doc tree. It maps every tag used in `docs/context/` and `docs/protocols/` frontmatter to the files that carry it.

## Purpose

- Human (and agent) lookup: "which doc covers X?" → find the tag → open the file.
- Registration check: every doc's tags must appear in the index.
- The workspace does NOT interpret tags for routing — they exist for lookup only.

## Tag conventions

| Convention | Rule |
|---|---|
| Lowercase | `architecture`, not `Architecture` |
| Kebab-case | `refined-source`, `agent-specific` |
| Singular nouns | `agent`, `rule`, `graph` |
| File-name derived | tags usually echo the doc's topic |
| 3–6 tags per doc | enough to be findable, not noise |

## How tags map to docs

The index is a single table:

| Tag | Docs |
|---|---|
| `architecture` | `docs/context/architecture.md` |
| `agents` | `docs/context/agent-catalog.md`, `docs/context/agent-delegation-graph.md` |
| ... | ... |

A tag may map to multiple docs (e.g. `rules` → `project-rules.md`, `rules-hierarchy.md`).

## Maintenance

- Add a row whenever a doc adds a tag.
- Remove a row only when no doc carries the tag anymore.
- Run the post-change audit (routing-table sync) after every edit — see `docs/context/doc-conventions.md`.

## References

- Conventions: `docs/context/doc-conventions.md`
- Tag index: `docs/_TAG-INDEX.md`