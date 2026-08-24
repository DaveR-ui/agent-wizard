/**
 * Typed models for the refined-source data layer.
 *
 * The JSON files are imported at build time as TS modules (see tsconfig.json →
 * compilerOptions.resolveJsonModule). Schema reference: docs/context/refined-source-data.md.
 */
import agentsJson from '../../../refined-source/agents.json';
import rulesJson from '../../../refined-source/rules.json';
import graphJson from '../../../refined-source/graph.json';

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

/** Tool allow/deny map plus the `task` allow-list, as declared in agent frontmatter. */
export interface AgentPermission {
  [tool: string]: string | string[] | undefined;
  edit?: 'allow' | 'deny';
  bash?: 'allow' | 'deny';
  webfetch?: 'allow' | 'deny';
  task?: string[];
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

/**
 * The 12 agent cards (v1.1.0: 12 actual agents, 22 edges, 7 groups with race+flavor).
 *
 * The JSON imports are asserted onto the interfaces: resolveJsonModule widens
 * string-like values (group, severity, mode) to `string`, while the curated,
 * jq-validated data is known to match the schema (docs/context/refined-source-data.md).
 */
export const AGENTS = agentsJson as Agent[];

/** The 3-level rule tree (2 global / 6 families / 6 agent-specific, kind-tagged). */
export const RULES = rulesJson as RulesData;

/** The delegation graph (12 nodes, 22 edges, 7 groups, v1.1.0). */
export const GRAPH = graphJson as GraphData;

/** Group id → color lookup derived from graph.json groups. */
export const GROUP_COLORS: ReadonlyMap<GroupId, string> = new Map(
  GRAPH.groups.map((group) => [group.id, group.color]),
);

/** Neutral fallback color for unknown/missing groups. */
export const FALLBACK_GROUP_COLOR = '#64748b';