/**
 * Shared unit-test environment shims for specs that render @swimlane/ngx-graph.
 *
 * jsdom (the Vitest DOM) lacks a few browser globals the graph library relies on:
 * - `requestAnimationFrame` / `cancelAnimationFrame`: the force simulation ticks
 *   via d3-timer (which falls back to setTimeout), but the graph component calls
 *   rAF directly for post-tick work.
 * - `CSS.escape`: used by the graph component to build element-id selectors when
 *   repainting edge text paths.
 *
 * The shims are idempotent so importing this module from multiple spec files is safe.
 */

if (typeof globalThis.requestAnimationFrame !== 'function') {
  globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number =>
    window.setTimeout(() => callback(performance.now()), 0);
}
if (typeof globalThis.cancelAnimationFrame !== 'function') {
  globalThis.cancelAnimationFrame = (handle: number): void => window.clearTimeout(handle);
}

if (typeof globalThis.CSS === 'undefined') {
  (globalThis as { CSS?: object }).CSS = {};
}
if (!(globalThis.CSS as { escape?: (value: string) => string }).escape) {
  // Standard css.escape algorithm (ES2019), matching the WHATWG CSSOM spec.
  (globalThis.CSS as { escape?: (value: string) => string }).escape = (value: string): string => {
    const string = String(value);
    const length = string.length;
    let index = -1;
    let codeUnit;
    let result = '';
    const firstCodeUnit = string.charCodeAt(0);

    while (++index < length) {
      codeUnit = string.charCodeAt(index);

      // Null character: replace with the replacement character.
      if (codeUnit === 0x0000) {
        result += '\uFFFD';
        continue;
      }

      // Control characters and the first character of the string, if it is a digit.
      if (
        (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
        (codeUnit >= 0x007f && codeUnit <= 0x009f) ||
        (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039)
      ) {
        result += `\\${codeUnit.toString(16)} `;
        continue;
      }

      // If the character is the first character and is a `-` sign and there is
      // exactly one character, escape it.
      if (index === 0 && length === 1 && codeUnit === 0x002d) {
        result += `\\${string.charAt(index)}`;
        continue;
      }

      // If the character is not handled by one of the above rules and is:
      // - a high surrogate that is not followed by a low surrogate
      // - a non-character
      // - a control character
      // - a digit
      // - a letter
      // - a `-`, `_` or whitespace
      // then output the character itself.
      if (
        codeUnit >= 0x0080 ||
        codeUnit === 0x002d ||
        codeUnit === 0x005f ||
        (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
        (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
        (codeUnit >= 0x0061 && codeUnit <= 0x007a)
      ) {
        result += string.charAt(index);
        continue;
      }

      // Otherwise, escaped character.
      result += `\\${string.charAt(index)}`;
    }

    return result;
  };
}