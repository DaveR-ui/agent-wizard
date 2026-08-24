import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { filter, map, startWith } from 'rxjs';
import { AgentCards } from './agent-cards/agent-cards';
import { RulesPanel } from './rules-panel/rules-panel';
import { ConstructorPanel } from './constructor-panel/constructor-panel';
import { PipelinePanel } from './pipeline-panel/pipeline-panel';

/**
 * App shell: header + four Angular Material tabs (Agentes / Reglas /
 * Constructor / Pipeline) with the routed detail viewer (diagram-agent/:id)
 * rendered as a side panel on desktop and stacked below the tabs on mobile.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, AgentCards, RulesPanel, ConstructorPanel, PipelinePanel],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);

  /**
   * True when a routed detail page (/diagram-agent/:id) is active. Drives the
   * .has-detail class on the aside so the empty side panel never reserves
   * horizontal space next to the tabs. CSS :empty is not reliable here — the
   * router-outlet can contain Angular's internal container anchors.
   */
  readonly hasDetail = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/diagram-agent')),
      startWith(this.router.url.startsWith('/diagram-agent')),
    ),
    { initialValue: this.router.url.startsWith('/diagram-agent') },
  );
}