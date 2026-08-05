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

    // The whole site sits behind this overlay, so finishing must not depend on
    // the animation actually running. GSAP is driven by requestAnimationFrame,
    // which a browser throttles to a near halt in a background tab and on some
    // low-power devices — and if the timeline never reaches its last frame, the
    // visitor is left staring at a loading screen with scrolling disabled.
    //
    // `finish` is therefore idempotent and can be called from anywhere: the
    // timeline's own completion, a wall-clock watchdog, or the moment the tab
    // becomes visible again after being throttled.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      document.documentElement.classList.remove('is-loading')
      if (root.current) root.current.style.display = 'none'
      onComplete?.()
    }

    // setTimeout keeps running when rAF does not, which is exactly why the
    // escape hatch uses it rather than another animation callback.
    const watchdog = setTimeout(finish, reduced ? 200 : 6000)

    // Coming back to a throttled tab: don't make them wait out the watchdog.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && performance.now() > 6000) finish()
    }
    document.addEventListener('visibilitychange', onVisible)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })

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

    return () => {
      clearTimeout(watchdog)
      document.removeEventListener('visibilitychange', onVisible)
      ctx.revert()
    }
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
