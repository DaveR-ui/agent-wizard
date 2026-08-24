import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Agent } from '../models/refined-source';
import { GRAPH } from '../models/refined-source';

/**
 * Compact mini card variant for the Agentes master-detail.
 * Shows only header (group badge, race badge, name), role, essence truncated
 * and View doc link. No RPG blocks, no hover-panel. Whole-card click /
 * keyboard selects the agent via cardSelected output. Highlighted when
 * selected; accessible as role=button with aria-selected.
 */
@Component({
  selector: 'app-agent-mini-card',
  imports: [RouterLink],
  templateUrl: './agent-mini-card.html',
  styleUrl: './agent-mini-card.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AgentMiniCard {
  readonly agent = input.required<Agent>();
  readonly groupColor = input<string>('#64748b');
  readonly selected = input<boolean>(false);

  /** Emits agent id when the card surface is activated. */
  readonly cardSelected = output<string>();

  readonly groupMeta = computed(() => GRAPH.groups.find((g) => g.id === this.agent().group) ?? null);
  readonly race = computed(() => this.groupMeta()?.race ?? null);
  readonly flavor = computed(() => this.groupMeta()?.flavor ?? null);

  onCardClick(): void {
    this.cardSelected.emit(this.agent().id);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.cardSelected.emit(this.agent().id);
    }
  }
}
