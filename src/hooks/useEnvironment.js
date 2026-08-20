import { useEffect, useState } from 'react'
import { pointer, damp, prefersReducedMotion } from '../lib/motionState'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Decides how much spectacle this device can actually afford. The verdict is
 * returned (not written to a shared singleton) — Scene.jsx reads `tier`
 * directly as a prop.
 */
/** `?motion=full` opts back into the full experience, `?motion=reduced` out of it. */
function motionOverride() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('motion')
}

export function useQualityTier() {
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const coarse = useMediaQuery('(pointer: coarse)')
  const small = useMediaQuery('(max-width: 900px)')

  const override = motionOverride()
  const reduced = override === 'full' ? false : override === 'reduced' ? true : prefersReduced

  const [tier, setTier] = useState('high')

  useEffect(() => {
    // Unknown defaults to capable, not weak: hardwareConcurrency is absent
    // on very old browsers, and deviceMemory is Chromium-only — Safari and
    // Firefox never report it. Treating "we don't know" as "assume 4GB" was
    // pinning every non-Chromium visitor to `low` regardless of hardware;
    // memory only downgrades the tier when it's actually reported and low.
    const cores = navigator.hardwareConcurrency ?? 8
    const memory = navigator.deviceMemory
    const weak = cores <= 4 || (memory !== undefined && memory <= 4)

    const next = reduced ? 'minimal' : small || weak ? 'low' : 'high'
    setTier(next)
  }, [reduced, small])

  return { tier, reduced, coarse, small }
}

// How long the pointer can sit still before `pointer.active` clears itself —
// generous enough that a normal reading pause doesn't flicker it off.
const POINTER_IDLE_MS = 4000

/** Global pointer tracking, eased, written into the shared singleton.
 *  Nothing reads `pointer.ex/ey` under reduced motion — Cursor bails before
 *  using them and the WebGL rig doesn't mount — so the loop doesn't start. */
export function usePointerTracking() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    let raf = 0
    let last = performance.now()
    let idleTimer = 0

    const clearActive = () => {
      clearTimeout(idleTimer)
      pointer.active = false
    }

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      // Touch fires pointermove too, mid-drag — only a real mouse or pen
      // marks the pointer "active"; a touch interaction clears it instead
      // (see onTouchStart below), the same way it never set it in the first
      // place before this fix.
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        pointer.active = true
        clearTimeout(idleTimer)
        idleTimer = setTimeout(clearActive, POINTER_IDLE_MS)
      }
    }

    const onTouchStart = (e) => {
      if (e.pointerType === 'touch') clearActive()
    }

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      pointer.ex = damp(pointer.ex, pointer.x, 4, dt)
      pointer.ey = damp(pointer.ey, pointer.y, 4, dt)
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onTouchStart, { passive: true })
    // pointerleave doesn't bubble, so window never sees it; document is the
    // standard exit-intent target — it fires when the pointer leaves the
    // browser's content area entirely.
    document.addEventListener('pointerleave', clearActive)
    window.addEventListener('blur', clearActive)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onTouchStart)
      document.removeEventListener('pointerleave', clearActive)
      window.removeEventListener('blur', clearActive)
      clearTimeout(idleTimer)
      cancelAnimationFrame(raf)
    }
  }, [])
}
