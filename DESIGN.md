---
name: Shravan Dige Portfolio
description: A near-black field where complexity resolves into a system — rows, nodes, links and layers standing in for information, entities, flow and architecture, with one vermillion accent marking whatever just resolved.
colors:
  ground: "#08080A"
  ground-soft: "#0D0D12"
  ground-lift: "#121219"
  ink: "#F2EFE9"
  ink-muted: "rgba(242, 239, 233, 0.64)"
  ink-quiet: "rgba(242, 239, 233, 0.56)"
  ink-faint: "rgba(242, 239, 233, 0.50)"
  mark: "rgba(242, 239, 233, 0.22)"
  hairline: "rgba(242, 239, 233, 0.10)"
  hairline-strong: "rgba(242, 239, 233, 0.18)"
  accent: "#E0472C"
  accent-ink: "#E9674B"
typography:
  display:
    fontFamily: "Fraunces, 'Playfair Display', Georgia, serif"
    fontSize: "clamp(3.1rem, 14.4vw, 13.5rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Fraunces, 'Playfair Display', Georgia, serif"
    fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)"
    fontWeight: 700
    lineHeight: 1.02
  title:
    fontFamily: "Fraunces, 'Playfair Display', Georgia, serif"
    fontSize: "clamp(2.2rem, 6.2vw, 5rem)"
    fontWeight: 700
    letterSpacing: "-0.055em"
    lineHeight: 0.98
  body:
    fontFamily: "'Inter Tight', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(0.96rem, 1.15vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "clamp(0.62rem, 0.72vw, 0.75rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  accent:
    fontFamily: "'Instrument Serif', Georgia, serif"
    fontSize: "1.1em"
    fontStyle: italic
    letterSpacing: "-0.01em"
spacing:
  gutter: "clamp(20px, 4.2vw, 72px)"
  section: "clamp(6rem, 14vh, 12rem)"
  maxWidth: "1600px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "100px"
    padding: "0.95em 1.6em"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "100px"
    padding: "0.95em 1.6em"
  chip:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "100px"
    padding: "0.42em 0.85em"
  pill:
    typography: "{typography.label}"
    rounded: "100px"
    padding: "0.3em 0.7em"
  case-frame:
    backgroundColor: "{colors.ground-soft}"
    rounded: "22px"
    padding: "clamp(1.6rem, 3vw, 2.8rem)"
---

# Design System: Shravan Dige Portfolio

## Overview

**Creative North Star: "Complexity → System"**

The site's thesis is the pattern behind every project on the CV: take
something dense and unstructured, and produce a system that makes it usable.
The visual language argues the same point rather than illustrating it from a
distance — a composable vocabulary of four instanced 3D primitives (rows,
nodes, links, layers, ADR-0010) that stands in for information, entities,
flow and architecture, reconfiguring itself as the page's own argument moves
from complexity toward a resolved structure.

Nothing about the chrome competes with that. Type is a Didone-class serif at
enormous scale doing the shouting and a narrow humanist doing the talking,
with a monospace layer for anything that's a measurement rather than a
sentence. The palette is near-black with warm off-white ink and exactly one
saturated colour, reserved for one meaning: *this has resolved*. Status
reads by shape and label, not by hue.

**Key Characteristics:**

- Near-black ground with warm off-white ink; three tonal steps, no light
  counterpart.
- One accent, one meaning — the resolved or active part of whatever's on
  screen. Nothing else on the page is saturated.
- A high-contrast Didone display serif at enormous, open-tracked scale
  against a monospace data layer.
- The 3D vocabulary is architecture, never ambient decoration (ADR-0011) —
  a node or link exists because something specific is named, not because a
  field needed filling.
- Motion is scroll-driven and single-clocked (ADR-0001); the frameloop
  itself is gated to actual activity (ADR-0013).

## Colors

One accent against a near-black, warm-neutral field. There is no second
saturated colour anywhere in the system (ADR-0014) — the previous
iridescent triad and status-colour pair are both gone.

### Accent

- **Accent** (`#E0472C`): The system's one meaning-bearing colour — *this is
  resolved, active, or the answer*. Used on the active fraction of a 3D
  formation, the active nav link, `:focus-visible`, `::selection`, and the
  "Flagship" pill. Measured at 4.78:1 against the ground — legal for text,
  thin margin.
- **Accent Ink** (`#E9674B`): The same hue at 6.09:1, used wherever accent
  colour needs to carry small, sustained text (case-study pipeline labels
  mid-scrub, the resume link).

### Neutral

- **Ground** (`#08080A`): The page. Near-black, never pure `#000`.
- **Ground Soft** (`#0D0D12`) and **Ground Lift** (`#121219`): The two
  raised tones — surfaces separate by tone, not by shadow.
- **Ink** (`#F2EFE9`): Warm off-white. Headlines, primary text, and the fill
  of primary buttons.
- **Ink Muted** (64%), **Ink Quiet** (56%), **Ink Faint** (50%): The
  descending text ramp. The floor is deliberately compressed — `0.485` is
  the lowest alpha that clears 4.5:1 on this ground, so a fourth,
  even-fainter legible tier does not exist here.
- **Mark** (22%): Faint decorative marks only — separator dots, rail ticks.
  Never text.
- **Hairline** (10%) and **Hairline Strong** (18%): Separation and control
  borders.

### Named Rules

**The One-Accent Rule (ADR-0014).** The accent means exactly one thing —
resolved, active, or correct — and nothing else on the page is saturated.
Status (shipping vs. in development) is carried by the pill's *label*, not
its colour: `.pill--live` (Flagship) is the one status pill that *does* use
the accent, because a flagship project genuinely is the resolved, notable
case; `.pill--learning` and `.pill--done` share one neutral treatment, since
under this rule "in development" is the opposite of resolved and doesn't
get its own hue.

**The Monochrome Chrome Rule.** Interface furniture — nav, rails, rules,
cards, type — is greyscale at rest. Saturated colour at rest belongs to the
3D layer's active fraction and to the Flagship pill only. Everything else
earns colour by being hovered, focused, or active.

## Typography

**Display Font:** Fraunces (variable, `opsz` + `wght` axes only — the
`SOFT`/`WONK` axes were deliberately left unrequested to keep the file
small), falling back to Playfair Display, then Georgia
**Body Font:** Inter Tight
**Label / Mono Font:** JetBrains Mono
**Accent Font:** Instrument Serif, italic only

**Character:** A Didone-class serif carrying the display voice — high
stroke contrast, hairline joins, open at rest rather than condensed — a
narrow humanist doing the running text, a monospace doing the measuring,
and one italic serif allowed in as the single moment of warmth per section.

Fraunces replaced Archivo (a variable grotesk previously manipulated along
a `wdth` axis for a handful of tight, condensed treatments) mid-build.
Fraunces has no `wdth` axis, so each of those eleven sites was migrated by
its actual effect rather than left inert: the widest nudges (92–95) simply
dropped, since Fraunces' own proportions at regular tracking already read
correctly; mid-range nudges (86–90) became small additional negative
letter-spacing; the hard-condensed end (74–80) moved to the body font
outright, since a high-contrast serif compressed to 74% width doesn't exist
and shouldn't be faked.

### Hierarchy

Sizes are fluid `clamp()` expressions tuned per component; the invariants
are the family, the weight, the tracking direction, and the role.

- **Display** (400, `clamp(3.1rem, 14.4vw, 13.5rem)`, line-height 0.88,
  tracking `-0.015em`): The name in the hero, set per-glyph in
  overflow-hidden masks. Weight and tracking were tuned specifically for
  this — a Didone-class serif at 800 weight with tight negative tracking
  closes up its own hairline joins; regular weight, opened back to
  `-0.015em`, is what makes the letterforms read at this size. Once per
  page.
- **Headline** (700, `clamp(1.8rem, 3.2vw, 2.8rem)`, line-height 1.02):
  Case-study titles.
- **Title** (700, `clamp(2.2rem, 6.2vw, 5rem)`, tracking `-0.055em`):
  Section headlines (`SectionHead`).
- **Body** (400, `clamp(0.96rem, 1.15vw, 1.08rem)`, line-height 1.55):
  Running text.
- **Label** (400, `0.62rem`, tracking `0.14em`, uppercase): Indices,
  metadata, stack names, pipeline steps.
- **Accent** (Instrument Serif, italic, `1.1em`): One emphasised word.

### Named Rules

**The One Italic Rule.** Instrument Serif italic marks exactly one word or
phrase per section. Used twice in a view it stops being emphasis and
becomes texture.

**The Mono-Means-Data Rule.** JetBrains Mono is never decorative. It
appears only where the content is genuinely a measurement, an identifier,
or an index. If it could be a sentence, it is not mono.

## Layout

A single centred column capped at `1600px` with a fluid gutter of
`clamp(20px, 4.2vw, 72px)`, and vertical section rhythm of
`clamp(6rem, 14vh, 12rem)`.

Breakpoints in the order the system actually uses them: `620px` (token and
gutter reductions), `780px`/`820px` (component-level height/width
adjustments), `900px` (grids collapse to one column; the pinned Work case
studies drop their pin entirely and stack — ADR-0017); `1100px` (skill rows
restack); `1180px` (case-study frame narrows on in-between desktop widths).

### Named Rules

**The Measure Rule.** Running text stays well under 60ch; case-study copy
sits nearer 48ch. Wide columns get a narrower measure, not a bigger font.

## The 3D System

The 3D layer is not decoration behind the content — it's a second
expression of the same argument the content is making (ADR-0010, ADR-0011,
ADR-0012).

- **Rows** — information: records, lines, a corpus.
- **Nodes** — entities: a service, a store, a decision point. A hairline
  square outline, not a filled dot.
- **Links** — flow: a request, a retrieval hop, a dependency. Computed from
  the same node positions the Nodes primitive uses, so a link never drifts
  off its endpoints.
- **Layers** — architectural strata: tiers, planes, documents.

Composed via named formations (`SCATTER`, `ALIGN`, `DISTILL`, `BARS`,
`STRATA`, `PIPE`, `CLUSTER4`, `LATTICE`, `RESOLVE`) that read as stages
along the arc from complexity to a resolved system, crossfading through one
mutable state singleton rather than mounting/unmounting components
(ADR-0012). Each of the four flagship case studies gets a genuinely
different character rather than one recoloured motif: DocMind moves
layers → rows → a distilled node/link cluster → one resolved answer node;
the IPO Risk Decoder extracts rows, turns them into scored bars, and
interleaves a benchmark set; MediSlot is node/link-dominant, an explicit
patient/doctor/clinic → hub → spine topology; Car Rental is layer-dominant,
four strata lighting up as a request travels down the stack.

`prefers-reduced-motion` (real OS setting *or* the `?motion=reduced` URL
override) replaces the whole canvas with `StaticField` — a static SVG using
the same vocabulary and accent, not an empty gradient (ADR-0016). The
frameloop itself is gated to a hidden tab, an idle page, or genuine activity
(ADR-0013), rather than rendering at full rate regardless of whether
anything is moving or anyone is looking.

### Named Rules

**The Architecture-Not-Network Rule (ADR-0011).** Nodes and links are never
random, never idle, and never ambient. A node sits where something is
named; a link exists because two named things are related. This is what
keeps the vocabulary out of the connected-dots-particle-network cliché that
an earlier design pass explicitly rejected.

## Elevation & Depth

Tonal and hairlined before glowing. Depth comes from moving between the
three ground tones and from 1px lines at 10% ink, not from stacking
shadows. The one enormous, deliberately soft structural shadow in the
system sinks the pinned case-study frame into the page rather than lifting
it off it; every other shadow in the system reports **state** — an accent
glow means something is hovered or active.

### Shadow Vocabulary

- **Stage lift** (`0 40px 120px -50px rgba(0,0,0,0.9)`): The case-study
  frame, and only the case-study frame.
- **Focus glow** (`0 8px 22px -10px rgba(224,71,44,0.65)`): A capability
  row's items, lifting on hover.
- **Edge glow** (`0 0 14px 1px rgba(224,71,44,0.55)`): The rule beneath an
  active capability row.
- **Live pulse** (`0 0 0 0 → 0 0 0 9px rgba(224,71,44,0)`): The animated
  ring on the hero's status dot.

### Named Rules

**The Glow-Is-State Rule.** A shadow answers a question about state, not
about height. If nothing is being hovered, focused, or reported as active,
there is no shadow.

**The Hairline-First Rule.** Reach for a 1px line at 10% ink before
reaching for a border, a box, or a background.

## Shapes

Radius here is functional but it is **not** a formal token scale — this was
a deliberate, documented deviation from the original build plan, which
called for a `--r-*` custom-property layer (Step 2 of the build order). By
the time that step would have run, the whole visual system had already been
rebuilt fresh rather than migrated forward from an old palette, which was
the specific problem that token layer existed to solve — introducing it
after the fact would have been a late structural CSS migration with no
correctness need behind it, so it was left undone and is recorded here
instead of implemented quietly. Radius values are plain pixel literals,
chosen per component by the same functional grouping the values below
describe:

- **Fully round** (`100px`): Anything interactive and inline — buttons,
  chips, pills. Round means *press me* or *I am a label*.
- **Case-study frame** (`22px`): The one large architectural surface in the
  system.
- **Metric tiles, panels** (`12–16px`): Smaller contained surfaces.
- **Focus ring offset** (`2px`, via `outline-offset`): The tightest,
  most structural mark in the system.

Borders are almost always `1px solid` at 10% or 18% ink. Filled backgrounds
are near-invisible gradients — `linear-gradient(150deg, rgba(20,20,28,0.92),
rgba(8,8,10,0.94))` on the case-study frame — which read as a tonal shift
rather than a box.

### Named Rules

**The Radius-Follows-Function Rule.** Round is interactive, mid-range is a
contained panel, the largest value is architecture. A tile that becomes a
button changes its radius.

## Components

### Buttons

- **Shape:** Fully round (`100px`).
- **Primary:** Ink fill behind ground-coloured text, applied via a
  `::before` layer so the fill can scale to `1.06` on hover while the label
  stays put.
- **Ghost:** Transparent with a `1px` hairline-strong border and ink text.
- **Behaviour:** Wrapped in a magnetic component that pulls the shell
  toward the cursor within a radius, with the inner label lagging the
  shell — the lag is what reads as physical rather than as a transform.

### Chips & Pills

- **Chip:** Hairline-strong border, no fill, ink-muted uppercase mono,
  fully round. Technology and stack names, everywhere they appear.
- **Pill — live/Flagship:** Accent-tinted fill and text — the one status
  pill that carries the accent, because "Flagship" *is* the resolved,
  notable case.
- **Pill — learning/done:** Shared neutral fill and ink-quiet text.
  Distinguished by label only, never colour.

### Case Studies (Work)

- **Corner:** `22px`.
- **Background:** A near-invisible `150deg` gradient over the ground.
- **Behaviour (desktop):** Each of the four projects pins independently
  while its own pipeline scrubs through the 3D system alongside it
  (ADR-0017); the pipeline list highlights its current step in place.
- **Behaviour (mobile / reduced motion):** No pin — a plain vertical stack,
  pipeline shown as a normal ordered list.
- **Metrics:** Mono key/value readouts sourced from `PROJECTS[].metrics`.

### Navigation

- **Style:** Uppercase mono, ink-quiet at rest, ink and an accent dot when
  active. Fixed, hides on scroll-down past 400px, reveals on scroll-up.
- **Mobile:** A full-screen overlay menu whose background wipes open via
  `clip-path` inset, links rising from masked containers.

### Signature Components

**The contextual cursor (ADR-0015).** The native cursor is never hidden.
A small additive dot tracks tightly, scales up and tints toward the accent
near anything interactive, and carries a short trailing label where one is
declared via `data-cursor-label` — nothing else. No coordinate readout: the
reticle-and-HUD it replaced reported a number that drove the previous
shader's `uMouse` uniform, and that surface no longer exists to report on.

**The pinned case study.** On desktop each project pins in turn and its
own pipeline scrubs continuously with scroll — the scene reconfigures
through that project's specific formations as you scroll, not once per
project but once per pipeline step.

**StaticField (ADR-0016).** The reduced-motion fallback: a static SVG using
the same rows/nodes/links vocabulary and accent as the live system, not an
empty gradient standing in for it.

## Do's and Don'ts

### Do:

- **Do** keep interface chrome monochrome and let the 3D layer's active
  fraction and the Flagship pill carry the one saturated colour at rest.
- **Do** separate with a `1px` hairline at 10% ink before reaching for a
  border, a box, or a shadow.
- **Do** drive everything scroll-linked through GSAP on the shared
  Lenis-fed clock (ADR-0001), and everything state-linked through CSS or
  React — the two never touch the same property on the same element.
- **Do** give every element whose visible state is established by
  JavaScript a hidden starting state in CSS, so it cannot strand itself
  when reduced motion suppresses the script (ADR-0003).
- **Do** gate rAF/GSAP/Lenis work to whether it's actually needed — hidden
  tab, reduced motion, and true idle all mean "don't run this" (ADR-0013,
  ADR-0016).

### Don't:

- **Don't** build an ambient, decorative node/link field. A node or link
  exists because something specific is named (ADR-0011).
- **Don't** give a second thing on the page a saturated colour. The accent
  means exactly one thing (ADR-0014).
- **Don't** use more than one Instrument Serif italic phrase per section.
- **Don't** set monospace on anything that is not a measurement, identifier,
  or index.
- **Don't** measure a scroll driver with `scrollWidth` or `100vh`. Use
  `offsetHeight`/`offsetWidth` against `document.documentElement`.
- **Don't** rely on `z-index` to raise an overlay above the nav from inside
  `.main` — it establishes a stacking context at `z-index: 2`; overlays that
  must sit above the chrome are portalled to `<body>` (ADR-0005).
- **Don't** give a pinned element's ancestor a `data-panel`/`data-parallax`
  transform — `position: fixed` then resolves against that transform
  instead of the viewport, and the pin breaks (ADR-0006, ADR-0017).
- **Don't** hide the native cursor.
