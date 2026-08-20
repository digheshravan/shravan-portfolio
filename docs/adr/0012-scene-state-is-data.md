# ADR 0012: Scene state is data, not components

- **Status:** Accepted
- **Date:** 2026-08-20

## Context

The page needs to reconfigure the 3D vocabulary (ADR-0010) dozens of times —
once per section, once per project, continuously while scrubbing through a
pinned case study's pipeline (ADR-0017) — without a mount/unmount, a shader
recompile, or a React re-render on every scroll tick. ADR-0002 already
established the pattern for this (scroll and pointer state live outside
React); this extends it to the composition of the scene itself.

## Decision

`src/lib/sceneState.js` holds one mutable singleton, `scene`: per-primitive
`{formA, formB, amt}`, plus `blend`, `active`, `opacity`, `slug`, `step`.
Each primitive's own `useFrame` reads it directly and damps toward it —
`scene` is never React state.

Four functions write to it, each suited to a different trigger:

- **`applyBeat(beat)`** — instant, no crossfade. Used once, for the very
  first paint, since a component whose frameloop hasn't ticked yet must
  still paint correctly.
- **`animateToBeat(beat, duration)`** — a GSAP tween on `scene.blend`,
  0→1. Carries `formA = current formB` first, so the crossfade always
  starts from wherever the scene is actually sitting, not a hard cut. Drives
  every section-to-section and mobile/reduced-motion project transition.
- **`beginCase(slug)`** — fires once when a pinned case study's pin becomes
  active. Same `formA = formB` continuity trick, applied as a one-time
  snapshot rather than a tween, plus a captured "entry" state for the
  segment that follows.
- **`scrubCase(beats, progress, cursor)`** — fires on every scroll tick
  inside a pin. Cheap direct arithmetic only (a lerp per primitive key, no
  allocation, no tween) — maps continuous scroll progress onto the two
  adjacent beats in that project's `PROJECT_SCENES` array it's currently
  between, reassigning `formA` only when the segment boundary is actually
  crossed.

`src/data/scenes.js` holds the beat data: `SECTION_BEATS` for the page's own
arc, `PROJECT_SCENES[slug]` for each project's pipeline, positionally keyed
to that project's `pipeline` array in `content.js` — which stays the single
source of truth for the visible labels. A dev-only `assertScenesMatchContent()`
throws if a project's beat count and pipeline-label count ever diverge,
rather than drifting silently.

## Consequences

- Switching sections or projects writes on the order of ten numbers. No
  disposal, no shader recompile, no React render in the hot path.
- `scrubCase`'s "reassign `formA` only on segment change" rule is what
  keeps a fast scroll flick through several pipeline steps landing on a
  coherent pair rather than a stale one.
- `assertScenesMatchContent()` was verified to actually throw (not just log)
  by deliberately shortening one project's beat array during Step 9
  verification and confirming the app fails loudly rather than silently
  rendering three formations for a four-label pipeline.
- Anything that wants to react to "which project, how far through" can read
  `scene.slug` / `scene.step` — written by `beginCase`/`scrubCase` — without
  needing to know how the scrub itself works.
