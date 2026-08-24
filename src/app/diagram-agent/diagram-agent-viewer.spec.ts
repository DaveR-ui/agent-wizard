import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { DiagramAgentViewer } from './diagram-agent-viewer';
import { AGENTS, GRAPH, RULES } from '../models/refined-source';
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

  it('should render the agent identity for a known agents.json id (interpreter) with race/flavor', () => {
    const { compiled } = render('interpreter');
    expect(compiled.querySelector('.viewer-title')?.textContent).toBe('Interpreter');
    expect(compiled.textContent).toContain('interpreter');
    expect(compiled.textContent).toContain('analysis');
    expect(compiled.textContent).toContain('Level');
    // RPG: race badge + flavor from graph groups
    expect(compiled.querySelector('.race-badge')?.textContent).toBe('Diviner');
    expect(compiled.querySelector('.flavor-text')?.textContent).toContain('Reads intent');
  });

  it('should render live RPG card sections (passives, skills, weapons/summons, protocol scrolls) without static .md links', () => {
    const { compiled } = render('interpreter');
    // No static diagram-agent/*.md hrefs remain
    const mdLinks = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('a[href$=".md"]'));
    expect(mdLinks.length).toBe(0);
    expect(compiled.querySelectorAll('.doc-link').length).toBe(0);
    // Passives tiers
    expect(compiled.textContent).toContain('World laws');
    expect(compiled.textContent).toContain('Race trait');
    expect(compiled.textContent).toContain('Personal trait');
    // Skills
    expect(compiled.textContent).toContain('Skills');
    // Weapons + Summons
    expect(compiled.textContent).toContain('Weapons');
    expect(compiled.textContent).toContain('Summons');
    // Protocol scrolls
    expect(compiled.textContent).toContain('Protocol scrolls');
    const agent = AGENTS.find((a) => a.id === 'interpreter')!;
    const expectedScrolls = agent.relatedFiles.filter((f) => f.includes('.opencode/protocols/'));
    const protocolChips = compiled.querySelectorAll('.protocol-chip');
    expect(protocolChips.length).toBe(expectedScrolls.length);
  });

  it('should render outgoing and incoming edges from graph.json', () => {
    const { compiled } = render('interpreter');
    const outgoingCount = GRAPH.edges.filter((e) => e.from === 'interpreter').length;
    const incomingCount = GRAPH.edges.filter((e) => e.to === 'interpreter').length;
    expect(compiled.querySelectorAll('.outgoing-section .edge-list li').length).toBe(outgoingCount);
    expect(compiled.querySelectorAll('.incoming-section .edge-list li').length).toBe(incomingCount);
  });

  it('should show a leaf note when the node has no outgoing edges (coder)', () => {
    const { compiled } = render('coder');
    expect(compiled.querySelector('.outgoing-section .leaf-note')).toBeTruthy();
  });

  it('should show a not-found state for an unknown id', () => {
    const { compiled } = render('does-not-exist');
    expect(compiled.querySelector('.viewer-missing')).toBeTruthy();
    expect(compiled.querySelector('.viewer-card')).toBeNull();
    expect(compiled.textContent).toContain('Agent not found');
  });

  it('should render specificBeyondGeneral for the live agent', () => {
    const { compiled } = render('delivery');
    const agent = AGENTS.find((a) => a.id === 'delivery')!;
    expect(compiled.textContent).toContain(agent.specificBeyondGeneral.slice(0, 20));
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
    expect(viewer.agent()?.displayName).toBe('Interpreter');
    expect(viewer.race()).toBe('Diviner');
  });
});
