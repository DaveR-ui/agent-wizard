import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AgentCards } from './agent-cards';
import { AGENTS } from '../models/refined-source';

function cardFor(fixture: { nativeElement: HTMLElement }, displayName: string): HTMLElement {
  const cards = Array.from(fixture.nativeElement.querySelectorAll<HTMLElement>('.agent-card'));
  const card = cards.find((el) => el.querySelector('.agent-name')?.textContent === displayName);
  if (!card) {
    throw new Error(`No card found for "${displayName}"`);
  }
  return card;
}

describe('AgentCards', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCards],
      // AgentCard navigates via Router (whole-card click) and renders RouterLink.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should render one card per agent (14)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.agent-card').length).toBe(14);
    expect(AGENTS.length).toBe(14);
  });

  it('should show the group badge with the group color from graph.json', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const delivery = cardFor(fixture, 'Delivery');
    const badge = delivery.querySelector('.group-badge');
    expect(badge?.textContent).toBe('coordination');
    // coordination → #4F46E5 in graph.json groups
    expect((badge as HTMLElement).style.backgroundColor).toBe('rgb(79, 70, 229)');
  });

  it('should reveal the hover panel with canCall and related-file chips on hover', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const delivery = cardFor(fixture, 'Delivery');

    // Hover contract is signal-driven: mouseenter opens the panel.
    delivery.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const panel = delivery.querySelector('.hover-panel');
    expect(panel).toBeTruthy();

    const canCallNames = Array.from(
      delivery.querySelectorAll('.can-call-list li'),
    ).map((li) => li.textContent?.trim());
    expect(canCallNames).toContain('Interpreter');
    expect(canCallNames.length).toBe(13); // delivery delegates to 13 agents, deduped

    const chips = delivery.querySelectorAll('.file-chip');
    expect(chips.length).toBe(6); // delivery relatedFiles
  });

  it('should render a neutral leaf note when canCall is empty', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const interpreter = cardFor(fixture, 'Interpreter');

    interpreter.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(interpreter.querySelector('.leaf-note')?.textContent).toBe('Hoja — no delega');
    expect(interpreter.querySelectorAll('.can-call-list li').length).toBe(0);
  });

  it('should dedupe the recursive fan-out self-loop with a hint (explorer)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const explorer = cardFor(fixture, 'Explorer');

    explorer.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const entries = explorer.querySelectorAll('.can-call-list li');
    expect(entries.length).toBe(1); // self-call deduped to a single entry
    expect(explorer.querySelector('.recursive-hint')?.textContent).toBe('recursivo');
  });

  it('should show "Copiado" feedback when a related-file chip is clicked', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const delivery = cardFor(fixture, 'Delivery');

    delivery.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const chip = delivery.querySelector('.file-chip') as HTMLButtonElement;
    expect(chip).toBeTruthy();
    chip.click();
    fixture.detectChanges();

    const feedback = delivery.querySelector('.copied-feedback');
    expect(feedback?.textContent).toBe('Copiado');
  });

  it('should render chips for minimal-surface agents (vision-relay, 1 file)', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const visionRelay = cardFor(fixture, 'Vision Relay');

    visionRelay.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const chips = visionRelay.querySelectorAll('.file-chip');
    expect(chips.length).toBe(1);
    expect(chips[0].textContent).toContain('vision-relay.md');
  });

  it('should navigate to the diagram-agent counterpart view when a card is clicked', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = cardFor(fixture, 'Delivery');
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');

    delivery.dispatchEvent(new MouseEvent('click'));

    expect(navigateSpy).toHaveBeenCalledWith(['/diagram-agent', 'delivery']);
  });

  it('should render a "View doc" link per card pointing to the diagram-agent counterpart', () => {
    const fixture = TestBed.createComponent(AgentCards);
    fixture.detectChanges();
    const delivery = cardFor(fixture, 'Delivery');
    const link = delivery.querySelector('.view-doc-link') as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/diagram-agent/delivery');
    expect(link.getAttribute('aria-label')).toBe(
      'Open diagram-agent counterpart doc for Delivery',
    );
  });
});