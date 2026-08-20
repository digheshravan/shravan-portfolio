import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROJECTS, PROFILE } from '../data/content'
import { PROJECT_SCENES } from '../data/scenes'
import { beginCase, scrubCase, animateToBeat } from '../lib/sceneState'
import { SectionHead } from '../components/SectionHead'
import { Magnetic } from '../components/Magnetic'

/**
 * Four pinned case studies, one ScrollTrigger per project. Each pin holds
 * the screen while the 3D system reconfigures through that project's own
 * pipeline (see PROJECT_SCENES) — no mount/unmount, the same persistent
 * canvas from Scene.jsx just gets scrubbed toward different targets.
 *
 * A case's markup carries no screenshot or device mockup: the 3D behind it
 * IS the visual for what the project does. Deep detail stays a repo link.
 */
export function Work() {
  const root = useRef(null)
  const stage = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /**
       * Mobile: a plain vertical stack, every pipeline shown as a normal
       * ordered list. Pinning a scroll-scrubbed rail on a touch device
       * fights the user's own scroll gesture. Still gets a first-beat
       * reaction per project — matching what the previous rail did here —
       * just not the full scrubbed pipeline, which needs the pin to make
       * scroll position mean "how far through," not just "which project."
       */
      const setupStacked = () => {
        gsap.utils.toArray('.case', stage.current).forEach((caseEl) => {
          gsap.fromTo(
            caseEl,
            { y: 56, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'out-expo',
              scrollTrigger: { trigger: caseEl, start: 'top 86%', once: true },
            }
          )

          ScrollTrigger.create({
            trigger: caseEl,
            start: 'top 60%',
            end: 'bottom 40%',
            onToggle: (self) => {
              if (self.isActive) animateToBeat(PROJECT_SCENES[caseEl.dataset.slug][0])
            },
          })

          const steps = gsap.utils.toArray('.case__step', caseEl)
          steps.forEach((step, index) => {
            ScrollTrigger.create({
              trigger: step,
              start: 'top 75%',
              end: 'bottom 25%',
              onToggle: (self) => {
                if (self.isActive) {
                  steps.forEach(s => s.classList.remove('is-active'))
                  step.classList.add('is-active')
                }
              }
            })
          })
        })
      }

      /**
       * Desktop: each case pins in turn — GSAP releases one and the next
       * scrolls up to take its place natively, no shared master timeline.
       * Adding, removing or reordering a project only touches its own
       * trigger; none of the others are aware of it.
       */
      const setupPinned = () => {
        const stageEl = stage.current
        if (!stageEl) return

        // documentElement.clientHeight, not 100vh: the constant this feeds
        // is a scroll DISTANCE, and 100vh drifts as a mobile URL bar
        // collapses. Re-measured in onRefreshInit for the same reason
        // Work's old --slot was — a window resize must not leave the pin
        // measuring a stale viewport.
        const setStepH = () => {
          stageEl.style.setProperty('--step-h', document.documentElement.clientHeight + 'px')
        }
        setStepH()

        const triggers = gsap.utils.toArray('.case', stageEl).map((caseEl) => {
          const slug = caseEl.dataset.slug
          const beats = PROJECT_SCENES[slug]
          const steps = gsap.utils.toArray('.case__step', caseEl)
          let cursor = null

          // offsetHeight, not scrollWidth/scrollHeight: this section applies
          // no transform of its own, but the discipline stays uniform with
          // every other measured trigger on the page. One "screen" of
          // scroll per pipeline step, so a 6-step pipeline (IPO Decoder)
          // genuinely gets more room to read than a 4-step one.
          const distance = () =>
            Math.max(1, beats.length - 1) * caseEl.offsetHeight || document.documentElement.clientHeight

          return ScrollTrigger.create({
            trigger: caseEl,
            start: 'top top',
            end: () => '+=' + distance(),
            pin: true,
            // No `scrub` here deliberately: there is no animation attached
            // to this trigger for it to link to, and setting it anyway
            // introduces an internal eased lag between real scroll
            // position and the progress onUpdate reports — fighting the
            // continuity scrubCase() already provides, and the primitives'
            // own per-frame damp() downstream. Direct, unsmoothed progress
            // is what scrubCase() expects to interpolate from.
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: setStepH,
            // Bookkeeping only: which project is active, plus the one-time
            // continuity handoff so the incoming case blends from wherever
            // the scene last settled rather than snapping cold.
            onToggle: (self) => {
              if (!self.isActive) return
              cursor = beginCase(slug)
            },
            // Cheap direct writes every tick — no tween, no reconstruction.
            // scrubCase() mutates the shared `scene` singleton; the
            // primitives' own useFrame already damps toward it.
            onUpdate: (self) => {
              if (!cursor) return
              const i0 = scrubCase(beats, self.progress, cursor)
              steps.forEach((s, i) => s.classList.toggle('is-active', i === i0))
            },
          })
        })

        return () => triggers.forEach((t) => t.kill())
      }

      /**
       * One matchMedia entry, branched in JS rather than two competing query
       * strings: `(prefers-reduced-motion: ...)` in a query only ever sees
       * the real OS setting, never `?motion=reduced` — prefersReducedMotion()
       * (motionState.js) is the single source of truth that honours both, so
       * it decides here instead of being folded into the media query. Width
       * still comes from the query, since CSS can see that correctly.
       */
      mm.add({ narrow: '(max-width: 900px)', wide: '(min-width: 901px)' }, (context) => {
        if (prefersReducedMotion()) return
        return context.conditions.narrow ? setupStacked() : setupPinned()
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section work" id="work" ref={root}>
      <SectionHead
        index="04"
        title="Four systems, one still in the lab"
        note="Scroll to run each pipeline — the scene reconfigures as it goes."
      />

      <div className="cases" ref={stage}>
        {PROJECTS.map((project) => (
          <article className="case" data-slug={project.slug} key={project.id}>
            <div className="case__frame">
              <p className="case__meta mono">
                <span>{project.id}</span>
                <i />
                <span>{project.year}</span>
                {project.flagship && (
                  <>
                    <i />
                    <span className="pill pill--live">Flagship</span>
                  </>
                )}
                {project.stage && (
                  <>
                    <i />
                    <span className="pill pill--learning">{project.stage}</span>
                  </>
                )}
              </p>

              <h3 className="case__title">{project.title}</h3>
              <p className="case__kind mono">{project.kind}</p>

              <div className="case__metrics">
                {project.metrics.map((m) => (
                  <div key={m.k}>
                    <em className="mono">{m.k}</em>
                    <b>{m.v}</b>
                  </div>
                ))}
              </div>

              <div className="case__foot">
                {project.repo ? (
                  <Magnetic strength={0.25}>
                    <a
                      className="btn btn--primary"
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor-label="GitHub"
                    >
                      <span data-magnetic-inner>
                        View the code
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
                ) : (
                  <p className="case__footNote">
                    Still in development — not public yet. The repository goes live here once it
                    ships.
                  </p>
                )}
              </div>

              <p className="case__blurb">{project.summary}</p>

              <ol className="case__pipeline mono" aria-label={`${project.title} pipeline`}>
                {project.pipeline.map((step, i) => (
                  <li className="case__step" key={step}>
                    <span className="case__stepIndex">{String(i + 1).padStart(2, '0')}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="case__stack">
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

      <div className="case case--end">
        <div className="case__frame case__frame--end">
          <h3 className="case__title">More on GitHub</h3>
          <p className="case__blurb">
            Attendance trackers, course work and whatever I'm building this week — the
            repositories are all public.
          </p>
          <Magnetic strength={0.35}>
            <a
              className="btn btn--primary"
              href={PROFILE.github}
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
      </div>
    </section>
  )
}
