# ADR 0009: The native cursor is never hidden

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The first implementation did what most award-style sites do: `cursor: none` on
everything, replaced by a custom dot and ring.

This was rejected after use. The native cursor is the one element a visitor
trusts to tell them where they are. Removing it means every frame of lag in the
replacement reads as the *page* being broken, and on any hitch the visitor is
genuinely lost. It is the fastest way to make a site feel hostile, and it costs
accessibility for a purely decorative gain.

The brief was explicit: modern, but not something that makes a visitor
miserable.

## Decision

The system cursor stays visible and authoritative. Everything drawn is additive
decoration around it:

- An **instrument reticle** — a CSS-3D ring carrying its own
  `transformPerspective`, banking on Y and pitching on X in proportion to
  pointer velocity, so it leans into movement like a gimbal and levels at rest.
- **Crosshair arms drawn with a transparent gap at the centre**, specifically so
  the system arrow reads through them rather than being buried.
- A **coordinate HUD** reporting the pointer in normalised device coordinates —
  the same −1 → 1 space the shaders use for `uMouse`. The number on screen is
  the value currently deforming the artifact, which ties the cursor to this
  portfolio rather than being generic chrome.

Interactive elements keep the normal `cursor: pointer`. Touch devices and
reduced-motion get nothing.

## Consequences

- Deleting `Cursor.jsx` changes nothing functional. That is the test of whether
  it has stayed decoration.
- The halo must start at `opacity: 0` in CSS, because under reduced motion the
  script returns before it would otherwise hide it — otherwise it strands itself
  in the top-left corner.
- The HUD reads `pointer.x` / `pointer.y` from the shared motion state
  (ADR-0002), so it costs no extra tracking.
- Hover affordances are declared in markup via `data-cursor` and
  `data-cursor-label`, keeping the cursor decoupled from the components it
  reacts to.
