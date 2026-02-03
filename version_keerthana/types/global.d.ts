/**
 * Ensure global JSX.IntrinsicElements exists so JSX elements type-check.
 * Uses a broad index signature so all HTML element names (div, p, input, etc.)
 * are valid when the IDE or resolver uses a different React types root.
 */
/// <reference path="../node_modules/@types/react/index.d.ts" />
/// <reference path="../node_modules/@types/react-dom/index.d.ts" />

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}
export {};
