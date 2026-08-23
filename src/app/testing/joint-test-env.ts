/**
 * Shared unit-test environment shims for specs that render @joint/core (JointJS).
 *
 * jsdom (the Vitest DOM) does not implement the SVG matrix/transform APIs that
 * JointJS's Vectorizer relies on:
 * - `window.SVGAngle` — JointJS gates its whole Vectorizer on this (`isSVGSupported`);
 *   without it V() becomes a throwing stub and every Paper fails.
 * - `SVGSVGElement.createSVGMatrix()` / `createSVGPoint()` / `createSVGTransform()` —
 *   used by `V.createSVGMatrix()` / `V.createSVGPoint()` during rendering.
 * - `SVGGraphicsElement.getBBox()` / `getCTM()` / `getScreenCTM()` — used for
 *   matrix math; getBBox is try/caught by JointJS but the CTM methods are not.
 *
 * The shims are idempotent so importing this module from multiple spec files is
 * safe. Import this module BEFORE anything imports `@joint/core` so the globals
 * exist when JointJS evaluates its module graph.
 */

/** Minimal SVGMatrix polyfill (SVGMatrix interface subset used by JointJS). */
class JointSVGMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  get [Symbol.toStringTag](): string {
    return 'SVGMatrix';
  }

  constructor(init?: Partial<JointSVGMatrix>) {
    if (!init) return;
    if ('a' in init) this.a = init.a ?? this.a;
    if ('b' in init) this.b = init.b ?? this.b;
    if ('c' in init) this.c = init.c ?? this.c;
    if ('d' in init) this.d = init.d ?? this.d;
    if ('e' in init) this.e = init.e ?? this.e;
    if ('f' in init) this.f = init.f ?? this.f;
  }

  multiply(other: JointSVGMatrix): JointSVGMatrix {
    return new JointSVGMatrix({
      a: this.a * other.a + this.c * other.b,
      b: this.b * other.a + this.d * other.b,
      c: this.a * other.c + this.c * other.d,
      d: this.b * other.c + this.d * other.d,
      e: this.a * other.e + this.c * other.f + this.e,
      f: this.b * other.e + this.d * other.f + this.f,
    });
  }

  inverse(): JointSVGMatrix {
    const det = this.a * this.d - this.b * this.c;
    if (det === 0) {
      return new JointSVGMatrix();
    }
    return new JointSVGMatrix({
      a: this.d / det,
      b: -this.b / det,
      c: -this.c / det,
      d: this.a / det,
      e: (this.c * this.f - this.d * this.e) / det,
      f: (this.b * this.e - this.a * this.f) / det,
    });
  }

  translate(x: number, y: number): JointSVGMatrix {
    return new JointSVGMatrix({
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e + x * this.a + y * this.c,
      f: this.f + x * this.b + y * this.d,
    });
  }

  scale(scaleFactor: number): JointSVGMatrix {
    return this.scaleNonUniform(scaleFactor, scaleFactor);
  }

  scaleNonUniform(scaleX: number, scaleY: number): JointSVGMatrix {
    return new JointSVGMatrix({
      a: this.a * scaleX,
      b: this.b * scaleX,
      c: this.c * scaleY,
      d: this.d * scaleY,
      e: this.e,
      f: this.f,
    });
  }

  rotate(angle: number): JointSVGMatrix {
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new JointSVGMatrix({
      a: this.a * cos + this.c * sin,
      b: this.b * cos + this.d * sin,
      c: -this.a * sin + this.c * cos,
      d: -this.b * sin + this.d * cos,
      e: this.e,
      f: this.f,
    });
  }

  rotateFromVector(x: number, y: number): JointSVGMatrix {
    return this.rotate((Math.atan2(y, x) * 180) / Math.PI);
  }

  flipX(): JointSVGMatrix {
    return this.scaleNonUniform(-1, 1);
  }

  flipY(): JointSVGMatrix {
    return this.scaleNonUniform(1, -1);
  }

  skewX(angle: number): JointSVGMatrix {
    const tan = Math.tan((angle * Math.PI) / 180);
    return new JointSVGMatrix({
      a: this.a,
      b: this.b,
      c: this.a * tan + this.c,
      d: this.b * tan + this.d,
      e: this.e,
      f: this.f,
    });
  }

  skewY(angle: number): JointSVGMatrix {
    const tan = Math.tan((angle * Math.PI) / 180);
    return new JointSVGMatrix({
      a: this.a,
      b: this.a * tan + this.b,
      c: this.c,
      d: this.c * tan + this.d,
      e: this.e,
      f: this.f,
    });
  }
}

/** Minimal SVGPoint polyfill (x/y + matrixTransform). */
class JointSVGPoint {
  x = 0;
  y = 0;

  matrixTransform(matrix: JointSVGMatrix): JointSVGPoint {
    const point = new JointSVGPoint();
    point.x = matrix.a * this.x + matrix.c * this.y + matrix.e;
    point.y = matrix.b * this.x + matrix.d * this.y + matrix.f;
    return point;
  }
}

/** Minimal SVGTransform polyfill (JointJS uses setMatrix after creation). */
class JointSVGTransform {
  // SVG_TRANSFORM_MATRIX
  type = 1;
  angle = 0;
  matrix: JointSVGMatrix = new JointSVGMatrix();

  setMatrix(matrix: JointSVGMatrix): JointSVGTransform {
    this.matrix = matrix;
    return this;
  }
}

/** Minimal SVGAnimatedTransformList so `node.transform.baseVal.consolidate()` is safe. */
class JointTransformList {
  consolidate(): null {
    return null;
  }
}

const install = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const win = window as Window & typeof globalThis;
  const svgWin = win as unknown as {
    SVGAngle?: unknown;
    SVGMatrix?: unknown;
    SVGPoint?: unknown;
    SVGTransform?: unknown;
  };

  if (!svgWin.SVGAngle) {
    // Truthiness gate only (`!!window.SVGAngle`).
    svgWin.SVGAngle = class {};
  }
  if (!svgWin.SVGMatrix) {
    svgWin.SVGMatrix = JointSVGMatrix;
  }
  if (!svgWin.SVGPoint) {
    svgWin.SVGPoint = JointSVGPoint;
  }
  if (!svgWin.SVGTransform) {
    svgWin.SVGTransform = JointSVGTransform;
  }

  // Prototype patches are intentionally loosely typed: jsdom's DOM-lib stubs
  // (SVGTransform / DOMRect / DOMMatrix) have stricter shapes than the minimal
  // polyfills JointJS needs, and conformance checks would reject them.
  // Bracket access: the prototypes are typed as index-signature records.
  const svgProto = win.SVGSVGElement?.prototype as unknown as Record<string, unknown> | undefined;
  if (svgProto) {
    if (typeof svgProto['createSVGMatrix'] !== 'function') {
      svgProto['createSVGMatrix'] = () => new JointSVGMatrix();
    }
    if (typeof svgProto['createSVGPoint'] !== 'function') {
      svgProto['createSVGPoint'] = () => new JointSVGPoint();
    }
    if (typeof svgProto['createSVGTransform'] !== 'function') {
      svgProto['createSVGTransform'] = () => new JointSVGTransform();
    }
    if (typeof svgProto['createSVGTransformFromMatrix'] !== 'function') {
      svgProto['createSVGTransformFromMatrix'] = (matrix: unknown) => {
        const transform = new JointSVGTransform();
        transform.matrix = matrix as JointSVGMatrix;
        return transform;
      };
    }
  }

  const graphicsProto = win.SVGGraphicsElement?.prototype as unknown as
    Record<string, unknown> | undefined;
  if (graphicsProto) {
    if (typeof graphicsProto['getBBox'] !== 'function') {
      graphicsProto['getBBox'] = () => ({ x: 0, y: 0, width: 0, height: 0 });
    }
    if (typeof graphicsProto['getCTM'] !== 'function') {
      graphicsProto['getCTM'] = () => new JointSVGMatrix();
    }
    if (typeof graphicsProto['getScreenCTM'] !== 'function') {
      graphicsProto['getScreenCTM'] = () => new JointSVGMatrix();
    }
    // jsdom exposes no `transform` SVGAnimatedTransformList; JointJS only
    // consolidates it (getNodeMatrix) and treats null as "no transform".
    if (graphicsProto['transform'] === undefined) {
      Object.defineProperty(graphicsProto, 'transform', {
        configurable: true,
        get(): JointTransformList {
          return new JointTransformList();
        },
      });
    }
  }

  // jsdom lacks `Element.prototype.checkVisibility`; JointJS uses it to decide
  // whether a link label's magnet is visible. Treat everything as visible.
  const elementProto = win.Element?.prototype as unknown as Record<string, unknown> | undefined;
  if (elementProto && typeof elementProto['checkVisibility'] !== 'function') {
    elementProto['checkVisibility'] = () => true;
  }
};

install();
