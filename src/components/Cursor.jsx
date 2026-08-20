import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'

/**
 * A contextual dot — additive to the native cursor, never a replacement for
 * it (ADR-0015, superseding ADR-0009's instrument reticle).
 *
 * The reticle it replaces read out the pointer's normalised coordinates
 * because that was literally the number deforming the old artifact's
 * shader — a HUD tied to a specific object that no longer exists. The
 * current 3D system doesn't have a single `uMouse`-driven surface for a
 * cursor readout to mean anything about, so carrying the HUD forward would
 * make it decoration competing with the visual system it used to explain.
 * What's left is what a cursor add-on should be: it tightens and tints
 * toward the accent near anything interactive, and carries a short label
 * where one is declared — nothing else.
 */
export function Cursor() {
  const dotRef = useRef(null)
  const labelWrapRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return

    const dot = dotRef.current
    const labelWrap = labelWrapRef.current
    if (!dot || !labelWrap) return

    gsap.set([dot, labelWrap], { xPercent: -50, yPercent: -50, opacity: 0 })

    // The dot tracks tightly; the label trails a beat behind and sits offset
    // from it, so the two never fight for the same point.
    const dx = gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'out-expo' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'out-expo' })
    const lx = gsap.quickTo(labelWrap, 'x', { duration: 0.32, ease: 'out-expo' })
    const ly = gsap.quickTo(labelWrap, 'y', { duration: 0.32, ease: 'out-expo' })

    let shown = false
    let state = 'idle'

    const onMove = (e) => {
      if (!shown) {
        shown = true
        gsap.to(dot, { opacity: 1, duration: 0.35 })
      }
      dx(e.clientX)
      dy(e.clientY)
      lx(e.clientX + 20)
      ly(e.clientY + 20)
    }

    const setState = (next, text) => {
      if (next === state) return
      state = next
      dot.dataset.state = next

      gsap.to(dot, {
        scale: next === 'idle' ? 1 : 1.6,
        duration: 0.4,
        ease: 'out-expo',
        overwrite: 'auto',
      })

      const hasLabel = next === 'label' && Boolean(text)
      if (labelRef.current) labelRef.current.textContent = text || ''
      gsap.to(labelWrap, { opacity: hasLabel ? 1 : 0, duration: 0.25, overwrite: 'auto' })
    }

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor-label], [data-cursor], a, button')
      if (!target) return setState('idle')
      const text = target.getAttribute('data-cursor-label')
      setState(text ? 'label' : 'hover', text)
    }

    const onDown = () =>
      gsap.to(dot, { scale: 0.65, duration: 0.2, ease: 'out-expo', overwrite: 'auto' })
    const onUp = () =>
      gsap.to(dot, {
        scale: state === 'idle' ? 1 : 1.6,
        duration: 0.35,
        ease: 'out-expo',
        overwrite: 'auto',
      })

    const onLeave = () => {
      shown = false
      gsap.to([dot, labelWrap], { opacity: 0, duration: 0.25 })
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([dot, labelWrap])
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__dot" ref={dotRef} data-state="idle" />
      <span className="cursor__labelWrap" ref={labelWrapRef}>
        <span className="cursor__label" ref={labelRef} />
      </span>
    </div>
  )
}
