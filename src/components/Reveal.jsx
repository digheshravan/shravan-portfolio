import { useLayoutEffect, useRef, createElement } from 'react'
import { gsap } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'

/**
 * Splits text into masked words (or characters) and lifts them into place on
 * scroll. Each unit sits inside an overflow-hidden wrapper, so the type slides
 * out from behind an invisible edge rather than just fading — the difference
 * between "animated" and "art directed".
 */
export function Reveal({
  children,
  as = 'span',
  mode = 'word',
  stagger = 0.045,
  duration = 1.15,
  delay = 0,
  y = 105,
  rotate = 0,
  trigger = 'scroll',
  start = 'top 85%',
  className = '',
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll('[data-unit]'), { yPercent: 0, opacity: 1, rotate: 0 })
      return
    }

    const ctx = gsap.context(() => {
      const units = el.querySelectorAll('[data-unit]')
      if (!units.length) return

      gsap.set(units, { yPercent: y, rotate, opacity: rotate ? 0 : 1 })

      const tween = {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration,
        delay,
        stagger: { each: stagger, from: 'start' },
        ease: 'out-expo',
      }

      if (trigger === 'immediate') {
        gsap.to(units, tween)
      } else {
        gsap.to(units, {
          ...tween,
          scrollTrigger: { trigger: el, start, once: true },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [mode, stagger, duration, delay, y, rotate, trigger, start])

  const text = typeof children === 'string' ? children : String(children ?? '')
  const tokens = mode === 'char' ? splitChars(text) : splitWords(text)

  return createElement(
    as,
    { ref, className: `reveal reveal--${mode} ${className}`.trim(), ...rest },
    tokens.map((token, i) => (
      <span className="reveal__mask" key={`${token}-${i}`}>
        <span className="reveal__unit" data-unit>
          {token}
        </span>
      </span>
    ))
  )
}

// Keep the trailing space glued to its word: the mask uses `white-space: pre`,
// so the gap survives inline-block layout without needing &nbsp;.
function splitWords(text) {
  return text.match(/\S+\s*/g) || []
}

function splitChars(text) {
  return Array.from(text)
}
