import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { pointer, prefersReducedMotion } from '../lib/motionState'

/**
 * A instrument-panel cursor, built for an engineer's portfolio.
 *
 * It reports the pointer's position in **normalised device coordinates** — the
 * exact -1 → 1 space the vertex and fragment shaders use for `uMouse`. So the
 * readout isn't decorative telemetry: it's the number currently deforming the
 * artifact behind the page. Move toward the object and watch X approach 1.
 *
 * The reticle is a real 3D object: a CSS-3D ring carrying its own perspective,
 * banking on Y and pitching on X in proportion to pointer velocity, so it leans
 * into movement like a gimbal and levels out when you stop.
 *
 * The native cursor stays visible throughout. The crosshair arms are drawn with
 * a transparent gap at the centre precisely so the system arrow reads through
 * them — nobody has to hunt for where they're pointing.
 */
export function Cursor() {
  const reticleRef = useRef(null)
  const ringRef = useRef(null)
  const hudRef = useRef(null)
  const xRef = useRef(null)
  const yRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (prefersReducedMotion()) return

    const reticle = reticleRef.current
    const ring = ringRef.current
    const hud = hudRef.current
    if (!reticle || !ring || !hud) return

    gsap.set([reticle, hud], { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(ring, { transformPerspective: 340 })

    // The reticle tracks tightly; the HUD trails, so the readout settles a beat
    // after the crosshair — it reads as an instrument catching up.
    const rx = gsap.quickTo(reticle, 'x', { duration: 0.28, ease: 'out-expo' })
    const ry = gsap.quickTo(reticle, 'y', { duration: 0.28, ease: 'out-expo' })
    const hx = gsap.quickTo(hud, 'x', { duration: 0.58, ease: 'out-expo' })
    const hy = gsap.quickTo(hud, 'y', { duration: 0.58, ease: 'out-expo' })

    // Velocity → gimbal bank/pitch.
    const bank = gsap.quickTo(ring, 'rotationY', { duration: 0.75, ease: 'out-expo' })
    const pitch = gsap.quickTo(ring, 'rotationX', { duration: 0.75, ease: 'out-expo' })
    const spin = gsap.quickTo(ring, 'rotationZ', { duration: 1.1, ease: 'out-expo' })

    let shown = false
    let lastX = 0
    let lastY = 0
    let state = 'idle'

    const onMove = (e) => {
      if (!shown) {
        shown = true
        gsap.to([reticle, hud], { opacity: 1, duration: 0.45 })
      }

      const vx = e.clientX - lastX
      const vy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY

      rx(e.clientX)
      ry(e.clientY)
      hx(e.clientX + 34)
      hy(e.clientY + 34)

      bank(gsap.utils.clamp(-46, 46, vx * 1.5))
      pitch(gsap.utils.clamp(-46, 46, -vy * 1.5))
      spin(gsap.utils.clamp(-16, 16, vx * 0.35))
    }

    // The coordinate readout is driven off the shared pointer singleton so the
    // number on screen is literally the one handed to the shader each frame.
    const fmt = (n) => (n < 0 ? '' : '+') + n.toFixed(3)
    let lastPrintedX = null
    let lastPrintedY = null

    const tick = () => {
      const nx = pointer.x
      const ny = pointer.y
      if (lastPrintedX === null || Math.abs(nx - lastPrintedX) > 0.001) {
        lastPrintedX = nx
        if (xRef.current) xRef.current.textContent = fmt(nx)
      }
      if (lastPrintedY === null || Math.abs(ny - lastPrintedY) > 0.001) {
        lastPrintedY = ny
        if (yRef.current) yRef.current.textContent = fmt(ny)
      }
    }
    gsap.ticker.add(tick)

    const setState = (next, text) => {
      if (next === state) return
      state = next
      reticle.dataset.state = next
      hud.dataset.state = next

      gsap.to(reticle, {
        scale: next === 'idle' ? 1 : 1.55,
        duration: 0.55,
        ease: 'out-expo',
        overwrite: 'auto',
      })

      if (labelRef.current) labelRef.current.textContent = text || ''
    }

    const onOver = (e) => {
      const target = e.target.closest('[data-cursor-label], [data-cursor], a, button')
      if (!target) return setState('idle')
      const text = target.getAttribute('data-cursor-label')
      setState(text ? 'label' : 'hover', text)
    }

    const onDown = () => gsap.to(reticle, { scale: 0.78, duration: 0.2, overwrite: 'auto' })
    const onUp = () =>
      gsap.to(reticle, {
        scale: state === 'idle' ? 1 : 1.55,
        duration: 0.4,
        overwrite: 'auto',
      })

    const onLeave = () => {
      shown = false
      gsap.to([reticle, hud], { opacity: 0, duration: 0.3 })
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
      gsap.ticker.remove(tick)
      gsap.killTweensOf([reticle, ring, hud])
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__reticle" ref={reticleRef} data-state="idle">
        <span className="cursor__ring" ref={ringRef} />
        <span className="cursor__axis cursor__axis--x" />
        <span className="cursor__axis cursor__axis--y" />
        <span className="cursor__corner cursor__corner--tl" />
        <span className="cursor__corner cursor__corner--tr" />
        <span className="cursor__corner cursor__corner--bl" />
        <span className="cursor__corner cursor__corner--br" />
      </div>

      <div className="cursor__hud" ref={hudRef} data-state="idle">
        <span className="cursor__coord">
          <em>x</em>
          <b ref={xRef}>+0.000</b>
        </span>
        <span className="cursor__coord">
          <em>y</em>
          <b ref={yRef}>+0.000</b>
        </span>
        <span className="cursor__hudLabel" ref={labelRef} />
      </div>
    </div>
  )
}
