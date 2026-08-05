# ADR 0008: The hero artifact is custom GLSL, not a stock material

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The hero object needed to be the identity of the site: an iridescent, organically
deforming shape that reacts to scroll and cursor.

The off-the-shelf routes were considered:

- **`MeshDistortMaterial`** (drei) — cheap, but the distortion is generic and
  every site using it looks the same.
- **`MeshTransmissionMaterial`** — beautiful glass, but it re-renders the scene
  to a buffer each frame. On a page already spending its budget on a large
  vertex count, and on mid-range mobile GPUs, that is not affordable.

Neither gives control over the surface's *character*, which is the point.

## Decision

A custom `ShaderMaterial` on an icosahedron:

- **Vertex** — fbm-driven displacement along the normal, blending a smooth field
  with a ridged one via a `uMorph` uniform so the object changes character as the
  page scrolls. Amplitude responds to scroll velocity.
- **Fragment** — fresnel-driven iridescence from a cosine palette, tinted toward
  the brand triad rather than a generic rainbow, plus two studio key lights and
  a noise dither to stop wide-gamut banding.

**Normals are rebuilt after displacement** using finite differences across a
tangent basis. This is the detail that matters: reusing the original sphere
normals leaves the lighting sliding across a surface that has moved underneath
it, and the object reads as plastic rather than metal.

Geometry detail is tiered — 36 subdivisions on `high`, 20 on `low`, 12 on
`minimal`.

## Consequences

- The look is specific to this site and tunable from uniforms rather than
  material props.
- The cost is understood and bounded: ~15 noise evaluations per vertex (fbm at
  four octaves, evaluated three times for the finite differences), which is ALU
  work GPUs handle well and no render-target churn.
- The shader is the hardest part of the codebase to modify safely. The tangent
  basis guards against degenerating at the poles, and the normal is flipped when
  `cross()` produces an inward result on some tessellations — both are load
  bearing and easy to break.
- The particle field shares the same `simplex3d` chunk deliberately, so the dust
  drifts on the same field as the artifact and the two read as one material.
