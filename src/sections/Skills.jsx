import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { SKILLS, MARQUEE } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { Marquee } from '../components/Marquee'

export function Skills() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // Each row is triggered on its own rather than as one batch, so the list
      // unrolls at the reader's pace — the row you're arriving at is the row
      // that moves. A clip wipe reads as the rule below it drawing the content
      // upward, which a plain fade doesn't.
      gsap.utils.toArray('.skillRow').forEach((row) => {
        gsap.fromTo(
          row,
          { clipPath: 'inset(0% 0% 100% 0%)', y: 46, opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'out-expo',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          }
        )
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section skills" id="skills" ref={root} data-panel>
      <SectionHead
        index="02"
        label="Craft"
        title="What I build with"
        note="Four layers of the stack, learned in the order that lets me ship a whole product alone."
      />

      {/* No hover state in React: the dimming of unhovered rows is done in CSS
          with :has(), which keeps the whole list a pure render. */}
      <div className="skills__list">
        {SKILLS.map((group) => (
          <article className="skillRow" key={group.id}>
            <div className="skillRow__head">
              <span className="skillRow__index mono">{group.id}</span>
              <h3 className="skillRow__title">{group.group}</h3>
            </div>

            <div className="skillRow__meta">
              <p className="skillRow__blurb">{group.blurb}</p>

              <ul className="skillRow__items">
                {group.items.map((item, i) => (
                  // --i drives the stagger delay purely in CSS.
                  <li key={item} style={{ '--i': i }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <span className="skillRow__count mono" aria-hidden="true">
              {String(group.items.length).padStart(2, '0')}
            </span>

            <span className="skillRow__rule" aria-hidden="true">
              <i />
            </span>
          </article>
        ))}
      </div>

      <Marquee items={MARQUEE} className="marquee--rule" speed={48} />
    </section>
  )
}
