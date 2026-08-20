import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { EXPERIENCE, EDUCATION, RECOGNITION } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'

/**
 * Applied engineering, not a generic timeline. The internship leads — a
 * recruiter scanning this section is looking for employment before
 * schooling — and the strongest single line on the site (choosing simpler
 * infrastructure because the corpus size didn't justify a vector database)
 * is pulled out of the bullet list into its own callout rather than buried
 * as item two of five. Bloomberg and SIH support in three compact rows;
 * education compresses to a footer line underneath.
 */
export function Experience() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.xp',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.xpList', start: 'top 84%', once: true },
        }
      )

      gsap.fromTo(
        '.support__row',
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.support', start: 'top 88%', once: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section journey" id="journey" ref={root} data-panel>
      <SectionHead
        index="05"
        title="Where the work got real"
        note="A technical internship, applied — the education that led to it follows underneath."
      />

      <div className="xpList">
        {EXPERIENCE.map((job) => (
          <article className="xp" key={job.id}>
            <div className="xp__aside">
              <span className="xp__period mono">{job.period}</span>
              <span className="xp__duration mono">{job.duration}</span>
              <span className="xp__place mono">{job.location}</span>
            </div>

            <div className="xp__main">
              <div className="xp__topline">
                <h3 className="xp__role">
                  {job.role} <em>at</em> {job.org}
                </h3>
                <span className="pill pill--live">{job.kind}</span>
              </div>

              <p className="xp__org">{job.orgNote}</p>
              <p className="xp__summary">{job.summary}</p>

              {job.judgment && (
                <blockquote className="xp__judgment">
                  <p>{job.judgment}</p>
                </blockquote>
              )}

              <ul className="xp__points">
                {job.highlights.map((h) => (
                  <li key={h}>
                    <i aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="xp__stack">
                {job.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="support" id="recognition">
        <h3 className="pathHeading">
          <Reveal mode="word" stagger={0.05}>
            Recognition
          </Reveal>
        </h3>

        <div className="support__list">
          {RECOGNITION.map((r) => (
            <div className="support__row" key={r.title} data-cursor>
              <span className="support__year mono">{r.year}</span>
              <span className="support__title">{r.title}</span>
              <span className="support__sub">{r.subtitle}</span>
              <span className="support__tag mono">{r.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pathFooter">
        <span className="mono">Education</span>
        <p>
          {EDUCATION.map((item, i) => (
            <span key={item.title}>
              {item.title} · {item.org}{' '}
              <span className="pathFooter__year mono">({item.year})</span>
              {i < EDUCATION.length - 1 ? ' — ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
