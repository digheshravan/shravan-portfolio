import { gsap } from './gsap'

/**
 * Scene choreography state.
 *
 * Extends the ADR-0002 pattern (per-frame state lives outside React) from
 * scroll/pointer to the 3D composition itself. Switching from one beat to
 * another — or from one project to another — writes a handful of numbers here.
 * No mount/unmount, no disposal, no shader recompile, no React render.
 *
 * Written by: the section/case ScrollTriggers.
 * Read by:    each primitive's useFrame, which damps toward these targets.
 */

const PRIM_KEYS = ['rows', 'nodes', 'links', 'layers']
const lerp = (a, b, t) => a + (b - a) * t

export const scene = {
  /** Crossfade between formA and formB, 0..1. */
  blend: 0,
  /** Fraction of instances in the "resolved/active" state — drives the accent. */
  active: 0,
  /** Master opacity for the whole system. The 3D yields to the content. */
  opacity: 1,

  rows: { formA: 1, formB: 1, amt: 1 },
  nodes: { formA: 0, formB: 0, amt: 0 },
  links: { formA: 0, formB: 0, amt: 0 },
  layers: { formA: 0, formB: 0, amt: 0 },

  /** Which case study is on screen, and how far through its pipeline. */
  slug: null,
  step: 0,
}

/** Formation ids — must stay in sync with the constants in system.glsl.js. */
export const FORM = {
  NONE: 0,
  SCATTER: 1,
  ALIGN: 2,
  DISTILL: 3,
  BARS: 4,
  STRATA: 5,
  PIPE: 6,
  CLUSTER4: 7,
  LATTICE: 8,
  RESOLVE: 9,
  LIVING: 10,
}

/**
 * Apply a beat instantly — no crossfade. Used for the very first paint,
 * where each primitive reads these fields at construction time rather than
 * waiting for a frame to tick.
 */
export function applyBeat(beat) {
  for (const key of PRIM_KEYS) {
    const b = beat[key]
    scene[key].formA = b ? b.form : FORM.NONE
    scene[key].formB = b ? b.form : FORM.NONE
    scene[key].amt = b ? b.amt : 0
  }
  scene.active = beat.active ?? 0
  scene.opacity = beat.opacity ?? 1
  scene.blend = 0
}

/**
 * Crossfade the live scene to `beat` over `duration`s. formA becomes
 * wherever the last tween actually landed (formB), formB becomes the new
 * target, and `blend` tweens 0→1 — the mechanism validated in the Step 0
 * lab (src/three/Lab.jsx). `amt`/`active`/`opacity` are set directly since
 * each primitive damps toward them independently every frame.
 */
export function animateToBeat(beat, duration = 1.4) {
  for (const key of PRIM_KEYS) {
    const cur = scene[key]
    const b = beat[key] ?? { form: FORM.NONE, amt: 0 }
    cur.formA = cur.formB
    cur.formB = b.form
    cur.amt = b.amt
  }
  scene.blend = 0
  scene.active = beat.active ?? 0
  scene.opacity = beat.opacity ?? 1

  gsap.killTweensOf(scene)
  gsap.to(scene, {
    blend: 1,
    duration,
    ease: 'in-out-quint',
    onComplete: () => {
      for (const key of PRIM_KEYS) {
        scene[key].formA = scene[key].formB
      }
      scene.blend = 0
    },
  })
}

/**
 * Call once when a pinned case study's pin becomes the active one. Carries
 * the scene's current, already-settled visual state forward as the source
 * for that case's first blend — the same "formA = last formB" continuity
 * animateToBeat() uses for section transitions — and returns a cursor for
 * scrubCase() to advance.
 */
export function beginCase(slug) {
  gsap.killTweensOf(scene)
  scene.slug = slug
  const entry = { active: scene.active, opacity: scene.opacity }
  for (const key of PRIM_KEYS) {
    scene[key].formA = scene[key].formB
    entry[key] = { amt: scene[key].amt }
  }
  return { i0: 0, entry }
}

/**
 * Continuous, per-tick scrubbing through one case study's pipeline. `beats`
 * is that project's PROJECT_SCENES array; `progress` is 0..1 across the
 * whole pin, as reported by ScrollTrigger's onUpdate. Direct arithmetic
 * writes into `scene` only — no tweens, no allocation beyond the loop
 * itself — so it is cheap enough to call on every scrub tick.
 *
 * Segment 0 blends `cursor.entry` (the snapshot beginCase() took) into
 * beats[0]; each later segment blends beats[i-1] into beats[i]. formA is
 * only reassigned when the segment actually changes, so a fast flick
 * through several steps in one tick still lands on a coherent pair.
 */
export function scrubCase(beats, progress, cursor) {
  const n = beats.length
  const t = Math.min(Math.max(progress, 0), 1) * n
  const i0 = Math.min(Math.floor(t), n - 1)
  const frac = Math.min(t - i0, 1)

  if (i0 !== cursor.i0) {
    if (i0 > 0) {
      for (const key of PRIM_KEYS) scene[key].formA = beats[i0 - 1][key]?.form ?? FORM.NONE
    }
    cursor.i0 = i0
  }

  const from = i0 === 0 ? cursor.entry : beats[i0 - 1]
  const to = beats[i0]
  for (const key of PRIM_KEYS) {
    scene[key].formB = to[key]?.form ?? FORM.NONE
    scene[key].amt = lerp(from[key]?.amt ?? 0, to[key]?.amt ?? 0, frac)
  }
  scene.blend = frac
  scene.active = lerp(from.active ?? 0, to.active ?? 0, frac)
  scene.opacity = lerp(from.opacity ?? 1, to.opacity ?? 1, frac)
  scene.step = i0

  return i0
}
