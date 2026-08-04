import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { PROFILE } from '../data/content'
import { Magnetic } from '../components/Magnetic'
import { Reveal } from '../components/Reveal'

const LINKS = [
  { label: 'Email', value: PROFILE.email, href: `mailto:${PROFILE.email}`, copy: true },
  { label: 'Phone', value: PROFILE.phone, href: `tel:${PROFILE.phoneHref}` },
  { label: 'LinkedIn', value: '/in/shravan-dige', href: PROFILE.linkedin, external: true },
  { label: 'GitHub', value: '@digheshravan', href: PROFILE.github, external: true },
  { label: 'Résumé', value: 'Download PDF', href: PROFILE.resume, external: true },
]

export function Contact() {
  const root = useRef(null)
  const [copied, setCopied] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact__row',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.contact__links', start: 'top 86%', once: true },
        }
      )

      // The huge outline word slides across as the footer arrives.
      gsap.fromTo(
        '.contact__ghost',
        { xPercent: 6 },
        {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
        }
      )

      gsap.fromTo(
        '.footer__col',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'out-expo',
          scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true },
        }
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the mailto link is still right there.
    }
  }

  return (
    <section className="section contact" id="contact" ref={root} data-panel>
      <span className="contact__ghost" aria-hidden="true">
        LET'S BUILD
      </span>

      <div className="contact__inner">
        <p className="contact__kicker mono">
          <i className="dot" /> Available for internships & freelance — 2026
        </p>

        <h2 className="contact__title">
          <Reveal mode="word" stagger={0.06}>
            Have something worth building?
          </Reveal>
        </h2>

        <div className="contact__cta">
          <Magnetic strength={0.42} radius={130}>
            <a
              className="contact__mail"
              href={`mailto:${PROFILE.email}`}
              data-cursor-label="Write"
            >
              <span data-magnetic-inner>
                {PROFILE.email}
                <i className="contact__mailLine" />
              </span>
            </a>
          </Magnetic>

          <button className="contact__copy" onClick={copyEmail} data-cursor>
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>

        <div className="contact__links">
          {LINKS.map((l) => (
            <a
              className="contact__row"
              key={l.label}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              data-cursor
            >
              <span className="contact__rowLabel mono">{l.label}</span>
              <span className="contact__rowValue">{l.value}</span>
              <span className="contact__rowArrow" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="16" height="16">
                  <path
                    d="M3 13L13 3M13 3H5M13 3v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>

      <footer className="footer">
        <div className="footer__col">
          <span className="mono">Based in</span>
          <p>{PROFILE.location}</p>
        </div>
        <div className="footer__col">
          <span className="mono">Studying</span>
          <p>
            {PROFILE.degree}
            <br />
            {PROFILE.school} · {PROFILE.cohort}
          </p>
        </div>
        <div className="footer__col">
          <span className="mono">Built with</span>
          <p>React · Three.js · GSAP · Lenis</p>
        </div>
        <div className="footer__col footer__col--end">
          <span className="mono">© {new Date().getFullYear()}</span>
          <p>
            {PROFILE.first} {PROFILE.last}
          </p>
        </div>
      </footer>
    </section>
  )
}
