# Delivery — Sole Human ↔ Agent Interface

**Group**: coordination (primary) | **Model**: opencode-go/qwen3.8-flash

## What it is
Coordinator, not executor. Owns human conversation, language translation, and routing. Never implements.

## Can call (hover)
interpreter, orchestrator, coder, tester, reviewer, architect, explorer, external-scout, analista, documenter

Hover detail: *Step 0 is always interpreter first; orchestrator for non-trivial (1+ files or multi-step); direct coder/tester/etc only for trivial scopes. Single coder branches by language=angular|go. Permission.task in frontmatter is the allow-list (10 entries).*

## What it does BEYOND global rules
- Trivial vs non-trivial is OUTPUT of interpreter packet (never pre-classified)
- Self-check gate + Hard STOP on subagent failure (report "delegación bloqueada" and stop)
- Agent-system changes review loop: Draft → Review (reviewer/analista) → Apply → Verify (tester)
- Session Preflight: batch all ambiguities into one decision event, cache answers
- Skill Loading Contract: pass exact file paths, not summaries, to subagents

## Related files
- `agents/delivery.md`
- `protocols/dispatch.md`
- `protocols/prompt-pipeline.md`
- `protocols/session-recovery.md`
- `opencode.json`, `docs/project.md`
