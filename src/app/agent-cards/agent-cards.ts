import { Component } from '@angular/core';
import { AGENTS, GROUP_COLORS, FALLBACK_GROUP_COLOR } from '../models/refined-source';
import { AgentCard } from './agent-card';

/**
 * Grid of agent cards. Consumes refined-source/agents.json (14 cards) and
 * group colors from refined-source/graph.json.
 */
@Component({
  selector: 'app-agent-cards',
  imports: [AgentCard],
  templateUrl: './agent-cards.html',
  styleUrl: './agent-cards.css',
})
export class AgentCards {
  /** All agents in curated order. */
  readonly agents = AGENTS;

  /** Group id → color. */
  readonly groupColors: ReadonlyMap<string, string> = GROUP_COLORS as ReadonlyMap<string, string>;

  groupColor(group: string): string {
    return this.groupColors.get(group) ?? FALLBACK_GROUP_COLOR;
  }
}