import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROJECTS, PROFILE } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { PhoneMock, BrowserMock } from '../components/DeviceMock'
import { ProjectModal } from '../components/ProjectModal'
import { Magnetic } from '../components/Magnetic'

export function Work() {
  const root = useRef(null)
  const viewport = useRef(null)
  const track = useRef(null)
  const [active, setActive] = useState(null)
  const [origin, setOrigin] = useState(null)

  const openProject = useCallback((project, e) => {
    // Keyboard activation (Enter/Space on a focused card) reports clientX/Y as 0,
    // which would bloom the reveal from the top-left corner of the screen
    // instead of the thing that was activated. Fall back to the button's centre.
    const rect = e.currentTarget.getBoundingClientRect()
    const fromPointer = e.clientX > 0 || e.clientY > 0
    setOrigin(
      fromPointer
        ? { x: e.clientX, y: e.clientY }
        : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    )
    setActive(project)
  }, [])

  const close = useCallback(() => setActive(null), [])

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /**
       * Desktop: the section pins and the track slides sideways, so vertical
       * scrolling reads as horizontal travel. Once the last panel clears, the
       * pin releases and the page returns to normal vertical scroll on its own —
       * no snapping and no wheel hijacking, just a longer scroll distance.
       */
      mm.add(
        { desktop: '(min-width: 981px) and (prefers-reduced-motion: no-preference)' },
        () => {
          const trackEl = track.current
          const viewEl = viewport.current
          if (!trackEl || !viewEl) return

          // One "screen" is documentElement.clientWidth: it excludes the
          // scrollbar (unlike 100vw) and it does not shift while the pin is
          // being applied (unlike the viewport element's own clientWidth,
          // which is measured before pinning and lands ~10px out).
          const screenW = () => document.documentElement.clientWidth

          const setSlot = () => {
            trackEl.style.setProperty('--slot', screenW() + 'px')
          }
          setSlot()

          // offsetWidth, not scrollWidth. scrollWidth includes the overflow
          // created by this section's own rotateY/translateZ transforms, so
          // measuring it makes the travel distance depend on the animation it
          // is supposed to be driving — the rail then overshoots and the last
          // card never lands centred.
          const distance = () => Math.max(0, trackEl.offsetWidth - screenW())

          const scrollTween = gsap.to(trackEl, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: viewEl,
              start: 'top top',
              end: () => '+=' + distance(),
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefreshInit: setSlot,
            },
          })

          // Each card is animated across its ENTIRE time on screen — from the
          // moment its left edge enters at the far right, to the moment its
          // right edge leaves at the far left. A single fromTo would run out
          // partway and leave the card frozen for the rest of its travel, so
          // this is a two-half timeline that peaks dead centre: it swings in,
          // settles square to the viewer, then swings back out symmetrically.
          gsap.utils.toArray('.pcard').forEach((card) => {
            const shot = card.querySelector('.pcard__shot')
            const body = card.querySelector('.pcard__body')

            const travel = {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: 0.6,
            }

            gsap
              .timeline({ scrollTrigger: travel })
              .fromTo(
                card,
                { scale: 0.86, opacity: 0.55, rotateY: 12, z: -220 },
                { scale: 1, opacity: 1, rotateY: 0, z: 0, ease: 'power2.out', duration: 0.5 }
              )
              .to(card, {
                scale: 0.86,
                opacity: 0.55,
                rotateY: -12,
                z: -220,
                ease: 'power2.in',
                duration: 0.5,
              })

            // The screenshot drifts against the card and the copy drifts with
            // it — a small depth cue that makes the pass feel three-dimensional
            // rather than like a flat slide. The closing panel has no
            // screenshot, hence the guard.
            if (shot) {
              gsap.fromTo(
                shot,
                { xPercent: 14 },
                { xPercent: -14, ease: 'none', scrollTrigger: travel }
              )
            }
            if (body) {
              gsap.fromTo(
                body,
                { xPercent: -7 },
                { xPercent: 7, ease: 'none', scrollTrigger: travel }
              )
            }
          })

          return () => scrollTween.scrollTrigger?.kill()
        }
      )

      // Mobile and reduced motion: a plain vertical stack. Pinning a horizontal
      // rail on a touch device fights the user's own scroll direction.
      mm.add(
        { stacked: '(max-width: 980px), (prefers-reduced-motion: reduce)' },
        () => {
          if (prefersReducedMotion()) return
          gsap.utils.toArray('.pcard').forEach((card) => {
            gsap.fromTo(
              card,
              { y: 56, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.1,
                ease: 'out-expo',
                scrollTrigger: { trigger: card, start: 'top 86%', once: true },
              }
            )
          })
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  // Layout shifts when the modal closes; make sure the pin re-measures.
  useLayoutEffect(() => {
    if (!active) ScrollTrigger.refresh()
  }, [active])

  return (
    <section className="section work" id="work" ref={root}>
      <SectionHead
        index="04"
        label="Work"
        title="Three products, end to end"
        note="Scroll sideways. Tap any one to open the full story."
      />

      <div className="work__viewport" ref={viewport}>
        <div className="work__track" ref={track}>
          {PROJECTS.map((project) => (
            <article className="pcard" key={project.id}>
              {/* .pcard is the full-viewport slot; .pcard__frame is the visible
                  rectangle. Keeping them separate means the swing pivots around
                  the centre of the screen rather than the edge of the card. */}
              <div className="pcard__frame">
                <div className="pcard__shot">
                  <div className="pcard__shotInner">
                    {project.device === 'phone' ? <PhoneMock /> : <BrowserMock />}
                  </div>
                  <span className="pcard__glow" aria-hidden="true" />
                </div>

                <div className="pcard__body">
                  <p className="pcard__meta mono">
                    <span>{project.id}</span>
                    <i />
                    <span>{project.year}</span>
                  </p>

                  <h3 className="pcard__title">{project.title}</h3>
                  <p className="pcard__kind mono">{project.kind}</p>
                  <p className="pcard__blurb">{project.summary}</p>

                  <div className="pcard__stack">
                    {project.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>

                  <span className="pcard__hint mono" aria-hidden="true">
                    Click to explore →
                  </span>
                </div>

                {/* A full-card hit area rather than a wrapping <button>: a button
                    may only contain phrasing content, and this card has headings. */}
                <button
                  className="pcard__hit"
                  onClick={(e) => openProject(project, e)}
                  aria-label={`Open details for ${project.title}`}
                  data-cursor-label="Open"
                />
              </div>
            </article>
          ))}

          {/* Closing panel so the rail ends on an invitation, not a hard stop. */}
          <article className="pcard pcard--end">
            <div className="pcard__frame pcard__frame--end">
              <div className="pcard__body pcard__body--end">
              <h3 className="pcard__title">More on GitHub</h3>
              <p className="pcard__blurb">
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
          </article>
        </div>
      </div>

      <ProjectModal project={active} origin={origin} onClose={close} />
    </section>
  )
}
