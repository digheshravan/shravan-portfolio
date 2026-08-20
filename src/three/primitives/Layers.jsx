import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sysCommon } from '../shaders/system.glsl.js'
import { scene } from '../../lib/sceneState'
import { damp } from '../../lib/motionState'

/**
 * LAYERS — architectural strata. A document, a tier, a plane the other
 * primitives sit on or pass through. Drawn as hairline-edged panes, never
 * filled — a filled card reads as UI chrome, an edge-only pane reads as
 * structure. There are only ever a handful on screen (8 max): this primitive
 * gives the composition weight and depth, it does not carry detail.
 */

const vert = /* glsl */ `
  ${sysCommon}

  attribute float aIdx;
  attribute vec2 aSeed;

  uniform float uTime, uFormA, uFormB, uBlend, uAmt;

  varying vec2 vUv;
  varying float vVis;

  struct Pane { vec3 pos; vec2 size; float rot; float vis; };

  Pane paneForm(float id, float i, vec2 seed, float t){
    Pane p;
    p.rot = 0.0;
    p.size = vec2(2.6, 3.4);
    p.vis = 0.0;
    p.pos = vec3(0.0, 0.0, -40.0);

    if (id < 0.5) return p;                             // NONE

    if (id < F_SCATTER + 0.5 && id > F_SCATTER - 0.5){   // complexity: loose, tilted sheets
      if (i > 5.5) return p;
      float a = i * 1.13;
      p.pos = vec3(cos(a) * 2.6, sin(a) * 1.6, -6.0 - i * 1.4);
      p.pos.x += sin(t * 0.1 + i) * 0.4;
      p.rot = (seed.x - 0.5) * 0.5 + sin(t * 0.05 + i) * 0.05;
      p.size = vec2(2.0, 2.7);
      p.vis = 0.16;
      return p;
    }

    if (id < F_ALIGN + 0.5 && id > F_ALIGN - 0.5){       // structure: a neat stack
      if (i > 3.5) return p;
      p.pos = vec3(-0.15 * i, 0.1 * i, -3.6 - i * 0.5);
      p.size = vec2(2.9, 3.9);
      p.vis = 0.22;
      return p;
    }

    if (id < F_STRATA + 0.5 && id > F_STRATA - 0.5){     // architecture: 4 tiers
      if (i > 3.5) return p;
      p.pos = vec3(0.0, 2.5 - i * 1.7, -2.6);
      p.size = vec2(7.4, 1.35);
      p.vis = 0.3;
      return p;
    }

    if (id < F_CLUSTER4 + 0.5 && id > F_CLUSTER4 - 0.5){ // the four domains
      if (i > 3.5) return p;
      float ga = i * 1.5707963 + 0.7853982;
      p.pos = vec3(cos(ga) * 2.75, sin(ga) * 2.75, -3.2);
      p.rot = ga + 1.5707963;
      p.size = vec2(2.5, 2.1);
      p.vis = 0.24;
      return p;
    }

    if (id < F_RESOLVE + 0.5 && id > F_RESOLVE - 0.5){   // outcome: one pane
      if (i > 0.5) return p;
      p.pos = vec3(0.0, 0.0, -2.4);
      p.size = vec2(6.6, 4.6);
      p.vis = 0.22;
      return p;
    }

    return p;
  }

  void main(){
    Pane a = paneForm(uFormA, aIdx, aSeed, uTime);
    Pane b = paneForm(uFormB, aIdx, aSeed, uTime);

    vec3 pos  = mix(a.pos, b.pos, uBlend);
    vec2 size = mix(a.size, b.size, uBlend);
    float rot = mix(a.rot, b.rot, uBlend);
    float vis = mix(a.vis, b.vis, uBlend) * uAmt;

    vVis = vis;
    vUv = uv;

    vec2 q = position.xy * size;
    float c = cos(rot), s = sin(rot);
    vec2 rq = vec2(q.x * c - q.y * s, q.x * s + q.y * c);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + vec3(rq, 0.0), 1.0);
  }
`

const frag = /* glsl */ `
  precision highp float;

  uniform vec3 uInk;
  uniform float uOpacity;

  varying vec2 vUv;
  varying float vVis;

  void main(){
    if (vVis <= 0.001) discard;

    vec2 d = abs(vUv - 0.5) * 2.0;
    float edge = max(
      smoothstep(0.965, 1.0, d.x),
      smoothstep(0.965, 1.0, d.y)
    );
    float corner = smoothstep(0.05, 0.0, min(d.x, d.y)) * 0.4;

    float a = (edge * 0.7 + corner) * vVis * uOpacity;
    if (a <= 0.003) discard;

    gl_FragColor = vec4(uInk, a);
  }
`

export function Layers({ count = 8 }) {
  const attrs = useMemo(() => {
    const idx = new Float32Array(count)
    const seed = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      idx[i] = i
      seed[i * 2] = ((Math.sin(i * 91.7) * 43758.5453) % 1 + 1) % 1
      seed[i * 2 + 1] = ((Math.sin(i * 51.3) * 12734.7) % 1 + 1) % 1
    }
    return { idx, seed }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFormA: { value: scene.layers.formA },
      uFormB: { value: scene.layers.formB },
      uBlend: { value: scene.blend },
      uAmt: { value: scene.layers.amt },
      uOpacity: { value: scene.opacity },
      uInk: { value: new THREE.Color('#F4F1EA') },
    }),
    []
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const u = uniforms
    u.uTime.value += dt
    u.uFormA.value = scene.layers.formA
    u.uFormB.value = scene.layers.formB
    u.uBlend.value = damp(u.uBlend.value, scene.blend, 7, dt)
    u.uAmt.value = damp(u.uAmt.value, scene.layers.amt, 5, dt)
    u.uOpacity.value = damp(u.uOpacity.value, scene.opacity, 4, dt)
  })

  return (
    <instancedMesh args={[undefined, undefined, count]} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aIdx" args={[attrs.idx, 1]} />
        <instancedBufferAttribute attach="attributes-aSeed" args={[attrs.seed, 2]} />
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
