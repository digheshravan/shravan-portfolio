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
| [0008](0008-custom-glsl-hero.md) | The hero artifact is custom GLSL, not a stock material | Superseded by [0010](0010-composable-vocabulary.md) |
| [0009](0009-never-hide-the-cursor.md) | The native cursor is never hidden | Superseded by [0015](0015-contextual-cursor.md) |
| [0010](0010-composable-vocabulary.md) | The visual identity is one composable vocabulary, not one object | Accepted |
| [0011](0011-architecture-not-network.md) | Nodes and links are architecture, never an ambient network | Accepted |
| [0012](0012-scene-state-is-data.md) | Scene state is data, not components | Accepted |
| [0013](0013-frameloop-is-gated.md) | The frameloop is gated | Accepted |
| [0014](0014-one-accent.md) | One accent, and it means "resolved" | Accepted |
| [0015](0015-contextual-cursor.md) | The cursor is a contextual dot | Accepted |
| [0016](0016-reduced-motion-static-diagram.md) | Reduced motion gets a static system diagram, not an empty page | Accepted |
| [0017](0017-pinned-case-studies.md) | Pinned case studies replace the horizontal rail | Accepted |

## Conventions

- Numbering is sequential and permanent. Never renumber.
- A decision that is replaced becomes **Superseded by ADR-NNNN**; the original
  text stays as written. The record is the history, not the current state.
- Amend an ADR only to correct a factual error, not to revise the reasoning.

## Reading order for a newcomer

0001 and 0002 explain how motion is wired at all; everything else assumes them.
0003 is the one most likely to surprise you — it changes what the site *is* on
a large share of machines.

0010–0017 describe the current visual system: 0010–0012 are the 3D vocabulary
and how it's driven; 0013 is the performance gate around it; 0014–0016 are the
palette, cursor and reduced-motion decisions; 0017 is the Work section. 0008
and 0009 are superseded but kept as written — read them if you want the
reasoning for what came before, not what's there now.
