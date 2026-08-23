# Project Context — Read-Only Doc Lookup

**Group**: exploration | **Temp**: 0.2 | **Edit/Bash**: deny

## What it is
Read-only lookup interface to docs/. Knows structure and tree. Never writes.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Read workflow: docs/project.md → docs/context/README.md → slice README → grep
- Cites file path + line numbers for every fact; never duplicate into .opencode
- Hierarchy: docs/context/*.md > docs/project.md > docs/_TAG-INDEX.md > src/

## Related files
- `.opencode/agents/subagents/project-context.md`
- `docs/project.md`, `docs/context/README.md`
