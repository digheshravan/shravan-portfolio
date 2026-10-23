import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { scroll } from '../lib/motionState'
import { NAV } from '../data/content'
import { scrollToSection } from '../hooks/useSmoothScroll'

/** Fixed film grain. Kept in CSS/SVG so it costs nothing on the GPU budget. */
export function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  )
}

/**
 * Reading progress across the top of the page. This is the piece that does the
 * job a scrollbar does — "how far in am I" — at a glance, on every screen size.
 */
export function ScrollProgress() {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const setScale = gsap.quickSetter(bar, 'scaleX')
    const tick = () => setScale(scroll.progress)
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <span className="progress__bar" ref={barRef} />
    </div>
  )
}

/**
 * The right-hand rail. A scrollbar tells you where you are; this also tells you
 * *what* you're looking at and lets you jump — so it replaces the scrollbar
 * rather than decorating it. Labels stay hidden until the rail is hovered or a
 * section is active, so it reads as a quiet ruler most of the time.
 */
export function SectionRail() {
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const triggers = NAV.map(({ href }, i) => {
      const target = document.querySelector(href)
      if (!target) return null
      return ScrollTrigger.create({
        trigger: target,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => self.isActive && setActive(i),
      })
    }).filter(Boolean)

    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    // No percentage readout or section count: the top progress bar already
    // says how far in you are, and three position indicators is two too many.
    <nav className="rail" aria-label="Section navigation">
      <ul className="rail__list">
        {NAV.map(({ label, href }, i) => (
          <li key={href}>
            <button
              className={`rail__item ${i === active ? 'is-active' : ''}`}
              onClick={() => scrollToSection(href)}
              aria-label={`Go to ${label}`}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className="rail__label">{label}</span>
              <span className="rail__tick" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Soft vignette that sits above the canvas, below the type. */
export function Atmosphere() {
  return <div className="atmosphere" aria-hidden="true" />
}
