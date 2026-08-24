import { Routes } from '@angular/router';

/**
 * Page routes. The only routed page is the diagram-agent counterpart viewer
 * (graph/agent UI → node :id) rendering the live RPG card from
 * refined-source/*.json (v1.1.0, race/flavor, passives, weapons, scrolls).
 *
 * Static hosting note: the default PathLocationStrategy is used, so deep links
 * like /diagram-agent/interpreter require the host's SPA fallback to rewrite to
 * index.html. The static diagram-agent/ mirror is deprecated since Phase 3
 * (see diagram-agent/README.md status: deprecated) — the live viewer no longer
 * links to static .md files.
 */
export const routes: Routes = [
  {
    path: 'diagram-agent/:id',
    loadComponent: () =>
      import('./diagram-agent/diagram-agent-viewer').then((m) => m.DiagramAgentViewer),
  },
];