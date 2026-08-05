# ADR 0003: Reduced motion is a first-class branch with an explicit override

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The site's entire identity is motion: a WebGL artifact, 3D section transitions,
a pinned horizontal rail, smooth scroll. All of that is exactly what
`prefers-reduced-motion: reduce` exists to suppress.

This is not a rare edge case. On Windows the setting flips on from **Battery
Saver** alone, and from vendor "performance" utilities — so a meaningful share
of visitors arrive with it set without ever having chosen it. The author's own
machine had it enabled, which is how this was discovered: the deployed site
looked broken to them while being entirely correct.

Honouring the preference *silently* also makes the site impossible to demo, and
impossible to debug, on any machine that has it on.

## Decision

Reduced motion is a branch that every animated component checks, via one shared
`prefersReducedMotion()` helper — currently **15 call sites**, the most
depended-on symbol in the codebase.

A URL override sits in front of the media query:

- `?motion=full` — opt back into the full experience
- `?motion=reduced` — preview the calm version on any machine

Quality tiers (`high` / `low` / `minimal`) are derived from the same signal plus
device capability, and written into the shared `quality` singleton so the Canvas
can size itself accordingly.

## Consequences

- The calm path is a real, maintained rendering of the site, not a degraded
  accident. It must be checked whenever motion changes.
- Every scroll-driven element needs a non-Lenis source of scroll position, or it
  freezes at zero when smoothing is off (see ADR-0001).
- Elements whose visible state is *established* by JS must start hidden in CSS,
  or they strand themselves when the JS deliberately does not run. The cursor
  halo and the timeline spine dot both start at `opacity: 0` for this reason.
- The override is a query parameter, not a persisted setting. Persisting it
  would silently overwrite a genuine accessibility preference for every later
  visit, which is worse than the inconvenience it saves.
- The CSS kill-switch (`transition-duration: 0.01ms !important` under the media
  query) is **not** affected by `?motion=full` — a query parameter cannot
  override a media query. This is harmless but confusing when debugging.

## Known gap

The current `minimal` tier removes the WebGL scene entirely, so reduced-motion
visitors get plain text on a dark background — the page reads as empty rather
than calm. The guideline is to reduce *motion*, not remove *content*. A better
fallback would keep the artifact on screen and essentially still, dropping only
the scroll-driven camera travel, panel rotation, parallax and skew. Not yet
implemented.
