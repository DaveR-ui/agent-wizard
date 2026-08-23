# Coder Go — Go 1.24 API Specialist

**Group**: coders | **Model**: opencode-go/deepseek-v4-flash

## What it is
Thin adapter over Go docs in docs/context/. Implements backend domain→repository→service→handler→routes under /api/v1. Returns CoderOutput JSON.

## Can call (hover)
_(none)_ — leaf worker.

## What it does BEYOND global rules
- Layered architecture, Gin v1.10, GORM v1.30 + PostgreSQL, Viper, JWT
- Seed logic + JSON data in internal/domain/jsons/ for new entities
- DB in development: backward compat NOT required; tables can be dropped
- gofmt/go vet clean, explicit error handling

## Related files
- `.opencode/agents/subagents/coder-go.md`
- `.opencode/agents/subagents/coder.schema.json`
- `backend/docs/project.md`, `backend/internal/domain/*`
