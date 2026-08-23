import { Component, computed, input, signal, OnDestroy } from '@angular/core';
import type { Agent } from '../models/refined-source';
import { AGENTS } from '../models/refined-source';

/** One entry of the deduped "Puede llamar a" list. */
export interface CanCallItem {
  id: string;
  displayName: string;
  /** True when the agent may delegate to itself (recursive fan-out, e.g. explorer → explorer). */
  recursive: boolean;
}

/**
 * Single agent card. The card body renders the always-visible summary; the
 * hover panel (signal-driven via mouseenter/mouseleave) reveals the hover
 * contract: canCall, specificBeyondGeneral and clickable related-file chips.
 */
@Component({
  selector: 'app-agent-card',
  templateUrl: './agent-card.html',
  styleUrl: './agent-card.css',
})
export class AgentCard implements OnDestroy {
  readonly agent = input.required<Agent>();
  readonly groupColor = input<string>('#64748b');

  /** Hover state is signal-driven so tests can assert the contract. */
  readonly hovered = signal(false);

  /** Path currently shown with "Copiado" feedback (null = none). */
  readonly copiedPath = signal<string | null>(null);

  /** agent id → displayName lookup. */
  private readonly nameById: ReadonlyMap<string, string> = new Map(
    AGENTS.map((agent) => [agent.id, agent.displayName]),
  );

  /**
   * Deduped canCall list. A self-reference (id === own id) is rendered once
   * with a "recursivo" hint instead of twice (delivery's list contains
   * interpreter etc. exactly once already; explorer/reviewer self-loops are the
   * graph's recursive-fanout edges).
   */
  readonly canCallItems = computed<CanCallItem[]>(() => {
    const agent = this.agent();
    const seen = new Set<string>();
    const items: CanCallItem[] = [];
    for (const id of agent.canCall) {
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      items.push({
        id,
        displayName: this.nameById.get(id) ?? id,
        recursive: id === agent.id,
      });
    }
    return items;
  });

  /** Empty canCall = leaf agent that never delegates. */
  readonly isLeaf = computed(() => this.canCallItems().length === 0);

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  onMouseEnter(): void {
    this.hovered.set(true);
  }

  onMouseLeave(): void {
    this.hovered.set(false);
  }

  onChipClick(path: string): void {
    void this.copyToClipboard(path);
    this.copiedPath.set(path);
    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }
    this.copyResetTimer = setTimeout(() => this.copiedPath.set(null), 1600);
  }

  ngOnDestroy(): void {
    if (this.copyResetTimer) {
      clearTimeout(this.copyResetTimer);
    }
  }

  /**
   * Copies a path to the clipboard. Prefers the async Clipboard API; falls back
   * to a temporary textarea + execCommand for non-secure contexts (and jsdom,
   * where the Clipboard API is absent). Never throws: the "Copiado" feedback is
   * signal-driven and shows regardless of clipboard availability.
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // Fall through to the legacy path.
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch {
      // Clipboard unavailable; the UI feedback still indicates the click.
    }
  }
}