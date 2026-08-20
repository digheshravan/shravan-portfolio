# ADR 0014: One accent, and it means "resolved"

- **Status:** Accepted
- **Date:** 2026-08-20

## Context

The previous palette carried five saturated colours doing two different
jobs: an iridescent triad (violet/cyan/rose) as the brand's identity, and a
separate live/learning pair for shipping-status badges — kept strictly apart
by what was called the Two Vocabularies Rule. With the artifact gone
(ADR-0010), there's no shader left for a three-colour triad to live in, and
the new vocabulary's own argument — complexity resolving into one clean
structure — reads more honestly with one colour than with five.

## Decision

`--accent: #E0472C` / `--accent-ink: #E9674B` — one vermillion, matching the
3D primitives' `uAccent` uniform exactly. It has exactly one meaning: **this
is the resolved or active part of the system.** Used on the active subset in
a formation (`isActive`, a hash decorrelated from both instance selection
and position, so the accent reads as a genuine small fraction rather than a
rhythmic stripe — see the Step 0 concept-gate fix), the active nav link, the
focus ring, and the "Flagship" pill.

Status stops being a hue. `.pill--learning` and `.pill--done` share the same
neutral treatment (`--fg-3` on a faint neutral fill) — the *label* says
"In development" or a year; the colour doesn't. Under the one-accent rule,
"in development" is the opposite of resolved, so giving it its own colour
would contradict what the accent means everywhere else on the page.

## Consequences

- Measured, not assumed: `#E0472C` on `#08080A` is 4.78:1 — legal for body
  text but thin margin — so `#E9674B` (6.09:1) is what small sustained
  accent text uses instead.
- `::selection` and `:focus-visible` both resolve to the accent; nothing
  else on the page competes with it for saturated attention.
- Five colours become one. `--vio`/`--cyan`/`--pink`/`--iri`,
  `--live`/`--learning` as *colour* tokens are gone entirely — verified by
  grep, zero remaining references.
