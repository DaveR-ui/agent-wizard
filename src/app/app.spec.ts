import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { App } from './app';
// JointJS needs SVG matrix/transform APIs jsdom lacks — the Pipeline tab's lazy
// chunk imports @joint/core at runtime, so the shim must be in place up front.
import './testing/joint-test-env';

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // MatTabs needs an animation provider in tests; noop keeps tab switching instant.
      providers: [provideNoopAnimations()],
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
    expect(labels).toEqual(['Agentes', 'Reglas', 'Constructor', 'Pipeline']);
  });

  it('should mount only the active tab content (Agentes by default)', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-agent-cards')).toBeTruthy();
    expect(compiled.querySelector('app-rules-panel')).toBeNull();
    expect(compiled.querySelector('app-constructor-panel')).toBeNull();
  });

  it('should mount each panel when its tab is activated', async () => {
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('.mat-mdc-tab'));

    // Tab 2: Reglas.
    headers[1].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-rules-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-agent-cards')).toBeNull();

    // Tab 3: Constructor.
    headers[2].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-constructor-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-rules-panel')).toBeNull();

    // Tab 4: Pipeline — lazy-loaded via @defer (on idle); wait for the idle
    // timer + dynamic-import chunk before asserting it mounted. Activated last.
    headers[3].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-pipeline-panel')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-constructor-panel')).toBeNull();
  });
});