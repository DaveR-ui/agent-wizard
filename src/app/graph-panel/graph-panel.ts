import { Component, signal } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { GRAPH, FALLBACK_GROUP_COLOR } from '../models/refined-source';
import type { GraphGroup } from '../models/refined-source';

/** Point used by the SVG helpers below. */
interface Point {
  x: number;
  y: number;
}

/** ngx-graph node model (its `Node` type accepts arbitrary `data`). */
interface NgxGraphNode {
  id: string;
  label: string;
  data: {
    group: string;
    groupColor: string;
    level: number;
    isPrimary: boolean;
  };
}

/** ngx-graph edge model (its `Edge` type accepts arbitrary `data`). */
interface NgxGraphLink {
  id: string;
  source: string;
  target: string;
  label: string;
  data: {
    kind: string;
    /** Self-loop (recursive fan-out, e.g. explorer → explorer). */
    recursive: boolean;
  };
}

/**
 * Force-directed delegation graph (@swimlane/ngx-graph). Consumes
 * refined-source/graph.json (14 nodes, 27 edges, 7 groups) and maps it to the
 * ngx-graph model: nodes carry their group color / level / isPrimary in `data`;
 * edges carry `label` (explicit label, falling back to the edge `kind`) and a
 * `recursive` flag so the two self-loops render as loop arcs.
 */
@Component({
  selector: 'app-graph-panel',
  imports: [NgxGraphModule],
  templateUrl: './graph-panel.html',
  styleUrl: './graph-panel.css',
})
export class GraphPanel {
  /**
   * Layout name. ngx-graph v13 registers the force-directed engine as
   * `d3ForceDirected` (pre-v10 it was `forceDirected`); matches
   * graph.json → meta.layoutHint ("Force-directed").
   */
  readonly layout = signal('d3ForceDirected');

  readonly view = signal<[number, number]>([900, 600]);

  readonly groups: GraphGroup[] = GRAPH.groups;

  readonly nodes: NgxGraphNode[] = GRAPH.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    data: {
      group: node.group,
      groupColor: groupColor(node.group),
      level: node.level,
      isPrimary: node.isPrimary,
    },
  }));

  readonly links: NgxGraphLink[] = GRAPH.edges.map((edge, index) => ({
    id: `edge-${index}-${edge.from}-${edge.to}`,
    source: edge.from,
    target: edge.to,
    label: edge.label ?? edge.kind,
    data: {
      kind: edge.kind,
      recursive: edge.from === edge.to,
    },
  }));

  /**
   * SVG path for a self-loop arc above the node, derived from the (identical)
   * source/target points. Returns an empty string until layout points exist so
   * nothing renders before the first tick.
   */
  loopPath(points: Point[] | undefined): string {
    const point = points?.[0];
    if (!point) {
      return '';
    }
    const x = point.x;
    const y = point.y;
    return `M ${x - 26} ${y - 14} C ${x - 30} ${y - 52}, ${x + 30} ${y - 52}, ${x + 26} ${y - 14}`;
  }

  /** Label anchor for a self-loop arc (sits above the arc peak). */
  loopLabel(points: Point[] | undefined): Point | null {
    const point = points?.[0];
    if (!point) {
      return null;
    }
    return { x: point.x, y: point.y - 58 };
  }
}

function groupColor(group: string): string {
  return GRAPH.groups.find((g) => g.id === group)?.color ?? FALLBACK_GROUP_COLOR;
}