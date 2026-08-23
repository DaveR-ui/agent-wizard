import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { GraphComponent } from '@swimlane/ngx-graph';
import { GraphPanel } from './graph-panel';
import { GRAPH } from '../models/refined-source';
import '../testing/ngx-graph-test-env';

/** Graph component internals we clean up (its own ngOnDestroy keeps the layout subscription). */
interface GraphComponentInternals {
  graphSubscription?: { unsubscribe(): void };
}

describe('GraphPanel', () => {
  let fixture: ComponentFixture<GraphPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphPanel],
    }).compileComponents();
    fixture = TestBed.createComponent(GraphPanel);
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

  it('should map all 14 nodes and 27 edges from graph.json', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(GRAPH.nodes.length).toBe(14);
    expect(GRAPH.edges.length).toBe(27);
    expect(component.nodes.length).toBe(14);
    expect(component.links.length).toBe(27);
  });

  it('should carry group color, level and isPrimary in node data', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const delivery = component.nodes.find((node) => node.id === 'delivery');
    expect(delivery).toBeTruthy();
    // coordination → #4F46E5 from graph.json groups.
    expect(delivery?.data.groupColor).toBe('#4F46E5');
    expect(delivery?.data.level).toBe(0);
    expect(delivery?.data.isPrimary).toBe(true);

    const coderGo = component.nodes.find((node) => node.id === 'coder-go');
    expect(coderGo?.data.group).toBe('coders');
    expect(coderGo?.data.isPrimary).toBe(false);
  });

  it('should use the explicit edge label and fall back to kind', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const step0 = component.links.find(
      (link) => link.source === 'delivery' && link.target === 'interpreter',
    );
    expect(step0?.label).toBe('Step 0');

    // delivery → coder-go has no explicit label; kind "direct" is used.
    const direct = component.links.find(
      (link) => link.source === 'delivery' && link.target === 'coder-go',
    );
    expect(direct?.label).toBe('direct');
  });

  it('should flag the two self-loops as recursive', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const recursive = component.links.filter((link) => link.data.recursive);
    expect(recursive.length).toBe(2);
    expect(recursive.map((link) => `${link.source}→${link.target}`).sort()).toEqual([
      'explorer→explorer',
      'reviewer→reviewer',
    ]);
  });

  it('should use the force-directed layout and render the ngx-graph host', () => {
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    // ngx-graph v13 registers the force engine as "d3ForceDirected".
    expect(component.layout()).toBe('d3ForceDirected');
    expect(compiled.querySelector('ngx-graph')).toBeTruthy();
    expect(compiled.querySelector('.graph-container')).toBeTruthy();
  });
});