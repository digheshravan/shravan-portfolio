import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { NAV, PROFILE } from '../data/content'
import { scrollToSection, getLenis } from '../hooks/useSmoothScroll'
import { Magnetic } from './Magnetic'

function useLocalClock(timeZone) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone,
        }).format(new Date())
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])
  return time
}

export function Nav({ ready }) {
  const root = useRef(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#hero')
  const time = useLocalClock(PROFILE.timezone)

  // Intro: the bar drops in only once the preloader has cleared.
  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.set('.nav__item', { yPercent: -140, opacity: 0 })
      gsap.to('.nav__item', {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.07,
        ease: 'out-expo',
        delay: 0.15,
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  // Hide on scroll down, reveal on scroll up.
  useLayoutEffect(() => {
    if (!ready) return
    const el = root.current
    const ctx = gsap.context(() => {
      const show = gsap.quickTo(el, 'yPercent', { duration: 0.6, ease: 'out-expo' })
      ScrollTrigger.create({
        start: 'top -120',
        end: 'max',
        onUpdate: (self) => {
          if (open) return show(0)
          show(self.direction === 1 && self.scroll() > 400 ? -140 : 0)
        },
      })

      NAV.forEach(({ href }) => {
        const target = document.querySelector(href)
        if (!target) return
        ScrollTrigger.create({
          trigger: target,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(href),
        })
      })
    }, el)
    return () => ctx.revert()
  }, [ready, open])

  // Freeze the page behind the overlay menu.
  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    open ? lenis.stop() : lenis.start()
    document.documentElement.classList.toggle('menu-open', open)
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    // Let the overlay begin closing before the scroll starts.
    setTimeout(() => scrollToSection(href), open ? 420 : 0)
  }

  return (
    <>
      <header className="nav" ref={root}>
        <div className="nav__item nav__brand">
          <a href="#hero" onClick={(e) => go(e, '#hero')} aria-label="Back to top">
            <span className="nav__mark">SD</span>
            <span className="nav__brandText">
              {PROFILE.first} {PROFILE.last}
              <em>{PROFILE.role}</em>
            </span>
          </a>
        </div>

        <nav className="nav__item nav__links" aria-label="Primary">
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => go(e, href)}
              className={active === href ? 'is-active' : ''}
              data-cursor
            >
              <span className="nav__linkInner">{label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__item nav__aside">
          <span className="nav__status">
            <i className="dot" />
            Open to internships
          </span>
          <span className="nav__clock mono">
            {time} <em>IST</em>
          </span>
          <Magnetic strength={0.25}>
            <button
              className={`nav__burger ${open ? 'is-open' : ''}`}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span data-magnetic-inner>
                <i />
                <i />
              </span>
            </button>
          </Magnetic>
        </div>
      </header>

      <Menu open={open} onNavigate={go} />
    </>
  )
}

function Menu({ open, onNavigate }) {
  const root = useRef(null)
  const tl = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true })
        // `el` is the context root: a '.menu' selector would be scoped to its
        // descendants and silently miss the shell itself.
        .set(el, { pointerEvents: 'auto', visibility: 'visible' })
        .to('.menu__bg', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'in-out-quint' })
        .fromTo(
          '.menu__link span',
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, stagger: 0.06, ease: 'out-expo' },
          '-=0.55'
        )
        .fromTo(
          '.menu__foot > *',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
          '-=0.6'
        )
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const t = tl.current
    if (!t) return
    if (open) t.play()
    else
      t.reverse().eventCallback('onReverseComplete', () =>
        gsap.set(root.current, { pointerEvents: 'none', visibility: 'hidden' })
      )
  }, [open])

  return (
    <div className="menu" ref={root} aria-hidden={!open}>
      <div className="menu__bg" />
      <div className="menu__inner">
        <ul className="menu__list">
          {NAV.map(({ label, href }, i) => (
            <li key={href}>
              <a className="menu__link" href={href} onClick={(e) => onNavigate(e, href)}>
                <em className="mono">{String(i + 1).padStart(2, '0')}</em>
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={PROFILE.resume} target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      </div>
    </div>
  )
}
