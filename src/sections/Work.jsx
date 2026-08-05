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
    // Keyboard activation (Enter/Space on a focused orb) reports clientX/Y as 0,
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

          // Recomputed on every refresh so resizes and font swaps stay correct.
          const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)

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
            },
          })

          // Each orb blooms open as it crosses the middle of the screen. The
          // clip-path circle is the transition the whole section is built
          // around — the artwork arrives by expanding, not by sliding in.
          gsap.utils.toArray('.orb').forEach((orb) => {
            const disc = orb.querySelector('.orb__disc')
            const shot = orb.querySelector('.orb__shot')
            const copy = orb.querySelector('.orb__copy')

            const bloom = {
              trigger: orb,
              containerAnimation: scrollTween,
              start: 'left 92%',
              end: 'center 58%',
              scrub: true,
            }

            // Only the screenshot is clipped. Putting the circle on the disc
            // instead would cut off the caption ring and the glow, which live
            // outside the artwork's edge.
            gsap.fromTo(
              shot,
              { clipPath: 'circle(28% at 50% 50%)' },
              { clipPath: 'circle(50% at 50% 50%)', ease: 'none', scrollTrigger: bloom }
            )

            gsap.fromTo(
              disc,
              { scale: 0.74, rotate: -8 },
              { scale: 1, rotate: 0, ease: 'none', scrollTrigger: bloom }
            )

            gsap.fromTo(
              copy,
              { y: 42, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: orb,
                  containerAnimation: scrollTween,
                  start: 'left 80%',
                  end: 'center 62%',
                  scrub: true,
                },
              }
            )

            // The ring counter-rotates against travel, which is what sells the
            // orbs as objects passing by rather than images on a conveyor.
            gsap.to(orb.querySelector('.orb__ring'), {
              rotate: 190,
              ease: 'none',
              scrollTrigger: {
                trigger: orb,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            })
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
          gsap.utils.toArray('.orb').forEach((orb) => {
            gsap.fromTo(
              orb,
              { y: 56, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 1.1,
                ease: 'out-expo',
                scrollTrigger: { trigger: orb, start: 'top 86%', once: true },
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
        index="03"
        label="Work"
        title="Three products, end to end"
        note="Scroll sideways. Tap any one to open the full story."
      />

      <div className="work__viewport" ref={viewport}>
        <div className="work__track" ref={track}>
          {PROJECTS.map((project) => (
            <article className="orb" key={project.id}>
              <button
                className="orb__disc"
                onClick={(e) => openProject(project, e)}
                aria-label={`Open details for ${project.title}`}
                data-cursor-label="Open"
              >
                <span className="orb__ring" aria-hidden="true">
                  <svg viewBox="0 0 200 200">
                    <defs>
                      <path
                        id={`ring-${project.slug}`}
                        d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
                        fill="none"
                      />
                    </defs>
                    <text>
                      <textPath href={`#ring-${project.slug}`} startOffset="0%">
                        {`${project.title} — ${project.year} — view case — `}
                      </textPath>
                    </text>
                  </svg>
                </span>

                <span className="orb__shot">
                  {project.device === 'phone' ? <PhoneMock /> : <BrowserMock />}
                </span>

                <span className="orb__glow" aria-hidden="true" />
                <span className="orb__index mono" aria-hidden="true">
                  {project.id}
                </span>
              </button>

              <div className="orb__copy">
                <h3 className="orb__title">{project.title}</h3>
                <p className="orb__kind mono">{project.kind}</p>
                <p className="orb__blurb">{project.summary}</p>
                <span className="orb__hint mono" aria-hidden="true">
                  Click to explore →
                </span>
              </div>
            </article>
          ))}

          {/* Closing panel so the rail ends on an invitation, not a hard stop. */}
          <article className="orb orb--end">
            <div className="orb__copy orb__copy--end">
              <h3 className="orb__title">More on GitHub</h3>
              <p className="orb__blurb">
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
          </article>
        </div>
      </div>

      <ProjectModal project={active} origin={origin} onClose={close} />
    </section>
  )
}
