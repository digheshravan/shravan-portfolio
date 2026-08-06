import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { FOCUS } from '../data/content'
import { SectionHead } from '../components/SectionHead'

/**
 * The four fronts, stated up front.
 *
 * This sits immediately after the hero on purpose: a recruiter decides whether
 * to keep reading inside about ten seconds, and "what does this person actually
 * do" has to be answerable before the scroll gets interesting. Each pillar
 * carries its own evidence, so the claim and the proof are never more than a
 * few lines apart.
 */
export function Focus() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('.pillar').forEach((pillar) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: pillar, start: 'top 85%', once: true },
        })

        // A thin line sweeps the card before its contents resolve — a scan,
        // which is the one motif this subject earns without turning into
        // cliché matrix rain.
        tl.fromTo(
          pillar.querySelector('.pillar__scan'),
          { scaleY: 0, opacity: 1 },
          { scaleY: 1, duration: 0.55, ease: 'power2.inOut' }
        )
          .to(pillar.querySelector('.pillar__scan'), { opacity: 0, duration: 0.35 }, '-=0.12')
          .fromTo(
            pillar.querySelectorAll('[data-pillar-item]'),
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.06, ease: 'out-expo' },
            '-=0.5'
          )
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section focus" id="focus" ref={root} data-panel>
      <SectionHead
        index="01"
        label="Focus"
        title="Four fronts, one engineer"
        note="Two of these are shipping today. Two are where I am taking the work next — marked honestly, because the difference matters."
      />

      <div className="focus__grid">
        {FOCUS.map((area) => (
          <article className="pillar" key={area.id}>
            <span className="pillar__scan" aria-hidden="true" />

            <header className="pillar__top" data-pillar-item>
              <span className="pillar__id mono">{area.id}</span>
              <span className={`pillar__status pillar__status--${area.tone}`}>
                <i aria-hidden="true" />
                {area.status}
              </span>
            </header>

            <h3 className="pillar__title" data-pillar-item>
              {area.title}
            </h3>

            <p className="pillar__blurb" data-pillar-item>
              {area.blurb}
            </p>

            <ul className="pillar__evidence">
              {area.evidence.map((line) => (
                <li key={line} data-pillar-item>
                  <i aria-hidden="true" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="pillar__stack" data-pillar-item>
              {area.stack.map((s) => (
                <span className="chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
