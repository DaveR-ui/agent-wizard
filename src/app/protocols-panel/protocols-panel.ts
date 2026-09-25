import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { PROTOCOLS } from '../models/refined-source';

/**
 * Protocols panel (refined-source/protocols.json): the 6 prose protocols of the
 * installed agent system. The `dispatch` turn-entry protocol is highlighted
 * ("Entrada del turno · delivery"); the remaining protocols render as cards. A
 * "Protocolo vs Skill" block spells out the flexible-vs-strict distinction that
 * explains why this system ships no skills.
 *
 * A category pill selector narrows the card list (pure client-side, signal
 * state) while keeping the highlighted dispatch entry visible in `all` and
 * `turn-entry`.
 */
@Component({
  selector: 'app-protocols-panel',
  templateUrl: './protocols-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './protocols-panel.css',
})
export class ProtocolsPanel {
  readonly protocols = PROTOCOLS.protocols;
  readonly comparison = PROTOCOLS.protocolVsSkill;
  readonly count = PROTOCOLS.meta.count;

  /** Category filter; `all` shows every protocol. */
  readonly category = signal<string>('all');

  /** Distinct categories derived from the curated data, in declaration order. */
  readonly categories = computed(() => [...new Set(this.protocols.map((p) => p.category))]);

  /** The highlighted entry (dispatch), falling back to the first protocol. */
  readonly highlighted = computed(
    () => this.protocols.find((p) => p.highlight) ?? this.protocols[0],
  );

  /** True when the highlighted entry passes the active category filter. */
  readonly showHighlighted = computed(() => {
    const active = this.category();
    return active === 'all' || active === this.highlighted()?.category;
  });

  /** The non-highlighted protocols passing the active category filter. */
  readonly visibleOthers = computed(() => {
    const active = this.category();
    return this.protocols.filter(
      (p) => !p.highlight && (active === 'all' || p.category === active),
    );
  });
}
