import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { prefersReducedMotion } from './lib/motionState'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useQualityTier, usePointerTracking } from './hooks/useEnvironment'
import { useScrollChoreography } from './hooks/useScrollChoreography'
import { useSceneChoreography } from './hooks/useSceneChoreography'

import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Grain, ScrollProgress, SectionRail, Atmosphere } from './components/Overlays'
import { StaticField } from './components/StaticField'

// three + r3f is a large bundle. The preloader runs for several seconds
// regardless, so fetch it alongside that instead of ahead of first paint.
const Scene = lazy(() => import('./three/Scene').then((m) => ({ default: m.Scene })))

import { Hero } from './sections/Hero'
import { Intersection } from './sections/Intersection'
import { Capabilities } from './sections/Capabilities'
import { Work } from './sections/Work'
import { Experience } from './sections/Experience'
import { Contact } from './sections/Contact'

export default function App() {
  const [ready, setReady] = useState(false)
  const { tier, reduced } = useQualityTier()

  // Exposes prefersReducedMotion()'s already-URL-aware result to CSS, the
  // same way is-loading/menu-open/modal-open expose other JS state — a raw
  // `@media (prefers-reduced-motion: reduce)` rule can't see ?motion=reduced,
  // only the real OS setting. `reduced` (from useQualityTier, below) is only
  // the dependency that tells this effect when to re-check; the value
  // applied always comes from prefersReducedMotion() itself, so there's one
  // source of truth, not a second one computed here.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', prefersReducedMotion())
  }, [reduced])

  usePointerTracking()
  useSmoothScroll(!reduced)
  // Runs after the sections exist, so it can scan for [data-skew]/[data-parallax].
  useScrollChoreography(ready && !reduced)
  useSceneChoreography(ready)

  const onLoaderDone = useCallback(() => {
    // Re-measure while the loader is still up. Doing it after — in the same
    // frame the intro timelines are created — lets a refresh land on a tween
    // that has only just applied its start pose.
    ScrollTrigger.refresh()
    setReady(true)
  }, [])

  // Fonts land after first paint and change every measurement that matters.
  useEffect(() => {
    if (!document.fonts) return
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <Preloader onComplete={onLoaderDone} />

      <Suspense
        fallback={
          <div className="scene scene--static" aria-hidden="true">
            <StaticField />
          </div>
        }
      >
        <Scene tier={tier} ready={ready} />
      </Suspense>
      <Atmosphere />
      <Grain />
      <Cursor />
      <ScrollProgress />
      <SectionRail />

      <Nav ready={ready} />

      <main className="main">
        <Hero ready={ready} />

        <Intersection />
        <Capabilities />
        <Work />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
