---
last_updated: 2026-09-24
description: Tag index for docs/ — every tag used in context, protocol, and plan frontmatter, mapped to the files that carry it.
tags: [index, tags, lookup]
status: active
---

# Tag Index

Fast lookup for the doc tree. Every tag used in `docs/context/`, `docs/protocols/`, and `docs/plans/` frontmatter maps to the files that carry it. Tags are for human lookup — the workspace does not interpret them for routing.

## Index

| Tag | Docs |
|---|---|
| `agent` | `context/agent-catalog.md`, `context/agent-delegation-graph.md` |
| `agent-specific` | `context/rules-hierarchy.md` |
| `agent-system` | `context/architecture.md` |
| `active` | `context/project-rules.md`, `context/rules-hierarchy.md`, `context/refined-source-data.md` |
| `agents` | `context/agent-catalog.md`, `context/agent-delegation-graph.md`, `plans/rpg-agent-organization-plan.md` |
| `agents.json` | `context/refined-source-data.md` |
| `angular` | `context/architecture.md` |
| `architecture` | `context/architecture.md` |
| `budget` | `context/context-engineering.md` |
| `build` | `local-dev.md`, `production.md` |
| `canCall` | `context/agent-catalog.md`, `context/agent-delegation-graph.md` |
| `catalog` | `context/agent-catalog.md` |
| `conventions` | `context/doc-conventions.md`, `context/project-rules.md` |
| `cost` | `context/project-rules.md` |
| `curation` | `protocols/refined-source-curation.md` |
| `data-layer` | `context/architecture.md`, `context/refined-source-data.md`, `protocols/refined-source-curation.md` |
| `delegation` | `context/agent-delegation-graph.md` |
| `diagram-agent` | `diagram-agent/` (repo root) — `README.md` + `*.md` static mirror, `status: deprecated`; superseded by the live viewer at `/diagram-agent/:id` |
| `dispatch` | `context/protocols.md` |
| `deploy` | `production.md` |
| `dev` | `local-dev.md` |
| `discipline` | `context/context-engineering.md` |
| `docs` | `context/doc-conventions.md` |
| `edges` | `context/agent-delegation-graph.md` |
| `english` | `context/project-rules.md` |
| `fan-out` | `context/agent-delegation-graph.md` |
| `frontmatter` | `context/doc-conventions.md` |
| `global` | `context/rules-hierarchy.md` |
| `graph` | `context/agent-delegation-graph.md` |
| `graph-ui` | `context/architecture.md` |
| `graph.json` | `context/refined-source-data.md` |
| `groups` | `context/agent-catalog.md`, `context/rules-hierarchy.md`, `plans/rpg-agent-organization-plan.md` |
| `hierarchy` | `context/rules-hierarchy.md` |
| `index` | `context/README.md`, `plans/README.md`, `protocols/README.md`, `_TAG-INDEX.md` |
| `indexing` | `context/indexing-strategy.md` |
| `jq` | `context/refined-source-data.md`, `local-dev.md`, `protocols/refined-source-curation.md` |
| `json` | `context/refined-source-data.md` |
| `knowledge-base` | `context/README.md` |
| `layers` | `context/architecture.md` |
| `load-on-demand` | `context/context-engineering.md` |
| `local` | `local-dev.md` |
| `lookup` | `context/indexing-strategy.md`, `_TAG-INDEX.md` |
| `mvi` | `context/context-engineering.md` |
| `orchestrate` | `context/protocols.md` |
| `passive` | `context/project-rules.md`, `context/rules-hierarchy.md`, `context/refined-source-data.md` |
| `permissions` | `plans/rpg-agent-organization-plan.md` |
| `philosophy` | `context/README.md` |
| `plan` | `plans/rpg-agent-organization-plan.md` |
| `plans` | `plans/README.md` |
| `production` | `production.md` |
| `protocol` | `context/protocols.md`, `protocols/refined-source-curation.md` |
| `protocols` | `context/protocols.md`, `protocols/README.md`, `plans/rpg-agent-organization-plan.md` |
| `protocols.json` | `context/protocols.md`, `context/refined-source-data.md` |
| `prompt-pipeline` | `context/protocols.md` |
| `refined-source` | `context/refined-source-data.md`, `protocols/refined-source-curation.md`, `plans/rpg-agent-organization-plan.md` |
| `registration` | `context/doc-conventions.md` |
| `review-loop` | `context/project-rules.md` |
| `routing` | `context/agent-delegation-graph.md` |
| `rpg` | `plans/rpg-agent-organization-plan.md` |
| `rules` | `context/project-rules.md`, `context/rules-hierarchy.md` |
| `rules.json` | `context/refined-source-data.md` |
| `search` | `context/indexing-strategy.md` |
| `serve` | `local-dev.md` |
| `severity` | `context/rules-hierarchy.md` |
| `skill` | `context/protocols.md` |
| `spa` | `production.md` |
| `standards` | `context/project-rules.md` |
| `static` | `production.md` |
| `subagents` | `context/agent-catalog.md` |
| `tags` | `context/indexing-strategy.md`, `_TAG-INDEX.md` |
| `test` | `local-dev.md` |
| `ui` | `plans/rpg-agent-organization-plan.md` |
| `_TAG-INDEX` | `context/indexing-strategy.md` |

## Grouped by topic

| Topic | Tags |
|---|---|
| Architecture | `architecture`, `layers`, `angular`, `graph-ui`, `data-layer` |
| Agents | `agents`, `agent`, `subagents`, `canCall`, `delegation`, `graph`, `edges`, `fan-out`, `groups`, `diagram-agent`, `plan`, `rpg` |
| Diagram agent | `diagram-agent` (deprecated static mirror; superseded by the live viewer at `/diagram-agent/:id`) |
| Rules | `rules`, `standards`, `conventions`, `english`, `cost`, `review-loop`, `hierarchy`, `global`, `agent-specific`, `severity`, `passive`, `active` |
| Data layer | `refined-source`, `json`, `jq`, `curation`, `data-layer` |
| Docs system | `docs`, `frontmatter`, `registration`, `indexing`, `tags`, `_TAG-INDEX`, `search`, `lookup`, `index` |
| Context discipline | `context`, `mvi`, `load-on-demand`, `budget`, `discipline` |
| Protocols | `protocol`, `protocols`, `protocols.json`, `dispatch`, `prompt-pipeline`, `orchestrate`, `skill` |
| Dev / ops | `local`, `dev`, `serve`, `test`, `build`, `production`, `deploy`, `static`, `spa` |

## Maintenance

- Add a row when a doc adds a tag; remove when no doc carries it.
- Run the post-change audit after edits — see `docs/context/doc-conventions.md`.