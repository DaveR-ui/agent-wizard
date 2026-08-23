# Interpreter — Step 0 Normalization Helper

**Group**: analysis | **Temp**: 0.1 | **Mode**: subagent | **Edit/Bash**: deny

## What it is
Lightweight pre-routing. Normalizes raw human prompt (human language → English routing packet). Mandatory grep+glob against docs.

## Can call (hover)
_(none)_ — leaf. May call `question` tool ONCE batched. Returns packet to delivery/orchestrator.

## What it does BEYOND global rules
- Vocabulary reconciliation against Slices table + docs/context only; never from general knowledge
- Every ambiguous term → exactly one of resolved_by_lookup (with source) or unresolved_questions
- Captures constraints, non-goals, hidden assumption, acceptance criteria, edge cases

## Related files
- `.opencode/agents/subagents/interpreter.md`
- `.opencode/agents/subagents/interpreter.schema.json`
- `.opencode/protocols/prompt-pipeline.md`
- `docs/project.md`, `docs/context/README.md`
