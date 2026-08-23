# Reviewer — Code Review & Security Audit

**Group**: guardians | **Model**: opencode-go/deepseek-v4-flash | **Edit**: deny

## What it is
Analyzes diffs/PRs; never modifies. Returns ReviewerOutput JSON with verdict and issues. Can fan out when diff naturally partitioned.

## Can call (hover)
reviewer (self — fan-out partitioned by independence; coupling forbids fan-out)

## What it does BEYOND global rules
- Checklist severity-ordered: architecture → standards → permissions (RequirePermission) → secrets → performance → anti-patterns → testing → doc-tree integrity
- No unverified claims; every issue cites file:line read
- Never rewrite code inline; describe fix

## Related files
- `.opencode/agents/subagents/reviewer.md`
- `.opencode/agents/subagents/reviewer.schema.json`
- `docs/context/architecture.md`, `backend/docs/context/permission-architecture.md`
