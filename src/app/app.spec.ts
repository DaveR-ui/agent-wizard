import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GraphComponent } from '@swimlane/ngx-graph';
import { App } from './app';
import './testing/ngx-graph-test-env';

/** Graph component internals we clean up (its own ngOnDestroy keeps the layout subscription). */
interface GraphComponentInternals {
  graphSubscription?: { unsubscribe(): void };
}

describe('App', () => {
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
  });

  afterEach(async () => {
    // ngx-graph's ngAfterViewInit schedules an unguarded `setTimeout(() => this.update())`
    // that emits `stateChange` on the next macrotask. Flush it while the component is still
    // alive so the emit does not hit a destroyed OutputRef (NG0953), then stop the
    // force-simulation subscription (its ngOnDestroy keeps it) and tear down.
    await new Promise((resolve) => setTimeout(resolve, 50));
    const graph = fixture.debugElement.query(By.directive(GraphComponent))
      ?.componentInstance as GraphComponentInternals | undefined;
    graph?.graphSubscription?.unsubscribe();
    fixture.destroy();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the page title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.site-title')?.textContent).toBe('AgentWizard');
  });

  it('should render the three section headers', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = Array.from(compiled.querySelectorAll('.section-title')).map((el) =>
      el.textContent?.trim(),
    );
    expect(headings).toEqual(['Agentes', 'Reglas', 'Grafo de delegación']);
  });

  it('should mount the agent cards, rules panel and graph panel', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-agent-cards')).toBeTruthy();
    expect(compiled.querySelector('app-rules-panel')).toBeTruthy();
    expect(compiled.querySelector('app-graph-panel')).toBeTruthy();
  });
});