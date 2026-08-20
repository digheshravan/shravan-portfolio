# ADR 0011: Nodes and links are architecture, never an ambient network

- **Status:** Accepted
- **Date:** 2026-08-20

## Context

An earlier design pass explicitly rejected a connected-dots particle-network
background as "the most overused effect in developer portfolios." ADR-0010
introduces exactly the ingredients that cliché is built from — nodes and
links — which overturns that rejection deliberately. The distinction has to
hold in the implementation, or the site lands in exactly the effect it was
warned against.

## Decision

Four rules keep nodes and links out of ambient-network territory:

- **Never random.** Node positions come from `nodePos()` in
  `system.glsl.js` — a per-formation switch of hand-placed coordinates, not
  noise or a random walk. `LATTICE`, for example, is an explicit topology:
  patient/doctor/clinic feeder-and-anchor clusters spoking into one shared
  hub, extending into a schedule spine — the diagram MediSlot's coordination
  actually depicts, not a generic grid.
- **A link is a pure function of two node indices.** The Links primitive
  calls the same `nodePos()` the Nodes primitive does, so a connection is
  computed from where its two endpoints already are — it can't drift off
  them when a formation changes, and the CPU never touches a link's
  position directly.
- **Sparse.** 40 nodes and 16 links (high tier) across the *whole page*,
  most parked off-stage (`z = -40`, scaled to zero) in any given beat — an
  architecture diagram's density, not a constellation's.
- **Never idle.** A node or link only appears where a formation places it
  for a reason; there is no background field rendered at rest independent
  of what the current beat is arguing.

## Consequences

- `LATTICE`'s topology is the clearest test of this rule: it reads as
  "patient, doctor and clinic coordinate through one hub" specifically
  because the positions are named and fixed, not because anything is
  wired to look busy.
- The Nodes primitive is drawn as a hairline square outline with a small
  filled core only when active — a filled dot at rest is the
  particle-network vocabulary; an outline is the diagram one.
- Extending the vocabulary to a new formation means writing an explicit
  `nodePos()` case, not tuning a noise field — the discipline is structural,
  not a style guideline that can quietly erode.
