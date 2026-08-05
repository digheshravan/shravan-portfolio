import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { scroll, clamp } from '../lib/motionState'

let lenisInstance = null
export const getLenis = () => lenisInstance

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis; ScrollTrigger listens to
 * both. Wiring it in this order is what keeps pinned sections from juddering.
 *
 * When smoothing is off (reduced motion), we still have to publish scroll
 * position into the shared state — the rail and the 3D scene read it, and a
 * frozen progress value would leave them stuck at zero.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      let last = 0
      const onScroll = () => {
        const limit = document.documentElement.scrollHeight - window.innerHeight
        const offset = window.scrollY
        scroll.offset = offset
        scroll.progress = limit > 0 ? clamp(offset / limit) : 0
        scroll.velocity = clamp((offset - last) / 60, -1, 1)
        last = offset
      }
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    // `lerp` rather than `duration` + `easing`: a duration-based tween restarts
    // on every wheel tick, so a run of quick ticks keeps interrupting itself and
    // the motion stutters. Lerp eases toward a moving target continuously, which
    // is what makes a long scroll feel like one gesture instead of many. Lower
    // is heavier — 0.085 glides without feeling detached from the wheel.
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    })
    lenisInstance = lenis

    lenis.on('scroll', ({ scroll: offset, limit, velocity }) => {
      scroll.offset = offset
      scroll.progress = limit > 0 ? clamp(offset / limit) : 0
      scroll.velocity = clamp(velocity / 40, -1, 1)
      ScrollTrigger.update()
    })

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [enabled])
}

/** Anchor navigation that respects the smooth-scroll instance. */
export function scrollToSection(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: 0, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
