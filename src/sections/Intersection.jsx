import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE, STATS, DOMAINS } from '../data/content'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'

/**
 * The section that carries the site's whole thesis: Computer Engineering ×
 * AI × Data × Management isn't four separate interests, it's one MBA Tech
 * degree read from four angles. The statement makes the claim in words: the
 * quadrant below states it again as a diagram — the same shape the 3D
 * system draws behind it (see SECTION_BEATS.about in data/scenes.js).
 */
export function Intersection() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduced) {
        // Nothing moves: just make sure the statement is fully legible.
        gsap.set('.about__w', { opacity: 1 })
        return
      }

      // The statement lights up word by word as it's read past — the reader
      // sets the pace, the page just keeps up.
      gsap.to('.about__w', {
        opacity: 1,
        ease: 'none',
        stagger: 0.9,
        scrollTrigger: {
          trigger: '.about__statement',
          start: 'top 78%',
          end: 'bottom 58%',
          scrub: 0.8,
        },
      })

      // fromTo, never from: a bare from() treats the element's current state as
      // its destination, and any invalidation (ScrollTrigger.refresh on font load
      // or resize) can bake the start pose in as the end pose and strand the
      // content at opacity 0. Naming both ends makes the tween self-describing.
      gsap.fromTo(
        '.about__stat',
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.09,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.about__stats', start: 'top 85%', once: true },
        }
      )

      gsap.fromTo(
        '.about__card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          stagger: 0.1,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.about__cards', start: 'top 84%', once: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const words = PROFILE.statement.split(' ')

  return (
    <section className="section about" id="about" ref={root} data-panel>
      <SectionHead index="01" title="Engineering × AI × Data × Management" />

      <div className="about__statement">
        <p className="about__text">
          {words.map((w, i) => (
            <span className="about__w" key={i}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>

      <div className="about__stats">
        {STATS.map((s) => (
          <div className="about__stat" key={s.label}>
            <span className="about__statValue">{s.value}</span>
            <span className="about__statLabel mono">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="about__cards">
        {DOMAINS.map((d) => (
          <article className="about__card" key={d.id}>
            <h3>
              <Reveal>{d.title}</Reveal>
            </h3>
            <p>{d.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
