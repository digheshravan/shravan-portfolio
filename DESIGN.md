---
name: Shravan Dige Portfolio
description: A near-black instrument panel where a single iridescent artifact is the only saturated thing at rest.
colors:
  ground: "#08080A"
  ground-soft: "#0D0D12"
  ground-lift: "#121219"
  ink: "#F2EFE9"
  ink-muted: "rgba(242, 239, 233, 0.64)"
  ink-quiet: "rgba(242, 239, 233, 0.40)"
  ink-faint: "rgba(242, 239, 233, 0.22)"
  hairline: "rgba(242, 239, 233, 0.10)"
  hairline-strong: "rgba(242, 239, 233, 0.18)"
  signal-violet: "#6C5CFF"
  instrument-cyan: "#35E0FF"
  readout-rose: "#FF6FB5"
  status-live: "#3ECF8E"
  status-learning: "#F5A524"
typography:
  display:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3.1rem, 14.4vw, 13.5rem)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.05em"
    fontVariation: "'wdth' 92"
  headline:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2.4rem, 7vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(1.3rem, 2.2vw, 1.85rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  body:
    fontFamily: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.98rem, 1.25vw, 1.16rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.62rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.16em"
  accent:
    fontFamily: "'Instrument Serif', Georgia, serif"
    fontSize: "1.1em"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
rounded:
  mark: "2px"
  data: "8px"
  panel: "16px"
  card: "18px"
  stage: "22px"
  full: "100px"
spacing:
  xs: "0.4rem"
  sm: "0.85rem"
  md: "1.4rem"
  lg: "2.2rem"
  gutter: "clamp(20px, 4.2vw, 72px)"
  section: "clamp(6rem, 14vh, 12rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.full}"
    padding: "0.95em 1.6em"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.95em 1.6em"
  chip:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.42em 0.85em"
  pill-live:
    backgroundColor: "rgba(53, 224, 255, 0.12)"
    textColor: "{colors.instrument-cyan}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.3em 0.7em"
  token-tile:
    backgroundColor: "rgba(242, 239, 233, 0.02)"
    textColor: "{colors.ink-quiet}"
    typography: "{typography.label}"
    rounded: "{rounded.data}"
    padding: "0.42em 0.85em"
  panel-card:
    backgroundColor: "{colors.ground-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(1.4rem, 2.4vw, 2.1rem)"
  nav-link:
    textColor: "{colors.ink-quiet}"
    typography: "{typography.label}"
    padding: "0.2em 0"
---

# Design System: Shravan Dige Portfolio

## Overview

**Creative North Star: "The Instrument Panel"**

This is a near-black chamber containing one luminous object and a great deal of calibrated measurement. The interface behaves like precision equipment rather than a brochure: monospace labels carry indices and exact values, the cursor reports its own position in the same normalised coordinate space the shaders consume, status badges distinguish what is shipping from what is being learned, and a scan line sweeps a card once as it arrives and then retires. Nothing decorates. Every readout means something.

The density is editorial, not dashboard. Display type is set enormous and tight — Archivo at 800 weight with the width axis pulled to 92 and letter-spacing at −0.05em — then given room to breathe against wide gutters and long vertical sections. Between those extremes sits a monospace layer doing the quiet work: `03`, `May — July 2026`, `x +0.421`. The result reads as an engineer's own instrument, built to specification, rather than a template someone filled in.

Restraint is the mechanism. The chrome is monochrome by rule, which is what allows the one saturated element — the iridescent artifact rendered live in WebGL — to carry the entire brand without competition. Remove the colour from everything else and a single object becomes unforgettable; distribute it and nothing is.

**Key Characteristics:**

- Near-black ground with warm off-white ink; three tonal steps, no light counterpart
- One iridescent triad, reserved exclusively for brand; a separate pair reserved exclusively for status
- Enormous tight display type against a monospace data layer
- Hairlines before boxes, glow before shadow
- Motion is scroll-driven and single-clocked; every effect answers to the same time source

## Colors

A monochrome instrument lit by one iridescent source, with a strictly separate pair of colours reserved for reporting state.

### Primary

- **Signal Violet** (`#6C5CFF`): The cool end of the iridescent triad. Appears in the artifact's shader, in the leading stop of the accent gradient, and in the radial wash behind a hovered panel. Never used for text.
- **Instrument Cyan** (`#35E0FF`): The working accent and the most-used of the three. Carries active nav state, focused controls, hovered token tiles, evidence bullets, the cursor reticle, and the scan line. When one accent colour is needed and the gradient is too much, this is it.
- **Readout Rose** (`#FF6FB5`): The warm terminus of the triad. Appears almost exclusively inside the shader's fresnel and at the tail of the accent gradient. Its rarity in the DOM is deliberate.

### Secondary

- **Status Live** (`#3ECF8E`): Something is shipping, complete, or currently true. Used on the availability dot and on "Shipping" badges.
- **Status Learning** (`#F5A524`): Something is in progress or being grown into. Used on "Going deeper" badges.

### Neutral

- **Ground** (`#08080A`): The page. Near-black with a blue bias, never pure `#000`.
- **Ground Soft** (`#0D0D12`) and **Ground Lift** (`#121219`): The two raised tones. This is how surfaces separate — by tone, not by shadow.
- **Ink** (`#F2EFE9`): Warm off-white. Headlines, primary text, and the fill of primary buttons.
- **Ink Muted** (64%), **Ink Quiet** (40%), **Ink Faint** (22%): The descending text ramp — supporting copy, tertiary copy, and mono labels respectively.
- **Hairline** (10%) and **Hairline Strong** (18%): Separation and control borders.

### Named Rules

**The Two Vocabularies Rule.** The iridescent triad means *this is the brand*. The status pair means *this is the state of something*. Neither ever does the other's job. A palette where one set does both stops communicating, which is exactly why they were split.

**The Monochrome Chrome Rule.** Interface furniture — nav, rails, rules, cards, type — is greyscale at rest. Saturated colour at rest belongs to the WebGL layer and to status badges only. Everything else earns colour by being hovered, focused, or active.

## Typography

**Display Font:** Archivo (variable, weight and width axes), falling back to Helvetica Neue and Arial
**Body Font:** Inter Tight
**Label / Mono Font:** JetBrains Mono
**Accent Font:** Instrument Serif, italic only

**Character:** A hard, tightly-tracked grotesk doing the shouting, a narrow humanist doing the talking, and a monospace doing the measuring — with one italic serif allowed in as the single moment of warmth. Four faces, four jobs, no overlap.

### Hierarchy

- **Display** (800, `clamp(3.1rem, 14.4vw, 13.5rem)`, line-height 0.82, `wdth` 92): The name in the hero, set per-glyph in overflow-hidden masks so it can be revealed letter by letter. Once per page.
- **Headline** (800, `clamp(2.4rem, 7vw, 5rem)`, line-height 0.98): Case-study and modal titles.
- **Title** (700, `clamp(1.3rem, 2.2vw, 1.85rem)`, line-height 1.05): Section headlines, pillar titles, card titles.
- **Body** (400, `clamp(0.98rem, 1.25vw, 1.16rem)`, line-height 1.6): Running text. Held to a 46–68ch measure depending on column.
- **Label** (400, `0.62rem`, tracking `0.16em`, uppercase): Indices, kickers, metadata, stack names, coordinates, timestamps.
- **Accent** (Instrument Serif, italic, `1.1em`): One emphasised word.

### Named Rules

**The One Italic Rule.** Instrument Serif italic marks exactly one word per section — `engineer` in the hero, `at` in a job title. Used twice in a view it stops being emphasis and becomes texture.

**The Mono-Means-Data Rule.** JetBrains Mono is never decorative. It appears only where the content is genuinely a measurement, an identifier, or a coordinate. If it could be a sentence, it is not mono.

## Layout

A single centred column capped at `1600px` with a fluid gutter of `clamp(20px, 4.2vw, 72px)`, and vertical section rhythm of `clamp(6rem, 14vh, 12rem)` — long, unhurried sections rather than a dense stack.

Internal composition is almost entirely CSS Grid with explicit column ratios rather than generic auto-fit: the experience block runs `minmax(9rem, 0.28fr)` for metadata against `1fr` for content; skill rows run a three-column title/description/count arrangement; the focus grid is a plain two-up. Sibling spacing is always `gap`, never per-element margins.

Breakpoints, in the order the system actually uses them: `620px` (token and gutter reductions), `900px` (grids collapse to one column), `980px` (the horizontal work rail becomes a vertical stack), `1100px` (skill rows restack), `1180–1240px` (two-column cards stack and centre). Height is a breakpoint too — below `780px` tall, stage artwork shrinks so captions are not pushed off the card.

The work rail is the one place layout becomes cinematic: each panel is exactly one viewport wide, driven by a `--slot` custom property measured from `documentElement.clientWidth`, so the rail advances by precisely one project per screen.

### Named Rules

**The Measure Rule.** Running text never exceeds ~68ch, and lead paragraphs sit nearer 56ch. Wide columns get a narrower measure, not a bigger font.

## Elevation & Depth

Tonal, hairlined, and glowing — in that order. Depth is expressed by moving between the three ground tones and by 1px lines at 10% ink, not by stacking shadows. Shadows exist, but they almost never describe height; they describe **state**. A cyan or green glow means something is hovered, focused, or alive.

There is exactly one structural shadow in the system, and it is deliberately enormous and soft so it reads as a room rather than a card border.

### Shadow Vocabulary

- **Stage lift** (`box-shadow: 0 40px 120px -50px rgba(0,0,0,0.9)`): The project card, and only the project card. Sinks it into the page rather than lifting it off.
- **Focus glow** (`box-shadow: 0 8px 22px -10px rgba(53,224,255,0.65)`): Token tiles lifting on hover.
- **Edge glow** (`box-shadow: 0 0 14px 1px rgba(53,224,255,0.6)`): The rule beneath an active skill row as it fills.
- **Live pulse** (`box-shadow: 0 0 0 0 → 0 0 0 4px rgba(62,207,142,0)`): The animated ring on a "Shipping" status dot.

### Named Rules

**The Glow-Is-State Rule.** A shadow in this system answers a question about state, not about height. If nothing is being hovered, focused, or reported as live, there is no shadow.

**The Hairline-First Rule.** Reach for a 1px line at 10% ink before reaching for a border, a box, or a background. Most separation in this system is a single rule.

## Shapes

Radius is functional and it varies on purpose, which is unusual enough to state plainly: this system does not have one corner value applied everywhere.

- **Fully round** (`100px`): Anything interactive and inline — buttons, chips, pills, status badges. Round means *press me* or *I am a label*.
- **Data tiles** (`8px`): Skill tokens. Squared-off because they are data, not controls; the tight corner is what separates a specification from a button.
- **Panels and cards** (`16–22px`): Pillars at 16px, experience and project frames at 18–22px. Generous, soft, architectural.
- **Structural marks** (`2px`): Accent bars and progress fills — effectively square.
- **Circles** (`50%`): Reserved for the cursor reticle, timeline nodes, evidence bullets, and glow sources.

Borders are almost always `1px solid` at 10% or 18% ink. Filled backgrounds are near-invisible gradients — `linear-gradient(158deg, rgba(242,239,233,0.035), rgba(242,239,233,0.008))` — which read as a tonal shift rather than a box.

### Named Rules

**The Radius-Follows-Function Rule.** Round is interactive, 8px is data, 16–22px is architecture, 2px is structure. A tile that becomes a button changes its radius.

## Components

Precise and instrument-like. Controls feel calibrated rather than friendly: tight tracking, uppercase mono, exact values on show, and state changes that resolve over 400–600ms on a single easing curve.

### Buttons

- **Shape:** Fully round (`100px`).
- **Primary:** Ink fill behind ground-coloured text, applied via a `::before` layer so the fill can scale to `1.06` on hover while the label stays put. Padding `0.95em 1.6em`.
- **Ghost:** Transparent with a `1px` hairline-strong border and ink text; same geometry.
- **Behaviour:** Primary and ghost buttons are wrapped in a magnetic component that pulls them toward the cursor within a radius, with the inner label lagging the shell — that lag is what makes it read as physical rather than as a transform.

### Chips

- **Style:** Hairline-strong border, no fill, ink-muted uppercase mono at `0.66rem` with `0.08em` tracking, fully round.
- **Use:** Technology and stack names, everywhere they appear.

### Token Tiles

- **Style:** The squared (`8px`) sibling of the chip, with a `rgba(242,239,233,0.02)` fill.
- **Hover:** Border to cyan at 55%, fill to cyan at 13%, text to pure white, lift `−4px`, with a cyan drop glow — staggered `40ms` per tile via a `--i` custom property so a row deals out rather than flipping at once.

### Status Badges

- **Style:** Fully round, `1px` border in `currentColor`, uppercase mono at `0.6rem`, with a filled dot.
- **States:** Live (`#3ECF8E`) pulses its dot on a 2.6s cycle; Learning (`#F5A524`) is static. The distinction between animated and still is itself the signal.

### Cards / Containers

- **Corner:** `16px` for pillars, `18px` for experience, `22px` for project stages.
- **Background:** A near-invisible `158deg` gradient over the ground.
- **Border:** `1px` hairline, moving to hairline-strong or cyan on hover.
- **Hover:** `translateY(-4px)` with a radial violet wash fading in behind the content via a `z-index: -1` pseudo-element and `isolation: isolate`.
- **Padding:** `clamp(1.4rem, 2.4vw, 2.1rem)`.

### Navigation

- **Style:** Uppercase mono at `0.68rem`, `0.14em` tracking, ink-quiet at rest, ink when active. Fixed, and it hides on scroll-down past 400px while revealing on scroll-up.
- **Mobile:** A full-screen overlay menu whose background wipes open via `clip-path` inset, with links rising from masked containers.

### Signature Components

**The coordinate reticle cursor.** The native cursor is never hidden. Around it sits a CSS-3D ring that banks on Y and pitches on X in proportion to pointer velocity, crosshair arms drawn with a transparent centre gap so the system arrow reads through them, corner brackets that snap in over interactive elements, and a HUD reporting the pointer in normalised device coordinates — the same −1→1 space the shaders consume for `uMouse`.

**The horizontal work rail.** On desktop the work section pins and translates a track sideways, one full viewport per project, then releases to vertical scroll. Each card runs a two-half timeline peaking dead centre: it swings in from the far right at `rotateY(12°)` and `translateZ(-220px)`, squares up, and swings symmetrically out.

**The scan line.** A single cyan gradient sweep down a pillar card as it enters, which then fades and never repeats. The security motif stated once rather than performed continuously.

## Do's and Don'ts

### Do:

- **Do** keep interface chrome monochrome and let the WebGL layer and status badges carry all saturated colour at rest.
- **Do** separate with a `1px` hairline at 10% ink before reaching for a border, a box, or a shadow.
- **Do** match radius to function — `100px` interactive, `8px` data, `16–22px` architecture, `2px` structural.
- **Do** reserve `backdrop-filter` blur for surfaces that genuinely float above the page (modal, overlay menu, cursor HUD). It is never the default card treatment.
- **Do** drive everything scroll-linked through GSAP on the shared Lenis-fed clock, and everything state-linked through CSS or React — the two never touch the same property on the same element.
- **Do** let panels settle at exactly identity. A card at rest carries no residual rotation or Z, so its type is never rasterised through a 3D matrix while being read.
- **Do** give every element whose visible state is established by JavaScript a hidden starting state in CSS, so it cannot strand itself when reduced motion suppresses the script.

### Don't:

- **Don't** build a connected-dots particle-network background. Confirmed rejection: it is the most overused effect in developer portfolios and would undo the point of writing custom shaders.
- **Don't** let the iridescent triad report status, or let the status pair decorate. The two vocabularies stay separate.
- **Don't** use more than one Instrument Serif italic word per section.
- **Don't** set monospace on anything that is not a measurement, identifier, or coordinate.
- **Don't** animate `filter: blur()` during scroll — it is the most reliable way to drop frames in this system.
- **Don't** measure a scroll driver with `scrollWidth` or `100vw`. The first includes overflow created by this system's own transforms; the second includes the scrollbar. Use `offsetWidth` against `documentElement.clientWidth`.
- **Don't** rely on `z-index` to raise an overlay above the nav from inside `.main` — it establishes a stacking context at `z-index: 2`, so overlays must be portalled to `<body>`.
- **Don't** hide the native cursor.
