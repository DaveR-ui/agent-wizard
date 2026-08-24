import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RULES } from '../models/refined-source';
import type { AgentSpecificRule, Rule } from '../models/refined-source';

export type RuleLevel = 'global' | 'groups' | 'specific';

/**
 * 3-level filterable rules panel (refined-source/rules.json):
 * - Global: 7 rules with severity badges (hard/medium).
 * - Grupos: 6 group families, switchable via a family pill selector.
 * - Específicas: 6 agents with their own rule blocks.
 * A free-text filter applies across all levels (pure client-side, signal state).
 */
@Component({
  selector: 'app-rules-panel',
  templateUrl: './rules-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './rules-panel.css',
})
export class RulesPanel {
  readonly globalCount = RULES.global.length;
  readonly familyCount = RULES.groups.length;
  readonly specificCount = RULES.agentSpecific.length;

  readonly families = RULES.groups;

  readonly level = signal<RuleLevel>('global');
  readonly family = signal<string>(RULES.groups[0]?.group ?? 'coders');
  readonly filter = signal('');

  readonly selectedFamily = computed(() => {
    const id = this.family();
    return RULES.groups.find((g) => g.group === id) ?? RULES.groups[0];
  });

  readonly visibleGlobalRules = computed(() => {
    const query = normalizedQuery(this.filter());
    return query ? RULES.global.filter((rule) => matchesRule(rule, query)) : RULES.global;
  });

  readonly visibleFamilyRules = computed(() => {
    const query = normalizedQuery(this.filter());
    const rules = this.selectedFamily().rules;
    return query ? rules.filter((rule) => matchesRule(rule, query)) : rules;
  });

  readonly visibleSpecific = computed<AgentSpecificRule[]>(() => {
    const query = normalizedQuery(this.filter());
    if (!query) {
      return RULES.agentSpecific;
    }
    return RULES.agentSpecific
      .map((entry) => ({ ...entry, rules: entry.rules.filter((rule) => matchesRule(rule, query)) }))
      .filter((entry) => entry.rules.length > 0);
  });

  onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
  }
}

function normalizedQuery(value: string): string {
  return value.trim().toLowerCase();
}

function matchesRule(rule: Rule, query: string): boolean {
  return (
    rule.rule.toLowerCase().includes(query) ||
    rule.description.toLowerCase().includes(query) ||
    rule.id.toLowerCase().includes(query)
  );
}
