# ADR 0005: Overlays that must sit above the chrome are portalled to `<body>`

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The project detail modal is authored inside the Work section, which is natural —
it belongs to that feature and reads from its data.

But `.main` sets `z-index: 2` and `position: relative`, which creates a
**stacking context**. Any `z-index` on a descendant is resolved *within* that
context. The modal carried `z-index: 55`, the nav carries `z-index: 50`, and yet
the nav painted on top: 55 inside a context stacked at 2 loses to 50 outside it.

**Symptom in production:** the modal's close button did nothing.
`document.elementFromPoint()` at the button's centre returned the **nav**, not
the button. The button was visible, correctly positioned, and had
`pointer-events: auto` — it simply was not the element receiving the pointer.
No amount of raising the modal's `z-index` could have fixed it.

## Decision

The modal renders through `createPortal(..., document.body)`, escaping `.main`'s
stacking context entirely, and uses a dedicated `--z-modal: 80` token placed
above the nav and grain but below the loader and cursor.

## Consequences

- The modal is a sibling of the app root, so its `z-index` competes on the same
  terms as the nav, rail and cursor.
- Focus management, scroll locking and Escape handling must be explicit, since
  the DOM position no longer implies containment. All three are implemented.
- The rule generalises: **any overlay expected to cover the site chrome must be
  portalled.** Raising `z-index` inside `.main` will never work, and the failure
  is silent — the element renders, it just cannot be clicked.
- `z-index` tokens live in one place (`base.css`) precisely so this ordering is
  reviewable rather than discovered by debugging.
