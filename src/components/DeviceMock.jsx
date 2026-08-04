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
