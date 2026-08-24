import { Injectable, computed, signal } from '@angular/core';
import { AGENTS } from '../models/refined-source';
import type { Agent } from '../models/refined-source';

/**
 * Shell-level selection service for the master-detail.
 * Holds the selected agent id as a signal and exposes the resolved agent.
 * Provided in root so both AgentCards (mini-grid) and App (right column)
 * share the same selection without prop-drilling.
 */
@Injectable({ providedIn: 'root' })
export class AgentSelection {
  /** Null = none selected. */
  readonly selectedId = signal<string | null>(null);

  readonly selectedAgent = computed<Agent | null>(() => {
    const id = this.selectedId();
    return id ? (AGENTS.find((a) => a.id === id) ?? null) : null;
  });

  select(id: string): void {
    this.selectedId.set(id);
  }

  clear(): void {
    this.selectedId.set(null);
  }
}
