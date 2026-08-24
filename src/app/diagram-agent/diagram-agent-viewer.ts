import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GRAPH } from '../models/refined-source';

/**
 * Visual counterpart view for a diagram-agent node (graph.json → agents.json).
 *
 * Route: /diagram-agent/:id (see app.routes.ts). Reads the node from
 * refined-source/graph.json and renders a read-only card: identity, group,
 * in/out edges, and links to the counterpart markdown that lives in the static
 * diagram-agent/ folder (served as static files — this view never writes or
 * persists anything). Lazy-loaded via loadComponent to keep the initial bundle
 * lean.
 */
@Component({
  selector: 'app-diagram-agent-viewer',
  imports: [RouterLink],
  templateUrl: './diagram-agent-viewer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './diagram-agent-viewer.css',
})
export class DiagramAgentViewer {
  /** Route param: graph.json node id (e.g. "interpreter"). Bound via withComponentInputBinding(). */
  readonly id = input<string>();

  /** The matched graph node, or null when the id does not exist in graph.json. */
  readonly node = computed(() => GRAPH.nodes.find((n) => n.id === this.id()) ?? null);

  /** The node's group metadata (label/color) from graph.json. */
  readonly group = computed(() => {
    const node = this.node();
    return node ? GRAPH.groups.find((g) => g.id === node.group) ?? null : null;
  });

  /** Delegation edges leaving this node (canCall). */
  readonly outgoingEdges = computed(() => {
    const node = this.node();
    return node ? GRAPH.edges.filter((e) => e.from === node.id) : [];
  });

  /** Delegation edges entering this node (called by). */
  readonly incomingEdges = computed(() => {
    const node = this.node();
    return node ? GRAPH.edges.filter((e) => e.to === node.id) : [];
  });

  /** Root-relative href to the counterpart markdown in the static diagram-agent/ folder. */
  docHref(id: string): string {
    return `/diagram-agent/${id}.md`;
  }

  /** Root-relative href to the group index markdown (diagram-agent/<group>/README.md). */
  groupIndexHref(groupId: string): string {
    return `/diagram-agent/${groupId}/README.md`;
  }

  /** Node id → display label (graph.json node labels). */
  labelFor(id: string): string {
    return GRAPH.nodes.find((n) => n.id === id)?.label ?? id;
  }
}