import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  computed,
  input,
  signal,
} from '@angular/core';
import type { Agent } from '../models/refined-source';
import { AGENTS, GRAPH, RULES } from '../models/refined-source';

export interface CanCallItem {
  id: string;
  displayName: string;
  recursive: boolean;
}

export interface WeaponItem {
  tool: string;
  status: 'allow' | 'deny';
}

export interface SummonItem {
  id: string;
  displayName: string;
}

/**
 * Persistent detail panel for the Agentes master-detail interaction.
 * Rendered in the right-side aside of AgentCards when an agent is selected
 * via card click. Reuses the full detail content (canCall, specificBeyondGeneral,
 * relatedFiles, RPG passives/skills/weapons/summons/protocol scrolls) but as a
 * persistent panel — the hover-only contract (.hover-panel in AgentCard) stays
 * transient. Styling matches the card/viewer vocabulary (border-top accent,
 * sticky aside) while remaining a presentational component driven by [agent].
 */
@Component({
  selector: 'app-agent-detail-panel',
  templateUrl: './agent-detail-panel.html',
  styleUrl: './agent-detail-panel.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AgentDetailPanel implements OnDestroy {
  readonly agent = input.required<Agent>();
  readonly groupColor = input<string>('#64748b');

  readonly copiedPath = signal<string | null>(null);

  private readonly nameById: ReadonlyMap<string, string> = new Map(
    AGENTS.map((a) => [a.id, a.displayName]),
  );

  readonly groupMeta = computed(() => GRAPH.groups.find((g) => g.id === this.agent().group) ?? null);
  readonly race = computed(() => this.groupMeta()?.race ?? null);
  readonly flavor = computed(() => this.groupMeta()?.flavor ?? null);

  readonly worldPassives = computed(() => RULES.global.filter((r) => r.kind === 'passive'));
  readonly racePassives = computed(() => {
    const fam = RULES.groups.find((g) => g.group === this.agent().group);
    return fam ? fam.rules.filter((r) => r.kind === 'passive') : [];
  });
  readonly personalPassives = computed(() => {
    const entry = RULES.agentSpecific.find((a) => a.agentId === this.agent().id);
    return entry ? entry.rules.filter((r) => r.kind === 'passive') : [];
  });

  readonly worldSkills = computed(() => RULES.global.filter((r) => r.kind === 'active'));
  readonly raceSkills = computed(() => {
    const fam = RULES.groups.find((g) => g.group === this.agent().group);
    return fam ? fam.rules.filter((r) => r.kind === 'active') : [];
  });
  readonly personalSkills = computed(() => {
    const entry = RULES.agentSpecific.find((a) => a.agentId === this.agent().id);
    return entry ? entry.rules.filter((r) => r.kind === 'active') : [];
  });

  readonly weapons = computed<WeaponItem[]>(() => {
    const perm = this.agent().permission;
    return Object.entries(perm)
      .filter(([key, val]) => key !== 'task' && (val === 'allow' || val === 'deny'))
      .map(([tool, status]) => ({ tool, status: status as 'allow' | 'deny' }));
  });

  readonly summons = computed<SummonItem[]>(() => {
    const task = this.agent().permission.task;
    if (!Array.isArray(task)) return [];
    return task.map((id) => ({ id, displayName: this.nameById.get(id) ?? id }));
  });

  readonly protocolScrolls = computed(() =>
    this.agent().relatedFiles.filter((f) => f.includes('.opencode/protocols/')),
  );

  readonly canCallItems = computed<CanCallItem[]>(() => {
    const agent = this.agent();
    const seen = new Set<string>();
    const items: CanCallItem[] = [];
    for (const id of agent.canCall) {
      if (seen.has(id)) continue;
      seen.add(id);
      items.push({ id, displayName: this.nameById.get(id) ?? id, recursive: id === agent.id });
    }
    return items;
  });

  readonly isLeaf = computed(() => this.canCallItems().length === 0);

  private copyResetTimer: ReturnType<typeof setTimeout> | null = null;

  onChipClick(path: string, event: Event): void {
    event.stopPropagation();
    void this.copyToClipboard(path);
    this.copiedPath.set(path);
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer);
    this.copyResetTimer = setTimeout(() => this.copiedPath.set(null), 1600);
  }

  ngOnDestroy(): void {
    if (this.copyResetTimer) clearTimeout(this.copyResetTimer);
  }

  private async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
    } catch {
      // fall through
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
      // clipboard unavailable
    }
  }
}
