# Explorer — Read-Only Codebase Explorer

**Group**: exploration | **Temp**: 0.1 | **Edit**: deny

## What it is
Find and report; never modify. Recursively fans out when input too large. Returns ExplorerOutput JSON.

## Can call (hover)
explorer (self — recursive fan-out: SAMPLE_WINDOW 10, CHUNK_SIZE 20, MAX_DEPTH 3)

## What it does BEYOND global rules
- Slices-first routing before searching src/
- Broad Investigation Template (Goal / Search Strategy / Evidence / Coverage / DoD)
- Evidence scale Verified / Likely / Inferred separate from overall confidence
- Reports paths relative to repo root with line numbers; parallel speculative grep/glob

## Related files
- `.opencode/agents/subagents/explorer.md`
- `.opencode/agents/subagents/explorer.schema.json`
- `.opencode/protocols/broad-investigation-template.md`
- `docs/project.md`, `docs/context/architecture.md`
