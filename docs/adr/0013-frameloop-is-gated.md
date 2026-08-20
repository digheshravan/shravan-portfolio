# ADR 0013: The frameloop is gated

- **Status:** Accepted
- **Date:** 2026-08-20

## Context

The R3F `<Canvas>` defaulted to `frameloop="always"` — full-rate WebGL
rendering for the entire time the page is open, including a backgrounded
browser tab and long stretches where nothing on screen is actually moving.
For a page whose canvas sits behind a ~9,000px scroll, that's the largest
uncontested perf cost in the render path.

## Decision

`useFrameloopGate(ready)` (`src/hooks/useFrameloopGate.js`) returns one of
three modes, read by `Scene.jsx` and passed straight through as the
Canvas's `frameloop` prop:

- **`never`** — the tab is hidden (`document.hidden`), or the preloader is
  still up (`!ready`, nothing to show yet). Zero frames render.
- **`always`** — scroll, pointer movement, or wheel input happened
  recently.
- **`demand`** — none of the above for 1.2s. In this mode R3F renders
  nothing unless explicitly invalidated.

Reduced motion never runs the gate at all — `Scene.jsx`'s minimal tier
renders `StaticField` (ADR-0016) instead of a `Canvas`, so there's nothing
for it to gate.

`demand` mode alone would freeze mid-crossfade, since scroll and pointer
input aren't the only thing that can still be moving the scene — a
section-to-section beat transition (`animateToBeat()`, ADR-0012) is a GSAP
tween that isn't tied to either. `<Invalidator/>`, mounted only while
`frameloop === 'demand'`, watches `gsap.isTweening(scene)` on its own
`requestAnimationFrame` loop (independent of R3F's, since R3F's own loop is
exactly what's paused) and calls `invalidate()` while a tween is running,
plus an 800ms settle window afterward so each primitive's own per-frame
`damp()` has time to close the gap. Every primitive already clamps its
`delta` to a 0.05s ceiling, which is what makes a long gap between
`demand`-mode renders safe — the damping takes as many logical steps to
converge as it always would, regardless of how much wall-clock time passed
between them.

## Consequences

- **Verified**: the gate's own state transitions (`never` → `always` →
  `demand`) were confirmed correct by reading the value actually committed
  to the `Canvas`/`CanvasImpl` fiber's `memoizedProps.frameloop` — not by
  trusting rendered pixels, which this sandbox's `document.visibilityState`
  quirk makes an unreliable signal on its own. All three transitions
  reproduced correctly, including settling into `demand` after idling.
- **Not verified — explicitly**: whether `<Invalidator/>` actually causes a
  visible mid-tween re-render in `demand` mode could not be confirmed in
  this sandbox. A real `ScrollTrigger`-driven beat transition was fired and
  canvas pixels sampled before and after; nothing changed — but a control
  test showed why that result is inconclusive rather than negative: a plain
  GSAP tween's own `progress()` stayed at `0` after 300ms in the same tab,
  meaning GSAP's `requestAnimationFrame`-driven ticker itself never ticked
  there. The Invalidator's logic (`gsap.isTweening(scene)` gating an
  `invalidate()` call) is straightforward and was verified in isolation as
  correct GSAP API usage, but its live runtime behaviour during an actively
  ticking tween has not been visually confirmed and should not be read as
  such.
- Frameloop mode is decoupled from tier — `minimal` never has a Canvas to
  gate; `low`/`high` both get the same gating logic.
