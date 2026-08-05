# ADR 0001: A single clock drives Lenis, GSAP and ScrollTrigger

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The site combines three systems that each want to own the frame loop:

- **Lenis** smooths the scroll position and normally runs its own
  `requestAnimationFrame` loop.
- **GSAP** has a ticker, also `requestAnimationFrame`.
- **ScrollTrigger** reads scroll position to drive scrubbed timelines and pins.

Left to their own devices these run on separate ticks. ScrollTrigger then reads
a scroll value that Lenis has already moved on from, which shows up as pinned
sections juddering by a frame and scrubbed animations lagging behind the wheel.

## Decision

One clock, in this order:

1. GSAP's ticker drives Lenis — `gsap.ticker.add((time) => lenis.raf(time * 1000))`.
2. Lenis's `scroll` event calls `ScrollTrigger.update()`.
3. `gsap.ticker.lagSmoothing(0)` is disabled so GSAP does not silently
   compensate for long frames and desynchronise from Lenis.

Lenis is configured with `lerp` rather than `duration` + `easing`. A
duration-based tween restarts on every wheel tick, so a burst of ticks keeps
interrupting itself and the motion stutters; `lerp` eases toward a moving target
continuously, which is what makes a long scroll feel like one gesture.

## Consequences

- Everything scroll-driven is frame-accurate against everything else.
- `useSmoothScroll` becomes load-bearing infrastructure. It is not optional
  polish, and changing its wiring can break pinning across the whole site.
- Lenis is stopped, not unmounted, when an overlay opens — see ADR-0005.
- Nested scroll containers need `data-lenis-prevent`, because Lenis intercepts
  wheel and touch at the window level and keeps doing so while stopped. Without
  it a nested container receives no events at all and simply cannot scroll.
- When reduced motion is active Lenis is never constructed, so a native `scroll`
  listener has to publish position into the shared state instead — otherwise
  every scroll-driven element freezes at zero. See ADR-0003.
