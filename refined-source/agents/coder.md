# Coder — Language-Parameterized Implementation Specialist

**Group**: coders | **Model**: opencode-go/deepseek-v4-flash

## What it is
Language-parameterized thin adapter over docs/context/. Branches by `language=angular|go` param. If `angular`: reads Angular docs in docs/context/ + MCP angular; if `go`: reads Go docs + gofmt/vet. Returns CoderOutput JSON.

## Can call (hover)
_(none)_ — leaf worker. Does not delegate. Branches internally, does not fan-out via task.

## What it does BEYOND global rules
- **Branching**: `language=angular` → Angular 22 SPA: standalone components, signals/rxResource, slice pattern `<feature>.{routes,service,models}.ts` + `page/` + `ui/`, Material, @swimlane/ngx-graph. `language=go` → Go 1.24 API: layered domain→repository→service→handler→routes under `/api/v1`, Gin v1.10, GORM v1.30 + PostgreSQL, Viper, JWT, seed logic in internal/domain/jsons/.
- Reads docs/project.md + relevant docs/context/ (not src/ legacy patterns); source-of-truth hierarchy: docs/context/*.md > docs/project.md > _TAG-INDEX.md > src/.
- Stack checks: Angular → ng test/build; Go → gofmt/go vet clean, explicit error handling; DB in development: backward compat NOT required.
- **Group rule**: complexity review and slice routing is a coder trait.

## Related files
- `.opencode/agents/subagents/coder.md`
- `.opencode/agents/subagents/coder.schema.json`
- `docs/project.md`, `docs/context/architecture.md`
