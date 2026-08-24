---
last_updated: 2026-08-24
description: Design plan to reorganize the agent system and its page around an RPG metaphor — races = groups, passives = rules kind:passive, weapons = permission entries, per-agent protocol folders. Design-only; implementation gated by human approval.
tags: [plan, rpg, agents, groups, protocols, permissions, refined-source, ui]
status: wip
---

# RPG Agent Organization Plan

Reorganize the agent system and its Angular page around an RPG metaphor: **races** = the 7 groups, **passives** = invariant rules (`kind: passive`), **weapons** = tool permissions, **protocol scrolls** = per-agent protocol files. The RPG layer is **presentation-only**: it derives from `refined-source/` data and never duplicates rule semantics. Implementation runs in a later session against the real agents, after human approval of this plan (complexity Alta/Muy Alta → human validation gate per `prompt-pipeline` decision rules).

## Scope

| In scope | Out of scope (explicit) |
|---|---|
| Per-agent protocol folders in `.opencode/` (branch-gated) | Rewriting agent prompt content (structure + pilot extraction only) |
| `refined-source/` curation after moves (paths, race display fields) | New rules — `rules.json` semantics unchanged |
| RPG display on agent cards + `/diagram-agent/:id` viewer | New UI libraries (Material + ngx-graph only) |
| Fate of stale `diagram-agent/` mirror | Deleting `diagram-agent/` (human action) |

Targets the **12 actual agents** (v1.0.2), not the 13 spec narrative.

## RPG ↔ System Mapping

### Races (groups) — display identity

Source: `refined-source/graph.json → groups[]` (7). Proposed stored display fields: `race` + `flavor` per group (see Phase 2). Flavor is display-only — it never re-states rule semantics.

| group id | Race | Flavor (display-only) | Members |
|---|---|---|---|
| coordination | Herald | Voice of the party — takes quests from the human and directs the company; never strikes | delivery, orchestrator |
| analysis | Diviner | Reads intent, dispels ambiguity, points the way — never walks the path for you | interpreter |
| exploration | Ranger | Scouts the terrain and the lore; touches nothing | explorer, project-context, external-scout |
| coders | Artificer | Crafter who switches toolkit by material (`language=angular\|go`) | coder |
| guardians | Sentinel | Read-only judges of plans and deeds | reviewer, architect, analista |
| quality | Inquisitor | Trials every artifact under controlled combat until it breaks | tester |
| writers | Lorekeeper | Chronicler of the party; writes only in the common tongue (English) | documenter |

### Passives — `rules.json` kind:passive is the single source

**Explicit reuse statement**: `refined-source/rules.json` already tags every rule `kind: passive` (invariant) / `kind: active` (behavioral), ordered passive-first across 3 levels. The RPG passive display **derives** from it — no parallel system, no new rule storage.

| Passive scope | rules.json source | RPG label |
|---|---|---|
| World laws (all agents) | `global[]` (0007, 0008) | World laws |
| Race passives | `groups[agent.group].rules` filtered `kind=passive` | Race trait |
| Personal passives | `agentSpecific[agentId].rules` filtered `kind=passive` | Personal trait |

Active rules (`kind=active`) render as a secondary "skills" list. The human's examples map to real data:

| Example | Evidence in current data |
|---|---|
| "writers must write in English" | Rule 0028 (sole writer, passive) + `doc_language: english` + `documenter.md` Rules ("Language follows docs/project.md → doc_language") |
| "coders need a language input + referenced folder" | `coder.md` branches on `language` param; `docs/context/` is the referenced folder (rule 0016 stack conventions, passive) |

### Weapons — derived from `agents.json → permission`

There is no `tools:` frontmatter field; weapons derive from the permission object. Render only explicit entries:

| Permission entry | RPG display |
|---|---|
| `<tool>: "allow"` (e.g. external-scout `webfetch`) | Weapon equipped |
| `<tool>: "deny"` (e.g. interpreter `edit`/`bash`) | Weapon locked |
| `task: [...]` allow-list | Summons (callable agents = `canCall`) |

### Protocols — per-agent files, shared/agent-specific split

| Kind | Location | Current content |
|---|---|---|
| Shared (multi-agent) | `.opencode/protocols/` — unchanged | All 5 existing: prompt-pipeline, session-recovery, broad-investigation-template, subagent-spec-template, agent-installer |
| Agent-specific | Per-agent folder (Phase 1, branch-gated) | New/extracted per agent (pilot: coder, documenter) |

## Phases

| Phase | Work | Executed by | Gate |
|---|---|---|---|
| 0 | Git snapshot of `.opencode/` + nested-loader probe | orchestrator → coder; human restarts | Probe result picks Branch A/B |
| 1 | Agent-system restructure (review loop) | coder drafts/applies; reviewer + analista review; tester verifies | All 12 agents load; tests pass |
| 2 | refined-source curation | documenter; reviewer verifies | jq + path resolvability |
| 3 | Page/UI RPG display + mirror fate | coder (language=angular); tester; reviewer | ng test green |
| — | Doc sync per phase | documenter | Registration + audit |

Every phase touching `.opencode/` honors rule 0008 (Draft → Review → Apply → Verify) and includes a **restart opencode** checkpoint (no hot reload). Draft staging can use the existing `.opencode/.draft/` dirs.

### Phase 0 — Reversibility + runtime verification

| Step | Action | Detail |
|---|---|---|
| 0.1 | Git snapshot | `.opencode/` is untracked (`??` on master @ c31ffb9). Stage selectively: `agents/`, `protocols/`, `workflows/`, `scripts/`, `tests/` (minus `__pycache__`). Discovered: `.opencode/` contains a nested `.git/` repo (inner history 4eb2b70) and `node_modules/` — never stage either; add `.gitignore` entries `.opencode/node_modules/`, `.opencode/.draft/`. Root `.gitignore` ignores only root `/node_modules`. |
| 0.2 | Probe nested loading | Create scratch `.opencode/agents/subagents/_probe/probe.md` (minimal frontmatter: description, mode: subagent) → restart opencode → check probe appears/is callable → record A or B → delete scratch → restart → confirm 12 agents load. |
| 0.3 | Gate | Probe loads → Branch A. Probe absent/fails → Branch B. Record outcome in the implementation session log. |

### Phase 1 — Agent-system restructure (branch-gated)

| Aspect | Branch A (nested loads) | Branch B (flat fallback) |
|---|---|---|
| Agent definition | `.opencode/agents/subagents/<id>/<id>.md` | `.opencode/agents/subagents/<id>.md` (unchanged) |
| Schema | moves with agent: `<id>/<id>.schema.json` (keeps `output_schema: ./<id>.schema.json` valid) | unchanged |
| Agent protocols | `.opencode/agents/subagents/<id>/protocols/*.md` | `.opencode/protocols/<id>/*.md` |
| Precedent | skills `**/SKILL.md`, commands `**/*.md` recursive scans | documented flat-agent loading |

Constraints (both branches):

- Preserve the **single language-parameterized coder** (`language=angular|go`); never split into two agents.
- Shared protocols stay in `.opencode/protocols/`; update its `README.md` index (via review loop — documenter does not write `.opencode/`).
- Pilot with 2 agents first (coder, documenter — the human's examples), then the remaining 10.
- Update every reference: agent-prompt relative links, `agents.json → relatedFiles`, docs citing moved paths (grep old paths → 0 hits).
- Restart checkpoint after each batch; verify load before continuing.

### Phase 2 — refined-source curation

| File | Change |
|---|---|
| `agents.json` | Update `relatedFiles` to post-move paths (must-resolve invariant; sibling-project refs stay display-only). No schema additions — passives/weapons/protocols are derived. |
| `graph.json` | Add display-only `race` + `flavor` to each of 7 `groups[]`; bump `meta.version` 1.0.2 → 1.1.0 (additive display field) + `meta.generated`. Nodes/edges unchanged (12/22). |
| `rules.json` | No change (kind taxonomy already complete). |
| Validation | `jq empty` x3; `jq length agents.json` = 12; nodes = 12, edges = 22; every in-repo `relatedFiles` path resolves (`ls` check). |

### Phase 3 — Page/UI (Angular 22, Material only, no new libs)

Agent card (`src/app/agent-cards/`) sections, all derived at render time:

| Section | Source |
|---|---|
| Race badge + flavor | `graph.json groups[]` race/flavor via `agent.group` (group color already exists) |
| Passives | rules.json global + group + agentSpecific, filter `kind=passive` (3 tiers: world/race/personal) |
| Skills (secondary) | same sources, filter `kind=active` |
| Weapons + summons | `agents.json permission` explicit entries; `task` list as summons chips |
| Protocol scrolls | `agents.json relatedFiles` filtered to `.opencode/protocols/` + per-agent protocol paths |

Mirror fate — **supersede**: extend `src/app/diagram-agent/diagram-agent-viewer.ts` (route `/diagram-agent/:id`, `app.routes.ts`) to render the same RPG card live from refined-source; drop its links to static `.md` (`docHref`/`groupIndexHref`). Mark `diagram-agent/README.md` `status: deprecated` with pointer; human deletes the folder later (never-delete convention). Staleness flagged now, fixed in Phase 3: mirror is v1.0.0 (14 nodes/27 edges; lists vision-relay, coder-angular, coder-go).

### Doc sync (documenter, per phase)

- Save this plan: create `docs/plans/` + `README.md` index; register in `docs/_TAG-INDEX.md` and `docs/project.md` Context Index (no new Slices row — docs slice covers it). Flag for human sign-off: doc-conventions registration list only names context/ and protocols/ READMEs → plans/README.md is a third bucket.
- After Phase 1: `docs/context/architecture.md` (paths), `docs/context/agent-catalog.md` (key files).
- After Phase 2: `docs/context/refined-source-data.md` (race/flavor fields, version 1.1.0).
- Post-change audit (routing sync, freshness, links) after each doc edit.

## Risks & Edge Cases

| Risk | Mitigation |
|---|---|
| 12 actual vs 13 spec agents | Target the 12 actual; keep spec narrative notes untouched |
| Nested agent loading unverified | Phase 0 probe gates A/B; both branches pre-specified |
| `relatedFiles` breakage after moves | Path-resolvability check in Phase 2 DoD; grep for old paths in Phase 1 |
| RPG display drift from rules | Passives/weapons derived only — nothing stored twice except race/flavor |
| Splitting the coder | Single-coder design is a Phase 1 constraint; race = Artificer with two toolkits, not two agents |
| Nested `.git` + node_modules in `.opencode/` | Selective staging (Phase 0.1); gitlink avoided |
| Config loaded once, no hot reload | Restart checkpoint in every `.opencode/` phase |
| `.opencode/` mutations | Review loop (0008) mandatory — Draft → Review → Apply → Verify |

## Definition of Done

| Phase | Observable DoD |
|---|---|
| 0 | Snapshot commit on master contains the 5 staged `.opencode/` subdirs (`git show --stat`); probe outcome recorded; scratch agent removed and 12 agents confirmed after restart |
| 1 | All 12 agents load after restart; `bash .opencode/tests/run-tests.sh` passes; grep for old paths = 0 hits; reviewer approval recorded |
| 2 | `jq empty` x3 pass; counts 12/12/22; 7 groups carry race+flavor; every in-repo relatedFiles path resolves; version 1.1.0 |
| 3 | `ng build` + `ng test` green; Agentes tab shows race/passives/weapons/protocols for all 12; `/diagram-agent/:id` renders RPG card without static-.md links; mirror README deprecated |

## References

- Data: `refined-source/agents.json`, `refined-source/rules.json`, `refined-source/graph.json` (v1.0.2)
- Context: `docs/context/agent-catalog.md`, `docs/context/rules-hierarchy.md`, `docs/context/refined-source-data.md`, `docs/context/architecture.md`, `docs/context/doc-conventions.md`
- Runtime: `.opencode/agents/subagents/coder.md`, `.opencode/agents/subagents/documenter.md`, `.opencode/protocols/README.md`
- UI: `src/app/app.routes.ts`, `src/app/diagram-agent/diagram-agent-viewer.ts`, `diagram-agent/README.md` (stale mirror)
