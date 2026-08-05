# ADR 0002: Per-frame state lives outside React

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

Scroll progress, scroll velocity and pointer position change every frame, and
they are read by both layers of the site:

- the DOM layer (rail, progress bar, marquee skew, cursor readout), and
- the WebGL layer, inside `useFrame`, which runs outside React's render cycle.

Holding these in `useState` would re-render the component tree 60+ times a
second. Passing them down as props would re-render every consumer on every
frame. Both are ruinous for a page that is already spending its budget on a
vertex shader.

## Decision

`src/lib/motionState.js` exports plain mutable singletons — `scroll`, `pointer`,
`stage`, `quality` — that are written by the input layer and read directly by
whoever needs them, including inside `useFrame`.

React state is reserved for things that genuinely change the rendered tree:
which project modal is open, whether the preloader has finished, which nav item
is active.

## Consequences

- No re-render pressure from motion. The WebGL layer reads the same numbers the
  DOM layer does, so the two stay visually coherent for free.
- The graph shows `lib` with **22 inbound calls and 0 outbound** — it is a true
  leaf dependency, which is what makes it safe to import from anywhere.
- These values are deliberately **not** reactive. A component that needs to
  re-render when they change must subscribe some other way (a ticker callback
  writing to the DOM directly is the pattern used throughout).
- Anything reading them must tolerate being called before the first write, so
  every field has a sensible zero value.
- Because the state is global and mutable, tests and Strict Mode double-invokes
  can observe values from a previous mount. Effects that own a field reset it.
