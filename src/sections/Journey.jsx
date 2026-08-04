import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { EDUCATION, RECOGNITION } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'

export function Journey() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      // The spine draws itself as you descend, with a light riding its leading
      // edge so the eye has something to follow between entries.
      const spineScroll = {
        trigger: '.timeline',
        start: 'top 70%',
        end: 'bottom 75%',
        scrub: 0.5,
      }

      gsap.fromTo(
        '.timeline__spineFill',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: spineScroll,
        }
      )

      gsap.fromTo(
        '.timeline__spineDot',
        { top: '0%', opacity: 0 },
        {
          top: '100%',
          opacity: 1,
          ease: 'none',
          scrollTrigger: spineScroll,
        }
      )

      gsap.utils.toArray('.timeline__item').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'out-expo',
            scrollTrigger: { trigger: item, start: 'top 84%', once: true },
          }
        )
        gsap.fromTo(
          item.querySelector('.timeline__node'),
          { scale: 0.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'out-expo',
            scrollTrigger: { trigger: item, start: 'top 78%', once: true },
          }
        )
      })

      gsap.fromTo(
        '.award',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          stagger: 0.12,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.awards', start: 'top 84%', once: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section journey" id="journey" ref={root} data-panel>
      <SectionHead
        index="04"
        label="Path"
        title="How I got here"
        note="Diploma first, degree second — hands on the keyboard before theory."
      />

      <div className="timeline">
        <div className="timeline__spine" aria-hidden="true">
          <span className="timeline__spineFill" />
          <span className="timeline__spineDot" />
        </div>

        {EDUCATION.map((item) => (
          <article className="timeline__item" key={item.title}>
            <span className="timeline__node" aria-hidden="true">
              <i />
            </span>

            <div className="timeline__year mono">{item.year}</div>

            <div className="timeline__content">
              <div className="timeline__topline">
                <h3>{item.title}</h3>
                <span className={`pill pill--${item.status === 'In progress' ? 'live' : 'done'}`}>
                  {item.status}
                </span>
              </div>
              <p className="timeline__org">{item.org}</p>
              <p className="timeline__board mono">{item.board}</p>
              <p className="timeline__note">{item.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="awards" id="recognition">
        <h3 className="awards__title">
          <Reveal mode="word" stagger={0.05}>
            Recognition & certification
          </Reveal>
        </h3>

        <div className="awards__grid">
          {RECOGNITION.map((r) => (
            <article className="award" key={r.title} data-cursor>
              <div className="award__top">
                <span className="award__year">{r.year}</span>
                <span className="award__tag mono">{r.tag}</span>
              </div>
              <h4>{r.title}</h4>
              <p className="award__sub">{r.subtitle}</p>
              <p className="award__body">{r.body}</p>
              <span className="award__sheen" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
