import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { artifactVertex, artifactFragment } from './shaders/artifact.glsl.js'
import { scroll, pointer, damp, mapRange } from '../lib/motionState'

/**
 * Choreography: where the object sits at each point in the scroll.
 * Keyframes are in document-progress space so the whole page shares one clock.
 */
const KEYS = [
  { at: 0.0, pos: [1.15, 0.05, 0], scale: 1.0, morph: 0.0, opacity: 1.0 },
  { at: 0.14, pos: [1.4, -0.15, -1.2], scale: 0.78, morph: 0.15, opacity: 0.95 },
  // Through the reading-heavy middle of the page the object steps back and
  // dims — it is scenery there, not the subject, and the copy has to win.
  { at: 0.3, pos: [-1.7, 0.1, -2.4], scale: 0.62, morph: 0.55, opacity: 0.6 },
  { at: 0.46, pos: [1.75, 0.2, -3.2], scale: 0.56, morph: 0.85, opacity: 0.42 },
  { at: 0.64, pos: [0.0, -0.4, -5.6], scale: 0.5, morph: 1.0, opacity: 0.3 },
  { at: 0.82, pos: [-1.5, 0.15, -2.2], scale: 0.66, morph: 0.5, opacity: 0.5 },
  // Finale: back to full presence, but parked to the right of the contact
  // column rather than on top of it.
  { at: 1.0, pos: [1.5, -0.05, -0.6], scale: 1.05, morph: 0.1, opacity: 0.92 },
]

function sample(progress) {
  let a = KEYS[0]
  let b = KEYS[KEYS.length - 1]
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (progress >= KEYS[i].at && progress <= KEYS[i + 1].at) {
      a = KEYS[i]
      b = KEYS[i + 1]
      break
    }
  }
  const span = b.at - a.at || 1
  const raw = (progress - a.at) / span
  // Smoothstep between keys so the path has no visible corners.
  const t = raw * raw * (3 - 2 * raw)
  return {
    x: a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    y: a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    z: a.pos[2] + (b.pos[2] - a.pos[2]) * t,
    scale: a.scale + (b.scale - a.scale) * t,
    morph: a.morph + (b.morph - a.morph) * t,
    opacity: a.opacity + (b.opacity - a.opacity) * t,
  }
}

export function Artifact({ tier = 'high', intro = false }) {
  const group = useRef(null)
  const mesh = useRef(null)
  const cage = useRef(null)
  const matRef = useRef(null)

  const detail = tier === 'high' ? 36 : tier === 'low' ? 20 : 12

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 0.24 },
      uFrequency: { value: 1.15 },
      uEnergy: { value: 0 },
      uMorph: { value: 0 },
      uPointer: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color('#6C5CFF') },
      uColorB: { value: new THREE.Color('#35E0FF') },
      uColorC: { value: new THREE.Color('#FF6FB5') },
      uBackground: { value: new THREE.Color('#08080A') },
    }),
    []
  )

  const introRef = useRef(intro ? 0 : 1)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const u = uniforms
    const g = group.current
    if (!g) return

    u.uTime.value += dt

    // Smoothed scroll energy — sharp enough to feel, damped enough to not jitter.
    scroll.energy = damp(scroll.energy, Math.abs(scroll.velocity), 5, dt)

    const k = sample(scroll.progress)

    // Entrance: the artifact swells into place once the preloader clears.
    introRef.current = damp(introRef.current, 1, 1.8, dt)
    const enter = introRef.current

    // Judge "compact" in CSS pixels, not world units — world width depends on
    // camera distance, which this rig changes as you scroll.
    const compact = state.size.width < 820
    const aspectComp = compact ? 0.3 : 1

    g.position.x = damp(g.position.x, k.x * aspectComp + pointer.ex * 0.16, 3, dt)
    // Drop it below the headline on narrow screens; there is no lateral room
    // to get out of the type's way, so it moves down instead.
    g.position.y = damp(g.position.y, k.y + (compact ? -0.42 : 0) + pointer.ey * 0.1, 3, dt)
    g.position.z = damp(g.position.z, k.z, 3, dt)

    // A narrow screen has no room for the object beside the type, so it shrinks
    // and steps back into the role of a backdrop.
    const targetScale = k.scale * (compact ? 0.38 : 1) * enter
    g.scale.setScalar(damp(g.scale.x, targetScale, 3.5, dt))

    // Continuous drift plus a nudge from the cursor.
    g.rotation.y += dt * 0.12 + scroll.velocity * 0.04
    g.rotation.x = damp(g.rotation.x, pointer.ey * 0.22, 2.4, dt)
    g.rotation.z = damp(g.rotation.z, -pointer.ex * 0.12, 2.4, dt)

    u.uEnergy.value = damp(u.uEnergy.value, scroll.energy, 6, dt)
    u.uMorph.value = damp(u.uMorph.value, k.morph, 2.2, dt)
    u.uOpacity.value = damp(u.uOpacity.value, k.opacity * enter * (compact ? 0.7 : 1), 3, dt)
    u.uPointer.value = damp(u.uPointer.value, pointer.active ? 1 : 0, 2, dt)
    u.uMouse.value.set(pointer.ex, pointer.ey)

    // Amplitude breathes with scroll so the surface boils when you move fast.
    u.uAmplitude.value = damp(
      u.uAmplitude.value,
      0.2 + scroll.energy * 0.16 + mapRange(k.morph, 0, 1, 0, 0.06),
      4,
      dt
    )

    if (cage.current) {
      cage.current.rotation.y -= dt * 0.22
      cage.current.rotation.x += dt * 0.05
      cage.current.material.opacity = 0.07 * u.uOpacity.value
    }
  })

  return (
    <group ref={group}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, detail]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={artifactVertex}
          fragmentShader={artifactFragment}
          uniforms={uniforms}
          transparent
          depthWrite
        />
      </mesh>

      {/* A counter-rotating wire shell adds a second read of depth. */}
      {tier !== 'minimal' && (
        <mesh ref={cage} scale={1.62}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#8FA0FF"
            wireframe
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  )
}
