import {
  Component,
  computed,
  inject,
  input,
  signal,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { Agent } from '../models/refined-source';
import { AGENTS, GRAPH, RULES } from '../models/refined-source';

/** One entry of the deduped "Puede llamar a" list. */
export interface CanCallItem {
  id: string;
  displayName: string;
  /** True when the agent may delegate to itself (recursive fan-out, e.g. explorer → explorer). */
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
 * Single agent card. The card body renders the always-visible summary; the
 * hover panel (signal-driven via mouseenter/mouseleave) reveals the hover
 * contract: canCall, specificBeyondGeneral and clickable related-file chips.
 * The RPG sections (race+flavor, passives, skills, weapons/summons, protocol
 * scrolls) are derived at render time from refined-source and always visible.
 */
@Component({
  selector: 'app-agent-card',
  imports: [RouterLink],
  templateUrl: './agent-card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './agent-card.css',
})
export class AgentCard implements OnDestroy {
  readonly agent = input.required<Agent>();
  readonly groupColor = input<string>('#64748b');

  /** Hover state is signal-driven so tests can assert the contract. */
  readonly hovered = signal(false);

  /** Path currently shown with "Copiado" feedback (null = none). */
  readonly copiedPath = signal<string | null>(null);

  /** Router for the whole-card click → diagram-agent counterpart view. */
  private readonly router = inject(Router);

  /** agent id → displayName lookup. */
  private readonly nameById: ReadonlyMap<string, string> = new Map(
    AGENTS.map((agent) => [agent.id, agent.displayName]),
  );

  /** Group metadata (race + flavor + color) from graph.json. */
  readonly groupMeta = computed(() => GRAPH.groups.find((g) => g.id === this.agent().group) ?? null);

  readonly race = computed(() => this.groupMeta()?.race ?? null);
  readonly flavor = computed(() => this.groupMeta()?.flavor ?? null);

  // Passives — 3 tiers filtered kind=passive
  readonly worldPassives = computed(() => RULES.global.filter((r) => r.kind === 'passive'));
  readonly racePassives = computed(() => {
    const fam = RULES.groups.find((g) => g.group === this.agent().group);
    return fam ? fam.rules.filter((r) => r.kind === 'passive') : [];
  });
  readonly personalPassives = computed(() => {
    const entry = RULES.agentSpecific.find((a) => a.agentId === this.agent().id);
    return entry ? entry.rules.filter((r) => r.kind === 'passive') : [];
  });

  // Skills — same sources filtered kind=active
  readonly worldSkills = computed(() => RULES.global.filter((r) => r.kind === 'active'));
  readonly raceSkills = computed(() => {
    const fam = RULES.groups.find((g) => g.group === this.agent().group);
    return fam ? fam.rules.filter((r) => r.kind === 'active') : [];
  });
  readonly personalSkills = computed(() => {
    const entry = RULES.agentSpecific.find((a) => a.agentId === this.agent().id);
    return entry ? entry.rules.filter((r) => r.kind === 'active') : [];
  });

  /** Weapons = explicit permission entries excluding task. */
  readonly weapons = computed<WeaponItem[]>(() => {
    const perm = this.agent().permission;
    return Object.entries(perm)
      .filter(([key, val]) => key !== 'task' && (val === 'allow' || val === 'deny'))
      .map(([tool, status]) => ({ tool, status: status as 'allow' | 'deny' }));
  });

  /** Summons = permission.task allow-list rendered with displayNames. */
  readonly summons = computed<SummonItem[]>(() => {
    const task = this.agent().permission.task;
    if (!Array.isArray(task)) return [];
    return task.map((id) => ({ id, displayName: this.nameById.get(id) ?? id }));
  });

  /** Protocol scrolls = relatedFiles filtered to .opencode/protocols/ */
  readonly protocolScrolls = computed(() =>
    this.agent().relatedFiles.filter((f) => f.includes('.opencode/protocols/')),
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

  /**
   * Whole-card click (pointer enhancement): navigate to the diagram-agent
   * counterpart view for this agent. The explicit "View doc →" link in the
   * template is the accessible path — this handler never replaces it.
   */
  onCardClick(): void {
    void this.router.navigate(['/diagram-agent', this.agent().id]);
  }

  onChipClick(path: string, event: Event): void {
    // Chip clicks copy the path — do not bubble into the card navigation.
    event.stopPropagation();
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
