# ADR 0004: The preloader must never be able to trap a visitor

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The preloader is a full-screen overlay, and while it is up `is-loading` on
`<html>` disables scrolling. The rest of the site is behind it.

Originally the overlay lifted only when a GSAP timeline reached its final frame.
GSAP is driven by `requestAnimationFrame`, which browsers throttle to near zero
in background tabs and on low-power devices. If that timeline stalled, there was
no other path to completion.

**This shipped and was hit in production.** Seven seconds after load on the live
site: `is-loading` still set, overlay still at `display: grid`, hero fully
rendered underneath but unreachable, scrolling disabled. The site appeared not
to load at all. There was no escape hatch of any kind.

## Decision

Completion is idempotent and reachable from three independent places:

1. The timeline's own `onComplete` — the normal path.
2. A **`setTimeout` watchdog** at 6s. `setTimeout` keeps running when
   `requestAnimationFrame` does not; that is the entire reason it is the escape
   hatch rather than another animation callback.
3. **`visibilitychange`**, so a tab returning from being throttled releases
   immediately rather than waiting out the watchdog.

A `done` flag makes the three paths safe to race.

## Consequences

- The site can no longer be gated behind an animation completing. This is the
  general principle, not a one-off fix.
- The watchdog is 6s against a ~4.4s timeline — enough margin that it never
  fires on a healthy load, short enough that a stalled one is not fatal.
- The rule generalises: **anything that blocks the whole page must have a
  wall-clock escape hatch that does not depend on the mechanism it is gating.**
  Apply this to any future intro, transition or gate.
- The preloader's visual timing and its completion are now separate concerns,
  so changing the animation cannot reintroduce the trap.
