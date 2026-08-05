import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { getLenis } from '../hooks/useSmoothScroll'
import { PhoneMock, BrowserMock } from './DeviceMock'

/**
 * Floating detail panel for a single project.
 *
 * It opens as a circle expanding from wherever the orb was clicked, so the
 * gesture reads as the orb itself unfolding rather than a generic dialog
 * appearing. The circle has to be large enough to cover the viewport's furthest
 * corner from the click point, which is why the radius is computed rather than
 * fixed.
 */
export function ProjectModal({ project, origin, onClose }) {
  const root = useRef(null)
  const panel = useRef(null)
  const closeBtn = useRef(null)
  const lastFocused = useRef(null)

  useLayoutEffect(() => {
    if (!project) return
    const el = root.current
    if (!el) return

    const reduced = prefersReducedMotion()
    const ox = origin?.x ?? window.innerWidth / 2
    const oy = origin?.y ?? window.innerHeight / 2

    // Distance to the furthest corner — anything less and the reveal leaves a
    // visible arc of un-covered page in one corner.
    const radius = Math.hypot(
      Math.max(ox, window.innerWidth - ox),
      Math.max(oy, window.innerHeight - oy)
    )

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(el, { clipPath: 'none', autoAlpha: 1 })
        gsap.set('.pmodal__inner > *', { opacity: 1, y: 0 })
        return
      }

      gsap.set(el, { autoAlpha: 1, clipPath: `circle(0px at ${ox}px ${oy}px)` })

      gsap
        .timeline({ defaults: { ease: 'out-expo' } })
        .to(el, {
          clipPath: `circle(${radius}px at ${ox}px ${oy}px)`,
          duration: 1,
        })
        .fromTo(
          '.pmodal__inner > *',
          { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.055 },
          '-=0.55'
        )
    }, el)

    return () => ctx.revert()
  }, [project, origin])

  // Freeze the page behind the panel, trap focus, and restore both on close.
  useEffect(() => {
    if (!project) return
    const lenis = getLenis()
    lastFocused.current = document.activeElement
    lenis?.stop()
    document.documentElement.classList.add('modal-open')
    closeBtn.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const focusables = root.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('modal-open')
      lenis?.start()
      lastFocused.current?.focus?.()
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="pmodal"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pmodal-title"
    >
      <button className="pmodal__scrim" onClick={onClose} aria-label="Close details" tabIndex={-1} />

      {/* Lenis swallows wheel and touch events at the window level, so a nested
          scroll container gets nothing — even while Lenis is stopped. This
          attribute is how Lenis is told to leave a subtree to native scrolling;
          without it the detail panel simply cannot be scrolled. */}
      <div className="pmodal__panel" ref={panel} data-lenis-prevent>
        <button className="pmodal__close" onClick={onClose} ref={closeBtn} aria-label="Close">
          <span />
          <span />
        </button>

        <div className="pmodal__inner">
          <div className="pmodal__meta mono">
            <span>{project.id}</span>
            <i />
            <span>{project.year}</span>
            <i />
            <span>{project.kind}</span>
          </div>

          <h2 className="pmodal__title" id="pmodal-title">
            {project.title}
          </h2>

          <p className="pmodal__summary">{project.summary}</p>

          <div className="pmodal__grid">
            <div className="pmodal__visual">
              {project.device === 'phone' ? <PhoneMock /> : <BrowserMock />}
            </div>

            <div className="pmodal__detail">
              <h3 className="pmodal__label mono">What it does</h3>
              <ul className="pmodal__list">
                {project.highlights.map((h) => (
                  <li key={h}>
                    <i aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>

              <h3 className="pmodal__label mono">At a glance</h3>
              <div className="pmodal__metrics">
                {project.metrics.map((m) => (
                  <div key={m.k}>
                    <em className="mono">{m.k}</em>
                    <b>{m.v}</b>
                  </div>
                ))}
              </div>

              <h3 className="pmodal__label mono">Built with</h3>
              <div className="pmodal__stack">
                {project.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <footer className="pmodal__foot">
            <p className="pmodal__footNote">
              Full source, commit history and setup instructions live on GitHub.
            </p>
            <a
              className="btn btn--primary pmodal__cta"
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              data-cursor-label="GitHub"
            >
              <span>
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
          </footer>
        </div>
      </div>
    </div>
  )
}
