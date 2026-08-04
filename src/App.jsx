import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useQualityTier, usePointerTracking } from './hooks/useEnvironment'
import { useScrollChoreography } from './hooks/useScrollChoreography'

import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { Grain, ScrollProgress, SectionRail, Atmosphere } from './components/Overlays'
import { Marquee } from './components/Marquee'

// three + r3f + postprocessing is ~1MB. The preloader runs for several seconds
// regardless, so fetch that bundle alongside it instead of ahead of first paint.
const Scene = lazy(() => import('./three/Scene').then((m) => ({ default: m.Scene })))

import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Skills } from './sections/Skills'
import { Work } from './sections/Work'
import { Journey } from './sections/Journey'
import { Contact } from './sections/Contact'

import { MARQUEE } from './data/content'

export default function App() {
  const [ready, setReady] = useState(false)
  const { tier, reduced } = useQualityTier()

  usePointerTracking()
  useSmoothScroll(!reduced)
  // Runs after the sections exist, so it can scan for [data-skew]/[data-parallax].
  useScrollChoreography(ready && !reduced)

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

      <Suspense fallback={<div className="scene scene--static" aria-hidden="true" />}>
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

        <div className="band" data-panel>
          <Marquee items={MARQUEE} speed={62} direction={1} />
          <Marquee
            items={['Full-stack', 'Cross-platform', 'UI/UX certified', 'MBA Tech', 'NMIMS Mumbai']}
            speed={44}
            direction={-1}
            className="marquee--outline"
            separator="—"
          />
        </div>

        <About />
        <Skills />
        <Work />
        <Journey />
        <Contact />
      </main>
    </>
  )
}
