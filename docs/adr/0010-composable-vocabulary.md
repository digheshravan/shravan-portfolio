# ADR 0010: The visual identity is one composable vocabulary, not one object

- **Status:** Accepted — supersedes ADR-0008
- **Date:** 2026-08-20

## Context

The site's identity was a single iridescent, noise-displaced icosahedron
(ADR-0008). It was technically accomplished but conceptually generic: the
object said nothing about the work behind it, and the same shape could sit
behind any developer's portfolio. Reviewed against the actual thesis —
turning complexity into usable systems, the pattern behind every project on
the CV — a single decorative object couldn't depict that argument. It could
only sit near it.

## Decision

Four instanced primitives, each meaning something specific rather than one
shape recoloured:

- **Rows** — information: records, lines, a corpus, raw material.
- **Nodes** — entities: a service, a store, a decision point. Drawn as a
  hairline square outline, not a filled dot, deliberately (a filled dot is
  the particle-network vocabulary; ADR-0011 covers why that distinction
  matters).
- **Links** — flow: a request, a retrieval hop, a dependency. Computed from
  the same `nodePos()` function the Nodes primitive uses, so a link can
  never drift off its endpoints when a formation changes.
- **Layers** — architectural strata: tiers, planes, documents.

Each primitive is one `InstancedMesh`, geometry and attributes declared as
r3f children rather than passed via a `geometry` prop — that's what lets r3f
own and dispose them, instead of hand-managing a `BufferGeometry`. Four
unlit shaders share one uniform block (`uFormA`, `uFormB`, `uBlend`,
`uActive`, `uAmt`, `uOpacity`) and one mutable state singleton (ADR-0012).

A **formation** is a named GLSL function — `SCATTER`, `ALIGN`, `DISTILL`,
`BARS`, `STRATA`, `PIPE`, `CLUSTER4`, `LATTICE`, `RESOLVE` — describing where
an instance sits for a given moment in the arc from complexity to a resolved
system. Each shader evaluates exactly two formations (`uFormA`/`uFormB`) and
mixes on `uBlend`, so a beat change is a uniform crossfade, not a remount.

Instance budget is tiered: 2048/40/16/8 (rows/nodes/links/layers) on `high`,
900/24/10/6 on `low`. Unlit by design — no normal reconstruction after
displacement, no tangent basis, no `cross()` orientation flip, none of the
hazards ADR-0008 had to guard against, because there's no lit, deforming
surface left to guard.

## Consequences

- Four draw calls total, no post-processing composer (Bloom/ChromaticAberration
  were tuned for the iridescent chrome this replaces; an unlit hairline system
  doesn't want the glow, and the vignette's job is already done free by the
  CSS `.atmosphere` layer).
- Switching what the scene shows is a data write (ADR-0012), not a
  mount/unmount — the same four meshes stay alive for the whole page and
  every project case study.
- `three/Artifact.jsx`, `three/Particles.jsx`, and their GLSL chunks are
  deleted, not kept as an unused fallback path.
- The vocabulary composes differently per section and per project (see
  `src/data/scenes.js`) rather than repeating one motif recoloured — that
  composability is the point ADR-0008's single object couldn't reach.
