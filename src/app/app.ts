import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { filter, map, startWith } from 'rxjs';
import { AgentCards } from './agent-cards/agent-cards';
import { RulesPanel } from './rules-panel/rules-panel';
import { ConstructorPanel } from './constructor-panel/constructor-panel';
import { PipelinePanel } from './pipeline-panel/pipeline-panel';
import { AgentDetailPanel } from './agent-cards/agent-detail-panel';
import { AgentSelection } from './agent-cards/agent-selection.service';
import { GROUP_COLORS, FALLBACK_GROUP_COLOR } from './models/refined-source';

/**
 * App shell: header + four Angular Material tabs (Agentes / Reglas /
 * Constructor / Pipeline) with the routed detail viewer (diagram-agent/:id)
 * and the inline agent detail (from AgentSelection) both rendered in the
 * shell-level .site-detail aside. The aside is visible when either a routed
 * detail is active (hasDetail) or an inline selection exists (hasInlineDetail);
 * hasSidePanel drives the .has-side-panel class for combined visibility.
 * Inline detail reuses AgentDetailPanel without hiding the Pipeline graph.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, AgentCards, RulesPanel, ConstructorPanel, PipelinePanel, AgentDetailPanel],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  readonly selection = inject(AgentSelection);

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

  readonly selectedAgent = this.selection.selectedAgent;

  readonly hasInlineDetail = computed(() => this.selectedAgent() !== null);

  readonly hasSidePanel = computed(() => this.hasDetail() || this.hasInlineDetail());

  readonly showInlineDetail = computed(() => !this.hasDetail() && this.hasInlineDetail());

  readonly showPlaceholder = computed(() => !this.hasDetail() && !this.hasInlineDetail());

  private readonly groupColors: ReadonlyMap<string, string> = GROUP_COLORS as ReadonlyMap<string, string>;

  groupColor(group: string): string {
    return this.groupColors.get(group) ?? FALLBACK_GROUP_COLOR;
  }
}
