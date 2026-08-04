import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { SKILLS, MARQUEE } from '../data/content'
import { SectionHead } from '../components/SectionHead'
import { Marquee } from '../components/Marquee'

export function Skills() {
  const root = useRef(null)
  const floatRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = prefersReducedMotion()

    const ctx = gsap.context(() => {
      if (reduced) return

      // Each row is triggered on its own rather than as one batch, so the list
      // unrolls at the reader's pace — the row you're arriving at is the row
      // that moves. A clip wipe reads as the rule below it drawing the content
      // upward, which a plain fade doesn't.
      gsap.utils.toArray('.skillRow').forEach((row) => {
        gsap.fromTo(
          row,
          { clipPath: 'inset(0% 0% 100% 0%)', y: 46, opacity: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            y: 0,
            opacity: 1,
            duration: 1.25,
            ease: 'out-expo',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          }
        )
      })

      // Floating preview panel trails the cursor across the list.
      const panel = floatRef.current
      if (!panel) return
      gsap.set(panel, { xPercent: -50, yPercent: -50, scale: 0.85, opacity: 0 })
      const xTo = gsap.quickTo(panel, 'x', { duration: 0.7, ease: 'out-expo' })
      const yTo = gsap.quickTo(panel, 'y', { duration: 0.7, ease: 'out-expo' })

      const onMove = (e) => {
        const rect = el.getBoundingClientRect()
        xTo(e.clientX - rect.left)
        yTo(e.clientY - rect.top)
      }
      el.addEventListener('pointermove', onMove)
      return () => el.removeEventListener('pointermove', onMove)
    }, el)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const panel = floatRef.current
    if (!panel) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    gsap.to(panel, {
      opacity: hovered ? 1 : 0,
      scale: hovered ? 1 : 0.85,
      duration: 0.55,
      ease: 'out-expo',
    })
  }, [hovered])

  const activeGroup = SKILLS.find((s) => s.id === hovered)

  return (
    <section className="section skills" id="skills" ref={root} data-panel>
      <SectionHead
        index="02"
        label="Craft"
        title="What I build with"
        note="Four layers of the stack, learned in the order that lets me ship a whole product alone."
      />

      <div className="skills__list" onPointerLeave={() => setHovered(null)}>
        {SKILLS.map((group) => (
          <div
            className={`skillRow ${hovered && hovered !== group.id ? 'is-dimmed' : ''}`}
            key={group.id}
            onPointerEnter={() => setHovered(group.id)}
            data-cursor
          >
            <span className="skillRow__index mono">{group.id}</span>

            <h3 className="skillRow__title">
              <span className="skillRow__titleInner">{group.group}</span>
              <span className="skillRow__titleGhost" aria-hidden="true">
                {group.group}
              </span>
            </h3>

            <p className="skillRow__blurb">{group.blurb}</p>

            <ul className="skillRow__items">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <span className="skillRow__count mono">{String(group.items.length).padStart(2, '0')}</span>
          </div>
        ))}
      </div>

      <div className="skills__float" ref={floatRef} aria-hidden="true">
        <div className="skills__floatInner">
          <span className="mono">{activeGroup?.id}</span>
          <div className="skills__chips">
            {activeGroup?.items.map((item) => (
              <em key={item}>{item}</em>
            ))}
          </div>
        </div>
      </div>

      <Marquee items={MARQUEE} className="marquee--rule" speed={48} />
    </section>
  )
}
