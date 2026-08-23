# Coder Angular — Angular 21 SPA Specialist

**Group**: coders | **Model**: opencode-go/deepseek-v4-flash

## What it is
Thin adapter over Angular docs in docs/context/. Implements frontend features, bug fixes, refactors. Returns CoderOutput JSON.

## Can call (hover)
_(none)_ — leaf worker. Does not delegate.

## What it does BEYOND global rules
- Reads docs/project.md + Angular docs in docs/context/ (not src/ legacy patterns)
- Slice pattern: `<feature>.{routes,service,models}.ts` + `page/` + `ui/`
- Stack: Angular 21 standalone, signals/rxResource, Tailwind 4.1, Biome, Vitest/Playwright
- **Group rule**: complexity review is a coder trait (global example in prompt) — categorized as GROUP not GLOBAL

## Related files
- `.opencode/agents/subagents/coder-angular.md`
- `.opencode/agents/subagents/coder.schema.json`
- `docs/project.md`, `docs/context/architecture.md`
- `frontend/docs/context/*`, `frontend/src/features/<feature>/`
