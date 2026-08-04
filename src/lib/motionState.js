/**
 * Mutable singletons shared between the DOM layer and the WebGL layer.
 *
 * These are deliberately NOT React state: they update on every frame, and
 * pushing them through React would re-render the tree 60+ times a second.
 * The Canvas reads them inside useFrame, which is outside React's render loop.
 */

export const scroll = {
  /** 0 → 1 across the whole document */
  progress: 0,
  /** raw pixel offset */
  offset: 0,
  /** signed, normalised scroll speed — drives shader turbulence */
  velocity: 0,
  /** smoothed absolute velocity, always 0 → 1 */
  energy: 0,
}

export const pointer = {
  /** -1 → 1, normalised device coordinates */
  x: 0,
  y: 0,
  /** eased follower used for parallax so nothing snaps */
  ex: 0,
  ey: 0,
  /** true once the visitor has actually moved a mouse (not a touch) */
  active: false,
}

/** Which section is currently on screen — lets the 3D scene change mood. */
export const stage = {
  index: 0,
  /** 0 → 1 progress within the active section */
  local: 0,
}

export const quality = {
  /** dropped to false on low-end devices / reduced-motion */
  effects: true,
  dpr: 1.5,
}

/**
 * One answer to "should this move?", used by every animated component.
 * Honours the OS setting, but `?motion=full` lets someone opt back in and
 * `?motion=reduced` lets them preview the calm version.
 */
const MOTION_PARAM =
  typeof window === 'undefined'
    ? null
    : new URLSearchParams(window.location.search).get('motion')

export function prefersReducedMotion() {
  if (MOTION_PARAM === 'full') return false
  if (MOTION_PARAM === 'reduced') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt))

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const mapRange = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin)
