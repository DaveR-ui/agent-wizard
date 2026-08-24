import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AgentCards } from './agent-cards';
import { AgentSelection } from './agent-selection.service';
import { AGENTS, GRAPH } from '../models/refined-source';

function miniCardFor(fixture: { nativeElement: HTMLElement }, displayName: string): HTMLElement {
  const cards = Array.from(
    fixture.nativeElement.querySelectorAll('.mini-card') as NodeListOf<HTMLElement>,
  );
  const card = cards.find((el) => el.querySelector('.mini-name')?.textContent === displayName);
  if (!card) {
    throw new Error(`No mini card found for "${displayName}"`);
  }
  return card;
}

describe('AgentCards (mini-grid)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCards],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    // Clear shared selection between tests (service is root-provided)
    try {
      TestBed.inject(AgentSelection).clear();
    } catch {}
  });

  it('should render 12 mini cards in a grid', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.mini-card').length).toBe(12);
    expect(compiled.querySelectorAll('app-agent-mini-card').length).toBe(12);
    expect(AGENTS.length).toBe(12);
    // grid uses compact minmax
    const grid = compiled.querySelector('.agent-grid') as HTMLElement;
    expect(grid).toBeTruthy();
    // No internal aside/detail — detail lives in App shell
    expect(compiled.querySelector('.agent-detail-aside')).toBeFalsy();
    expect(compiled.querySelector('app-agent-detail-panel')).toBeFalsy();
    expect(compiled.querySelector('.detail-placeholder')).toBeFalsy();
  });

  it('should show the group badge with the group color from graph.json', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    const badge = delivery.querySelector('.group-badge');
    expect(badge?.textContent).toBe('coordination');
    expect((badge as HTMLElement).style.backgroundColor).toBe('rgb(79, 70, 229)');
  });

  it('should show race badge for every mini card (no RPG blocks, no hover-panel)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const cards = Array.from(
      fixture.nativeElement.querySelectorAll('.mini-card') as NodeListOf<HTMLElement>,
    );
    expect(cards.length).toBe(12);
    for (const card of cards) {
      const name = card.querySelector('.mini-name')?.textContent?.trim() ?? '';
      const agent = AGENTS.find((a) => a.displayName === name);
      expect(agent).toBeTruthy();
      const groupMeta = GRAPH.groups.find((g) => g.id === agent!.group);
      const raceBadge = card.querySelector('.race-badge');
      expect(raceBadge, `race badge for ${name}`).toBeTruthy();
      expect(raceBadge?.textContent).toBe(groupMeta?.race);
      // mini cards have no RPG blocks
      expect(card.querySelector('.passives-block')).toBeFalsy();
      expect(card.querySelector('.skills-block')).toBeFalsy();
      expect(card.querySelector('.weapons-block')).toBeFalsy();
      expect(card.querySelector('.protocols-block')).toBeFalsy();
      expect(card.querySelector('.hover-panel')).toBeFalsy();
    }
  });

  it('should render role and truncated essence plus View doc link', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    expect(delivery.querySelector('.mini-role')?.textContent).toBeTruthy();
    expect(delivery.querySelector('.mini-essence')?.textContent).toBeTruthy();
    const link = delivery.querySelector('.view-doc-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/diagram-agent/delivery');
  });

  it('should select an agent on mini card click and highlight with aria-selected via shared service', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    const selection = TestBed.inject(AgentSelection);
    expect(selection.selectedId()).toBeNull();

    delivery.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(selection.selectedId()).toBe('delivery');
    expect(selection.selectedAgent()?.displayName).toBe('Delivery');
    expect(delivery.classList.contains('is-selected')).toBe(true);
    expect(delivery.getAttribute('aria-selected')).toBe('true');
    expect(delivery.getAttribute('role')).toBe('button');
  });

  it('should switch selection on rapid clicks and keep single selection', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    const explorer = miniCardFor(fixture, 'Explorer');
    const selection = TestBed.inject(AgentSelection);

    delivery.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(selection.selectedId()).toBe('delivery');
    expect(delivery.classList.contains('is-selected')).toBe(true);

    explorer.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(selection.selectedId()).toBe('explorer');
    expect(explorer.classList.contains('is-selected')).toBe(true);
    expect(delivery.classList.contains('is-selected')).toBe(false);
  });

  it('should support keyboard activation (Enter/Space) for selection', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const selection = TestBed.inject(AgentSelection);
    const delivery = miniCardFor(fixture, 'Delivery');
    const explorer = miniCardFor(fixture, 'Explorer');

    delivery.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(selection.selectedId()).toBe('delivery');

    explorer.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();
    expect(selection.selectedId()).toBe('explorer');
  });

  it('should render a View doc link per card that does not select on link click (stopPropagation)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    const link = delivery.querySelector('.view-doc-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('aria-label')).toBe('Open diagram-agent counterpart doc for Delivery');

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true as never);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    const selection = TestBed.inject(AgentSelection);
    expect(selection.selectedId()).toBeNull();
    link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(selection.selectedId()).toBeNull();
  });

  it('should have no hover-panel even after mouseenter (compact variant)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = miniCardFor(fixture, 'Delivery');
    delivery.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(delivery.querySelector('.hover-panel')).toBeFalsy();
  });
});

// Shell-level detail integration is tested in app.spec (App detail side panel)
