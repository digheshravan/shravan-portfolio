import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE } from '../data/content'

const WORDS = ['Namaste', 'नमस्ते', 'Hello', 'Bonjour', 'こんにちは', 'Hola']

const SEEN_KEY = 'sd:intro-seen'

/** Session storage can throw (private mode, blocked site data) — never let
 *  that decide whether the page is reachable. */
function introSeen() {
  try {
    const seen = sessionStorage.getItem(SEEN_KEY) === '1'
    sessionStorage.setItem(SEEN_KEY, '1')
    return seen
  } catch {
    return false
  }
}

// Read once per page load, not per effect run — StrictMode's double-mount
// would otherwise see its own write and skip the intro on a first visit.
const INTRO_SEEN = introSeen()

/**
 * Counter → greeting cycle → column wipe, then the hero takes over — compressed
 * to under a second before the hero starts, and skipped entirely on a repeat
 * visit in the same session. A visitor (often a recruiter on a short clock)
 * should be looking at the name and the Résumé button, not a loader.
 */
export function Preloader({ onComplete }) {
  const root = useRef(null)
  const counterRef = useRef(null)
  const [count, setCount] = useState(0)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    document.documentElement.classList.add('is-loading')

    // Nothing behind the overlay is reachable by Tab while it covers them.
    const behind = ['.main', '.nav', '.rail']
      .map((s) => document.querySelector(s))
      .filter(Boolean)
    behind.forEach((n) => (n.inert = true))

    const skip = prefersReducedMotion() || INTRO_SEEN
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
    // The hero is handed control as the wipe *starts* (`reveal`), so its
    // intro plays while the columns lift instead of after them; `finish`
    // removes the overlay itself once the wipe is done.
    let revealed = false
    const reveal = () => {
      if (revealed) return
      revealed = true
      behind.forEach((n) => (n.inert = false))
      onComplete?.()
    }

    let done = false
    const finish = () => {
      if (done) return
      done = true
      document.documentElement.classList.remove('is-loading')
      if (root.current) root.current.style.display = 'none'
      reveal()
    }

    // setTimeout keeps running when rAF does not, which is exactly why the
    // escape hatch uses it rather than another animation callback.
    const watchdog = setTimeout(finish, skip ? 200 : 3000)

    // Coming back to a throttled tab: don't make them wait out the watchdog.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && performance.now() > 3000) finish()
    }
    document.addEventListener('visibilitychange', onVisible)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish })

      // `el` is the context root, so it can't be reached by a descendant
      // selector — every reference to the shell itself has to go through the ref.
      if (skip) {
        tl.set(el, { display: 'none' })
        return
      }

      tl.to(counterObj, {
        v: 100,
        duration: 0.8,
        ease: 'in-out-quint',
        onUpdate: () => setCount(Math.round(counterObj.v)),
      })
        .fromTo(
          '.preloader__word',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.22, stagger: 0.09, ease: 'power3.out' },
          0.05
        )
        .to(
          '.preloader__word',
          { yPercent: -110, opacity: 0, duration: 0.22, stagger: 0.09, ease: 'power3.in' },
          0.14
        )
        .to(
          '.preloader__meta, .preloader__counter',
          { yPercent: -120, opacity: 0, duration: 0.4, stagger: 0.04 },
          0.78
        )
        .call(reveal, [], 0.85)
        .to(
          '.preloader__col',
          {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 0.75,
            stagger: { each: 0.04, from: 'start' },
            ease: 'in-out-quint',
          },
          0.85
        )
        .set(el, { display: 'none' })
    }, el)

    return () => {
      behind.forEach((n) => (n.inert = false))
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

        <div
          className={`preloader__counter${count >= 96 ? ' is-resolved' : ''}`}
          ref={counterRef}
        >
          <span>{String(count).padStart(3, '0')}</span>
          <em>%</em>
        </div>
      </div>
    </div>
  )
}
