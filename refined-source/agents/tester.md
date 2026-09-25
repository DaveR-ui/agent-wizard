# Tester — Test Author & Runner

**Group**: quality | **Model**: inherit | **Edit**: deny

## What it is
Framework-parameterized test specialist. Runs via canonical commands. Returns TesterOutput JSON. Handles flaky quarantine. Does not implement source features.

## Can call (hover)
_(none)_ — leaf.

## What it does BEYOND global rules
- Branches by framework param (vitest | karma-jasmine | playwright | go); runs from package dir (never root)
- Behavior assertions (DOM, emitted values, state) not mock verification; don't duplicate logic into test
- Coverage gap reports; flaky quarantined with failure signature
- Optional conditional linter only when a linter param is informed

## Related files
- `agents/tester.md`
- `agents/tester.schema.json`
- `docs/project.md`, `docs/context/project-rules.md`
