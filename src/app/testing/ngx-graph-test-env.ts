/**
 * Shared unit-test environment shims for specs that render @swimlane/ngx-graph.
 *
 * jsdom (the Vitest DOM) lacks a few browser globals the graph library relies on:
 * - `requestAnimationFrame` / `cancelAnimationFrame`: the force simulation ticks
 *   via d3-timer (which falls back to setTimeout), but the graph component calls
 *   rAF directly for post-tick work.
 * - `CSS.escape`: used by the graph component to build element-id selectors when
 *   repainting edge text paths.
 *
 * The shims are idempotent so importing this module from multiple spec files is safe.
 */

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number =>
    window.setTimeout(() => callback(performance.now()), 0);
}
if (typeof globalThis.cancelAnimationFrame !== 'function') {
  globalThis.cancelAnimationFrame = (handle: number): void => window.clearTimeout(handle);
}

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as { CSS?: object }).CSS = {};
}
if (!(globalThis.CSS as { escape?: (value: string) => string }).escape) {
  // Standard css.escape algorithm (ES2019), matching the WHATWG CSSOM spec.
  (globalThis.CSS as { escape?: (value: string) => string }).escape = (value: string): string => {
    const string = String(value);
    const length = string.length;
    let index = -1;
    let codeUnit;
    let result = '';
    const firstCodeUnit = string.charCodeAt(0);

    while (++index < length) {
      codeUnit = string.charCodeAt(index);

      // Null character: replace with the replacement character.
      if (codeUnit === 0x0000) {
        result += '\uFFFD';
        continue;
      }

      // Control characters and the first character of the string, if it is a digit.
      if (
        (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
        (codeUnit >= 0x007f && codeUnit <= 0x009f) ||
        (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039)
      ) {
        result += `\\${codeUnit.toString(16)} `;
        continue;
      }

      // If the character is the first character and is a `-` sign and there is
      // exactly one character, escape it.
      if (index === 0 && length === 1 && codeUnit === 0x002d) {
        result += `\\${string.charAt(index)}`;
        continue;
      }

      // If the character is not handled by one of the above rules and is:
      // - a high surrogate that is not followed by a low surrogate
      // - a non-character
      // - a control character
      // - a digit
      // - a letter
      // - a `-`, `_` or whitespace
      // then output the character itself.
      if (
        codeUnit >= 0x0080 ||
        codeUnit === 0x002d ||
        codeUnit === 0x005f ||
        (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
        (codeUnit >= 0x0061 && codeUnit <= 0x007a)
      ) {
        result += string.charAt(index);
        continue;
      }

      // Otherwise, escaped character.
      result += `\\${string.charAt(index)}`;
    }
    return result;
  };
}

/**
 * Dagre CJS/ESM interop fix for Vitest (Vite/CJS).
 *
 * @swimlane/ngx-graph imports dagre via `import * as dagre from 'dagre'` and
 * expects `dagre.layout` at the top level. In Vite's jsdom test transform the
 * CJS `dagre` package is exposed as `{ default: { layout, graphlib } }`, so
 * `dagre.layout` is undefined and DagreLayout.run throws. The node_modules
 * patch handles the bundled mjs, but this runtime prototype patch is the
 * durable fix that survives fresh installs.
 *
 * Implementation is synchronous and side-effect free so it runs before any
 * spec instantiates the graph component.
 */
// @ts-ignore - dagre CJS without types
import * as dagreImport from 'dagre';
import { DagreLayout, DagreClusterLayout, DagreNodesOnlyLayout } from '@swimlane/ngx-graph';

try {
  const dagreResolved = ((dagreImport as unknown as { default?: unknown }).default as never) ?? (dagreImport as never);
  const needsPatch =
    dagreResolved &&
    typeof (dagreResolved as { layout?: unknown }).layout === 'function' &&
    typeof (dagreImport as { layout?: unknown }).layout === 'undefined';
  if (needsPatch) {
    const dagreAny = dagreResolved as {
      layout(g: unknown): void;
      graphlib: { Graph: new (opts: { compound: boolean; multigraph: boolean }) => unknown };
    };
    const patch = (Cls: { prototype: { run(graph: unknown): unknown; createDagreGraph(graph: unknown): void } }) => {
      if (!Cls?.prototype?.createDagreGraph || !Cls?.prototype?.run) return;
      Cls.prototype.createDagreGraph = function (graph: unknown) {
        const g = graph as {
          nodes: Array<{
            id: string;
            dimension?: { width?: number; height?: number };
            position?: { x?: number; y?: number };
          }>;
          edges: Array<{ source: string; target: string; id?: string }>;
        };
        const settings = Object.assign(
          {},
          (this as unknown as { defaultSettings: Record<string, unknown> }).defaultSettings,
          (this as unknown as { settings: Record<string, unknown> }).settings,
        );
        (this as unknown as { dagreGraph: unknown }).dagreGraph = new dagreAny.graphlib.Graph({
          compound: settings['compound'] as boolean,
          multigraph: settings['multigraph'] as boolean,
        });
        const dg = (
          this as unknown as {
            dagreGraph: {
              setGraph(o: unknown): void;
              setDefaultEdgeLabel(fn: () => unknown): void;
              setNode(id: string, v: unknown): void;
              setEdge(s: string, t: string, v: unknown): void;
            };
          }
        ).dagreGraph;
        dg.setGraph({
          rankdir: settings['orientation'],
          marginx: settings['marginX'],
          marginy: settings['marginY'],
          edgesep: settings['edgePadding'],
          ranksep: settings['rankPadding'],
          nodesep: settings['nodePadding'],
          align: settings['align'],
          acyclicer: settings['acyclicer'],
          ranker: settings['ranker'],
          multigraph: settings['multigraph'],
          compound: settings['compound'],
        });
        dg.setDefaultEdgeLabel(() => ({}));
        const dagreNodes = g.nodes.map((n) => ({
          ...n,
          width: n.dimension?.width ?? 150,
          height: n.dimension?.height ?? 40,
          x: n.position?.x ?? 0,
          y: n.position?.y ?? 0,
        }));
        const dagreEdges = g.edges.map((l) => ({ ...l, id: l.id ?? Math.random().toString(36).slice(2) }));
        (this as unknown as { dagreNodes: unknown }).dagreNodes = dagreNodes;
        (this as unknown as { dagreEdges: unknown }).dagreEdges = dagreEdges;
        for (const node of dagreNodes) {
          dg.setNode(node.id, node);
        }
        for (const edge of dagreEdges) {
          dg.setEdge(edge.source, edge.target, edge);
        }
      };
      Cls.prototype.run = function (graph: unknown) {
        this.createDagreGraph(graph);
        dagreAny.layout((this as unknown as { dagreGraph: unknown }).dagreGraph);
        const dg = (
          this as unknown as {
            dagreGraph: {
              _edgeLabels: unknown;
              _nodes: Record<string, { id: string; x: number; y: number; width: number; height: number }>;
            };
          }
        ).dagreGraph;
        (graph as { edgeLabels: unknown }).edgeLabels = dg._edgeLabels;
        for (const id in dg._nodes) {
          const dn = dg._nodes[id];
          const node = (
            graph as { nodes: Array<{ id: string; position?: unknown; dimension?: unknown }> }
          ).nodes.find((n) => n.id === dn.id);
          if (node) {
            node.position = { x: dn.x, y: dn.y };
            node.dimension = { width: dn.width, height: dn.height };
          }
        }
        return graph;
      };
    };
    patch(DagreLayout);
    patch(DagreClusterLayout);
    patch(DagreNodesOnlyLayout);
  }
} catch {
  // Test env must never throw; dagre fix is best-effort. Production build resolves dagre correctly.
}
