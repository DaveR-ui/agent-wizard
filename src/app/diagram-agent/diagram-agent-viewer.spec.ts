import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DiagramAgentViewer } from './diagram-agent-viewer';
import { GRAPH } from '../models/refined-source';
import { routes } from '../app.routes';

describe('DiagramAgentViewer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramAgentViewer],
      // RouterLink (back link / edge links) needs the router.
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(
    id: string,
  ): { fixture: ComponentFixture<DiagramAgentViewer>; compiled: HTMLElement } {
    const fixture = TestBed.createComponent(DiagramAgentViewer);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }

  it('should render the node identity for a known graph.json id (interpreter)', () => {
    const { compiled } = render('interpreter');
    expect(compiled.querySelector('.viewer-title')?.textContent).toBe('Interpreter');
    expect(compiled.textContent).toContain('interpreter');
    expect(compiled.textContent).toContain('analysis');
    expect(compiled.textContent).toContain('Level');
  });

  it('should link to the diagram-agent counterpart markdown and the group index', () => {
    const { compiled } = render('interpreter');
    const hrefs = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('.doc-link')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain('/diagram-agent/interpreter.md');
    expect(hrefs).toContain('/diagram-agent/analysis/README.md');
  });

  it('should render outgoing and incoming edges from graph.json', () => {
    const { compiled } = render('interpreter');
    const outgoingCount = GRAPH.edges.filter((e) => e.from === 'interpreter').length;
    const incomingCount = GRAPH.edges.filter((e) => e.to === 'interpreter').length;
    expect(compiled.querySelectorAll('.outgoing-section .edge-list li').length).toBe(outgoingCount);
    expect(compiled.querySelectorAll('.incoming-section .edge-list li').length).toBe(incomingCount);
  });

  it('should show a leaf note when the node has no outgoing edges (vision-relay)', () => {
    const { compiled } = render('vision-relay');
    expect(compiled.querySelector('.outgoing-section .leaf-note')).toBeTruthy();
  });

  it('should show a not-found state for an unknown id', () => {
    const { compiled } = render('does-not-exist');
    expect(compiled.querySelector('.viewer-missing')).toBeTruthy();
    expect(compiled.querySelector('.viewer-card')).toBeNull();
  });

  it('should state that the view is read-only (no writes)', () => {
    const { compiled } = render('delivery');
    expect(compiled.textContent).toContain('read-only');
  });
});

describe('diagram-agent route wiring', () => {
  it('binds the :id param to the viewer input via the real lazy route', async () => {
    TestBed.configureTestingModule({
      // Mirror the production router: real routes + withComponentInputBinding().
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    const harness = await RouterTestingHarness.create();
    const viewer = await harness.navigateByUrl('/diagram-agent/interpreter', DiagramAgentViewer);
    expect(viewer).toBeTruthy();
    expect(viewer.id()).toBe('interpreter');
    expect(viewer.node()?.label).toBe('Interpreter');
  });
});