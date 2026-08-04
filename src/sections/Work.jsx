import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROJECTS } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { PhoneMock, BrowserMock } from '../components/DeviceMock'
import { Magnetic } from '../components/Magnetic'

export function Work() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 981px)', () => {
        gsap.utils.toArray('.project').forEach((project) => {
          const stage = project.querySelector('.project__stage')
          const device = project.querySelector('.project__device')

          // The visual drifts and settles while the copy scrolls past it.
          gsap.fromTo(
            device,
            { yPercent: 9, rotateX: 9, rotateY: -13, scale: 0.94 },
            {
              yPercent: -9,
              rotateX: -4,
              rotateY: 6,
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: 1 },
            }
          )

          gsap.to(stage, {
            '--glow': 1,
            scrollTrigger: { trigger: project, start: 'top 70%', end: 'bottom 40%', scrub: true },
          })
        })
      })

      gsap.utils.toArray('.project').forEach((project) => {
        gsap.fromTo(
          project.querySelectorAll('.project__reveal'),
          { y: 46, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: 'out-expo',
            scrollTrigger: { trigger: project, start: 'top 72%', once: true },
          }
        )

        // The oversized project number counter-scrolls behind the content.
        gsap.fromTo(
          project.querySelector('.project__bigNum'),
          { yPercent: 18 },
          {
            yPercent: -24,
            ease: 'none',
            scrollTrigger: { trigger: project, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          }
        )
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section work" id="work" ref={root} data-panel>
      <SectionHead
        index="03"
        label="Work"
        title="Two products, end to end"
        note="Designed, built and shipped solo — from schema to interface."
      />

      <div className="work__list">
        {PROJECTS.map((project, i) => (
          <article
            className={`project project--${i % 2 === 0 ? 'left' : 'right'}`}
            key={project.id}
            data-parallax-scope
          >
            <span className="project__bigNum" aria-hidden="true">
              {project.id}
            </span>

            <div className="project__stage">
              <div className="project__device">
                {project.device === 'phone' ? <PhoneMock /> : <BrowserMock />}
              </div>
              <div className="project__glow" aria-hidden="true" />
            </div>

            <div className="project__body" data-parallax="0.055">
              <div className="project__meta mono project__reveal">
                <span>{project.year}</span>
                <span className="project__dot">·</span>
                <span>{project.kind}</span>
              </div>

              <h3 className="project__title">
                <Reveal mode="word" stagger={0.05}>
                  {project.title}
                </Reveal>
              </h3>

              <p className="project__summary project__reveal">{project.summary}</p>

              <ul className="project__highlights">
                {project.highlights.map((h) => (
                  <li className="project__reveal" key={h}>
                    <i aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="project__metrics project__reveal">
                {project.metrics.map((m) => (
                  <div className="project__metric" key={m.k}>
                    <em className="mono">{m.k}</em>
                    <b>{m.v}</b>
                  </div>
                ))}
              </div>

              <div className="project__stack project__reveal">
                {project.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="work__more">
        <p>More on the way — the repos are public.</p>
        <Magnetic strength={0.35}>
          <a
            className="btn btn--ghost"
            href="https://github.com/digheshravan"
            target="_blank"
            rel="noreferrer"
            data-cursor-label="GitHub"
          >
            <span data-magnetic-inner>
              Browse the code
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
          </a>
        </Magnetic>
      </div>
    </section>
  )
}
