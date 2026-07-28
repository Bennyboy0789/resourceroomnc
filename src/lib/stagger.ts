/**
 * Per-item delay for grids and rails.
 *
 * Lives outside the Reveal module because most callers are server components:
 * anything exported from a `"use client"` file becomes a client reference and
 * cannot be *called* during server rendering, only rendered or passed as props.
 *
 * The cap is deliberate. In a horizontal rail the tenth card may be far off
 * screen, and an uncapped `index * step` would leave it waiting through a delay
 * whose beginning nobody ever saw.
 */
export function stagger(index: number, step = 0.07, max = 5) {
  return Math.min(index, max) * step;
}
