import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { Artifact } from './Artifact'
import { Particles } from './Particles'
import { pointer, scroll, damp } from '../lib/motionState'

/** Camera drift. Small numbers — the object should move, not the room. */
function Rig() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    camera.position.x = damp(camera.position.x, pointer.ex * 0.42, 2, dt)
    camera.position.y = damp(camera.position.y, pointer.ey * 0.3, 2, dt)
    // Pull back slightly as the page scrolls so the composition opens up.
    camera.position.z = damp(camera.position.z, 5 + scroll.progress * 0.9, 2, dt)
    camera.lookAt(target.current)
  })

  return null
}

function Effects({ tier }) {
  if (tier !== 'high') return null
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.4}
        mipmapBlur
        radius={0.65}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0007, 0.0009]}
        radialModulation
        modulationOffset={0.35}
      />
      <Vignette eskil={false} offset={0.24} darkness={0.82} />
    </EffectComposer>
  )
}

export function Scene({ tier = 'high', ready = false }) {
  if (tier === 'minimal') {
    // Reduced motion: a still, quiet gradient instead of a live canvas.
    return <div className="scene scene--static" aria-hidden="true" />
  }

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        dpr={tier === 'high' ? [1, 1.75] : [1, 1.25]}
        gl={{
          antialias: tier === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 5], fov: 42, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Rig />
          <Artifact tier={tier} intro={!ready} />
          <Particles tier={tier} />
          <Effects tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  )
}
