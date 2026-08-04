# Shravan Dige — Portfolio

A scroll-driven 3D portfolio. Custom GLSL, one continuous WebGL scene behind the
whole page, and a motion system built on GSAP + Lenis.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the build
```

## How it's put together

```
src/
  data/content.js      Every piece of copy on the site. Edit here, not in JSX.
  lib/motionState.js   Frame-rate state (scroll, pointer) shared DOM ↔ WebGL.
  lib/gsap.js          Plugin registration + the custom eases.
  hooks/               Smooth scroll, quality tiering, pointer tracking.
  three/               The WebGL layer: Artifact, Particles, Scene, shaders.
  sections/            Hero, About, Skills, Work, Journey, Contact.
  components/          Preloader, Nav, Cursor, Marquee, Reveal, DeviceMock…
  styles/              base (tokens/reset) → ui (chrome) → sections (layout).
```

### The scene

One `<canvas>` is fixed behind the entire document. A displaced icosahedron
(`three/shaders/artifact.glsl.js`) is shaded as iridescent chrome: fbm noise
pushes the surface, normals are rebuilt from finite differences so the lighting
stays welded to the geometry, and a cosine palette does the thin-film colour.

Its position, scale, opacity and "morph" are keyframed against **document scroll
progress** in `three/Artifact.jsx` (`KEYS`). That array is the choreography for
the whole page — move a number there and the object's whole journey changes.

### 3D section transitions

Every panel (`data-panel`) arrives out of depth — `translateZ(-420px)`,
`rotateX(-13°)`, 25% opacity — rotates flat as it takes the screen, and tips the
other way (`rotateX(+10°)`, `translateZ(-340px)`) as it leaves. Hero → About →
Craft → Work → Path → Contact all hand off this way. Scrolling itself stays
completely normal: no snapping, no pinning, no hijacked wheel.

Two details that matter:

- **Perspective is per element** (`transformPerspective`), not `perspective` on a
  shared ancestor. On a ~9,000px page a single ancestor puts the vanishing point
  thousands of pixels from most sections, which shears them instead of rotating
  them.
- **`force3D` is left at `"auto"`**, so GSAP drops back to a 2D matrix once a
  panel settles. Verified: at rest a panel's transform is just
  `perspective(1500px)` with opacity 1 — nothing to blur the type while it's
  being read.

The last panel never plays its exit; it carries the footer, and dimming the
contact details on the way out would be a strange note to end on.

### Scroll choreography

`hooks/useScrollChoreography.js` holds the page-wide scroll behaviour so it
isn't copy-pasted into every section:

- **Velocity skew** — anything marked `data-skew` leans up to 1.2° in the
  direction of travel and springs back. Deliberately small: these are
  full-width panels, so a degree already moves their edges ~15px.
- **Declarative parallax** — `data-parallax="0.05"` drifts an element against
  its section at that fraction of the scroll distance. Add
  `data-parallax-scope` to an ancestor to measure the drift over that ancestor
  instead of the whole section (used so each project card parallaxes over its
  own height).
- **Section rules** draw themselves in as their header enters.

On top of that each section has one signature move: the About statement lights
word by word, Skills rows wipe open individually via `clip-path`, the Journey
spine draws with a light riding its leading edge, Work's device and copy travel
at different rates, and Contact's outline word slides against the page.

### Pointer and scroll affordances

`components/Cursor.jsx` is an instrument reticle built for this portfolio
specifically: it reports the pointer in **normalised device coordinates**, the
same -1 → 1 space the shaders use for `uMouse`. The number on screen is the one
currently deforming the artifact behind the page — move toward the object and
watch X approach 1. The ring is real CSS-3D, carrying its own
`transformPerspective` and banking on Y / pitching on X in proportion to pointer
velocity, so it leans into movement like a gimbal and levels out at rest.
Corner brackets snap in over interactive elements.

The **native cursor is never hidden.** The crosshair arms are drawn with a
transparent gap at the centre precisely so the system arrow reads through them —
nobody has to hunt for where they're pointing. Interactive elements keep the
normal `cursor: pointer`.

Three things report scroll position, deliberately: the real scrollbar (styled,
still draggable), a top progress bar that works on every screen size, and the
right-hand `SectionRail`, which names the current section and jumps on click.

### Motion state

Scroll and pointer values update every frame, so they live in plain mutable
objects (`lib/motionState.js`) rather than React state — pushing them through
render would re-render the tree 60× a second. `useFrame` reads them directly.

### Two rules worth keeping

1. **Never `gsap.from()`.** Use `gsap.set()` + `.to()`, or `gsap.fromTo()`. A
   bare `from()` records the element's *current* state as its destination, so
   any invalidation (a `ScrollTrigger.refresh()` on font load or resize) can
   promote the start pose into the end pose and strand content at `opacity: 0`.
2. **`gsap.context(fn, el)` scopes selectors to `el`'s descendants.** A selector
   matching the root element itself silently matches nothing — reference the
   root through its ref.

### Performance and accessibility

`useQualityTier()` picks `high` / `low` / `minimal` from screen size, CPU cores
and device memory, then sets DPR, particle count, mesh subdivision and whether
post-processing runs at all. `prefers-reduced-motion` drops to `minimal`: no
canvas, no smooth scroll, no reveals — just the page.

Override with a query string when you need to demo it:

- `?motion=full` — force the full experience
- `?motion=reduced` — force the calm version

The `three`/`@react-three` bundle (~1 MB) is lazy-loaded so it downloads
alongside the preloader instead of blocking first paint.

## Editing content

Everything — profile, projects, skills, education, recognition — is in
`src/data/content.js`. The résumé served at `/Shravan-Dige-CV.pdf` lives in
`public/`; replace that file to update the download.
