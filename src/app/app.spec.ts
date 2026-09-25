import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { AgentSelection } from './agent-cards/agent-selection.service';
// JointJS needs SVG matrix/transform APIs jsdom lacks — the Pipeline tab's lazy
// chunk imports @joint/core at runtime, so the shim must be in place up front.
import './testing/joint-test-env';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // MatTabs needs an animation provider in tests; noop keeps tab switching instant.
      // RouterOutlet + the lazy PipelinePanel (node-click navigation) need the router.
      providers: [provideNoopAnimations(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.site-title')?.textContent).toBe('AgentWizard');
  });

  it('should render the four Material tab labels', () => {
    fixture.detectChanges();
    const labels = fixture.debugElement
      .queryAll(By.css('.mat-mdc-tab'))
      .map((tab) => tab.nativeElement.textContent?.trim());
    expect(labels).toEqual(['Agentes', 'Reglas', 'Protocolos', 'Pipeline']);
  });

  it('should mount only the active tab content (Agentes by default)', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-agent-cards')).toBeTruthy();
    expect(compiled.querySelector('app-rules-panel')).toBeNull();
    expect(compiled.querySelector('app-protocols-panel')).toBeNull();
  });

  it('should mount each panel when its tab is activated', async () => {
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));

    // Tab 2: Reglas.
    headers[1].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-rules-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-agent-cards')).toBeNull();

    // Tab 3: Protocolos.
    headers[2].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-protocols-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-rules-panel')).toBeNull();

    // Tab 4: Pipeline — lazy-loaded via @defer (on idle); wait for the idle
    // timer + dynamic-import chunk before asserting it mounted. Activated last.
    headers[3].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-pipeline-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-protocols-panel')).toBeNull();
  });
});

describe('App detail side panel', () => {
  it('hides the aside until a detail route activates, then renders the viewer beside the tabs', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNoopAnimations(),
        // Mirror the production router: real routes + withComponentInputBinding().
        provideRouter(routes, withComponentInputBinding()),
      ],
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('.site-detail') as HTMLElement;
    expect(aside).toBeTruthy();
    expect(aside.classList.contains('has-detail')).toBe(false);

    await TestBed.inject(Router).navigateByUrl('/diagram-agent/interpreter');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(aside.classList.contains('has-detail')).toBe(true);
    expect(aside.querySelector('.viewer-card')).toBeTruthy();
    expect(aside.querySelector('.viewer-title')?.textContent).toBe('Interpreter');
  });

  it('shows inline detail in the shell aside when a mini card is selected and keeps placeholder when none', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideNoopAnimations(), provideRouter(routes, withComponentInputBinding())],
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('.site-detail') as HTMLElement;
    expect(aside).toBeTruthy();
    // Initially no routed detail and no inline selection → aside hidden, placeholder present but hidden
    expect(aside.classList.contains('has-detail')).toBe(false);
    expect(aside.classList.contains('has-inline')).toBe(false);
    expect(aside.classList.contains('has-side-panel')).toBe(false);
    expect(aside.querySelector('.detail-placeholder')?.textContent).toBe('Select an agent to see details');
    expect(aside.querySelector('.detail-panel')).toBeFalsy();

    // Simulate selecting a mini card via shared service
    const selection = TestBed.inject(AgentSelection);
    selection.select('delivery');
    fixture.detectChanges();

    expect(aside.classList.contains('has-inline')).toBe(true);
    expect(aside.classList.contains('has-side-panel')).toBe(true);
    expect(aside.querySelector('.detail-panel')).toBeTruthy();
    expect(aside.querySelector('.detail-panel')?.textContent).toContain('Delivery');
    expect(aside.querySelector('.detail-placeholder')).toBeFalsy();

    // Selecting another agent switches the panel
    selection.select('explorer');
    fixture.detectChanges();
    expect(aside.querySelector('.detail-panel')?.textContent).toContain('Explorer');

    // Clearing selection returns to placeholder and hides aside
    selection.clear();
    fixture.detectChanges();
    expect(aside.classList.contains('has-inline')).toBe(false);
    expect(aside.classList.contains('has-side-panel')).toBe(false);
    expect(aside.querySelector('.detail-placeholder')).toBeTruthy();
    expect(aside.querySelector('.detail-panel')).toBeFalsy();
  });
});