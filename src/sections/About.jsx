import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE, STATS } from '../data/content'
import { Reveal } from '../components/Reveal'
import { SectionHead } from '../components/SectionHead'

export function About() {
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
      // its destination, so any invalidation (ScrollTrigger.refresh on font load
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
      <SectionHead index="01" label="About" title="The short version" />

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
        <article className="about__card">
          <h3>
            <Reveal>Product-first engineering</Reveal>
          </h3>
          <p>
            A certified UI/UX foundation means I don't hand off at the API boundary. Interface
            states, empty screens and error paths are part of the build, not a follow-up ticket.
          </p>
        </article>

        <article className="about__card">
          <h3>
            <Reveal>One codebase, every screen</Reveal>
          </h3>
          <p>
            Flutter for cross-platform delivery, Spring Boot and Angular where the web needs to be
            first-class. Chosen per problem, not per habit.
          </p>
        </article>

        <article className="about__card">
          <h3>
            <Reveal>Tech that answers to business</Reveal>
          </h3>
          <p>
            An MBA Tech degree is a deliberate bet: the best technical decision is the one that
            survives contact with cost, timeline and the people using it.
          </p>
        </article>
      </div>
    </section>
  )
}
