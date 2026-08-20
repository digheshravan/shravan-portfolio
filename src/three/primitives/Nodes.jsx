import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sysCommon } from '../shaders/system.glsl.js'
import { scene } from '../../lib/sceneState'
import { damp } from '../../lib/motionState'

/**
 * NODES — entities. A service, a store, a stage, a domain, a decision point.
 *
 * A node exists where something is *named*. There is never an ambient field of
 * them: 40 across the entire page, most parked off-stage in any given beat.
 * Sparse is what separates an architecture diagram from a constellation.
 *
 * Drawn as a hairline square outline rather than a filled dot — a filled dot is
 * the particle-network vocabulary; an outlined square is the diagram one.
 */

const vert = /* glsl */ `
  ${sysCommon}

  attribute float aIdx;

  uniform float uTime, uFormA, uFormB, uBlend, uAmt, uActive;

  varying vec2 vUv;
  varying float vActive;

  void main(){
    vec3 a = nodePos(uFormA, aIdx, uTime);
    vec3 b = nodePos(uFormB, aIdx, uTime);
    vec3 p = mix(a, b, uBlend);

    // A node parked off-stage (z very negative) is scaled away rather than
    // flown across the screen — otherwise every formation change reads as
    // debris sweeping through.
    float live = step(-30.0, p.z);

    vActive = step(hash11(aIdx * 3.7), uActive);
    vUv = uv;

    float s = 0.15 * uAmt * live;
    vec3 q = vec3(position.xy * s, 0.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p + q, 1.0);
  }
`

const frag = /* glsl */ `
  precision highp float;

  uniform vec3 uInk, uAccent;
  uniform float uOpacity, uAmt;

  varying vec2 vUv;
  varying float vActive;

  void main(){
    vec2 d = abs(vUv - 0.5);
    float sq = max(d.x, d.y);

    // Hairline square outline + a small solid core when active.
    float ring = smoothstep(0.5, 0.46, sq) - smoothstep(0.40, 0.36, sq);
    float core = (1.0 - smoothstep(0.12, 0.18, sq)) * vActive;

    float a = (ring * 0.85 + core) * uOpacity * uAmt;
    if (a <= 0.003) discard;

    vec3 col = mix(uInk, uAccent, vActive);
    gl_FragColor = vec4(col, a);
  }
`

export function Nodes({ count = 40 }) {
  const idx = useMemo(() => Float32Array.from({ length: count }, (_, i) => i), [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFormA: { value: scene.nodes.formA },
      uFormB: { value: scene.nodes.formB },
      uBlend: { value: scene.blend },
      uAmt: { value: scene.nodes.amt },
      uActive: { value: scene.active },
      uOpacity: { value: scene.opacity },
      uInk: { value: new THREE.Color('#F4F1EA') },
      uAccent: { value: new THREE.Color('#E0472C') },
    }),
    []
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const u = uniforms
    u.uTime.value += dt
    u.uFormA.value = scene.nodes.formA
    u.uFormB.value = scene.nodes.formB
    u.uBlend.value = damp(u.uBlend.value, scene.blend, 7, dt)
    u.uAmt.value = damp(u.uAmt.value, scene.nodes.amt, 5, dt)
    u.uActive.value = damp(u.uActive.value, scene.active, 5, dt)
    u.uOpacity.value = damp(u.uOpacity.value, scene.opacity, 4, dt)
  })

  return (
    <instancedMesh args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aIdx" args={[idx, 1]} />
      </planeGeometry>
      <shaderMaterial
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  )
}
