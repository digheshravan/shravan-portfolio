# Architecture Decision Records

Decisions that shaped this portfolio, and the reasoning behind them. Several
were forced by bugs that reached production — those are written up with the
symptom, because the symptom is the cheapest way to recognise the problem if it
ever comes back.

Format follows Michael Nygard's template: **Context → Decision → Consequences**.

| # | Title | Status |
|---|-------|--------|
| [0001](0001-single-clock-for-scroll.md) | A single clock drives Lenis, GSAP and ScrollTrigger | Accepted |
| [0002](0002-frame-rate-state-outside-react.md) | Per-frame state lives outside React | Accepted |
| [0003](0003-reduced-motion-is-a-branch.md) | Reduced motion is a first-class branch with an explicit override | Accepted |
| [0004](0004-preloader-must-not-trap.md) | The preloader must never be able to trap a visitor | Accepted |
| [0005](0005-portal-overlays-above-chrome.md) | Overlays that must sit above the chrome are portalled to `<body>` | Accepted |
| [0006](0006-per-element-perspective.md) | 3D section transitions carry their own perspective | Accepted |
| [0007](0007-measure-layout-not-overflow.md) | Scroll-driven geometry is measured from layout, not overflow | Accepted |
| [0008](0008-custom-glsl-hero.md) | The hero artifact is custom GLSL, not a stock material | Accepted |
| [0009](0009-never-hide-the-cursor.md) | The native cursor is never hidden | Accepted |

## Conventions

- Numbering is sequential and permanent. Never renumber.
- A decision that is replaced becomes **Superseded by ADR-NNNN**; the original
  text stays as written. The record is the history, not the current state.
- Amend an ADR only to correct a factual error, not to revise the reasoning.

## Reading order for a newcomer

0001 and 0002 explain how motion is wired at all; everything else assumes them.
0003 is the one most likely to surprise you — it changes what the site *is* on
a large share of machines.
