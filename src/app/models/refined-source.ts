/**
 * Typed models for the refined-source data layer.
 *
 * The JSON files are imported at build time as TS modules (see tsconfig.json →
 * compilerOptions.resolveJsonModule). Schema reference: docs/context/refined-source-data.md.
 */
import agentsJson from '../../../refined-source/agents.json';
import rulesJson from '../../../refined-source/rules.json';
import graphJson from '../../../refined-source/graph.json';
import protocolsJson from '../../../refined-source/protocols.json';

/** The seven curated agent groups. */
export type GroupId =
  | 'coordination'
  | 'analysis'
  | 'guardians'
  | 'coders'
  | 'exploration'
  | 'quality'
  | 'writers';

export type Severity = 'hard' | 'medium';

/**
 * Tool allow/deny map plus the `task` allow-list, as declared in agent
 * frontmatter. A tool value may be a scalar (`allow`/`deny`), an allow-list
 * (`task: [ids]`), or a nested resource→effect map (e.g. `documenter`'s
 * `edit: { "*": deny, "docs/**": allow }`).
 */
export interface AgentPermission {
  [tool: string]: string | string[] | Record<string, string> | undefined;
  edit?: 'allow' | 'deny' | Record<string, string>;
  bash?: 'allow' | 'deny';
  webfetch?: 'allow' | 'deny';
  task?: string[] | 'allow' | 'deny';
}

/** One entry of refined-source/agents.json. */
export interface Agent {
  id: string;
  displayName: string;
  role: string;
  group: GroupId;
  essence: string;
  model: string | null;
  temperature: number | null;
  mode: 'primary' | 'subagent';
  permission: AgentPermission;
  canCall: string[];
  specificBeyondGeneral: string;
  relatedFiles: string[];
}

/** A rule card. `severity` only exists on global rules. `kind` is passive (invariant) or active (behavioral). */
export interface Rule {
  id: string;
  rule: string;
  description: string;
  source: string;
  severity?: Severity;
  kind?: 'passive' | 'active';
}

/** One family of group rules (refined-source/rules.json → groups). */
export interface GroupRuleFamily {
  group: GroupId;
  members: string[];
  rules: Rule[];
}

/** Agent-specific rules for one agent (refined-source/rules.json → agentSpecific). */
export interface AgentSpecificRule {
  agentId: string;
  rules: Rule[];
}

/** Top-level shape of refined-source/rules.json. */
export interface RulesData {
  global: Rule[];
  groups: GroupRuleFamily[];
  agentSpecific: AgentSpecificRule[];
}

export interface GraphMeta {
  generated: string;
  source: string;
  version: string;
  description: string;
  layoutHint: string;
}

export interface GraphGroup {
  id: GroupId;
  label: string;
  color: string;
  order: number;
  /** Display race for the RPG layer (e.g. Herald, Artificer). */
  race?: string;
  /** Flavor text for the race badge tooltip/subtitle. */
  flavor?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  group: GroupId;
  level: number;
  isPrimary: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: string;
  label?: string;
}

/** Top-level shape of refined-source/graph.json. */
export interface GraphData {
  meta: GraphMeta;
  groups: GraphGroup[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** One protocol entry (refined-source/protocols.json → protocols). */
export interface Protocol {
  id: string;
  file: string;
  title: string;
  category: string;
  owner: string;
  highlight: boolean;
  summary: string;
  /** Ordered turn-entry / stage labels; only present on procedure-style protocols. */
  steps?: string[];
}

/** One side of the flexible-vs-strict comparison. */
export interface ProtocolVsSkillEntry {
  nature: string;
  mechanism: string;
}

/** Flexible protocol vs strict skill — the installed system's rationale. */
export interface ProtocolVsSkill {
  protocol: ProtocolVsSkillEntry;
  skill: ProtocolVsSkillEntry;
  why: string;
}

/** Top-level shape of refined-source/protocols.json. */
export interface ProtocolsData {
  meta: {
    source: string;
    version: string;
    generated: string;
    count: number;
    description: string;
  };
  protocols: Protocol[];
  protocolVsSkill: ProtocolVsSkill;
}

/**
 * The 11 agent cards (v1.2.0: 11 actual agents, 20 edges, 7 groups with race+flavor).
 *
 * The JSON imports are asserted onto the interfaces: resolveJsonModule widens
 * string-like values (group, severity, mode) to `string`, while the curated,
 * jq-validated data is known to match the schema (docs/context/refined-source-data.md).
 */
export const AGENTS = agentsJson as Agent[];

/** The 3-level rule tree (2 global / 6 families / 6 agent-specific, kind-tagged). */
export const RULES = rulesJson as RulesData;

/** The delegation graph (11 nodes, 20 edges, 7 groups, v1.2.0). */
export const GRAPH = graphJson as GraphData;

/** The 6 protocols of the installed agent system + the protocol-vs-skill rationale. */
export const PROTOCOLS = protocolsJson as ProtocolsData;

/** Group id → color lookup derived from graph.json groups. */
export const GROUP_COLORS: ReadonlyMap<GroupId, string> = new Map(
  GRAPH.groups.map((group) => [group.id, group.color]),
);

/** Neutral fallback color for unknown/missing groups. */
export const FALLBACK_GROUP_COLOR = '#64748b';