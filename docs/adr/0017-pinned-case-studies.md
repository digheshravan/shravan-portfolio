# ADR 0017: Pinned case studies replace the horizontal rail

- **Status:** Accepted
- **Date:** 2026-08-20

## Context

The Work section was one shared horizontal rail: a single `ScrollTrigger`
pinned the whole section and translated a track sideways, one screen-width
slot per project, with a `DeviceMock` screenshot per card and a
`ProjectModal` for deep detail. It depicted each project the same way — a
flat mockup beside generic copy — and the 3D behind it only ever showed one
beat per project (`beats[0]`), never progressing through a pipeline.

## Decision

Four independent `ScrollTrigger`s, one per project, each with `pin: true`.
GSAP releases one and the next scrolls up to take its place natively — no
shared master timeline, so adding, removing, or reordering a project only
touches its own trigger.

Within a project's pin, scroll progress continuously scrubs through that
project's own `PROJECT_SCENES` beat array via `beginCase()`/`scrubCase()`
(ADR-0012): `beginCase` fires once when the pin becomes active, carrying the
scene's just-settled visual state forward as the crossfade source so the
incoming project blends in rather than snapping cold; `scrubCase` writes
cheaply on every scroll tick, no tween spawned per frame. Pin distance
scales with pipeline length — `(steps − 1) × viewport height` — so IPO Risk
Decoder's six-step pipeline gets proportionally more scroll room than
DocMind's four.

The case panel carries no screenshot and no modal: title, kind, summary, the
pipeline as an ordered list (the current step highlighted in place as the
pin scrubs), metrics from `PROJECTS[].metrics` as mono readouts, stack
chips, and a repository link (or an honest "still in development" note when
`repo` is `null`). The 3D behind it *is* the visual for what the project
does; deep detail stays the actual repository.

Mobile (≤900px) and reduced motion get no pin at all — a plain vertical
stack, pipeline rendered as a normal ordered list, with a lighter first-beat
reaction per project on mobile rather than the full scrubbed sequence (which
needs the pin to make scroll position mean "how far through," not just
"which project").

## Consequences

- `DeviceMock.jsx` and `ProjectModal.jsx`, and their CSS (roughly 1,000
  combined lines across `ui.css` and `sections.css`), are deleted — kept
  through an earlier cleanup pass specifically because `Work.jsx` still
  depended on them, removed only once this rebuild stopped importing either.
- Carries ADR-0006/0007's pin constraints forward exactly: `#work` carries
  no `data-panel` (which would apply a `rotateX`/`z` transform to it,
  breaking `position: fixed` math for every pin nested inside); `SectionHead`'s
  `data-parallax` header renders as a sibling of the pinned `.case` elements,
  never their ancestor; distance is measured via `offsetHeight` and
  `document.documentElement.clientHeight`, never `scrollWidth` or `100vh`;
  the measured height is pushed to CSS as `--step-h` and re-set in
  `onRefreshInit` so a window resize can't leave a pin measuring a stale
  viewport.
- `ScrollTrigger.refresh()` is idempotent — verified by calling it three
  times in a row and confirming identical trigger positions each time.
- Verified end to end: all four projects' step counts (4/6/4/4) match their
  `pipeline` arrays exactly; a deliberate beat/pipeline length mismatch was
  confirmed to throw via `assertScenesMatchContent()` (ADR-0012) and then
  restored; the crossfade continuity math (`formA` reassigned only on
  segment change) was confirmed exact against the expected progress formula
  at multiple checkpoints.
