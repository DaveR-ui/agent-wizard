import { TestBed } from '@angular/core/testing';
import { RulesPanel } from './rules-panel';

function tabButton(fixture: { nativeElement: HTMLElement }, label: string): HTMLButtonElement {
  const tabs = Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('.level-tab'));
  const tab = tabs.find((el) => el.textContent?.includes(label));
  if (!tab) {
    throw new Error(`No level tab for "${label}"`);
  }
  return tab;
}

describe('RulesPanel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulesPanel],
    }).compileComponents();
  });

  it('should render the three level tabs with the curated counts (2 / 6 / 6)', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = Array.from(compiled.querySelectorAll('.level-tab')).map((el) =>
      el.textContent?.trim(),
    );
    expect(tabs).toEqual(['Global (2)', 'Grupos (6)', 'Específicas (6)']);
  });

  it('should render 2 global rules with severity badges by default', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.rule-card').length).toBe(2);
    expect(compiled.querySelectorAll('.severity-badge').length).toBe(2);
    expect(compiled.querySelector('.severity-hard')).toBeTruthy();
    // Each global rule cites its source.
    expect(compiled.querySelector('.rule-source')?.textContent?.length).toBeGreaterThan(0);
  });

  it('should switch to the Grupos level and select families', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    tabButton(fixture, 'Grupos').click();
    fixture.detectChanges();

    const pills = Array.from(compiled.querySelectorAll('.family-pill')).map((el) =>
      el.textContent?.trim(),
    );
    expect(pills).toEqual([
      'coders',
      'guardians',
      'exploration',
      'quality',
      'writers',
      'coordination',
    ]);

    // Default family is coders (4 rules) with its members listed.
    expect(compiled.querySelector('.family-pill.active')?.textContent?.trim()).toBe('coders');
    expect(compiled.querySelector('.family-members')?.textContent).toContain('coder');
    expect(compiled.querySelectorAll('.rule-card').length).toBe(4);

    // Switch to exploration (4 rules).
    const exploration = Array.from(
      compiled.querySelectorAll<HTMLButtonElement>('.family-pill'),
    ).find((el) => el.textContent?.trim() === 'exploration');
    exploration?.click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.rule-card').length).toBe(4);
  });

  it('should render the 6 agent-specific rule blocks', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    tabButton(fixture, 'Específicas').click();
    fixture.detectChanges();

    const blocks = Array.from(compiled.querySelectorAll('.agent-rule-block'));
    expect(blocks.length).toBe(6);
    const heads = blocks.map((el) => el.querySelector('.agent-rule-head')?.textContent);
    expect(heads).toEqual([
      'delivery',
      'orchestrator',
      'interpreter',
      'explorer',
      'reviewer',
      'analista',
    ]);
    // 3 + 2 + 1 + 1 + 1 + 1 rule cards across the six blocks.
    expect(compiled.querySelectorAll('.rule-card').length).toBe(9);
  });

  it('should filter global rules client-side by free text', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('.rules-filter') as HTMLInputElement;
    input.value = 'never';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const titles = Array.from(compiled.querySelectorAll('.rule-title')).map((el) =>
      el.textContent?.trim(),
    );
    // Both global rules (0007, 0008) describe "never" write/touch actions.
    expect(titles.length).toBe(2);
    expect(titles.join(' | ')).toContain('Structured returns via EventV2');
    expect(titles.join(' | ')).toContain('Agent-system changes');
    expect(titles).not.toContain('One question block');
  });

  it('should filter within the Grupos level', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    tabButton(fixture, 'Grupos').click();
    fixture.detectChanges();

    const input = compiled.querySelector('.rules-filter') as HTMLInputElement;
    input.value = 'slice';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const titles = Array.from(compiled.querySelectorAll('.rule-title')).map((el) =>
      el.textContent?.trim(),
    );
    // Only coders-01 (id 0013) mentions slices in its description.
    expect(titles).toEqual(['0013 - Complexity review and slice routing']);
  });

  it('should show an empty-state note in the Grupos level when the filter matches nothing', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    tabButton(fixture, 'Grupos').click();
    fixture.detectChanges();

    const input = compiled.querySelector('.rules-filter') as HTMLInputElement;
    input.value = 'zzz-no-such-term';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('.empty-note')).toBeTruthy();
    expect(compiled.querySelector('.empty-note')?.textContent).toContain('zzz-no-such-term');
    expect(compiled.querySelectorAll('.rule-card').length).toBe(0);
  });

  it('should show an empty-state note when the filter matches nothing', () => {
    const fixture = TestBed.createComponent(RulesPanel);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const input = compiled.querySelector('.rules-filter') as HTMLInputElement;
    input.value = 'zzz-no-such-term';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(compiled.querySelector('.empty-note')).toBeTruthy();
    expect(compiled.querySelectorAll('.rule-card').length).toBe(0);
  });
});
