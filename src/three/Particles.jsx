import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { particlesVertex, particlesFragment } from './shaders/particles.glsl.js'
import { scroll, pointer, damp } from '../lib/motionState'

export function Particles({ count = 1400, tier = 'high' }) {
  const points = useRef(null)
  const { size } = useThree()

  const n = tier === 'high' ? count : tier === 'low' ? Math.round(count * 0.45) : 0

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(n * 3)
    const scales = new Float32Array(n)
    const seeds = new Float32Array(n)

    for (let i = 0; i < n; i++) {
      // A wide slab rather than a sphere — it has to read across the viewport.
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26
      // Keep the whole field behind the artifact. Anything in front of it
      // reads as dirt on the lens rather than depth.
      positions[i * 3 + 2] = -3 - Math.random() * 21

      // Cube the random so most particles stay small and a few pop.
      const r = Math.random()
      scales[i] = 0.25 + r * r * r * 2.6
      seeds[i] = Math.random()
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [n])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 110 },
      uEnergy: { value: 0 },
      uScrollY: { value: 0 },
      uMouse: { value: new THREE.Vector3(0, 0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorA: { value: new THREE.Color('#8E86FF') },
      uColorB: { value: new THREE.Color('#7BE9FF') },
    }),
    []
  )

  useFrame((state, delta) => {
    if (!points.current || n === 0) return
    const dt = Math.min(delta, 0.05)
    const u = uniforms

    u.uTime.value += dt
    u.uEnergy.value = damp(u.uEnergy.value, scroll.energy, 5, dt)
    u.uScrollY.value = scroll.progress * 6

    // Project the cursor onto the particle slab so repulsion lines up visually.
    const vw = state.viewport.width
    const vh = state.viewport.height
    u.uMouse.value.set(pointer.ex * vw * 0.5, pointer.ey * vh * 0.5, 0)
  })

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
    uniforms.uSize.value = size.width < 800 ? 78 : 110
  }, [size.width, uniforms])

  if (n === 0) return null

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
