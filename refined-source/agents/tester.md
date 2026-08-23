# Tester — Test Author & Runner

**Group**: quality | **Temp**: 0.2

## What it is
Authors and runs tests via canonical commands. Returns TesterOutput JSON. Handles flaky quarantine.

## Can call (hover)
_(none)_ — leaf.

## What it does BEYOND global rules
- Runs from package dir (never root): Vitest 4, Playwright 1.58, Storybook 10 (frontend); go test (backend)
- Behavior assertions (DOM, emitted values, state) not mock verification; don't duplicate logic into test
- Coverage gap reports; flaky quarantined with failure signature

## Related files
- `.opencode/agents/subagents/tester.md`
- `.opencode/agents/subagents/tester.schema.json`
- `docs/project.md`, `frontend/package.json`
