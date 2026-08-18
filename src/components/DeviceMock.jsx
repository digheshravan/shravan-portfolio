import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'

/**
 * There are no screenshots in the CV, so the products are drawn here in DOM
 * and animated — a live impression of each app rather than a dead image.
 */

const SLOTS = [
  { time: '09:30', name: 'Aarav Shah', tag: 'Follow-up', state: 'confirmed' },
  { time: '10:15', name: 'Priya Nair', tag: 'New patient', state: 'pending' },
  { time: '11:00', name: 'Rohan Iyer', tag: 'Consultation', state: 'confirmed' },
  { time: '11:45', name: 'Meera Joshi', tag: 'Report review', state: 'open' },
]

export function PhoneMock() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.4,
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 10%', toggleActions: 'play pause resume pause' },
      })

      tl.fromTo(
        '.mock__slot',
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.14, ease: 'out-expo' }
      )
        .to('.mock__slot:nth-child(4) .mock__state', {
          backgroundColor: 'rgba(108,92,255,0.18)',
          color: '#B9B1FF',
          duration: 0.5,
        })
        .to('.mock__pulse', { scale: 1.9, opacity: 0, duration: 1.1, ease: 'power2.out' }, '<')
        .set('.mock__pulse', { scale: 1, opacity: 0.7 })
        .to('.mock__slot', { opacity: 0.35, duration: 0.5, stagger: 0.05 }, '+=1.1')

      // The realtime badge never stops — that's the point of the product.
      gsap.to('.mock__live i', {
        opacity: 0.25,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="mock mock--phone" ref={root} aria-hidden="true">
      <div className="mock__frame">
        <div className="mock__notch" />
        <div className="mock__screen">
          <div className="mock__statusbar mono">
            <span>9:41</span>
            <span className="mock__live">
              <i />
              Live
            </span>
          </div>

          <div className="mock__appHead">
            <p className="mock__hello">Good morning,</p>
            <h4>Dr. A. Mehta</h4>
            <div className="mock__tabs">
              <span className="is-active">Doctor</span>
              <span>Patient</span>
            </div>
          </div>

          <div className="mock__sectionLabel mono">
            Today · 4 slots
            <em className="mock__pulse" />
          </div>

          <div className="mock__slots">
            {SLOTS.map((s) => (
              <div className="mock__slot" key={s.time}>
                <span className="mock__time mono">{s.time}</span>
                <span className="mock__slotBody">
                  <b>{s.name}</b>
                  <em>{s.tag}</em>
                </span>
                <span className={`mock__state mock__state--${s.state}`}>
                  <span>
                    {s.state === 'confirmed' ? 'Confirmed' : s.state === 'pending' ? 'Pending' : 'Open'}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="mock__cta">Manage availability</div>
        </div>
      </div>
    </div>
  )
}

const FLEET = [
  { car: 'Hyundai Creta', plate: 'MH 01 · AF 4421', status: 'Rented', rate: '₹2,400' },
  { car: 'Maruti Baleno', plate: 'MH 02 · BK 1180', status: 'Available', rate: '₹1,650' },
  { car: 'Tata Nexon EV', plate: 'MH 04 · CE 9077', status: 'Servicing', rate: '₹2,900' },
  { car: 'Honda City', plate: 'MH 03 · DL 2256', status: 'Available', rate: '₹2,100' },
]

export function BrowserMock() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 10%', toggleActions: 'play pause resume pause' },
      })

      tl.fromTo(
        '.mockb__tile',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'out-expo' }
      )
        .fromTo(
          '.mockb__row',
          { x: -18, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: 'out-expo' },
          '-=0.25'
        )
        .to('.mockb__row:nth-child(2)', { backgroundColor: 'rgba(53,224,255,0.07)', duration: 0.4 })
        .to('.mockb__row:nth-child(2) .mockb__status', {
          color: '#7BE9FF',
          borderColor: 'rgba(123,233,255,0.45)',
          duration: 0.4,
        }, '<')
        .to('.mockb__row', { opacity: 0.4, duration: 0.5, stagger: 0.04 }, '+=1.2')

      // Count-up on the revenue tile, looping with the rest of the scene.
      const counter = el.querySelector('[data-count]')
      if (counter) {
        const obj = { v: 0 }
        tl.to(
          obj,
          {
            v: 184,
            duration: 1.4,
            ease: 'out-expo',
            onUpdate: () => (counter.textContent = `₹${Math.round(obj.v)}k`),
          },
          0.2
        )
      }
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="mock mock--browser" ref={root} aria-hidden="true">
      <div className="mockb__chrome">
        <span className="mockb__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mockb__url mono">rental.admin / fleet</span>
      </div>

      <div className="mockb__body">
        <aside className="mockb__side">
          <span className="mockb__logo">CR</span>
          {['Fleet', 'Bookings', 'Billing', 'Users'].map((l, i) => (
            <span className={`mockb__nav ${i === 0 ? 'is-active' : ''}`} key={l}>
              {l}
            </span>
          ))}
        </aside>

        <div className="mockb__main">
          <div className="mockb__tiles">
            <div className="mockb__tile">
              <em className="mono">Revenue · MTD</em>
              <b data-count>₹0k</b>
            </div>
            <div className="mockb__tile">
              <em className="mono">Active rentals</em>
              <b>27</b>
            </div>
            <div className="mockb__tile">
              <em className="mono">Fleet</em>
              <b>41</b>
            </div>
          </div>

          <div className="mockb__table">
            <div className="mockb__head mono">
              <span>Vehicle</span>
              <span>Registration</span>
              <span>Status</span>
              <span>Day rate</span>
            </div>
            {FLEET.map((r) => (
              <div className="mockb__row" key={r.plate}>
                <span>{r.car}</span>
                <span className="mono">{r.plate}</span>
                <span className="mockb__status">{r.status}</span>
                <span className="mono">{r.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const DOC_TILES = [
  { label: 'Risk score', to: 72 },
  { label: 'Clauses flagged', value: '6' },
  { label: 'Papers synced', value: '12' },
]

/**
 * DocMind: the interesting part of a document-intelligence tool isn't a
 * dashboard, it's the answer citing where it came from. So the panel leads
 * with the RAG chat exchange rather than another metrics grid.
 */
export function DocMock() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 10%', toggleActions: 'play pause resume pause' },
      })

      tl.fromTo(
        '.mockb__tile',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'out-expo' }
      ).fromTo(
        '.mockd__msg',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.22, ease: 'out-expo' },
        '-=0.2'
      )

      const counter = el.querySelector('[data-count]')
      if (counter) {
        const obj = { v: 0 }
        tl.to(
          obj,
          {
            v: 72,
            duration: 1.2,
            ease: 'out-expo',
            onUpdate: () => (counter.textContent = Math.round(obj.v)),
          },
          0.15
        )
      }

      tl.to('.mockd__msg, .mockb__tile', { opacity: 0.4, duration: 0.5, stagger: 0.04 }, '+=1.3')
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="mock mock--browser" ref={root} aria-hidden="true">
      <div className="mockb__chrome">
        <span className="mockb__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mockb__url mono">docmind.app / legal-intelligence</span>
      </div>

      <div className="mockb__body">
        <aside className="mockb__side">
          <span className="mockb__logo">DM</span>
          {['Legal', 'Research', 'Compare', 'Chat'].map((l, i) => (
            <span className={`mockb__nav ${i === 0 ? 'is-active' : ''}`} key={l}>
              {l}
            </span>
          ))}
        </aside>

        <div className="mockb__main">
          <div className="mockb__tiles">
            {DOC_TILES.map((t) => (
              <div className="mockb__tile" key={t.label}>
                <em className="mono">{t.label}</em>
                <b {...(t.to !== undefined ? { 'data-count': true } : {})}>{t.value ?? 0}</b>
              </div>
            ))}
          </div>

          <div className="mockd__chat">
            <p className="mockd__msg mockd__msg--user">Does this lease allow early termination?</p>
            <p className="mockd__msg mockd__msg--ai">
              Yes — clause 14.2 permits termination after month 12 with 60 days&rsquo; notice.
              <span className="mockd__cite mono">Clause 14.2</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const RISK_FACTORS = [
  { label: 'Litigation exposure', severity: 82 },
  { label: 'Related-party transactions', severity: 64 },
  { label: 'Revenue concentration', severity: 71 },
  { label: 'Regulatory approval pending', severity: 45 },
]

/**
 * IPO Prospectus Risk Decoder: severity reads better as a bar than a badge —
 * the whole point of the product is that risk is a gradient DRHP language
 * tries to flatten, so the mock should not flatten it either.
 */
export function RiskMock() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.6,
        scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 10%', toggleActions: 'play pause resume pause' },
      })

      tl.fromTo(
        '.mockb__tile',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'out-expo' }
      ).fromTo(
        '.mockr__factor',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, stagger: 0.09 },
        '-=0.2'
      )

      RISK_FACTORS.forEach((f, i) => {
        tl.fromTo(
          `.mockr__bar--${i} i`,
          { width: '0%' },
          { width: f.severity + '%', duration: 0.7, ease: 'power2.out' },
          `<+=0.05`
        )
      })

      const counter = el.querySelector('[data-count]')
      if (counter) {
        const obj = { v: 0 }
        tl.to(
          obj,
          {
            v: 68,
            duration: 1.1,
            ease: 'out-expo',
            onUpdate: () => (counter.textContent = Math.round(obj.v)),
          },
          0.15
        )
      }

      tl.to('.mockr__factor, .mockb__tile', { opacity: 0.4, duration: 0.5, stagger: 0.04 }, '+=1.3')
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <div className="mock mock--browser" ref={root} aria-hidden="true">
      <div className="mockb__chrome">
        <span className="mockb__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mockb__url mono">ipo-decoder / drhp-2026-114</span>
      </div>

      <div className="mockb__body">
        <aside className="mockb__side">
          <span className="mockb__logo">RD</span>
          {['Filing', 'Risks', 'Benchmark', 'Insights'].map((l, i) => (
            <span className={`mockb__nav ${i === 0 ? 'is-active' : ''}`} key={l}>
              {l}
            </span>
          ))}
        </aside>

        <div className="mockb__main">
          <div className="mockb__tiles">
            <div className="mockb__tile">
              <em className="mono">Overall risk</em>
              <b data-count>0</b>
            </div>
            <div className="mockb__tile">
              <em className="mono">Factors flagged</em>
              <b>{RISK_FACTORS.length}</b>
            </div>
            <div className="mockb__tile">
              <em className="mono">Vs. benchmark</em>
              <b>+18%</b>
            </div>
          </div>

          <div className="mockr__factors">
            {RISK_FACTORS.map((f, i) => (
              <div className="mockr__factor" key={f.label}>
                <span className="mockr__label">{f.label}</span>
                <span className={`mockr__bar mockr__bar--${i}`}>
                  <i />
                </span>
                <span className="mockr__value mono">{f.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
