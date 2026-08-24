import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AGENTS, GRAPH, RULES } from '../models/refined-source';

/**
 * Visual counterpart view for a diagram-agent node (graph.json → agents.json).
 *
 * Route: /diagram-agent/:id (see app.routes.ts). Reads the agent from
 * refined-source/agents.json + graph.json and renders a live RPG card:
 * race/flavor, passives/skills, weapons/summons, protocol scrolls plus
 * in/out edges. No static diagram-agent/*.md links — live derived view.
 * Lazy-loaded via loadComponent to keep the initial bundle lean.
 */
@Component({
  selector: 'app-diagram-agent-viewer',
  imports: [RouterLink],
  templateUrl: './diagram-agent-viewer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './diagram-agent-viewer.css',
})
export class DiagramAgentViewer {
  /** Route param: agent id (e.g. "interpreter"). Bound via withComponentInputBinding(). */
  readonly id = input<string>();

  /** The matched agent, or null when the id does not exist in agents.json. */
  readonly agent = computed(() => AGENTS.find((a) => a.id === this.id()) ?? null);

  /** The matched graph node, or null when the id does not exist in graph.json. */
  readonly node = computed(() => GRAPH.nodes.find((n) => n.id === this.id()) ?? null);

  /** The agent's group metadata (label/color/race/flavor) from graph.json. */
  readonly groupMeta = computed(() => {
    const agent = this.agent();
    if (agent) return GRAPH.groups.find((g) => g.id === agent.group) ?? null;
    const node = this.node();
    return node ? GRAPH.groups.find((g) => g.id === node.group) ?? null : null;
  });

  /** Legacy alias for template backward compat — use groupMeta instead. */
  readonly group = computed(() => this.groupMeta());

  /** Delegation edges leaving this node (canCall). */
  readonly outgoingEdges = computed(() => {
    const id = this.id();
    return id ? GRAPH.edges.filter((e) => e.from === id) : [];
  });

  /** Delegation edges entering this node (called by). */
  readonly incomingEdges = computed(() => {
    const id = this.id();
    return id ? GRAPH.edges.filter((e) => e.to === id) : [];
  });

  // RPG derived — same as agent-card
  readonly race = computed(() => this.groupMeta()?.race ?? null);
  readonly flavor = computed(() => this.groupMeta()?.flavor ?? null);

  readonly worldPassives = computed(() => RULES.global.filter((r) => r.kind === 'passive'));
  readonly racePassives = computed(() => {
    const agent = this.agent();
    if (!agent) return [];
    const fam = RULES.groups.find((g) => g.group === agent.group);
    return fam ? fam.rules.filter((r) => r.kind === 'passive') : [];
  });
  readonly personalPassives = computed(() => {
    const agent = this.agent();
    if (!agent) return [];
    const entry = RULES.agentSpecific.find((a) => a.agentId === agent.id);
    return entry ? entry.rules.filter((r) => r.kind === 'passive') : [];
  });

  readonly worldSkills = computed(() => RULES.global.filter((r) => r.kind === 'active'));
  readonly raceSkills = computed(() => {
    const agent = this.agent();
    if (!agent) return [];
    const fam = RULES.groups.find((g) => g.group === agent.group);
    return fam ? fam.rules.filter((r) => r.kind === 'active') : [];
  });
  readonly personalSkills = computed(() => {
    const agent = this.agent();
    if (!agent) return [];
    const entry = RULES.agentSpecific.find((a) => a.agentId === agent.id);
    return entry ? entry.rules.filter((r) => r.kind === 'active') : [];
  });

  readonly weapons = computed(() => {
    const agent = this.agent();
    if (!agent) return [] as Array<{ tool: string; status: 'allow' | 'deny' }>;
    return Object.entries(agent.permission)
      .filter(([key, val]) => key !== 'task' && (val === 'allow' || val === 'deny'))
      .map(([tool, status]) => ({ tool, status: status as 'allow' | 'deny' }));
  });

  readonly summons = computed(() => {
    const agent = this.agent();
    if (!agent || !Array.isArray(agent.permission.task)) return [] as Array<{ id: string; displayName: string }>;
    const nameById = new Map(AGENTS.map((a) => [a.id, a.displayName]));
    return agent.permission.task.map((id) => ({ id, displayName: nameById.get(id) ?? id }));
  });

  readonly protocolScrolls = computed(() => {
    const agent = this.agent();
    return agent ? agent.relatedFiles.filter((f) => f.includes('.opencode/protocols/')) : [];
  });

  /** agent id → display label (agents.json displayName fallback to graph.json label). */
  labelFor(id: string): string {
    const agent = AGENTS.find((a) => a.id === id);
    if (agent) return agent.displayName;
    return GRAPH.nodes.find((n) => n.id === id)?.label ?? id;
  }
}
