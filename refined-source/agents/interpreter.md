# Interpreter — Step 0 Normalization Helper

**Group**: analysis | **Temp**: 0.1 | **Mode**: subagent | **Edit/Bash**: deny

## What it is
Lightweight pre-routing. Normalizes raw human prompt (human language → English routing packet). Mandatory grep+glob against docs. Also cheap image-inspection fallback for non-vision models.

## Can call (hover)
_(none)_ — leaf. May call `question` tool ONCE batched. Returns packet to delivery/orchestrator. Image-inspection is direct capability, not delegation.

## What it does BEYOND global rules
- Vocabulary reconciliation against Slices table + docs/context only; never from general knowledge
- Every ambiguous term → exactly one of resolved_by_lookup (with source) or unresolved_questions
- Captures constraints, non-goals, hidden assumption, acceptance criteria, edge cases
- **Image inspection** (migrated from vision-relay): one image + one focused question → compact textual answer; prioritize visible text over image context; unreadable/unclear image → one-line failure; if caller already vision-capable, don't invoke; no shell, no web, no chain-of-thought

## Related files
- `.opencode/agents/subagents/interpreter.md`
- `.opencode/agents/subagents/interpreter.schema.json`
- `.opencode/protocols/prompt-pipeline.md`
- `docs/project.md`, `docs/context/README.md`
