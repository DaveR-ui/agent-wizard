import { Routes } from '@angular/router';

/**
 * Page routes. The only routed page is the diagram-agent counterpart viewer
 * (graph/agent UI → node :id).
 *
 * Static hosting note: the default PathLocationStrategy is used, so deep links
 * like /diagram-agent/interpreter require the host's SPA fallback to rewrite to
 * index.html. The counterpart markdown itself is served as static files from
 * /diagram-agent/*.md (plain anchors, not Angular routes) — see the
 * diagram-agent/ folder.
 */
export const routes: Routes = [
  {
    path: 'diagram-agent/:id',
    loadComponent: () =>
      import('./diagram-agent/diagram-agent-viewer').then((m) => m.DiagramAgentViewer),
  },
];