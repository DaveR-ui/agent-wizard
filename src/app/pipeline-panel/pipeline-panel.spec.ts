// JointJS needs SVG matrix/transform APIs jsdom lacks — install before @joint/core evaluates.
import '../testing/joint-test-env';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import type { dia } from '@joint/core';
import { PipelinePanel } from './pipeline-panel';

describe('PipelinePanel', () => {
  let fixture: ComponentFixture<PipelinePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PipelinePanel],
    }).compileComponents();
    fixture = TestBed.createComponent(PipelinePanel);
    fixture.detectChanges();
  });

  afterEach(async () => {
    // Let the JointJS async (frozen → unfreeze) render settle before teardown.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    fixture.destroy();
  });

  it('should render legend with phase colors', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const legend = compiled.querySelector('.graph-legend');
    expect(legend).toBeTruthy();
    const items = compiled.querySelectorAll('.legend-item');
    // Intake, Interpretation, Orchestration, Execution, Verification, Writers (optional) = 6
    expect(items.length).toBe(6);
    const dotColors = Array.from(compiled.querySelectorAll<HTMLElement>('.legend-dot')).map(
      (dot) => dot.style.backgroundColor,
    );
    expect(dotColors.length).toBe(6);
    expect(compiled.textContent).toContain('Intake');
    expect(compiled.textContent).toContain('Interpretation');
    expect(compiled.textContent).toContain('Orchestration');
    expect(compiled.textContent).toContain('Execution');
    expect(compiled.textContent).toContain('Verification');
  });

  it('should map 14 nodes and 15 edges covering full flow', () => {
    const component = fixture.componentInstance;
    expect(component.nodes.length).toBe(14);
    expect(component.links.length).toBe(15);

    // Spot-check critical nodes
    const delivery = component.nodes.find((n) => n.id === 'delivery');
    expect(delivery?.data.groupColor).toBe('#2563eb');
    const interpreter = component.nodes.find((n) => n.id === 'interpreter');
    expect(interpreter?.label).toContain('interpreter');
    const decision = component.nodes.find((n) => n.id === 'decision');
    expect(decision?.data.shape).toBe('diamond');
    const documenter = component.nodes.find((n) => n.id === 'documenter');
    expect(documenter?.data.shape).toBe('optional');

    // Spot-check critical edges and styles
    const step0 = component.links.find(
      (l) => l.source === 'delivery' && l.target === 'interpreter',
    );
    expect(step0?.label).toBe('Step 0 (delega inmediato)');
    expect(step0?.data.style).toBe('thick');
    const optionalEdge = component.links.find(
      (l) => l.source === 'reviewer' && l.target === 'documenter',
    );
    expect(optionalEdge?.data.style).toBe('dashed');
    expect(optionalEdge?.label).toBe('optional (dashed)');
    const dotted = component.links.filter((l) => l.data.style === 'dotted');
    expect(dotted.length).toBe(3);
    // Confidence branching edges
    const confidence = component.links.find(
      (l) => l.source === 'orchestrator' && l.target === 'decision',
    );
    expect(confidence?.label).toBe('confidence branching');
  });

  it('should render the JointJS paper host and build the pipeline graph', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // `#jointPaper` is an Angular template reference; the rendered host carries
    // the `joint-paper-host` class (no id attribute).
    const host = compiled.querySelector('.joint-paper-host');
    expect(host).toBeTruthy();
    expect(compiled.querySelector('.graph-container')).toBeTruthy();

    // The component builds a dia.Graph with 14 element cells + 15 link cells.
    const graph = (fixture.componentInstance as unknown as { graph?: dia.Graph }).graph;
    expect(graph).toBeTruthy();
    const cells = graph!.getCells();
    expect(cells.length).toBe(29);
    expect(cells.filter((cell) => cell.isElement()).length).toBe(14);
    expect(cells.filter((cell) => cell.isLink()).length).toBe(15);

    // The JointJS paper SVG is appended to the host.
    expect(host?.children.length).toBeGreaterThan(0);
  });

  it('should render caption with first-sketch note', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const caption = compiled.querySelector('.graph-caption')?.textContent ?? '';
    expect(caption).toContain('First sketch toward n8n-like prompt builder');
    expect(caption).toContain('read-only pipeline visualization');
    const note = compiled.querySelector('.graph-note')?.textContent ?? '';
    expect(note).toContain('Spanish is cut at the interpreter');
    expect(note).toContain('confidence branching');
    const meta = compiled.querySelector('.graph-meta')?.textContent ?? '';
    expect(meta).toContain('JointJS');
    expect(meta).toContain('14 nodes');
    expect(meta).toContain('15 edges');
  });

  it('should render the zoom toolbar with accessible controls', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const toolbar = compiled.querySelector('.zoom-toolbar');
    expect(toolbar).toBeTruthy();
    expect(toolbar?.getAttribute('role')).toBe('toolbar');
    const buttons = compiled.querySelectorAll('.zoom-toolbar .zoom-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].getAttribute('aria-label')).toBe('Zoom in');
    expect(buttons[1].getAttribute('aria-label')).toBe('Zoom out');
    expect(buttons[2].getAttribute('aria-label')).toBe('Reset zoom');
    expect(compiled.querySelector('.zoom-percent')).toBeTruthy();
  });

  it('should zoom in/out about the paper and update the toolbar label', () => {
    const component = fixture.componentInstance;
    const paper = (component as unknown as { paper?: dia.Paper }).paper;
    expect(paper).toBeTruthy();
    const before = paper!.scale().sx;

    component.zoomIn();
    expect(paper!.scale().sx).toBeGreaterThan(before);
    expect(component.zoomPercent()).toBe(Math.round(paper!.scale().sx * 100));

    component.zoomOut();
    expect(paper!.scale().sx).toBeCloseTo(before, 6);
  });

  it('should clamp zoom within [0.35, 3]', () => {
    const component = fixture.componentInstance;
    const paper = (component as unknown as { paper?: dia.Paper }).paper;
    // Repeated zoom-out must bottom out at MIN_SCALE.
    for (let i = 0; i < 30; i++) {
      component.zoomOut();
    }
    expect(paper!.scale().sx).toBeGreaterThanOrEqual(0.35 - 1e-9);
    // Repeated zoom-in must top out at MAX_SCALE.
    for (let i = 0; i < 40; i++) {
      component.zoomIn();
    }
    expect(paper!.scale().sx).toBeLessThanOrEqual(3 + 1e-9);
    expect(component.zoomPercent()).toBe(300);
  });

  it('should reset zoom back to the fitted scale', () => {
    const component = fixture.componentInstance;
    const paper = (component as unknown as { paper?: dia.Paper }).paper;
    const fitted = paper!.scale().sx;

    component.zoomIn();
    component.zoomIn();
    component.zoomReset();

    expect(paper!.scale().sx).toBeCloseTo(fitted, 6);
    expect(component.zoomPercent()).toBe(Math.round(fitted * 100));
  });

  it('should zoom on wheel input and clamp at the limits', () => {
    const component = fixture.componentInstance;
    const paper = (component as unknown as { paper?: dia.Paper }).paper;
    const start = paper!.scale().sx;

    const wheel = (deltaY: number): void =>
      component.handleWheel({
        preventDefault: () => undefined,
        deltaY,
        clientX: 50,
        clientY: 50,
      } as unknown as WheelEvent);

    wheel(-120);
    expect(paper!.scale().sx).toBeGreaterThan(start);

    // A huge negative delta (zoom in) must clamp at MAX_SCALE = 3.
    wheel(-100000);
    expect(paper!.scale().sx).toBeLessThanOrEqual(3);
  });
});
