# Orchestrator — Persistent Coordinator

**Group**: coordination | **Model**: inherit

## What it is
Sole executor of Phase 2 Reduce. Decomposes handoff, fans out subagents in parallel, aggregates structured returns, returns agent-snapshot.

## Can call (hover)
coder, tester, reviewer, architect, explorer, external-scout, analista, documenter

Hover detail: *Does NOT call delivery or interpreter. Fan-out pattern: split file list into 20-file chunks, parallel N tasks, de-duplicate, promote severity. Single coder fan-out by language param; cross-type parallelism + same-type fan-out (8 entries).*

## What it does BEYOND global rules
- Produces ## Scope block (complexity Baja→Muy Alta, hot spots, in/out, key files, verification path)
- Slices routing via Keywords → Repo → Entry points; pick coder by language param (angular|go)
- Decision Hierarchy (context > integrity > user decisions > objective > buildable > conventions > quality)
- Context Budget: trim → delegate slice → request restart with clean snapshot

## Related files
- `agents/orchestrator.md`
- `protocols/orchestrate.md`
- `protocols/prompt-pipeline.md`
- `protocols/subagent-spec-template.md`
- `protocols/session-recovery.md`, `docs/project.md`
