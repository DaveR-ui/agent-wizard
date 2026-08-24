---
last_updated: 2026-08-25
description: Index and philosophy of docs/context/ — the strategic knowledge base for agent-wizard.
tags: [context, index, philosophy, knowledge-base]
status: active
---

# Context Folder - Project Knowledge Base

**Single source of truth for project strategies, architecture, and conventions.**

## Philosophy

This folder contains **strategic documents** that guide the agent system's behavior. Each file serves a specific purpose and should be referenced by agents when relevant.

### Storage Principles

1. **Single Responsibility**: Each file covers ONE aspect of the project
2. **Reference, Don't Duplicate**: Agents should reference these files, not copy their content
3. **Version Controlled**: All changes are tracked in git
4. **English Only**: All documentation in English for consistency

## File Index

### Architecture & Design

| File | Purpose | When to Use |
|------|---------|-------------|
| `architecture.md` | Layered architecture (agent system, data layer, Angular skeleton), dependency flow, graph UI | When designing features, refactoring, or understanding how the layers relate |
| `agent-delegation-graph.md` | The canCall graph (13 nodes spec / 12 actual, 22 edges), edge kinds, routing and fan-out behavior | When reasoning about delegation, fan-out, or graph data |

### Development Standards

| File | Purpose | When to Use |
|------|---------|-------------|
| `project-rules.md` | Development standards: language, path quoting, cost discipline, review loop, structured returns | Always - baseline for all development |
| `doc-conventions.md` | Documentation conventions: frontmatter, registration, one-topic-per-file, nesting, post-change audit (canonical) | When writing or reviewing any doc in `docs/` |

### Agents & Rules

| File | Purpose | When to Use |
|------|---------|-------------|
| `agent-catalog.md` | The 13 agents (spec) / 12 actual: id, group, role, model, mode, canCall, key files | When picking an agent, reviewing the roster, or updating agent cards |
| `rules-hierarchy.md` | The 3-level rule hierarchy: 2 global, 6 group families, 6 agent-specific sets | When checking which rules apply to an agent or a change |

### Data Layer

| File | Purpose | When to Use |
|------|---------|-------------|
| `refined-source-data.md` | Data layer schemas (agents.json, rules.json, graph.json), hover contract, jq validation | When working with `refined-source/` or the UI data flow |

### Strategies & Optimization

| File | Purpose | When to Use |
|------|---------|-------------|
| `context-engineering.md` | Load-on-demand discipline: MVI sizing, when to load (and not load) context | When designing a subagent, writing a new doc, or changing the context-loading policy |
| `indexing-strategy.md` | Tag-based indexing for documentation search (`docs/_TAG-INDEX.md`) | When creating or searching documentation resources |

## Usage Guidelines

### For Agents

1. **Read on demand**: Only load files relevant to your current task
2. **Reference, don't embed**: Use file paths in your reasoning, don't copy entire content
3. **Respect hierarchy**: `project-rules.md` is always authoritative

### For Orchestrator

When coordinating complex tasks:

1. **Identify relevant context files** based on task type
2. **Pass file paths** to subagents, not full content
3. **Instruct subagents** to read specific sections

## File Relationships

```
project-rules.md (baseline - always applies)
├── context-engineering.md (the MVI sizing + load-on-demand discipline)
│   └── Referenced by: every strategy doc below; enforces the MVI cap
├── architecture.md (how the layers fit together)
├── agent-catalog.md (who the agents are)
│   └── agent-delegation-graph.md (how they delegate)
├── rules-hierarchy.md (which rules apply where)
├── refined-source-data.md (the data layer schemas)
├── doc-conventions.md (how to write docs)
│   └── indexing-strategy.md (how to index docs for search)
└── context-engineering.md (how much context to load)
```

## Maintenance

### Adding New Files

1. **One topic per file**: Don't mix concerns
2. **Clear purpose**: State when to use this file
3. **Cross-reference**: Link to related files
4. **Update this README**: Add to the index

### Updating Existing Files

1. **Maintain structure**: Keep the same sections
2. **Version control**: Commit with clear message
3. **Notify agents**: If breaking change, update agent prompts

## Context Budget

For models with limited context windows. **Last audit: 2026-08-23** (line counts are actual, tokens are estimated at ~3.5/line). MVI cap column follows the discipline in `context-engineering.md`; the **Status** column flags files over their cap.

| File | Lines | Tokens (~3.5/line) | MVI cap | Status | Priority |
|------|-------|--------------------|---------|--------|----------|
| `project-rules.md` | 32 | 112 | <100 (concept) | OK | High (always load) |
| `architecture.md` | 75 | 263 | <100 (concept) | OK | High (for design tasks) |
| `agent-catalog.md` | 64 | 224 | <150 (guide) | OK | Medium (for agent tasks) |
| `agent-delegation-graph.md` | 46 | 161 | <100 (concept) | OK | Medium (for delegation tasks) |
| `rules-hierarchy.md` | 54 | 189 | <100 (concept) | OK | Medium (for rule checks) |
| `refined-source-data.md` | 81 | 284 | <150 (guide) | OK | Medium (for data-layer tasks) |
| `doc-conventions.md` | 67 | 235 | <100 (concept) | OK | Medium (when writing docs) |
| `indexing-strategy.md` | 48 | 168 | <100 (concept) | OK | Low (for doc search) |
| `context-engineering.md` | 49 | 172 | <100 (concept) | OK | Medium (when designing agents / writing docs) |

**Total**: 516 lines / ~1808 tokens (context docs only)

**Recommendation**: Load only 2-3 files per task to stay under 2000 tokens. See `context-engineering.md` for the MVI sizing discipline and operational guidelines for when to load (and not load) context.

## Future Improvements

- [ ] Create summary versions of each file (for ultra-small context models)
- [ ] Add versioning to track changes over time
- [ ] Implement automatic context selection based on task type
- [ ] Create visual diagrams for architecture and workflows