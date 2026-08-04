import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE } from '../data/content'
import { Magnetic } from '../components/Magnetic'
import { scrollToSection } from '../hooks/useSmoothScroll'

export function Hero({ ready }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (!ready) return
    const el = root.current
    if (!el) return

    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      const targets = '.hero__eyebrow > *, .hero__glyph, .hero__rule, .hero__aside > *, .hero__cue'

      if (reduced) {
        gsap.set(targets, { clearProps: 'all' })
        return
      }

      // Explicit set() + to() rather than from(): a from() records the element's
      // current state as its destination, and anything that invalidates the
      // tween mid-flight (a ScrollTrigger.refresh landing in the same frame)
      // can promote the start pose into the end pose and freeze the type
      // off-screen. Stating both ends outright removes that whole class of bug.
      gsap.set('.hero__eyebrow > *', { yPercent: 120, opacity: 0 })
      gsap.set('.hero__glyph', { yPercent: 118, rotate: 6 })
      gsap.set('.hero__rule', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.hero__aside > *', { y: 34, opacity: 0 })
      gsap.set('.hero__cue', { y: 20, opacity: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'out-expo' } })

      tl.to('.hero__eyebrow > *', {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.08,
      })
        .to(
          '.hero__glyph',
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.5,
            stagger: { each: 0.045, from: 'start' },
          },
          '-=0.7'
        )
        .to('.hero__rule', { scaleX: 1, duration: 1.4 }, '-=1.0')
        .to('.hero__aside > *', { y: 0, opacity: 1, duration: 1.1, stagger: 0.09 }, '-=1.1')
        .to('.hero__cue', { y: 0, opacity: 1, duration: 0.9 }, '-=0.9')

      // Departure: the hero tips away from the viewer and falls into depth as
      // About rises to meet it. Perspective is set on the element itself so the
      // vanishing point is the hero's own centre rather than the whole page's.
      gsap.set('.hero__inner', {
        transformPerspective: 1500,
        transformOrigin: '50% 0%',
      })

      gsap.to('.hero__inner', {
        yPercent: -12,
        rotateX: 12,
        z: -460,
        opacity: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })

      // The two name lines drift apart slightly on scroll — a parallax tell.
      gsap.to('.hero__line--a', {
        xPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      })
      gsap.to('.hero__line--b', {
        xPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
      })
    }, el)

    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="hero" ref={root}>
      <div className="hero__inner">
        <div className="hero__eyebrow mono">
          <span>
            <i className="dot" /> Portfolio / 2026
          </span>
          <span>{PROFILE.location}</span>
          <span>{PROFILE.cohort}</span>
        </div>

        <h1 className="hero__title">
          <span className="sr-only">
            {PROFILE.first} {PROFILE.last} — {PROFILE.role}
          </span>

          <span className="hero__line hero__line--a" aria-hidden="true">
            {Array.from(PROFILE.first.toUpperCase()).map((c, i) => (
              <span className="hero__glyphMask" key={`f-${i}`}>
                <span className="hero__glyph">{c}</span>
              </span>
            ))}
          </span>

          <span className="hero__line hero__line--b" aria-hidden="true">
            {Array.from(PROFILE.last.toUpperCase()).map((c, i) => (
              <span className="hero__glyphMask" key={`l-${i}`}>
                <span className="hero__glyph">{c}</span>
              </span>
            ))}
            <span className="hero__glyphMask hero__glyphMask--serif">
              <span className="hero__glyph hero__glyph--serif">engineer</span>
            </span>
          </span>
        </h1>

        <div className="hero__rule" />

        <div className="hero__foot">
          <div className="hero__aside">
            <p className="hero__lede">
              {PROFILE.tagline} Currently reading <em>{PROFILE.degree}</em> at {PROFILE.school},
              where I pair engineering with product thinking.
            </p>
            <div className="hero__actions">
              <Magnetic strength={0.4}>
                <button
                  className="btn btn--primary"
                  onClick={() => scrollToSection('#work')}
                  data-cursor-label="See"
                >
                  <span data-magnetic-inner>
                    Selected work
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                      <path
                        d="M3 13L13 3M13 3H5M13 3v8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <a className="btn btn--ghost" href={`mailto:${PROFILE.email}`} data-cursor-label="Mail">
                  <span data-magnetic-inner>Get in touch</span>
                </a>
              </Magnetic>
            </div>
          </div>

          <button
            className="hero__cue"
            onClick={() => scrollToSection('#about')}
            aria-label="Scroll to about"
          >
            <span className="mono">Scroll</span>
            <span className="hero__cueLine">
              <i />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
