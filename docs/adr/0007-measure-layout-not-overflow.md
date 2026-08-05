# ADR 0007: Scroll-driven geometry is measured from layout, not overflow

- **Status:** Accepted
- **Date:** 2026-08-05

## Context

The Work rail pins and translates a horizontal track. Its travel distance was
computed the obvious way:

```js
const distance = () => track.scrollWidth - window.innerWidth
```

Two things are wrong with that line, and both shipped.

**1. `scrollWidth` includes the overflow created by the section's own
transforms.** The cards carry `rotateY` and `translateZ`, which project outside
their layout boxes. Measured: cards laid out at offsets 0 / 1440 / 2880 / 4320,
each exactly 1440 wide — `offsetWidth` **5760** — but `scrollWidth` reported
**5898**. The travel distance was therefore a function of the animation it was
supposed to be driving: a 138px feedback loop that made the rail overshoot, so
the last card never landed centred.

**2. `100vw` and `innerWidth` include the scrollbar.** Slots were 1440 wide
while the visible area was 1430, leaving every card ~10px off-centre.

A third trap sits nearby: the pinned element's own `clientWidth` is measured
before pinning is applied and lands ~10px out.

## Decision

- Travel is measured from **`offsetWidth`**, which reflects layout only and is
  unaffected by transforms.
- One "screen" is **`document.documentElement.clientWidth`** — it excludes the
  scrollbar and does not shift while pinning is applied.
- Slot width is pushed to CSS as a `--slot` custom property from that same
  measurement, re-set on `onRefreshInit`, with `100vw` only as a fallback.

Verified exact afterwards: every slot equals the screen width, travel equals
`(n - 1) × screenWidth` precisely, and the pin spacer equals
`viewportHeight + travel` to the pixel.

## Consequences

- Rail geometry is independent of the animation running on top of it. This is
  the general rule: **never measure a scroll driver with a property its own
  animation can inflate.**
- Slot sizing has a JS dependency. If `--slot` is not set, cards fall back to
  `100vw` and are marginally off-centre rather than broken.
- `invalidateOnRefresh` plus function-based `end` keeps resizes and font swaps
  correct, since all measurements are re-read on refresh.
- Any future scroll-driven measurement should prefer `offsetWidth` /
  `offsetHeight` / `documentElement.clientWidth` over `scrollWidth` /
  `innerWidth` for the same reasons.
