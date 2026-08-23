---
last_updated: 2026-08-23
description: Load-on-demand context discipline — docs/project.md entry → context/README.md → specific doc → grep; MVI caps and the Context Budget table.
tags: [context, mvi, load-on-demand, budget, discipline]
status: active
---

# Context Engineering

The discipline for deciding what context the agent system loads, when, and how much. Small models have limited windows — load only what the task needs.

## Load path

```
docs/project.md (entry) → docs/context/README.md (index) → specific doc → grep if still unclear
```

1. **Entry**: `docs/project.md` — slices, stack, commands, conventions.
2. **Index**: `docs/context/README.md` — pick the doc for the task type.
3. **Specific doc**: read the relevant `docs/context/*.md` or `docs/protocols/*.md`.
4. **Grep**: search the codebase only if the doc does not answer the question.

## MVI caps

MVI (Minimum Viable Information) caps keep docs loadable:

| Doc type | Cap |
|---|---|
| Concept | < 100 lines |
| Guide | < 150 lines |
| Research audit | < 300 lines |

## Context Budget

See the live table in `docs/context/README.md` → Context Budget. Rules:

- Load 2–3 files per task to stay under ~2000 tokens.
- Files over their cap are flagged `OVER` — split or trim them.
- `project-rules.md` is always authoritative and always loaded.

## When NOT to load

- The task is trivial and the answer is in the prompt.
- The doc is a reference for a subsystem you are not touching.
- The fact already lives in a higher-priority source (docs/context > docs/project.md > _TAG-INDEX > src/).

## References

- Budget table: `docs/context/README.md`
- Conventions: `docs/context/doc-conventions.md`