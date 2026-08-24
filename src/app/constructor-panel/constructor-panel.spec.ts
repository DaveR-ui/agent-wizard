import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { ConstructorPanel } from './constructor-panel';

describe('ConstructorPanel', () => {
  let fixture: ComponentFixture<ConstructorPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructorPanel],
      // MatSelect/MatFormField need an animation provider in tests.
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(ConstructorPanel);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should prefill the delivery archetype by default', () => {
    const panel = fixture.componentInstance;
    expect(panel.fields.id()).toBe('delivery');
    expect(panel.fields.displayName()).toBe('Delivery');
    expect(panel.fields.mode()).toBe('primary');
    expect(panel.fields.model()).toBe('opencode-go/deepseek-v4-flash');
  });

  it('should render a live markdown preview for the current draft', () => {
    const code = fixture.debugElement.query(By.css('[data-testid="md-preview"]'));
    expect(code).toBeTruthy();
    const text = (code.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('id: delivery');
    expect(text).toContain('mode: primary');
    expect(text).toContain('permission:');
    expect(text).toContain('## Role');
  });

  it('should prefill the orchestrator template on archetype change', () => {
    const panel = fixture.componentInstance;
    panel.onArchetypeChange('orchestrator');
    fixture.detectChanges();
    expect(panel.fields.id()).toBe('orchestrator');
    expect(panel.fields.mode()).toBe('subagent');
    expect(panel.fields.model()).toBe('inherit');
  });

  it('should prefill explorer objective variants (role/essence/specificBeyondGeneral)', () => {
    const panel = fixture.componentInstance;
    panel.onArchetypeChange('explorer');
    panel.onObjectiveChange('file search');
    fixture.detectChanges();
    expect(panel.fields.role()).toContain('grep/glob');
    expect(panel.fields.essence()).toContain('Read-only');
    // The base fields stay stable across objectives.
    expect(panel.fields.id()).toBe('explorer');
  });

  it('should prefill coder language variants (role/model)', () => {
    const panel = fixture.componentInstance;
    panel.onArchetypeChange('coder');
    panel.onLanguageChange('Go');
    fixture.detectChanges();
    expect(panel.fields.id()).toBe('coder');
    expect(panel.fields.role()).toContain('Go 1.24');
    expect(panel.fields.model()).toBe('opencode-go/deepseek-v4-flash');
    expect(panel.fields.permission()).toContain('coder: allow');
  });

  it('should update the preview as fields change', () => {
    const panel = fixture.componentInstance;
    panel.fields.id.set('my-custom-agent');
    fixture.detectChanges();
    const text =
      fixture.nativeElement.querySelector('[data-testid="md-preview"]')?.textContent ?? '';
    expect(text).toContain('id: my-custom-agent');
  });

  it('should sanitize the agent id to kebab-case in the preview frontmatter', () => {
    const panel = fixture.componentInstance;
    panel.fields.id.set('My  Weird Agent!!');
    fixture.detectChanges();
    const text =
      fixture.nativeElement.querySelector('[data-testid="md-preview"]')?.textContent ?? '';
    expect(text).toContain('id: my-weird-agent');
    expect(text).not.toContain('My  Weird Agent!!');
  });

  it('should download the generated .md as a blob', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    const originalCreate = URL.createObjectURL;
    const originalRevoke = URL.revokeObjectURL;
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);
    const appendChild = vi.spyOn(document.body, 'appendChild');
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    try {
      fixture.componentInstance.downloadMd();
      expect(createObjectURL).toHaveBeenCalledTimes(1);
      expect(click).toHaveBeenCalledTimes(1);
      // The anchor is appended/removed around the click, and the object URL is
      // revoked asynchronously (an immediate revoke can abort Firefox downloads).
      const anchor = appendChild.mock.calls[0][0] as HTMLAnchorElement;
      expect(anchor.download).toBe('delivery.md');
      expect(revokeObjectURL).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
    } finally {
      vi.useRealTimers();
      Object.defineProperty(URL, 'createObjectURL', { value: originalCreate, configurable: true });
      Object.defineProperty(URL, 'revokeObjectURL', { value: originalRevoke, configurable: true });
      click.mockRestore();
      appendChild.mockRestore();
    }
  });
});