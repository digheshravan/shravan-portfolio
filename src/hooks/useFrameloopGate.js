import { useEffect, useState } from 'react'
import { invalidate } from '@react-three/fiber'
import { gsap } from '../lib/gsap'
import { scene } from '../lib/sceneState'
import { prefersReducedMotion } from '../lib/motionState'

// No scroll or pointer activity for this long settles the canvas into
// `demand` mode. After the last GSAP tween touching `scene` completes, the
// Invalidator below keeps waking it a little longer than this, so each
// primitive's own per-frame damp() has time to close the gap.
const IDLE_MS = 1200
const SETTLE_MS = 800

/**
 * Decides the R3F Canvas's frameloop mode.
 *
 *  - Tab hidden, or the preloader still up (nothing to show, or nothing
 *    anyone can see yet): `never` — zero frames render.
 *  - No scroll or pointer activity for IDLE_MS: `demand` — mount
 *    <Invalidator/> alongside this inside the Canvas; it wakes rendering
 *    for exactly as long as something is actually animating.
 *  - Otherwise: `always`.
 *
 * Every primitive's useFrame already clamps its delta (Math.min(delta,
 * 0.05)), so a long gap between demand-mode renders is safe — the damping
 * just takes as many logical steps to converge as it always would, whether
 * those renders were a frame apart or a second apart.
 */
export function useFrameloopGate(ready) {
  const [mode, setMode] = useState('never')

  useEffect(() => {
    // Reduced motion never mounts a Canvas at all (Scene.jsx's minimal-tier
    // branch renders StaticField instead) — this state simply goes unread,
    // but there's no reason to run scroll/pointer listeners for it either.
    if (!ready || prefersReducedMotion()) {
      setMode('never')
      return
    }

    let idleTimer = 0

    const settle = () => {
      idleTimer = setTimeout(() => setMode('demand'), IDLE_MS)
    }

    const wake = () => {
      if (document.hidden) return
      clearTimeout(idleTimer)
      setMode('always')
      settle()
    }

    const onVisibility = () => {
      clearTimeout(idleTimer)
      if (document.hidden) {
        setMode('never')
      } else {
        setMode('always')
        settle()
      }
    }

    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('pointermove', wake, { passive: true })
    window.addEventListener('wheel', wake, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    onVisibility()

    return () => {
      clearTimeout(idleTimer)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('pointermove', wake)
      window.removeEventListener('wheel', wake)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [ready])

  return mode
}

/**
 * Lives inside the Canvas, mounted only while frameloop is `demand` — in
 * that mode r3f renders nothing unless invalidated. Scroll- and
 * pointer-driven updates already pull the gate back to `always` before they
 * write anything (see useFrameloopGate above), so the one thing left that
 * can still move the scene while otherwise idle is a GSAP tween on `scene`
 * itself (animateToBeat(), used by section/case beat transitions). This
 * watches for exactly that, keeps invalidating for SETTLE_MS after the last
 * one completes so each primitive's own damping can catch up, then goes
 * fully quiet again.
 */
export function Invalidator() {
  useEffect(() => {
    let raf = 0
    let settledAt = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const now = performance.now()
      if (gsap.isTweening(scene)) {
        settledAt = now + SETTLE_MS
        invalidate()
      } else if (now < settledAt) {
        invalidate()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return null
}
