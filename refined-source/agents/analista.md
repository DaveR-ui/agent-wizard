# Analista — Second-Opinion Advisor

**Group**: guardians | **Model**: inherit | **Edit/Bash**: deny | **Canonical-only spec**

## What it is
Second-opinion for delivery/orchestrator when lost or stuck. Read-only; returns AnalystOutput JSON. Re-routes implementation to owning subagents.

## Can call (hover)
_(none)_ — but re_route_to field points to correct owner (coder, reviewer, architect, tester, explorer)

## What it does BEYOND global rules
- Requires 2+ alternatives + calibrated confidence; <0.5 must state what evidence would raise it
- Verdict: proceed / reconsider / abandon; complements session-recovery.md
- Evidence-grounded: every recommendation cites files read

## Related files
- `agents/analista.md`
- `agents/analista.schema.json`
- `protocols/session-recovery.md`
- `protocols/subagent-spec-template.md`
