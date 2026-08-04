import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { scroll, prefersReducedMotion } from '../lib/motionState'

/**
 * Infinite ticker whose speed and skew answer to scroll velocity — scrolling
 * hard shoves the type along and leans it. It never stops, so the page always
 * has a pulse even when the visitor doesn't.
 */
export function Marquee({ items, speed = 55, direction = 1, className = '', separator = '✦' }) {
  const root = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2
      const wrap = gsap.utils.wrap(-half, 0)
      let x = direction > 0 ? 0 : -half

      const setX = gsap.quickSetter(track, 'x', 'px')
      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.8, ease: 'out-expo' })

      const tick = (_t, deltaMs) => {
        const dt = deltaMs / 1000
        const boost = 1 + Math.abs(scroll.velocity) * 6
        x -= direction * speed * dt * boost
        setX(wrap(x))
        skewTo(gsap.utils.clamp(-9, 9, -scroll.velocity * 14 * direction))
      }

      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    }, root)

    return () => ctx.revert()
  }, [speed, direction, items])

  const row = (
    <>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <i className="marquee__sep" aria-hidden="true">
            {separator}
          </i>
        </span>
      ))}
    </>
  )

  return (
    <div className={`marquee ${className}`.trim()} ref={root} aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {row}
        {row}
      </div>
    </div>
  )
}
