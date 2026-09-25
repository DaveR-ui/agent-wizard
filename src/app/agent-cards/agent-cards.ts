import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AGENTS, GROUP_COLORS, FALLBACK_GROUP_COLOR } from '../models/refined-source';
import { AgentMiniCard } from './agent-mini-card';
import { AgentSelection } from './agent-selection.service';

/**
 * Grid of 11 compact mini cards.
 * Selection is delegated to the shell-level AgentSelection service so the
 * detail panel can be rendered in app.html's .site-detail aside. No internal
 * aside/detail is rendered here — only the mini-grid.
 */
@Component({
  selector: 'app-agent-cards',
  imports: [AgentMiniCard],
  templateUrl: './agent-cards.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './agent-cards.css',
})
export class AgentCards {
  readonly agents = AGENTS;

  readonly groupColors: ReadonlyMap<string, string> = GROUP_COLORS as ReadonlyMap<string, string>;

  readonly selection = inject(AgentSelection);

  onCardSelected(id: string): void {
    this.selection.select(id);
  }

  groupColor(group: string): string {
    return this.groupColors.get(group) ?? FALLBACK_GROUP_COLOR;
  }
}
