import { Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Rows } from './primitives/Rows'
import { Nodes } from './primitives/Nodes'
import { Links } from './primitives/Links'
import { Layers } from './primitives/Layers'
import { pointer, damp } from '../lib/motionState'
import { StaticField } from '../components/StaticField'
import { useFrameloopGate, Invalidator } from '../hooks/useFrameloopGate'

/**
 * ADR-0010: the visual identity is one composable vocabulary of instanced
 * primitives, unlit by design, rather than a single normal-mapped object.
 * There is no post-processing composer — Bloom/ChromaticAberration/Vignette
 * were tuned for the iridescent artifact this replaces; an unlit hairline
 * system doesn't want the glow, and the vignette's job is already done for
 * free by the CSS `.atmosphere` layer. See ADR-0010 for the full rationale.
 */

const TIER_COUNTS = {
  high: { rows: 2048, nodes: 40, links: 16, layers: 8 },
  low: { rows: 900, nodes: 24, links: 10, layers: 6 },
}

/** Camera drift. Small numbers — the system should breathe, not swim. */
function Rig() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    camera.position.x = damp(camera.position.x, pointer.ex * 0.5, 2, dt)
    camera.position.y = damp(camera.position.y, pointer.ey * 0.35, 2, dt)
    camera.lookAt(0, 0, -2.5)
  })

  return null
}

export function Scene({ tier = 'high', ready = false }) {
  // Called unconditionally, ahead of the minimal-tier early return, so the
  // Rules of Hooks hold regardless of which branch renders. StaticField's
  // tier never mounts a Canvas at all, so the gate's own listeners are
  // harmless there — nothing reads `mode` in that branch.
  const frameloopMode = useFrameloopGate(ready)

  if (tier === 'minimal') {
    // Reduced motion: a static image of the same system, not a live canvas.
    return (
      <div className="scene scene--static" aria-hidden="true">
        <StaticField />
      </div>
    )
  }

  const counts = TIER_COUNTS[tier] ?? TIER_COUNTS.low

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        frameloop={frameloopMode}
        dpr={tier === 'high' ? [1, 1.75] : [1, 1.25]}
        gl={{
          antialias: tier === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 11], fov: 44, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Rig />
          <Rows count={counts.rows} />
          <Nodes count={counts.nodes} />
          <Links connections={counts.links} />
          <Layers count={counts.layers} />
          {frameloopMode === 'demand' && <Invalidator />}
        </Suspense>
      </Canvas>
    </div>
  )
}
