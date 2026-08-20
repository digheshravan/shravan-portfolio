# Handoff — Shravan Dige Portfolio

**Date:** 2026-08-20
**Prepared for:** another AI/design reviewer picking this project up next
**Repo:** `git@github.com:digheshravan/shravan-portfolio.git`, branch `main`
**Live:** `https://www.shravandige.dev/` (canonical), Vercel auto-deploys `main`

---

## 1. Project overview

A single-page React + WebGL portfolio for Shravan Dige — MBA Tech student (Computer Engineering × Management, NMIMS Mumbai) — built as a hand-authored 3D experience, not a template. No backend, no database, no auth. Content is static and lives entirely in `src/data/content.js`; the CV (`public/Shravan-Dige-CV.pdf`) is the parallel document and must never disagree with the site.

Primary audience: recruiters and hiring contacts (India-first, internationally legible), who verify claims against the public GitHub repos within the first minute. Secondary audience: the public record — peers, collaborators, anyone sent the link. Full positioning, evidence-on-hand, and disclosure boundaries are in `PRODUCT.md` — read it before changing any copy or claim.

## 2. Current design philosophy

**"Complexity → System."** Every project on the CV does the same thing: takes something dense and unstructured and produces a system that makes it usable (DocMind on legal/research documents, the IPO Risk Decoder on DRHP filings, MediSlot on care coordination). The site's whole visual identity argues that same point instead of decorating around it — a composable vocabulary of 3D primitives that reconfigures as the page's own argument moves from complexity toward a resolved structure.

Chrome discipline: near-black ground, warm off-white ink, **one accent colour with one meaning** (resolved/active), a Didone-class serif for display type, monospace for anything that's a genuine measurement. Nothing decorative that isn't also structural.

## 3. V2 redesign summary

The site was completely rebuilt from a single iridescent, noise-displaced icosahedron (the old identity, ADR-0008, now superseded) to the current system, executed as ten gated steps (0 through 10), each reviewed and approved before the next began:

- **Step 0** — concept-gate prototype (`?lab=1`, `src/three/Lab.jsx`).
- **Steps 1** — bug fixes (frameloop gating, `deviceMemory`/`hardwareConcurrency` detection, `pointer.active` reset, dead `scroll.energy` removal) — done later, see below.
- **Steps 2** — a formal radius/spacing token layer was **deliberately not built** (documented deviation, see §9).
- **Step 3** — typography: Archivo → Fraunces (variable, `opsz`+`wght` only).
- **Steps 4–5** — scene replacement: the four-primitive vocabulary (§5) replaces the old artifact.
- **Step 6** — sections rebuilt: Hero, Intersection, Capabilities, Experience.
- **Step 7** — chrome: nav, cursor, overlays, preloader restyled.
- **Step 8** — cleanup: `Marquee`, `Focus`, `DeviceMock`, `ProjectModal` and dead CSS/tokens removed.
- **Step 9** — `StaticField` (reduced-motion fallback) + full reduced-motion audit.
- **Step 10** — documentation: ADRs 0010–0017 written, `DESIGN.md` rewritten, `PRODUCT.md` refreshed.

This full redesign is **committed and deployed** — commit `c8b4082`, "Complete V2 portfolio redesign", currently live in production.

A follow-up pass (after Step 10, still on `main`, same commit) fixed four bugs the original plan had flagged but never actually closed: **frameloop gating** (`src/hooks/useFrameloopGate.js`, new file), the `deviceMemory`/`hardwareConcurrency` tier-detection bug, `pointer.active` reset logic, and dead `scroll.energy` state — plus the canonical/`og:url` correction (apex → `www`, confirmed via the real Vercel redirect). All documented in ADR-0013 and the relevant inline comments.

## 4. Hero — "Living System Layers" (in progress, uncommitted)

The hero background was redesigned again, separately from the rest of V2, after the owner felt the original hero formation (`SCATTER` on rows+nodes+layers simultaneously — 2048 independently-tilted line segments) read as busy/uncontrolled rather than premium.

**Current state: implemented and visually approved in principle, sitting uncommitted on top of the deployed baseline, pending the owner's own visual review before commit.** Four files changed, nothing else:

- `src/lib/sceneState.js` — added `FORM.LIVING: 10`.
- `src/three/shaders/system.glsl.js` — added the `F_LIVING` constant.
- `src/three/primitives/Layers.jsx` — added the `LIVING` formation (a staggered diagonal cascade of 6 panes, not parallel tiers) and, in the fragment shader, reactivated the dormant `fbm()` noise chunk (`src/three/shaders/noise.glsl.js`, unused since the old artifact) to slowly modulate each pane's edge brightness — a "current" running through the architecture. A rare, threshold-gated crossover tints the edge toward the accent colour. Cursor position (`pointer.ex/ey`) offsets the noise sample for a subtle field response.
- `src/data/scenes.js` — `SECTION_BEATS.hero` now uses `rows/nodes/links: NONE`, `layers: LIVING`, `opacity: 0.55`.

**Design lineage** (full detail lives in this session's transcript, not yet in an ADR): three concepts were proposed (Strata, Contour Field, Ledger); the owner chose a hybrid of Strata (layered-architecture metaphor, low implementation risk, reuses the existing `Layers` primitive) with Contour Field's noise-driven "intelligence" technique, explicitly avoiding nodes/particle-network and grid/dashboard aesthetics. **This has not yet been written up as an ADR** — see §10.

**If the owner asks for opacity tuning only:** change `opacity` in `SECTION_BEATS.hero` (`scenes.js`) and/or the `p.vis = 0.26` line in `Layers.jsx`'s `LIVING` case. Nothing else should move without a fresh conversation.

## 5. 3D architecture

Four instanced primitives, one shared mutable state singleton, zero per-frame React renders:

| Primitive | File | Means |
|---|---|---|
| Rows | `src/three/primitives/Rows.jsx` | information, records, a corpus |
| Nodes | `src/three/primitives/Nodes.jsx` | entities — hairline square outline, never a filled dot |
| Links | `src/three/primitives/Links.jsx` | relationships — right-angle elbow routing, declared pairs only, never proximity-computed |
| Layers | `src/three/primitives/Layers.jsx` | architectural strata — hairline-edged panes, never filled |

Shared GLSL lives in `src/three/shaders/system.glsl.js` (`sysCommon`: hash functions, `sel()` selection helper, formation-id constants, the shared `nodePos()` Nodes and Links both call so a link can never drift off its endpoints) and `src/three/shaders/noise.glsl.js` (`simplex3d`/`fbm`, dormant except for the new `LIVING` formation).

A **formation** (`FORM.*` in `src/lib/sceneState.js`, `F_*` in the shader) is a named pure function of instance index → position/appearance. Ten formations exist: `NONE, SCATTER, ALIGN, DISTILL, BARS, STRATA, PIPE, CLUSTER4, LATTICE, RESOLVE, LIVING`. Each primitive's shader blends two formations (`uFormA`/`uFormB`) via `uBlend`, so a "beat change" is a uniform crossfade, not a remount.

**State flow** (`src/lib/sceneState.js`):
- `scene` — the singleton. `{blend, active, opacity, rows/nodes/links/layers: {formA, formB, amt}, slug, step}`. Read every frame by each primitive's own `useFrame`, which damps toward it — never React state.
- `applyBeat(beat)` — instant, first paint only.
- `animateToBeat(beat, duration)` — GSAP-tweens `blend` 0→1, carrying `formA = current formB` for continuity. Drives section-to-section transitions (`src/hooks/useSceneChoreography.js`, `SECTION_BEATS` in `src/data/scenes.js`) and mobile/reduced-motion Work transitions.
- `beginCase(slug)` / `scrubCase(beats, progress, cursor)` — the pinned Work case studies' continuous scroll-scrubbed pipeline progress (`PROJECT_SCENES` in `scenes.js`, positionally keyed to each project's `pipeline` array in `content.js`). Cheap, direct writes only — no per-tick allocation, no tween spawned per scroll event.
- `assertScenesMatchContent()` (dev-only) — **throws** if a project's beat-array length and its `pipeline` label count ever diverge. Verified to actually throw (not just log) during Step 9/10 verification.

**Frameloop gating** (`src/hooks/useFrameloopGate.js`, ADR-0013): the Canvas's `frameloop` prop is `never` (hidden tab or preloader still up) / `always` (recent scroll/pointer activity) / `demand` (idle — a mounted `<Invalidator/>` wakes rendering only while a GSAP tween touches `scene`). Every primitive's `useFrame` clamps `delta` to 0.05s, which is what makes long gaps between `demand`-mode renders safe.

## 6. All major design decisions (ADR index)

Full reasoning in `docs/adr/` — read the relevant one before touching anything it governs. `0008` and `0009` are **superseded but their original text is kept as written** (never edit a superseded ADR's body, only its status line — see the README's own conventions).

| ADR | Decision |
|---|---|
| 0001–0007 | Motion architecture fundamentals (single clock, state outside React, reduced motion is a branch, preloader can't trap, overlays portal above chrome, per-element 3D perspective, measure layout not overflow) |
| 0008 | *Superseded by 0010* — the old custom-GLSL hero artifact |
| 0009 | *Superseded by 0015* — the old cursor reticle/HUD (its core rule, never hide the native cursor, is restated in 0015, not overturned) |
| 0010 | The visual identity is one composable vocabulary, not one object |
| 0011 | Nodes and links are architecture, never an ambient network — never random, never idle, always sparse |
| 0012 | Scene state is data, not components |
| 0013 | The frameloop is gated |
| 0014 | One accent (`#E0472C`/`#E9674B`), and it means "resolved" — status is shape/label now, never a second hue |
| 0015 | The cursor is a contextual dot — native cursor never hidden |
| 0016 | Reduced motion gets a static system diagram (`StaticField.jsx`), never an empty page |
| 0017 | Pinned case studies (Work section) replace the old horizontal rail |

Also load-bearing, not yet its own ADR: the Hero "Living System Layers" formation (§4) and its constraint that nodes/particle-network and grid/dashboard treatments are explicitly off the table for the hero specifically.

## 7. Files changed (this session's work, on top of the deployed baseline)

Deployed (commit `c8b4082`): full V2 rebuild — see `git show --stat c8b4082` for the complete 54-file list (scene primitives, sections, Work rebuild, typography, all ADRs, `DESIGN.md`, `PRODUCT.md`).

Post-deploy, still uncommitted on `main` right now:
```
 M src/data/scenes.js
 M src/lib/sceneState.js
 M src/three/primitives/Layers.jsx
 M src/three/shaders/system.glsl.js
```
(4 files, +59/−9 lines — the Living System Layers hero implementation, §4.)

## 8. Current git status

- Branch: `main`, tracking `origin/main`.
- Last commit: `c8b4082` — "Complete V2 portfolio redesign" — **pushed and deployed**.
- Working tree: the 4 files above, modified, **not staged, not committed**.
- Do not commit until the owner explicitly approves after their own visual review (in progress as of this handoff).
- Do not push, and do not force anything — this repo is public and auto-deploys on push to `main`.

## 9. What must not be changed (without an explicit new instruction)

- **Any ADR's original body text.** Amend only for a factual error; a superseded decision changes only its status line.
- **The one-accent rule** (ADR-0014) — no second saturated colour, anywhere, ever.
- **Nodes/Links "never random, never proximity, never idle" rule** (ADR-0011) — the `LIVING` formation's diagonal cascade is a *positions* exception already reasoned through (hero = pre-structure complexity); it does not license loosening this rule anywhere else.
- **The native cursor is never hidden** (ADR-0009 → 0015).
- **Work's pin constraints** (ADR-0006/0007/0017): `#work` carries no `data-panel`; `SectionHead`'s `data-parallax` header is a sibling of the pinned `.case` elements, never their ancestor; measure via `offsetHeight`/`documentElement.clientHeight`, never `scrollWidth`/`100vh`.
- **Privacy constraints** (`PRODUCT.md`): no DOB, no CGPA, no mentor/individual names, no unresolved-security-issue disclosure about the Tyrannix internship product. Grep guards exist for this — run them after any content edit.
- **The Step 2 token-layer deviation** — do not introduce a `--r-*`/`--s-*` radius/spacing token layer retroactively; it was deliberately left undone (documented in `DESIGN.md`'s Shapes section) since the system was rebuilt fresh rather than migrated.
- **The canonical URL** — `https://www.shravandige.dev/`, confirmed via the real Vercel redirect (apex → www). Don't revert to the apex.
- Typography, Work mechanics, section structure, and navigation are **not** in scope for the current hero work — don't touch them incidentally while tuning the hero.

## 10. Future improvement areas

- **Write the ADR for "Living System Layers"** once the owner finalizes it (post-visual-review) — it doesn't have one yet; §4/§6 of this document is the interim record.
- Two cosmetic stale references, low priority, explicitly deferred by the owner in an earlier audit: `ui.css:2` and `base.css:82` still say "marquee"/"mocks" in file-header comments describing content that no longer exists; `base.css:33`'s comment still says `.mock__state--pending`, a deleted class. Zero functional impact.
- **ADR-0013's `Invalidator` behavior could not be live-verified** in the sandbox used to build this (GSAP's own ticker doesn't tick in that environment — a control test confirmed this is a tooling limitation, not a code defect). Worth a real-browser confirmation at some point that a `demand`-mode section transition actually paints correctly mid-tween.
- Large `r3f` bundle chunk (~892 kB) — pre-existing, flagged by Vite's own build output, not something this session's work changed. Code-splitting is the standard fix if it's ever worth the effort.
- The formal radius/spacing token layer (§9) remains undone by deliberate choice — only worth revisiting if a future redesign specifically needs cross-component radius/spacing consistency enforced structurally.

## 11. Technical stack

- **React 19.2**, **Vite 8.2** (`@vitejs/plugin-react`), ES modules (`"type": "module"`).
- **`@react-three/fiber` 9.7** + **`three` 0.185** — WebGL, no `@react-three/drei` and no `@react-three/postprocessing`/`postprocessing` (both removed; confirmed zero usage before removal).
- **GSAP 3.15** (`ScrollTrigger` registered) drives all scroll-linked animation on one clock; **Lenis 1.3** provides the smooth-scroll feel and feeds GSAP's ticker (ADR-0001).
- No CSS framework — hand-written CSS in `src/styles/{base,ui,sections}.css`, custom-property-driven (`--bg`, `--fg`, `--accent`, `--gutter`, etc. in `base.css`).
- Fonts via Google Fonts `<link>` in `index.html`: **Fraunces** (`opsz`+`wght` only — the `SOFT`/`WONK` axes are deliberately unrequested to keep the file small), **Instrument Serif** (italic, one phrase per section), **Inter Tight** (body), **JetBrains Mono** (data/labels only).
- No backend, no database, no test suite currently in the repo — verification throughout this project has been build (`npm run build`) + grep guards + live browser inspection.
- Deployed on **Vercel**, auto-deploy from `origin/main`.

## 12. Performance considerations

- Instance budgets are tiered (`TIER_COUNTS` in `src/three/Scene.jsx`): `high` = 2048 rows / 40 nodes / 16 links / 8 layers; `low` = 900/24/10/6. Tier decided by `useQualityTier()` (`src/hooks/useEnvironment.js`) from viewport width, `prefers-reduced-motion`, and (now correctly) `navigator.hardwareConcurrency`/`deviceMemory` — unknown `deviceMemory` (Safari/Firefox) no longer downgrades the tier; only an *actually reported* low value does.
- Frameloop gating (§5, ADR-0013) is the largest standing perf win — a hidden tab or an idle page renders zero/near-zero frames instead of full-rate WebGL regardless of visibility.
- `Layers`' new `LIVING` fragment shader gates its `fbm()` call behind `if (edge > 0.001)` specifically so the (comparatively expensive) 4-octave noise evaluation only runs for fragments actually near a pane's border, not across each pane's whole (mostly-empty) fill.
- No post-processing composer anywhere (ADR-0010) — Bloom/ChromaticAberration were tuned for the old artifact and were removed with it; the vignette effect is pure CSS (`.atmosphere` in `base.css`).
- `?motion=full` / `?motion=reduced` URL params override `prefers-reduced-motion` in both directions — `prefersReducedMotion()` (`src/lib/motionState.js`) is the single source of truth every JS-side check uses. Raw CSS `@media (prefers-reduced-motion: reduce)` **cannot** see the URL override — where that gap matters for layout (Work's pin, the hero's static fallback), `App.jsx` mirrors the JS-resolved state onto `<html>` as a class (`reduced-motion`), the same pattern `is-loading`/`menu-open`/`modal-open` already use.

## 13. How another developer/AI should approach modifications

1. **Read before writing.** `PRODUCT.md` for what can be claimed/shown; `DESIGN.md` for the current visual system as actually built (not aspirational); the relevant ADR(s) in `docs/adr/` for *why* a piece of architecture is shaped the way it is. This project has a strong "record the history, not just the current state" discipline — respect it.
2. **Verify claims against the live code, not memory of it** (including this document, several turns from now). Grep before assuming a token/class/pattern still exists.
3. **This project has a strict incremental-approval workflow.** The owner reviews and approves narrow, well-scoped steps one at a time, not sweeping changes. Match that pace: propose a scoped plan, get confirmation, implement exactly that scope, verify, report — don't bundle unrelated cleanup into a requested change, and don't silently make a design decision that isn't specified (surface it and ask instead).
4. **Run the grep guards after any content or palette change**: `grep -rn -- '--cyan\|--vio\|--pink\|--iri\|font-variation-settings\|Archivo' src/ index.html` (should be empty besides the known `.pill--live`/`.pill--learning` false positives) and the privacy guard `grep -rn '08/09/2005\|2\.43\|Date of Birth\|CGPA' src/ public/ index.html` (should only ever match the doc-comment that describes the rule, never real data).
5. **`npm run build` before calling anything done.** GLSL syntax errors do not fail the JS build — they only surface as a browser console error at runtime, so also load the page and check the console.
6. **Treat `scene` (sceneState.js) mutations as the only correct way to change what the 3D shows.** Never reach for React state or a new mount/unmount for anything visual-system-related — it exists specifically to avoid that (ADR-0002, ADR-0012).
7. **Never commit or push without explicit approval.** This is a public repo that auto-deploys to production on every push to `main` — there is no staging environment.
