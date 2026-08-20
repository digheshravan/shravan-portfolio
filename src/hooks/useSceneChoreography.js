import { useLayoutEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motionState'
import { applyBeat, animateToBeat } from '../lib/sceneState'
import { SECTION_BEATS, assertScenesMatchContent } from '../data/scenes'

const SECTIONS = ['hero', 'about', 'skills', 'work', 'journey', 'contact']

/**
 * Drives the 3D system's section-level arc — COMPLEXITY (hero) → SYSTEM
 * (about/skills/work/journey) → OUTCOME (contact). One ScrollTrigger per
 * section, crossfading via animateToBeat() as each becomes current.
 *
 * Work's own per-project beats (see Work.jsx) take over once a specific
 * project card is centred in the rail; the 'work' entry here is only the
 * beat shown while scrolling in before that happens.
 */
export function useSceneChoreography(ready) {
  useLayoutEffect(() => {
    if (!ready) return

    assertScenesMatchContent()

    // The very first paint must be correct even if a frame never ticks
    // (see the Step 0 lab notes) — apply the hero beat directly, not via
    // an animated transition.
    applyBeat(SECTION_BEATS.hero)

    if (prefersReducedMotion()) return

    const triggers = SECTIONS.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const beat = SECTION_BEATS[id]
      const go = () => animateToBeat(beat)
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        onEnter: go,
        onEnterBack: go,
      })
    }).filter(Boolean)

    return () => triggers.forEach((t) => t.kill())
  }, [ready])
}
