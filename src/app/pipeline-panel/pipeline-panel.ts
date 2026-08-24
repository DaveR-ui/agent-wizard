import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { dia, shapes } from '@joint/core';
import { GRAPH } from '../models/refined-source';

/** Pipeline phase group for legend rendering. */
export interface PipelineGroup {
  id: string;
  label: string;
  color: string;
}

/** Node model for the static in-memory pipeline graph. */
export interface PipelineNode {
  id: string;
  label: string;
  data: {
    group: string;
    groupColor: string;
    shape: 'rect' | 'diamond' | 'small' | 'optional';
    phaseLabel: string;
  };
  dimension?: { width: number; height: number };
}

/** Edge model for the static pipeline graph. */
export interface PipelineLink {
  id: string;
  source: string;
  target: string;
  label: string;
  data: {
    style: 'solid' | 'dashed' | 'dotted' | 'thick';
  };
}

/** Edge style → JointJS line attributes. */
interface EdgeLineStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  strokeLinecap?: string;
}

/**
 * Read-only first-sketch pipeline graph rendered with JointJS (OSS @joint/core,
 * MPL-2.0) instead of @swimlane/ngx-graph.
 *
 * The same in-memory directed graph (static arrays, not from refined-source)
 * is mapped to JointJS cells: `shapes.standard.Rectangle` for rect/small/
 * optional nodes, `shapes.standard.Polygon` for the diamond decision node,
 * `shapes.standard.Link` for edges. Layout is a manual left-to-right (LR)
 * column placement (positions table) that replaces the previous dagre engine —
 * `@joint/layout-directed-graph` is intentionally NOT installed to keep the
 * bundle small. No mutation of refined-source, no new dependencies beyond
 * @joint/core.
 */
@Component({
  selector: 'app-pipeline-panel',
  templateUrl: './pipeline-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pipeline-panel.css',
  host: {
    // Keyboard zoom shortcuts (+ / = → in, - / _ → out, 0 → reset fit). The
    // app is zoneless, so global listeners go through the component host.
    '(window:keydown)': 'onWindowKeydown($event)',
  },
})
export class PipelinePanel implements AfterViewInit, OnDestroy {
  /** Host div that receives the JointJS paper SVG. */
  @ViewChild('jointPaper') paperEl!: ElementRef<HTMLDivElement>;

  /** Router for node-click navigation to the diagram-agent counterpart view. */
  private readonly router = inject(Router);

  /**
   * graph.json node ids — only pipeline nodes that also exist in
   * refined-source/graph.json navigate to a diagram-agent counterpart view.
   * Pipeline-only nodes (user, decision, execution, ...) stay inert.
   */
  private readonly graphNodeIds = new Set<string>(GRAPH.nodes.map((n) => n.id));

  /** Phase groups for legend — distinct colors per phase. */
  readonly groups: PipelineGroup[] = [
    { id: 'intake', label: 'Intake', color: '#2563eb' },
    { id: 'interpretation', label: 'Interpretation', color: '#d97706' },
    { id: 'orchestration', label: 'Orchestration', color: '#7c3aed' },
    { id: 'execution', label: 'Execution', color: '#059669' },
    { id: 'verification', label: 'Verification', color: '#db2777' },
    { id: 'optional', label: 'Writers (optional)', color: '#64748b' },
  ];

  readonly nodes: PipelineNode[] = [
    {
      id: 'delivery',
      label: 'delivery',
      data: {
        group: 'intake',
        groupColor: '#2563eb',
        shape: 'rect',
        phaseLabel: 'Intake',
      },
      dimension: { width: 140, height: 40 },
    },
    {
      id: 'interpreter',
      label: 'interpreter\n(cuts Spanish at root · Step 0)',
      data: {
        group: 'interpretation',
        groupColor: '#d97706',
        shape: 'rect',
        phaseLabel: 'Interpretation',
      },
      dimension: { width: 200, height: 50 },
    },
    {
      id: 'user',
      label: 'user\n(question batch)',
      data: {
        group: 'interpretation',
        groupColor: '#f59e0b',
        shape: 'rect',
        phaseLabel: 'Interpretation',
      },
      dimension: { width: 140, height: 40 },
    },
    {
      id: 'architect',
      label: 'architect (on-demand)',
      data: {
        group: 'interpretation',
        groupColor: '#d97706',
        shape: 'small',
        phaseLabel: 'Interpretation',
      },
      dimension: { width: 150, height: 28 },
    },
    {
      id: 'explorer',
      label: 'explorer (on-demand)',
      data: {
        group: 'interpretation',
        groupColor: '#d97706',
        shape: 'small',
        phaseLabel: 'Interpretation',
      },
      dimension: { width: 150, height: 28 },
    },
    {
      id: 'coder',
      label: 'coder (on-demand)',
      data: {
        group: 'interpretation',
        groupColor: '#d97706',
        shape: 'small',
        phaseLabel: 'Interpretation',
      },
      dimension: { width: 140, height: 28 },
    },
    {
      id: 'orchestrator',
      label: 'orchestrator\n(Phase 2 · saneamiento)',
      data: {
        group: 'orchestration',
        groupColor: '#7c3aed',
        shape: 'rect',
        phaseLabel: 'Orchestration',
      },
      dimension: { width: 190, height: 50 },
    },
    {
      id: 'decision',
      label: 'confidence?\nbroad / targeted /\ndirect',
      data: {
        group: 'orchestration',
        groupColor: '#7c3aed',
        shape: 'diamond',
        phaseLabel: 'Orchestration',
      },
      dimension: { width: 110, height: 110 },
    },
    {
      id: 'broad-explore',
      label: 'broad-explore',
      data: {
        group: 'orchestration',
        groupColor: '#7c3aed',
        shape: 'rect',
        phaseLabel: 'Orchestration',
      },
      dimension: { width: 140, height: 40 },
    },
    {
      id: 'targeted-explore',
      label: 'targeted-explore',
      data: {
        group: 'orchestration',
        groupColor: '#7c3aed',
        shape: 'rect',
        phaseLabel: 'Orchestration',
      },
      dimension: { width: 155, height: 40 },
    },
    {
      id: 'execution',
      label: 'execution',
      data: {
        group: 'execution',
        groupColor: '#059669',
        shape: 'rect',
        phaseLabel: 'Execution',
      },
      dimension: { width: 140, height: 40 },
    },
    {
      id: 'tester',
      label: 'tester',
      data: {
        group: 'execution',
        groupColor: '#059669',
        shape: 'rect',
        phaseLabel: 'Execution',
      },
      dimension: { width: 110, height: 40 },
    },
    {
      id: 'reviewer',
      label: 'reviewer',
      data: {
        group: 'verification',
        groupColor: '#db2777',
        shape: 'rect',
        phaseLabel: 'Verification',
      },
      dimension: { width: 120, height: 40 },
    },
    {
      id: 'documenter',
      label: 'documenter\n(optional)',
      data: {
        group: 'optional',
        groupColor: '#64748b',
        shape: 'optional',
        phaseLabel: 'Verification',
      },
      dimension: { width: 140, height: 40 },
    },
  ];

  readonly links: PipelineLink[] = [
    {
      id: 'edge-delivery-interpreter',
      source: 'delivery',
      target: 'interpreter',
      label: 'Step 0 (delega inmediato)',
      data: { style: 'thick' },
    },
    {
      id: 'edge-interpreter-user',
      source: 'interpreter',
      target: 'user',
      label: 'may consult (question batch)',
      data: { style: 'dashed' },
    },
    {
      id: 'edge-interpreter-architect',
      source: 'interpreter',
      target: 'architect',
      label: 'on-demand validation',
      data: { style: 'dotted' },
    },
    {
      id: 'edge-interpreter-explorer',
      source: 'interpreter',
      target: 'explorer',
      label: 'on-demand validation',
      data: { style: 'dotted' },
    },
    {
      id: 'edge-interpreter-coder',
      source: 'interpreter',
      target: 'coder',
      label: 'on-demand validation',
      data: { style: 'dotted' },
    },
    {
      id: 'edge-interpreter-orchestrator',
      source: 'interpreter',
      target: 'orchestrator',
      label: 'routing packet → Phase 2',
      data: { style: 'solid' },
    },
    {
      id: 'edge-orchestrator-decision',
      source: 'orchestrator',
      target: 'decision',
      label: 'confidence branching',
      data: { style: 'solid' },
    },
    {
      id: 'edge-decision-broad',
      source: 'decision',
      target: 'broad-explore',
      label: 'low confidence → broad exploration',
      data: { style: 'solid' },
    },
    {
      id: 'edge-decision-targeted',
      source: 'decision',
      target: 'targeted-explore',
      label: 'medium → targeted exploration',
      data: { style: 'solid' },
    },
    {
      id: 'edge-decision-execution',
      source: 'decision',
      target: 'execution',
      label: 'high → direct execution (coder)',
      data: { style: 'solid' },
    },
    {
      id: 'edge-broad-execution',
      source: 'broad-explore',
      target: 'execution',
      label: 'explore → build',
      data: { style: 'solid' },
    },
    {
      id: 'edge-targeted-execution',
      source: 'targeted-explore',
      target: 'execution',
      label: 'explore → build',
      data: { style: 'solid' },
    },
    {
      id: 'edge-execution-tester',
      source: 'execution',
      target: 'tester',
      label: 'verify',
      data: { style: 'solid' },
    },
    {
      id: 'edge-tester-reviewer',
      source: 'tester',
      target: 'reviewer',
      label: 'verify',
      data: { style: 'solid' },
    },
    {
      id: 'edge-reviewer-documenter',
      source: 'reviewer',
      target: 'documenter',
      label: 'optional (dashed)',
      data: { style: 'dashed' },
    },
  ];

  /**
   * Manual LR column placement replacing dagre: delivery → interpreter →
   * orchestrator → decision → broad/targeted → execution → tester → reviewer
   * → documenter. Side nodes (user/architect/explorer/coder) are staggered
   * vertically so the decision diamond stays on the main line.
   */
  private readonly positions: Record<string, { x: number; y: number }> = {
    delivery: { x: 40, y: 260 },
    interpreter: { x: 260, y: 260 },
    user: { x: 480, y: 90 },
    architect: { x: 480, y: 180 },
    explorer: { x: 480, y: 270 },
    coder: { x: 480, y: 360 },
    orchestrator: { x: 700, y: 260 },
    decision: { x: 920, y: 260 },
    'broad-explore': { x: 1140, y: 120 },
    'targeted-explore': { x: 1140, y: 330 },
    execution: { x: 1360, y: 260 },
    tester: { x: 1580, y: 260 },
    reviewer: { x: 1800, y: 260 },
    documenter: { x: 2020, y: 340 },
  };

  private graph?: dia.Graph;
  private paper?: dia.Paper;
  private resizeObserver?: ResizeObserver;

  /** Minimum zoom scale — matches resizePaper's scaleContentToFit minScale. */
  private readonly MIN_SCALE = 0.35;
  /** Maximum zoom scale (3x — enough to inspect any node closely). */
  private readonly MAX_SCALE = 3;
  /** Zoom step applied by the toolbar +/- buttons and keyboard shortcuts. */
  private readonly ZOOM_STEP = 0.2;
  /** Fallback scale used before the first fit completes. */
  private readonly DEFAULT_SCALE = 0.8;

  /** Current paper zoom (scale factor), kept in sync with the paper matrix. */
  private currentScale = this.DEFAULT_SCALE;
  /**
   * True once the user manually zoomed or panned. While set, container
   * resizes only resize the paper and preserve the user's transform instead
   * of re-fitting (zoomReset clears it and restores the fit).
   */
  private hasUserZoomed = false;

  /** Zoom percentage shown in the toolbar (signal → zoneless change detection). */
  readonly zoomPercent = signal(Math.round(this.DEFAULT_SCALE * 100));
  /** True while a blank-area drag pan is in progress (cursor affordance). */
  readonly panningActive = signal(false);

  private wheelListener?: (event: WheelEvent) => void;
  private panning = false;
  private panStartX = 0;
  private panStartY = 0;
  private panStartTranslate = { tx: 0, ty: 0 };

  ngAfterViewInit(): void {
    this.buildGraph();
    this.paperEl.nativeElement.appendChild(this.paper!.el);
    this.attachWheelListener();

    // Pan the paper by dragging the blank background (elements stay draggable
    // through the paper's built-in interactivity).
    this.paper!.on('blank:pointerdown', this.onBlankPointerDown);

    // Unfreeze before any fit so scaleContentToFit operates on a live paper
    // with a real model bbox (frozen:true + scaleContentToFit can leave the
    // viewport transform off-screen / scale 0 when useModelGeometry is used
    // before views are mounted).
    this.paper!.unfreeze();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.resizePaper();
        this.syncZoomState();
      });
      this.resizeObserver.observe(this.paperEl.nativeElement);
    }
    // Initial fit must happen after unfreeze and after the host has a layout
    // size. Call synchronously for jsdom/tests (fallback dimensions) and also
    // schedule a frame to catch late layout (mat-tab defer / hidden tab where
    // host.clientWidth is 0 at this moment).
    this.resizePaper();
    this.syncZoomState();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        this.resizePaper();
        this.syncZoomState();
      });
    }
  }

  ngOnDestroy(): void {
    this.detachWheelListener();
    this.stopPan();
    this.resizeObserver?.disconnect();
    this.paper?.off('blank:pointerdown', this.onBlankPointerDown);
    this.paper?.off('element:pointerclick', this.onElementClick);
    this.paper?.remove();
    this.graph?.clear();
  }

  /** Create the JointJS graph + paper and lay out all cells manually (LR). */
  private buildGraph(): void {
    this.graph = new dia.Graph({}, { cellNamespace: shapes });

    for (const node of this.nodes) {
      this.graph.addCell(this.createElement(node));
    }
    for (const link of this.links) {
      this.graph.addCell(this.createLink(link));
    }

    const host = this.paperEl.nativeElement;
    this.paper = new dia.Paper({
      model: this.graph,
      cellViewNamespace: shapes,
      async: true,
      frozen: true,
      interactive: true,
      width: host.clientWidth || DEFAULT_WIDTH,
      height: host.clientHeight || DEFAULT_HEIGHT,
      background: { color: '#F8F9FA' },
    });

    // Clicking an agent node navigates to its diagram-agent counterpart view.
    this.paper.on('element:pointerclick', this.onElementClick);
  }

  /** Map a PipelineNode to a JointJS element preserving shape/color. */
  private createElement(node: PipelineNode): dia.Element {
    const size = node.dimension ?? { width: 140, height: 40 };
    const position = this.positions[node.id] ?? { x: 40, y: 260 };
    const { shape, groupColor } = node.data;

    // Nodes with a graph.json counterpart are clickable → pointer cursor.
    const cursor = this.graphNodeIds.has(node.id) ? 'pointer' : 'default';

    const label = {
      text: node.label,
      fill: '#ffffff',
      fontWeight: 600,
      fontSize: shape === 'small' ? 10 : shape === 'diamond' ? 9 : 11,
      textAnchor: 'middle' as const,
      textVerticalAnchor: 'middle' as const,
    };
    const body = {
      fill: groupColor,
      stroke: '#ffffff',
      strokeWidth: 2,
    };

    if (shape === 'diamond') {
      return new shapes.standard.Polygon({
        id: node.id,
        position,
        size,
        attrs: {
          root: { cursor },
          body: {
            ...body,
            points: 'calc(w/2) 0, calc(w) calc(h/2), calc(w/2) calc(h), 0 calc(h/2)',
          },
          label,
        },
      });
    }

    if (shape === 'small') {
      return new shapes.standard.Rectangle({
        id: node.id,
        position,
        size,
        attrs: {
          root: { cursor },
          body: { ...body, rx: 8, ry: 8, strokeDasharray: '2 3' },
          label,
        },
      });
    }

    if (shape === 'optional') {
      return new shapes.standard.Rectangle({
        id: node.id,
        position,
        size,
        attrs: {
          root: { cursor },
          body: { ...body, rx: 10, ry: 10, strokeDasharray: '6 4' },
          label,
        },
      });
    }

    return new shapes.standard.Rectangle({
      id: node.id,
      position,
      size,
      attrs: {
        root: { cursor },
        body: { ...body, rx: 10, ry: 10 },
        label,
      },
    });
  }

  /** Map a PipelineLink to a JointJS link preserving the edge style. */
  private createLink(link: PipelineLink): dia.Link {
    const line = this.edgeLineStyle(link.data.style);
    return new shapes.standard.Link({
      id: link.id,
      source: { id: link.source },
      target: { id: link.target },
      router: { name: 'normal' },
      connector: { name: 'normal' },
      attrs: {
        line: {
          stroke: line.stroke,
          strokeWidth: line.strokeWidth,
          strokeDasharray: line.strokeDasharray,
          strokeLinecap: line.strokeLinecap,
          targetMarker: {
            type: 'path',
            d: 'M 10 -5 0 0 10 5 z',
            fill: line.stroke,
          },
        },
        wrapper: { strokeWidth: 12 },
      },
      labels: [
        {
          attrs: {
            text: {
              text: link.label,
              fill: '#475569',
              fontSize: 10,
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
            },
          },
        },
      ],
    });
  }

  /** Edge style → stroke color / width / dash (mirrors the previous CSS). */
  private edgeLineStyle(style: PipelineLink['data']['style']): EdgeLineStyle {
    switch (style) {
      case 'thick':
        return { stroke: '#334155', strokeWidth: 2.6 };
      case 'dashed':
        return { stroke: '#94a3b8', strokeWidth: 1.4, strokeDasharray: '8 4' };
      case 'dotted':
        return {
          stroke: '#94a3b8',
          strokeWidth: 1.6,
          strokeDasharray: '2 4',
          strokeLinecap: 'round',
        };
      default:
        return { stroke: '#94a3b8', strokeWidth: 1.4 };
    }
  }

  /**
   * Keep the paper sized to the host and fit the whole pipeline.
   *
   * Fit is only re-applied while the user has not transformed the paper
   * manually (hasUserZoomed). After a manual zoom/pan, resizes preserve the
   * user's transform and only update the paper dimensions — the user's
   * working view is never yanked back to fit. zoomReset() clears the flag and
   * re-fits.
   */
  private resizePaper(): void {
    const host = this.paperEl?.nativeElement;
    if (!this.paper || !host) {
      return;
    }
    this.paper.setDimensions(
      host.clientWidth || DEFAULT_WIDTH,
      host.clientHeight || DEFAULT_HEIGHT,
    );
    if (this.hasUserZoomed) {
      // Preserve the user's zoom/pan — only the paper size changes.
      return;
    }
    // useModelGeometry: fit from the model bbox so it also works pre-render.
    this.paper.scaleContentToFit({
      padding: 16,
      useModelGeometry: true,
      minScale: 0.35,
      maxScale: 1,
    });
  }

  /** Sync currentScale/zoomPercent from the paper matrix (after any fit). */
  private syncZoomState(): void {
    if (!this.paper) {
      return;
    }
    const { sx } = this.paper.scale();
    this.currentScale = sx;
    this.zoomPercent.set(Math.round(sx * 100));
  }

  /** Clamp a scale factor to the allowed zoom range. */
  private clampScale(scale: number): number {
    return Math.min(this.MAX_SCALE, Math.max(this.MIN_SCALE, scale));
  }

  /**
   * Toolbar "+" — zoom in one step about the paper center.
   */
  zoomIn(): void {
    this.zoomTo(this.currentScale + this.ZOOM_STEP, this.paperCenter());
  }

  /**
   * Toolbar "−" — zoom out one step about the paper center.
   */
  zoomOut(): void {
    this.zoomTo(this.currentScale - this.ZOOM_STEP, this.paperCenter());
  }

  /**
   * Toolbar "reset" — clear the user-zoom flag and re-fit the whole pipeline
   * (equivalent to the initial scaleContentToFit).
   */
  zoomReset(): void {
    this.hasUserZoomed = false;
    this.resizePaper();
    this.syncZoomState();
  }

  /**
   * Zoom the paper to `scale`, clamped to [MIN_SCALE, MAX_SCALE]. When
   * `center` (a point in paper-local coordinates) is provided, the model
   * point under it stays fixed on screen — the cursor keeps hovering the
   * same graph feature while zooming.
   */
  private zoomTo(scale: number, center?: { x: number; y: number }): void {
    if (!this.paper) {
      return;
    }
    const clamped = this.clampScale(scale);
    if (clamped === this.currentScale) {
      return;
    }
    const oldScale = this.currentScale;
    const { tx, ty } = this.paper.translate();
    this.paper.scale(clamped);
    if (center) {
      // Keep the focal local point fixed on screen:
      // t' = t - center * (newScale - oldScale)  (same math as scaleUniformAtPoint).
      this.paper.translate(
        tx - center.x * (clamped - oldScale),
        ty - center.y * (clamped - oldScale),
      );
    }
    this.currentScale = clamped;
    this.hasUserZoomed = true;
    this.zoomPercent.set(Math.round(clamped * 100));
  }

  /** Paper center in local coordinates — focal point for the +/- buttons. */
  private paperCenter(): { x: number; y: number } {
    if (!this.paper) {
      return { x: 0, y: 0 };
    }
    const size = this.paper.getComputedSize();
    const offset = this.paper.clientOffset();
    return this.paper.clientToLocalPoint(
      offset.x + size.width / 2,
      offset.y + size.height / 2,
    );
  }

  /**
   * Wheel zoom. Both plain wheel and Ctrl/Cmd+wheel (pinch) zoom, centered on
   * the cursor. The listener is attached with { passive: false } so
   * preventDefault() can stop page scrolling while zooming the graph.
   */
  handleWheel(event: WheelEvent): void {
    if (!this.paper) {
      return;
    }
    event.preventDefault();
    const delta = -event.deltaY * 0.0015;
    const nextScale = this.clampScale(this.currentScale * (1 + delta));
    if (nextScale === this.currentScale) {
      return;
    }
    const center = this.paper.clientToLocalPoint(event.clientX, event.clientY);
    this.zoomTo(nextScale, center);
  }

  /** Attach the wheel listener to the paper SVG (native, non-passive). */
  private attachWheelListener(): void {
    const svg = this.paper?.el;
    if (!svg) {
      return;
    }
    this.wheelListener = (event: WheelEvent) => this.handleWheel(event);
    svg.addEventListener('wheel', this.wheelListener, { passive: false });
  }

  private detachWheelListener(): void {
    if (!this.wheelListener) {
      return;
    }
    this.paper?.el.removeEventListener('wheel', this.wheelListener);
    this.wheelListener = undefined;
  }

  /**
   * Click on a pipeline node → navigate to its diagram-agent counterpart view.
   * Only nodes that exist in refined-source/graph.json navigate; pipeline-only
   * nodes (user, decision, execution, ...) stay inert.
   */
  private onElementClick = (elementView: dia.ElementView): void => {
    const id = String(elementView.model.id);
    if (this.graphNodeIds.has(id)) {
      void this.router.navigate(['/diagram-agent', id]);
    }
  };

  /**
   * Start a pan drag on the blank paper background (primary button only).
   * Element dragging is unaffected — pan only starts when no cell is under
   * the pointer.
   */
  private onBlankPointerDown = (evt: Event): void => {
    if (!this.paper) {
      return;
    }
    const pointer = evt as PointerEvent;
    if (pointer.button !== 0) {
      return;
    }
    this.panning = true;
    this.panStartX = pointer.clientX;
    this.panStartY = pointer.clientY;
    this.panStartTranslate = this.paper.translate();
    this.panningActive.set(true);
    document.addEventListener('pointermove', this.onPanPointerMove);
    document.addEventListener('pointerup', this.onPanPointerUp);
    document.addEventListener('pointercancel', this.onPanPointerUp);
  };

  /** Pan the paper while dragging: screen deltas map 1:1 to the translate. */
  private onPanPointerMove = (evt: PointerEvent): void => {
    if (!this.panning || !this.paper) {
      return;
    }
    const dx = evt.clientX - this.panStartX;
    const dy = evt.clientY - this.panStartY;
    // Translate is applied after scale in the viewport transform, so it is
    // already in screen-pixel units — no division by currentScale needed.
    this.paper.translate(
      this.panStartTranslate.tx + dx,
      this.panStartTranslate.ty + dy,
    );
    this.hasUserZoomed = true;
  };

  /** End the pan drag and detach the document-level listeners. */
  private onPanPointerUp = (): void => {
    this.panning = false;
    this.panningActive.set(false);
    document.removeEventListener('pointermove', this.onPanPointerMove);
    document.removeEventListener('pointerup', this.onPanPointerUp);
    document.removeEventListener('pointercancel', this.onPanPointerUp);
  };

  /** Idempotent pan cleanup (used by onPanPointerUp and ngOnDestroy). */
  private stopPan(): void {
    if (this.panning) {
      this.onPanPointerUp();
    } else {
      this.panningActive.set(false);
      document.removeEventListener('pointermove', this.onPanPointerMove);
      document.removeEventListener('pointerup', this.onPanPointerUp);
      document.removeEventListener('pointercancel', this.onPanPointerUp);
    }
  }

  /**
   * Keyboard zoom shortcuts: + / = → zoom in, - / _ → zoom out, 0 → reset
   * fit. Ignored while a text field is focused so typing is never hijacked,
   * and for ctrl/meta/alt combinations (browser shortcuts).
   */
  onWindowKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    ) {
      return;
    }
    switch (event.key) {
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
      case '_':
        event.preventDefault();
        this.zoomOut();
        break;
      case '0':
        event.preventDefault();
        this.zoomReset();
        break;
    }
  }
}

/** Fallback paper size when the host has no laid-out size (e.g. jsdom tests). */
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 560;
