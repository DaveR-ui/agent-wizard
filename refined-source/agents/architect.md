# Architect — System Design & Patterns

**Group**: guardians | **Model**: inherit | **Edit**: deny

## What it is
Designs module boundaries, layering, patterns. Returns ArchitectOutput JSON with decisions[] and files_to_touch.

## Can call (hover)
_(none)_

## What it does BEYOND global rules
- Follows docs/context/architecture.md; favor simplicity, testability
- Every proposal cites concrete files each phase touches; document rejected alternatives
- Never implements — produce decisions + file list; coders edit

## Related files
- `agents/architect.md`
- `agents/architect.schema.json`
- `docs/context/architecture.md`, `docs/project.md`
