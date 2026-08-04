import { useLayoutEffect } from 'react'
import { gsap } from '../lib/gsap'
import { scroll, prefersReducedMotion } from '../lib/motionState'

/**
 * Page-wide scroll behaviour that would otherwise be copy-pasted into every
 * section.
 *
 * The headline effect is the 3D panel transition: each section arrives out of
 * depth, tilted away from the viewer, rotates flat as it takes the screen, and
 * falls back into depth as it leaves. Scrolling stays completely normal — no
 * snapping, no pinning, no hijacked wheel. The page just has a Z axis.
 *
 * Perspective is applied per element via GSAP's `transformPerspective` rather
 * than as `perspective` on a shared ancestor. On a 9,000px page a single
 * ancestor puts the vanishing point thousands of pixels away from most
 * sections, which shears them instead of rotating them.
 */
export function useScrollChoreography(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('[data-panel]')

      // ---- 3D section transitions ----------------------------------------
      panels.forEach((panel, i) => {
        const isLast = i === panels.length - 1

        // force3D is left at GSAP's "auto": it uses matrix3d while the values
        // are moving and drops back to a 2D matrix at rest, which keeps the
        // type sharply rasterised for the whole time anyone is reading it.
        gsap.set(panel, {
          transformPerspective: 1500,
          transformOrigin: '50% 50%',
        })

        // Arrival: rise out of depth and rotate flat.
        gsap.fromTo(
          panel,
          { rotateX: -13, z: -420, opacity: 0.25 },
          {
            rotateX: 0,
            z: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top 96%',
              end: 'top 38%',
              scrub: 0.9,
            },
          }
        )

        // Departure: tip back and recede. The last panel holds — it carries the
        // footer, and dimming the contact details on the way out would be a
        // strange note to end on.
        if (isLast) return

        gsap.fromTo(
          panel,
          { rotateX: 0, z: 0, opacity: 1 },
          {
            rotateX: 10,
            z: -340,
            opacity: 0.22,
            ease: 'none',
            // Without this the exit tween renders its start values at creation
            // and clobbers the arrival tween's opening pose.
            immediateRender: false,
            scrollTrigger: {
              trigger: panel,
              // Starts only once the section is genuinely on its way out, so
              // nothing dims while it is still being read.
              start: 'bottom 62%',
              end: 'bottom -5%',
              scrub: 0.9,
            },
          }
        )
      })

      // ---- Velocity lean --------------------------------------------------
      // A fraction of a degree in the direction of travel, springing back at
      // rest. Deliberately tiny now that the panels carry real depth — this is
      // just momentum, and it composes into the same matrix as the tilt.
      const setSkew = panels.map((el) =>
        gsap.quickTo(el, 'skewY', { duration: 0.75, ease: 'out-expo' })
      )

      const MAX = 0.8
      let current = 0
      const tick = () => {
        const target = gsap.utils.clamp(-MAX, MAX, scroll.velocity * MAX * 1.6)
        if (Math.abs(target - current) > 0.01) {
          current = target
          setSkew.forEach((fn) => fn(target))
        }
      }
      gsap.ticker.add(tick)

      // ---- Declarative parallax -------------------------------------------
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const depth = parseFloat(el.dataset.parallax) || 0.1
        // Drift is measured against the nearest declared scope so that, e.g., a
        // project card parallaxes over its own height rather than over the
        // whole multi-project section.
        const scope = el.closest('[data-parallax-scope]') || el.closest('section') || el
        gsap.fromTo(
          el,
          { yPercent: depth * 100 },
          {
            yPercent: -depth * 100,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
          }
        )
      })

      // ---- Section rules draw themselves in --------------------------------
      gsap.utils.toArray('.sectionHead__rule').forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: 'left center',
            ease: 'none',
            scrollTrigger: {
              trigger: rule.closest('.sectionHead') || rule,
              start: 'top 92%',
              end: 'top 62%',
              scrub: 0.6,
            },
          }
        )
      })

      return () => gsap.ticker.remove(tick)
    })

    return () => ctx.revert()
  }, [enabled])
}
