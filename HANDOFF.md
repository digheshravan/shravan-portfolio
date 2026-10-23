# Handoff — Shravan Dige Portfolio

**Date:** 2026-10-24 (supersedes the 2026-08-20 handoff)
**Prepared for:** another AI/design reviewer picking this project up next
**Repo:** `git@github.com:digheshravan/shravan-portfolio.git`, branch `main`
**Live:** `https://www.shravandige.dev/` (canonical), Vercel auto-deploys `main`

---

## 1. Project overview

A single-page React + WebGL portfolio for Shravan Dige — MBA Tech student (Computer Engineering × Management, NMIMS Mumbai) — built as a hand-authored 3D experience, not a template. No backend, no database, no auth. Content is static and lives entirely in `src/data/content.js`; the CV (`public/Shravan-Dige-CV.pdf`) is the parallel document and must never disagree with the site.

Primary audience: recruiters and hiring contacts (India-first, internationally legible), who verify claims against the public GitHub repos within the first minute. Secondary audience: the public record — peers, collaborators, anyone sent the link. Full positioning, evidence-on-hand, and disclosure boundaries are in `PRODUCT.md` — read it before changing any copy or claim.

## 2. Current design philosophy

**"Complexity → System."** Every project on the CV does the same thing: takes something dense and unstructured and produces a system that makes it usable (DocMind on legal/research documents, the IPO Risk Decoder on DRHP filings, MediSlot on care coordination). The site's visual identity argues that same point instead of decorating around it — a composable vocabulary of 3D primitives that reconfigures as the page's own argument moves from complexity toward a resolved structure.

Chrome discipline: near-black ground, warm off-white ink, **one accent colour with one meaning** (resolved/active), a Didone-class serif for display type, monospace for anything that's a genuine measurement. Nothing decorative that isn't also structural.

## 3. History in one screen

| Commit | What | State |
|---|---|---|
| `c8b4082` | Complete V2 redesign (Steps 0–10, ADRs 0010–0017, `DESIGN.md`, `PRODUCT.md`) | pushed, deployed |
| `68d37dc` | "Living System Layers" hero, Tyrannix project badge, case-study metrics/CTA reorder, mobile pipeline stepper, first `HANDOFF.md` | pushed, deployed (production verified serving it on 2026-10-24) |
| *(next local commit)* | Apple-Design-Skill audit fixes — §4. Includes the fix that makes the 3D system animate at all. | **local only — not pushed, not deployed** |

V2 step summary (unchanged): Step 0 concept lab (`?lab=1`, `src/three/Lab.jsx`); Step 1 bug fixes (frameloop gating etc., ADR-0013); Step 2 radius/spacing token layer **deliberately not built** (§9); Step 3 Archivo → Fraunces; Steps 4–5 the four-primitive vocabulary; Step 6 sections; Step 7 chrome; Step 8 dead-code cleanup; Step 9 `StaticField` + reduced-motion audit; Step 10 docs.

## 4. October 2026 audit pass (this handoff's main subject)

A full audit was run against the Apple Design Skill (Apple HIG, used as design principles for a web app) with **WCAG 2.2 AA as the pass/fail baseline** for accessibility. Large text = 18pt (24px) or 14pt (≈18.66px) bold per WCAG — not Apple's 17pt figure. Apple-only numbers (11pt phone / 10pt desktop minimum text, 44pt targets) are treated as recommendations, not WCAG failures. Every approved finding was then fixed in six batches.

### 4.1 The 3D system never animated (critical — fixed)

**Root cause.** `@react-three/fiber` 9.7.0's `applyProps` copies each entry of a `<shaderMaterial uniforms={…}>` prop into the material (`uniforms[name] = { ...uniform }`, `node_modules/@react-three/fiber/dist/events-*.esm.js` ~line 428). Every primitive's `useFrame` mutated the *memoised* uniforms object, which the GPU never reads. So the entire system froze at whatever `scene` held when the Canvas mounted — usually the default `rows: SCATTER, amt 1` (2048 tilted hairlines), sometimes the hero's static Layers panes, depending on load timing. That frozen scatter is very likely what the owner originally described as "childish scribble". r3f 9.7.0 has been the installed version since the very first commit, so this was never working in production — including the deployed Living System Layers hero and every Work pipeline scene.

**Fix.** `Rows.jsx`, `Nodes.jsx`, `Links.jsx`, `Layers.jsx`: `useFrame` now writes to `mat.current.uniforms` (the material's own copy, via a ref on `<shaderMaterial>`). Comment in `Rows.jsx` explains why; the others point to it. The memoised `uniforms` object is still what seeds the material's initial values.

**Earlier verification was wrong.** The previous session "verified" Living System Layers by forcing one render with `r3f.advance()` and reading pixels — that captured the *initial* uniforms, which happened to be correct, and masked the bug. Don't trust a single forced frame as proof of animation; read the material's `uniforms.uTime.value` twice, some time apart.

### 4.2 Other fixes, by batch

| Batch | Finding | Change | Files |
|---|---|---|---|
| 2 | Phone menu covered its own Close button (`--z-menu` 55 > `--z-nav` 50); no Escape; Tab escaped behind the overlay | `html.menu-open .nav` lifted above the menu; Escape closes; focus moves to first link on open and back to burger on close; `.main`/`.rail` set `inert` while open; `menu-open` class now set even without Lenis (reduced motion); `aria-controls` | `Nav.jsx`, `ui.css` |
| 2 | Focus stranded after in-page nav | `scrollToSection()` now focuses the target section (`tabindex="-1"`, no visible ring) | `useSmoothScroll.js`, `base.css` |
| 3 | ~4.6 s preloader on every visit, CTA visible ~6.9 s after load | Preloader compressed; hero handed control at 0.85 s (as the column wipe *starts*); skipped on repeat visits in a session (`sessionStorage`, try/catch, read once at module load so StrictMode can't skip a first visit); content behind it `inert`; watchdog 6 s → 3 s. Hero intro re-timed to ~1 s with the lede/buttons at 0.15 s | `Preloader.jsx`, `Hero.jsx` |
| 3 | React was bundled inside the three/r3f chunk, so ~890 kB of three.js was preloaded and parsed before first render — the lazy `<Scene>` did nothing | `manualChunks` no longer names three/r3f (forcing them made Rolldown emit React's CJS wrappers into that chunk); React gets its own `react` chunk | `vite.config.js` |
| 4 | Skill-row hover dimmed siblings to 1.39:1; pipeline step numbers 2.38:1; About statement resting at 1.46:1 | Sibling dimming removed; step-index opacity removed; About words rest at 0.5 (4.77:1) | `sections.css` |
| 5 | Work was 73% of the page's scroll length | Pinned distance per pipeline step 1.0 → 0.4 screen (`STEP_SCREENS`); visible "Skip to experience" link (44 px tall) at the top of Work | `Work.jsx`, `sections.css` |
| 5 | Nav labels "Index / Craft / Path" | Home, About, Skills, Projects, Experience, Contact | `content.js` |
| 6 | Many labels at 9–10 px | New `--t-micro: 0.6875rem` (11 px) token; every sub-11 px size points at it | `base.css`, `ui.css`, `sections.css` |
| 6 | Hidden (scrolled-away) nav stayed hidden when keyboard-focused | Revealed on `focusin`; not re-hidden while focus is inside | `Nav.jsx` |
| 6 | Grain jittered forever; pulse dot and scroll cue looped forever (WCAG 2.2.2 risk) | Grain static; `.dot` pulse and cue run 3 cycles | `base.css`, `sections.css` |
| 6 | Section rail came first in tab order; labels hover-only; three position indicators | Rail rendered after `<main>`; labels show on `:focus-within`; `%` readout and count removed | `App.jsx`, `Overlays.jsx`, `ui.css` |
| 6 | Phone cards read a status note before saying what the project is; "In development" ×3; pill overflowed at 320 px; dot separator dangled at a line end when wrapped | Summary now precedes metrics/CTA (all widths — CTA still above pipeline/stack); "Stage" metric removed; no-repo note shortened; `.case__meta` wraps; no dot separators before pills | `Work.jsx`, `content.js`, `sections.css` |
| 6 | Small writing/a11y items | "Résumé" spelt consistently, contact row says "Open PDF" (it opens a tab); copy button announces copied/blocked via a `role="status"` region and no longer fails silently; all 11 new-tab links carry a visually hidden "(opens in new tab)"; recognition rows no longer fake a pointer affordance; cursor labels Projects/PDF/Email; section indices renumbered 01–04 (hero and contact are unnumbered bookends) | `Hero.jsx`, `Contact.jsx`, `Experience.jsx`, `Nav.jsx`, `Work.jsx`, section files |

### 4.3 Verification actually performed (2026-10-24)

Environment caveat first: the in-app browser pane used for testing was throttled to **1–3 animation frames per second** for most of the session (window not in view). Wall-clock animation timing could therefore not be measured. Where timing mattered, a deterministic harness drove `gsap.ticker.tick()` manually at ~60 Hz (Lenis and every GSAP tween run off that ticker). That is a simulation of normal frame rates, **not** a real 60 fps display.

| Check | How | Result |
|---|---|---|
| `npm run build` | CLI | passes (chunk-size warning for the lazy 3D chunk, see §10) |
| `git diff --check` | CLI | clean |
| Grep guards (§13) | CLI | palette/typography: no matches; privacy: only the rule's own doc comment |
| Lint / unit tests | — | **none exist in this repo**; not run |
| 3D uniforms update | dev build: read `material.uniforms` via r3f `_roots`; scroll; read again | hero: rows/nodes/links `amt 0`, layers `LIVING amt 1`, `uTime` advancing, pointer tracked; formations follow `scene` |
| Section transitions | simulated-60 Hz harness, Lenis-driven wheel-like scrolling, compare `scene` to `SECTION_BEATS` after each section | 7/7 match — hero, about, skills, journey, contact going down; journey and skills going back up through the Work pins |
| "One section late" report | as above | **not reproduced.** It came from the earlier test method (native `scrollIntoView` jumps bypassing Lenis, 2 fps ticker, state read too early) |
| Nav click → Experience from top | harness, real `click()` | scene matches `journey` beat; focus on `#journey` |
| Work pin mid-pipeline (DocMind, 60%) | harness | `scene.step` 2, DOM active step 2, scene + GPU formations match `PROJECT_SCENES.docmind[2]` |
| Phone menu | 375 px, real Tab/Enter/Escape key presses | focus into menu on open; Tab cycles menu + brand + Close only; Close is the topmost element at its own centre; Escape closes and refocuses burger; link navigation focuses the section |
| Skip link | real Tab + Enter from top of Work | lands on Experience (scroll 16,362 px), focus on `#journey` |
| Hidden nav focus | wheel-scroll down, then real Shift+Tab | bar revealed, focused link fully on screen |
| Contrast | script over every visible text node, alpha/opacity composited, WCAG large-text rule | 0 failures at 320, 375, 920, 1181 px; minimum 4.77:1 desktop, 6.2:1 phone |
| Text size | same script | no visible text under 11 px at any of those widths |
| Reflow / overflow | `scrollWidth` vs viewport | no horizontal overflow at 320 px; IPO card pills wrap with no dangling dot |
| Nav fit | 920 px | six labels on one row |
| Infinite animations | `document.getAnimations()` after 10 s | none running |
| Console | dev build | no errors |
| Initial JS | brotli of the files `index.html` loads | ~110 KB (index 14.6 KB, react 50.8 KB, motion 44.4 KB, runtime 0.4 KB); was ~367 KB with three/r3f preloaded |
| Scroll length | measured offsets at 1181×1091 | Work 20,765 → 11,741 px; Experience starts at 16,362 px (was 25,386) |

**Not verified:** real wall-clock time-to-CTA (designed: buttons fully opaque ≈1.8 s after load on a first visit, ≈0.9 s on a repeat visit — first visit misses the 1.5 s audit target at full opacity, though out-expo easing gets them close well before that); idle GPU frame rate; real iOS Safari / Android devices (emulation only); VoiceOver/NVDA; the OS-level Reduce Motion setting (only `?motion=reduced` was exercised); Safari rendering; production build behaviour after deploy (nothing has been deployed).

## 5. 3D architecture

Four instanced primitives, one shared mutable state singleton, zero per-frame React renders:

| Primitive | File | Means |
|---|---|---|
| Rows | `src/three/primitives/Rows.jsx` | information, records, a corpus |
| Nodes | `src/three/primitives/Nodes.jsx` | entities — hairline square outline, never a filled dot |
| Links | `src/three/primitives/Links.jsx` | relationships — right-angle elbow routing, declared pairs only, never proximity-computed |
| Layers | `src/three/primitives/Layers.jsx` | architectural strata — hairline-edged panes, never filled |

Shared GLSL lives in `src/three/shaders/system.glsl.js` (`sysCommon`: hashes, `sel()`, formation-id constants, the shared `nodePos()` so a link can never drift off its endpoints) and `src/three/shaders/noise.glsl.js` (`simplex3d`/`fbm`, used only by the hero's `LIVING` formation).

A **formation** (`FORM.*` in `src/lib/sceneState.js`, `F_*` in the shader) is a named pure function of instance index → position/appearance: `NONE, SCATTER, ALIGN, DISTILL, BARS, STRATA, PIPE, CLUSTER4, LATTICE, RESOLVE, LIVING`. Each shader blends two formations (`uFormA`/`uFormB`) via `uBlend`, so a beat change is a uniform crossfade, not a remount.

**Uniform rule (new, load-bearing):** per-frame writes go to the material's own uniforms (`mat.current.uniforms`), never to the object passed as the `uniforms` prop — see §4.1. Any new primitive must follow this or it will silently freeze.

**State flow** (`src/lib/sceneState.js`):
- `scene` — the singleton `{blend, active, opacity, rows/nodes/links/layers: {formA, formB, amt}, slug, step}`, read every frame by each primitive's `useFrame`, which damps toward it.
- `applyBeat(beat)` — instant, first paint only.
- `animateToBeat(beat, duration)` — GSAP-tweens `blend` 0→1; drives section transitions (`useSceneChoreography.js`, `SECTION_BEATS`) and the stacked/mobile Work transitions.
- `beginCase(slug)` / `scrubCase(beats, progress, cursor)` — pinned Work pipelines (`PROJECT_SCENES`, positionally keyed to each project's `pipeline` in `content.js`).
- `assertScenesMatchContent()` (dev-only) throws if beat count and pipeline label count diverge.

**Hero — Living System Layers** (`SECTION_BEATS.hero`): rows/nodes/links `NONE`, layers `LIVING`, opacity 0.55. `LIVING` is a staggered diagonal cascade of 6 hairline panes drifting slowly; the fragment shader runs `fbm()` along pane edges (gated behind `edge > 0.001`) as a "current", with a rare threshold-gated tint toward the accent and a subtle pointer offset. **Because of §4.1 it now animates for the first time — the owner approved it from a static frame and should re-review it live.** Opacity tuning only: `opacity` in `SECTION_BEATS.hero` and/or `p.vis = 0.26` in the `LIVING` case of `Layers.jsx`.

**Frameloop gating** (`useFrameloopGate.js`, ADR-0013): `never` (hidden tab / preloader) / `always` (recent scroll or pointer) / `demand` (idle; `<Invalidator/>` wakes rendering only while a GSAP tween touches `scene`). `useFrame` clamps `delta` to 0.05 s. Note for testers: r3f's `advance(timestamp)` while the loop is `never` mixes ms timestamps with the clock's seconds and can produce a negative delta that drives the damped uniforms to `NaN` — a harness artefact, not an app path, but don't use `advance()` in `never` mode as evidence.

## 6. Design decisions (ADR index)

Full reasoning in `docs/adr/`. `0008` and `0009` are superseded but their original text is kept (only status lines change).

| ADR | Decision |
|---|---|
| 0001–0007 | Motion architecture fundamentals (single clock, state outside React, reduced motion is a branch, preloader can't trap, overlays portal above chrome, per-element 3D perspective, measure layout not overflow) |
| 0008 | *Superseded by 0010* — old custom-GLSL hero artifact |
| 0009 | *Superseded by 0015* — old cursor reticle (never-hide-native-cursor rule carried forward) |
| 0010 | Visual identity is one composable vocabulary, not one object |
| 0011 | Nodes and links are architecture, never an ambient network |
| 0012 | Scene state is data, not components |
| 0013 | The frameloop is gated |
| 0014 | One accent (`#E0472C`/`#E9674B`), meaning "resolved" |
| 0015 | Cursor is a contextual dot; native cursor never hidden |
| 0016 | Reduced motion gets a static system diagram (`StaticField.jsx`) |
| 0017 | Pinned case studies replace the horizontal rail |

Decisions made in the audit pass that are **not yet ADRs** (see §10): the material-uniform rule (§4.1/§5); the bundle-splitting rule (React own chunk, three/r3f never forced into a manual chunk); preloader timing + session skip (amends the spirit of ADR-0004); `STEP_SCREENS = 0.4` pin distance (amends ADR-0017's one-screen-per-step); the `--t-micro` 11 px floor; static grain / finite loops; Living System Layers itself.

## 7. Files changed in the audit-pass commit

```
src/three/primitives/{Rows,Nodes,Links,Layers}.jsx   uniform writes via material ref (§4.1)
vite.config.js                                       React chunk; three/r3f left to the bundler
src/components/Preloader.jsx                         compressed intro, session skip, inert, reveal-at-wipe
src/components/Nav.jsx                               modal menu, Escape, focus, inert, focus-reveals-nav
src/components/Overlays.jsx                          rail readout removed
src/hooks/useSmoothScroll.js                         scrollToSection moves focus
src/App.jsx                                          rail after <main>
src/sections/Hero.jsx                                ~1 s intro, Résumé label, cursor labels
src/sections/Work.jsx                                STEP_SCREENS, skip link, card order, no pill separators
src/sections/Contact.jsx                             copy status region, Open PDF, new-tab hints
src/sections/{Intersection,Capabilities,Experience}.jsx  indices 01–04; recognition rows
src/data/content.js                                  nav labels; IPO "Stage" metric removed
src/styles/{base,ui,sections}.css                    --t-micro, contrast, grain, loops, menu z-index, skip link, rail focus
HANDOFF.md                                           this document
```

## 8. Git status at handoff

- Branch `main`, tracking `origin/main`; `origin/main` is at `68d37dc`.
- The audit pass is committed **locally only**. Not pushed, not deployed — production still runs `68d37dc`, which includes the frozen-3D bug.
- Pushing to `main` auto-deploys to production. Do not push without the owner's explicit approval.

## 9. What must not be changed (without an explicit new instruction)

- **Any ADR's original body text.** Amend only for a factual error.
- **The one-accent rule** (ADR-0014).
- **Nodes/Links "never random, never proximity, never idle"** (ADR-0011). The hero's `LIVING` cascade lives on Layers and does not license loosening this.
- **The native cursor is never hidden** (ADR-0015).
- **Work's pin constraints** (ADR-0006/0007/0017): `#work` has no `data-panel`; `SectionHead`'s `data-parallax` header is a sibling of the pinned `.case` elements, never their ancestor; measure with `offsetHeight`/`documentElement.clientHeight`, never `scrollWidth`/`100vh`.
- **The material-uniform rule** (§5) — reverting to mutating the prop object re-freezes the whole 3D system with no error.
- **`vite.config.js` chunking** — don't add a manual chunk for `three`/`@react-three`; check that the built `index.html` doesn't `modulepreload` the three.js chunk after any config change.
- **Privacy constraints** (`PRODUCT.md`): no DOB, no CGPA, no mentor/individual names, no unresolved-security-issue disclosure about the Tyrannix internship product.
- **The Step 2 token-layer deviation** — no retroactive `--r-*`/`--s-*` radius/spacing layer. (`--t-micro` is a single type floor, not that layer.)
- **The canonical URL** — `https://www.shravandige.dev/`.
- **Accessibility floors established in the audit**: no text below `--t-micro`; no opacity-based dimming that takes text under 4.5:1 (3:1 for WCAG large text); no infinite decorative animation; the menu's inert/Escape/focus behaviour.

## 10. Known limitations and future work

- **Deploy and re-verify in production** (owner approval required): hero animates, sections transition, first-visit time-to-CTA, real devices.
- **Re-review the live Living System Layers hero** — first time it actually moves (§5).
- **First-visit time-to-CTA** is ≈1.8 s by design to full opacity; the audit target was 1.5 s. Options: start the hero intro earlier in the wipe, or drop the greeting cycle.
- **Experience still starts ~16,400 px down.** The audit's "under ~8,000 px" target isn't reachable without removing the pins; the skip link and nav are the mitigation. A shorter `STEP_SCREENS` or reordering Experience before Work are the remaining levers.
- **Write ADRs** for the decisions listed at the end of §6, and for Living System Layers.
- **Instrument Serif kept.** It's used three times (hero lede italic, the "at" in the role line, the judgment quote) — the audit wrongly said once. Replacing it with Fraunces italic needs the Fraunces `ital` axis, which downloads more than the family it would remove.
- **Lazy 3D chunk is ~910 kB raw / ~198 kB brotli** and still triggers Vite's chunk-size warning. It no longer blocks first render.
- **`THREE.Clock` deprecation warning** comes from r3f 9.7 internals with three 0.185; needs an r3f upgrade to clear.
- **Untested**: VoiceOver/NVDA, OS Reduce Motion, Safari, physical phones, idle GPU frame rate, and ADR-0013's `Invalidator` mid-tween painting at real frame rates.
- Cosmetic stale comments (deferred earlier): `ui.css` header mentions "marquee"/"mocks"; a `base.css` comment mentions the deleted `.mock__state--pending`.
- The radius/spacing token layer remains deliberately undone (§9).

## 11. Technical stack

- **React 19.2**, **Vite 8.2** (Rolldown; `@vitejs/plugin-react`), ES modules.
- **`@react-three/fiber` 9.7** + **`three` 0.185** — no drei, no postprocessing.
- **GSAP 3.15** (`ScrollTrigger`) on one clock; **Lenis 1.3** smooth scroll fed by GSAP's ticker (ADR-0001).
- Hand-written CSS in `src/styles/{base,ui,sections}.css`, custom-property tokens in `base.css` (`--bg`, `--fg-*`, `--accent`, `--t-micro`, `--gutter`…).
- Fonts via Google Fonts in `index.html`: **Fraunces** (`opsz`+`wght`), **Instrument Serif** (italic accents, 3 uses), **Inter Tight** (body), **JetBrains Mono** (labels/data).
- No backend, no database, **no test suite and no lint script** — verification is `npm run build`, grep guards, and browser inspection.
- Vercel, auto-deploy from `origin/main`.

## 12. Performance considerations

- First load: entry + React + GSAP/Lenis ≈110 KB brotli; three.js/r3f/primitives arrive in one lazy chunk when `<Scene>` mounts (during the preloader on a first visit).
- Instance budgets are tiered (`TIER_COUNTS` in `Scene.jsx`): high 2048/40/16/8, low 900/24/10/6, chosen by `useQualityTier()`.
- Frameloop gating (ADR-0013) — hidden tab renders nothing; idle renders only while `scene` is tweening.
- `LIVING` gates its `fbm()` to edge fragments only.
- Grain is a static SVG filter layer now (was a full-viewport layer animated forever).
- No post-processing (ADR-0010); vignette is CSS (`.atmosphere`).
- `?motion=full` / `?motion=reduced` override `prefers-reduced-motion`; `prefersReducedMotion()` (`motionState.js`) is the single JS source of truth, mirrored onto `<html class="reduced-motion">` for CSS.

## 13. How another developer/AI should approach modifications

1. **Read before writing**: `PRODUCT.md` (claims), `DESIGN.md` (visual system — note it predates the audit pass; §4 here is newer), the relevant ADRs.
2. **Verify against live code and live behaviour, not memory** — including this document. For the 3D, read `material.uniforms` over time; one forced frame proves nothing (§4.1).
3. **Incremental-approval workflow**: propose a scoped plan, get confirmation, implement exactly that, verify, report. Don't bundle unrelated cleanup; surface design decisions instead of making them silently.
4. **Grep guards after any content or palette change**: `grep -rn -- '--cyan\|--vio\|--pink\|--iri\|font-variation-settings\|Archivo' src/ index.html` (expect nothing) and `grep -rn '08/09/2005\|2\.43\|Date of Birth\|CGPA' src/ public/ index.html` (expect only the rule's doc comment in `content.js`).
5. **`npm run build` and `git diff --check` before calling anything done.** GLSL errors don't fail the build — load the page and check the console.
6. **`scene` mutations are the only way to change what the 3D shows** (ADR-0002/0012) — never React state or remounts.
7. **Browser-testing caveat**: a backgrounded/throttled tab stalls rAF, GSAP, CSS transitions and timers. Confirm the frame rate (`requestAnimationFrame` count over 1 s) before trusting any timing or animation reading; report throttled results as such.
8. **Never commit or push without explicit approval.** Public repo, auto-deploys on push to `main`, no staging.
