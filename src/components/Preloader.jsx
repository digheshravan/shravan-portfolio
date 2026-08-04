import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE } from '../data/content'

const WORDS = ['Namaste', 'नमस्ते', 'Hello', 'Bonjour', 'こんにちは', 'Hola']

/**
 * The first four seconds set the tone for everything after them.
 * Counter → greeting cycle → column wipe, then the hero takes over.
 */
export function Preloader({ onComplete }) {
  const root = useRef(null)
  const counterRef = useRef(null)
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    document.documentElement.classList.add('is-loading')

    const reduced = prefersReducedMotion()
    const counterObj = { v: 0 }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove('is-loading')
          onComplete?.()
        },
      })

      // `el` is the context root, so it can't be reached by a descendant
      // selector — every reference to the shell itself has to go through the ref.
      if (reduced) {
        tl.set(el, { display: 'none' })
        return
      }

      tl.to(counterObj, {
        v: 100,
        duration: 2.4,
        ease: 'in-out-quint',
        onUpdate: () => setCount(Math.round(counterObj.v)),
      })
        .fromTo(
          '.preloader__word',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.24, ease: 'power3.out' },
          0.1
        )
        .to(
          '.preloader__word',
          { yPercent: -110, opacity: 0, duration: 0.5, stagger: 0.24, ease: 'power3.in' },
          0.34
        )
        .to('.preloader__meta, .preloader__counter', {
          yPercent: -120,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
        })
        .to(
          '.preloader__col',
          {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 1.25,
            stagger: { each: 0.07, from: 'start' },
            ease: 'in-out-quint',
          },
          '-=0.3'
        )
        .set(el, { display: 'none' })
    }, el)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div className="preloader" ref={root}>
      <div className="preloader__cols" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="preloader__col" key={i} />
        ))}
      </div>

      <div className="preloader__inner">
        <div className="preloader__meta">
          <span className="mono">{PROFILE.first}</span>
          <span className="mono">{PROFILE.location}</span>
        </div>

        <div className="preloader__words" aria-hidden="true">
          {WORDS.map((w) => (
            <span className="preloader__word" key={w}>
              {w}
            </span>
          ))}
        </div>

        <div className="preloader__counter" ref={counterRef}>
          <span>{String(count).padStart(3, '0')}</span>
          <em>%</em>
        </div>
      </div>
    </div>
  )
}
