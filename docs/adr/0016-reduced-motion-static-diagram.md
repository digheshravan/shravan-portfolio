# ADR 0016: Reduced motion gets a static system diagram, not an empty page

- **Status:** Accepted — closes the gap ADR-0003 recorded (ADR-0003 stays Accepted; this doesn't supersede it)
- **Date:** 2026-08-20

## Context

ADR-0003 established reduced motion as a first-class branch, and warned
explicitly against a page that goes calm by going empty. For a period during
the rebuild, that's exactly what the 3D layer's reduced-motion path was — a
plain CSS gradient behind the page, standing in for the whole visual system.
It read as absence, not calm.

## Decision

`src/components/StaticField.jsx` — a plain, static `<svg>`: no WebGL, no
JS-driven position updates, no CSS animation. It reuses the "four domains
converging on a shared centre" composition from the Intersection section
(rows, nodes, an inward-elbow link into a lit centre point), because that
idea is true of the whole page, not just one section. Coordinates are
hand-placed rather than derived from the GLSL formation math — a deliberate
choice, since a one-time static image doesn't need that machinery — but the
vocabulary and the vermillion accent (ADR-0014) match the live system
exactly.

`Scene.jsx` renders `StaticField` in place of the `Canvas` whenever
`tier === 'minimal'`, and `App.jsx`'s `Suspense` fallback renders it too, so
the lazy-loaded canvas chunk's loading window doesn't show a bare gradient
before popping into the real fallback.

Tier detection, and everything downstream of it, has to see *both* signals
that mean "reduced motion": the real OS `prefers-reduced-motion` setting,
and the site's own `?motion=reduced` URL override (`prefersReducedMotion()`
in `motionState.js` is the one function that checks both). A raw
`@media (prefers-reduced-motion: reduce)` CSS rule only ever sees the first
— it can't see the URL override at all. Where that gap mattered for actual
layout (the pinned Work case studies, ADR-0017, needing their compact
stacked layout under `?motion=reduced` regardless of viewport width),
`App.jsx` exposes the JS-resolved state to CSS as an `html.reduced-motion`
class — the same pattern `is-loading`/`menu-open`/`modal-open` already use
to bridge JS state into CSS, not a second, parallel detection system.

## Consequences

- Reduced motion means "the same system, expressed without motion," not
  "no visual system."
- Everything rAF/GSAP/Lenis-driven that has nothing to do while
  `StaticField` is showing is gated off rather than left running unseen:
  `usePointerTracking`'s loop never starts, `useSmoothScroll` never
  instantiates Lenis, Nav's intro and hide-on-scroll animations skip to
  their end state, and `useFrameloopGate` (ADR-0013) never runs its
  listeners at all — there's no `Canvas` for it to gate.
- Work's pin (ADR-0017) is disabled under reduced motion at *any* viewport
  width — verified specifically because the `html.reduced-motion` class
  closes the exact gap a plain media query would have missed at desktop
  widths under the URL override.
- `docs/adr/0003-reduced-motion-is-a-branch.md` is not superseded — this
  ADR fulfils a gap that one explicitly flagged as open, it doesn't replace
  its decision.
