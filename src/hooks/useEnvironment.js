import { useEffect, useState } from 'react'
import { pointer, quality, damp } from '../lib/motionState'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Decides how much spectacle this device can actually afford, then writes the
 * verdict into the shared quality singleton so the Canvas can read it.
 */
/** `?motion=full` opts back into the full experience, `?motion=reduced` out of it. */
function motionOverride() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('motion')
}

export function useQualityTier() {
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const coarse = useMediaQuery('(pointer: coarse)')
  const small = useMediaQuery('(max-width: 900px)')

  const override = motionOverride()
  const reduced = override === 'full' ? false : override === 'reduced' ? true : prefersReduced

  const [tier, setTier] = useState('high')

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4
    const weak = cores <= 4 || memory <= 4

    const next = reduced ? 'minimal' : small || weak ? 'low' : 'high'
    setTier(next)

    quality.effects = next === 'high'
    quality.dpr = next === 'high' ? 1.75 : next === 'low' ? 1.25 : 1
  }, [reduced, small])

  return { tier, reduced, coarse, small }
}

/** Global pointer tracking, eased, written into the shared singleton. */
export function usePointerTracking() {
  useEffect(() => {
    let raf = 0
    let last = performance.now()

    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = true
    }

    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      pointer.ex = damp(pointer.ex, pointer.x, 4, dt)
      pointer.ey = damp(pointer.ey, pointer.y, 4, dt)
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
}
