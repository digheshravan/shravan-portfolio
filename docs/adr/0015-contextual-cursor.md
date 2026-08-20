# ADR 0015: The cursor is a contextual dot — supersedes ADR-0009's instrument reticle

- **Status:** Accepted — supersedes the reticle/HUD decision recorded in ADR-0009 (ADR-0009's core rule, that the native cursor is never hidden, is restated below, not overturned)
- **Date:** 2026-08-20

## Context

ADR-0009's reticle carried a coordinate HUD reporting the pointer's
normalised device coordinates because that number was literally the value
deforming the old artifact's shader (`uMouse`). With that object gone
(ADR-0010), the HUD has nothing left to explain — carrying it forward would
make it decoration competing with the visual system it used to describe,
rather than a readout of anything real.

What ADR-0009 already settled still holds, unchanged: the native cursor is
never hidden. It's the one element a visitor trusts to know where they are;
removing it turns every frame of replacement lag into the page feeling
broken. Only the reticle and HUD built around that cursor are being
replaced here.

## Decision

`src/components/Cursor.jsx` — a small dot, additive to the native cursor:

- Tracks tightly via `gsap.quickTo` (0.18s).
- Scales to 1.6× and tints toward the accent (ADR-0014) near anything
  matching `[data-cursor-label]`, `[data-cursor]`, `a`, or `button`.
- Shows a trailing label — offset +20px, 0.32s lag so it never fights the
  dot for the same point — only where `data-cursor-label` is declared on
  the target.
- Shrinks to 0.65× on pointerdown.
- Bails entirely on coarse pointers (`pointer: coarse`) and reduced motion.

Hover affordances stay declared in markup (`data-cursor`,
`data-cursor-label`), the same decoupling ADR-0009 established — the cursor
still doesn't need to know what it's hovering, only that the attribute is
there.

## Consequences

- Deleting `Cursor.jsx` changes nothing functional — the same test
  ADR-0009 proposed for the reticle still applies to the dot.
- No coordinate HUD, no NDC readout — nothing on screen claims to report a
  number that isn't actually driving something.
- The cursor no longer needs `pointer.x`/`pointer.y` from the shared motion
  state for a HUD; it tracks the raw DOM pointer events itself.
