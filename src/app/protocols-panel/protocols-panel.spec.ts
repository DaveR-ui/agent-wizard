import { TestBed } from '@angular/core/testing';
import { ProtocolsPanel } from './protocols-panel';
import { PROTOCOLS } from '../models/refined-source';

function pillButton(fixture: { nativeElement: HTMLElement }, label: string): HTMLButtonElement {
  const pills = Array.from(
    fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.category-pill'),
  );
  const pill = pills.find((el) => el.textContent?.trim().startsWith(label));
  if (!pill) {
    throw new Error(`No category pill for "${label}"`);
  }
  return pill;
}

describe('ProtocolsPanel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProtocolsPanel],
    }).compileComponents();
  });

  it('should render the intro and the 6 protocols (1 highlighted + 5 cards)', () => {
    const fixture = TestBed.createComponent(ProtocolsPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.protocols-intro')?.textContent).toContain('protocolo');
    expect(compiled.querySelector('.dispatch-highlight')).toBeTruthy();
    expect(compiled.querySelectorAll('.protocol-card').length).toBe(5);
    expect(PROTOCOLS.protocols.length).toBe(6);
  });

  it('should highlight dispatch as the turn-entry protocol of delivery', () => {
    const fixture = TestBed.createComponent(ProtocolsPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const highlight = compiled.querySelector('.dispatch-highlight') as HTMLElement;
    expect(highlight.querySelector('.dispatch-badge')?.textContent).toContain(
      'Entrada del turno · delivery',
    );
    expect(highlight.querySelector('.dispatch-title')?.textContent).toBe('Dispatch');
    expect(highlight.querySelectorAll('.dispatch-steps li').length).toBe(4);
    expect(highlight.querySelector('.protocol-file')?.textContent).toContain(
      'protocols/dispatch.md',
    );
  });

  it('should render a card for every non-highlighted protocol with owner, summary and file chip', () => {
    const fixture = TestBed.createComponent(ProtocolsPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const titles = Array.from(compiled.querySelectorAll('.protocol-title')).map((el) =>
      el.textContent?.trim(),
    );
    expect(titles).toEqual([
      'Prompt Pipeline',
      'Orchestrate',
      'Subagent Spec Template',
      'Session Recovery',
      'Broad Investigation Template',
    ]);
    expect(compiled.querySelectorAll('.protocol-owner').length).toBe(5);
    expect(compiled.querySelectorAll('.protocol-summary').length).toBe(5);
    // File chips use agent-system-relative protocols/ paths — never .opencode/.
    const files = Array.from(compiled.querySelectorAll('.protocol-file')).map(
      (el) => el.textContent ?? '',
    );
    expect(files.every((f) => f.startsWith('protocols/'))).toBe(true);
    expect(files.some((f) => f.includes('.opencode'))).toBe(false);
  });

  it('should render the protocol-vs-skill comparison block', () => {
    const fixture = TestBed.createComponent(ProtocolsPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.vs-title')?.textContent).toBe('Protocolo vs Skill');
    expect(compiled.querySelector('.vs-protocol .vs-tag')?.textContent).toBe(
      'Protocolo = Flexible',
    );
    expect(compiled.querySelector('.vs-skill .vs-tag')?.textContent).toBe('Skill = Estricto');
    const why = compiled.querySelector('.vs-why')?.textContent ?? '';
    expect(why).toContain('no skills by design');
  });

  it('should filter the card list by category while keeping dispatch visible in "all"', () => {
    const fixture = TestBed.createComponent(ProtocolsPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Pills: Todos + the 5 distinct categories.
    const pills = Array.from(compiled.querySelectorAll('.category-pill')).map((el) =>
      el.textContent?.trim(),
    );
    expect(pills[0]).toBe('Todos (6)');
    expect(pills.length).toBe(6);

    pillButton(fixture, 'template').click();
    fixture.detectChanges();
    expect(compiled.querySelector('.dispatch-highlight')).toBeFalsy();
    expect(compiled.querySelectorAll('.protocol-card').length).toBe(2);

    pillButton(fixture, 'Todos').click();
    fixture.detectChanges();
    expect(compiled.querySelector('.dispatch-highlight')).toBeTruthy();
    expect(compiled.querySelectorAll('.protocol-card').length).toBe(5);
  });
});
