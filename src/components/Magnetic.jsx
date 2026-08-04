import { useLayoutEffect, useRef, cloneElement } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'

/**
 * Pulls its child toward the cursor within a radius, then springs back.
 * The inner label lags slightly behind the shell, which is what makes the
 * effect read as physical rather than as a transform.
 */
export function Magnetic({ children, strength = 0.35, radius = 90, innerStrength = 0.18 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return

    const inner = el.querySelector('[data-magnetic-inner]')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'out-expo' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'out-expo' })
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 1.3, ease: 'out-expo' })
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 1.3, ease: 'out-expo' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      if (ixTo) {
        ixTo(dx * innerStrength)
        iyTo(dy * innerStrength)
      }
    }

    const onLeave = () => {
      xTo(0)
      yTo(0)
      if (ixTo) {
        ixTo(0)
        iyTo(0)
      }
    }

    // Listen on a padded area so the pull begins before the cursor arrives.
    const onWindowMove = (e) => {
      const rect = el.getBoundingClientRect()
      const inside =
        e.clientX > rect.left - radius &&
        e.clientX < rect.right + radius &&
        e.clientY > rect.top - radius &&
        e.clientY < rect.bottom + radius
      if (inside) onMove(e)
      else onLeave()
    }

    window.addEventListener('pointermove', onWindowMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onWindowMove)
      gsap.killTweensOf([el, inner].filter(Boolean))
    }
  }, [strength, radius, innerStrength])

  return cloneElement(children, { ref })
}
