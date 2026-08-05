# ADR 0006: 3D section transitions carry their own perspective

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

Each section arrives out of depth, rotates flat as it takes the screen, and tips
back as it leaves. That needs a perspective origin.

The obvious approach — `perspective` on a shared ancestor — fails on a long
page. The vanishing point sits at the centre of the ancestor, so for a document
around 9,000px tall most sections are thousands of pixels away from it. Elements
that far off-axis do not rotate; they **shear**. The effect looks like a
skew bug rather than a rotation.

## Decision

Perspective is applied per element, via GSAP's `transformPerspective`, which
writes `perspective()` into the element's own transform. Each panel's vanishing
point is therefore its own centre.

`force3D` is deliberately left at GSAP's default `"auto"`, so a panel uses
`matrix3d` only while its values are moving and drops back to a 2D matrix at
rest. Verified: a settled panel's computed transform is just
`perspective(1500px)` with `opacity: 1` — no residual 3D matrix to blur the type
while it is being read.

The horizontal rail is the exception: its cards share one `perspective: 1800px`
on the track, because there they genuinely are a row of objects passing a single
fixed viewpoint.

## Consequences

- Sections can be transformed anywhere on the page without distortion.
- Type stays sharply rasterised at rest, which matters because these panels are
  full of body copy.
- Panels must settle at **exactly** identity. Any residual rotation or Z leaves
  text rendered through a 3D matrix for the whole time it is on screen.
- A pinned element cannot be nested inside a transformed ancestor —
  `position: fixed` resolves against the transform instead of the viewport.
  This is why the Work section carries no `data-panel`: its horizontal pin and
  the 3D panel treatment are mutually exclusive.
