import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sysCommon } from '../shaders/system.glsl.js'
import { simplex3d } from '../shaders/noise.glsl.js'
import { scene } from '../../lib/sceneState'
import { pointer, damp } from '../../lib/motionState'

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
  varying float vIdx;

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

    if (id < F_LIVING + 0.5 && id > F_LIVING - 0.5){
      // Hero only: a considered cascade through depth, not a random scatter
      // and not parallel tiers — the former reads as unstructured, the
      // latter reads as a dashboard. A gentle diagonal instead, like panes
      // of glass set down one after another. The "living" part is entirely
      // in the fragment shader below; this is just where they sit.
      if (i > 5.5) return p;
      vec2 h = hash21(i * 7.3 + 11.0);
      p.pos = vec3(-1.6 + i * 0.95, 0.9 - i * 0.5, -2.6 - i * 1.3);
      p.pos.x += sin(t * 0.035 + i * 1.9) * 0.18;
      p.pos.y += cos(t * 0.03 + i * 1.4) * 0.14;
      p.rot = (h.x - 0.5) * 0.22 + i * 0.03;
      p.size = vec2(4.2 + h.y * 0.6, 2.9 + h.x * 0.5);
      p.vis = 0.26;
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
    vIdx = aIdx;

    vec2 q = position.xy * size;
    float c = cos(rot), s = sin(rot);
    vec2 rq = vec2(q.x * c - q.y * s, q.x * s + q.y * c);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos + vec3(rq, 0.0), 1.0);
  }
`

const frag = /* glsl */ `
  precision highp float;
  ${simplex3d}

  uniform vec3 uInk, uAccent;
  uniform float uOpacity, uTime;
  uniform vec2 uPointer;

  varying vec2 vUv;
  varying float vVis;
  varying float vIdx;

  void main(){
    if (vVis <= 0.001) discard;

    vec2 d = abs(vUv - 0.5) * 2.0;
    float edge = max(
      smoothstep(0.965, 1.0, d.x),
      smoothstep(0.965, 1.0, d.y)
    );
    float corner = smoothstep(0.05, 0.0, min(d.x, d.y)) * 0.4;

    float a;
    vec3 col = uInk;

    // The "living" current — reactivates the fbm chunk the old hero artifact
    // used at far greater scale (ADR-0008), here just to walk each pane's
    // edge slowly. Gated behind edge>0 so the (moderately expensive) noise
    // call only runs for fragments actually near a border — most of each
    // pane's fill is empty and never reaches this branch.
    if (edge > 0.001){
      float flow = fbm(vec3(vUv * 2.2 + uPointer * 0.12, uTime * 0.05 + vIdx * 3.7));
      float flowN = clamp(flow * 0.5 + 0.5, 0.0, 1.0);
      float edgeMod = mix(0.55, 1.0, flowN);
      float accentAmt = smoothstep(0.72, 0.88, flowN) * 0.7;
      col = mix(uInk, uAccent, accentAmt);
      a = (edge * edgeMod * 0.7 + corner) * vVis * uOpacity;
    } else {
      a = corner * vVis * uOpacity;
    }

    if (a <= 0.003) discard;

    gl_FragColor = vec4(col, a);
  }
`

export function Layers({ count = 8 }) {
  const mat = useRef(null)
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
      uAccent: { value: new THREE.Color('#E0472C') },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    []
  )

  // The material's own uniforms, not `uniforms` — see Rows.jsx.
  useFrame((_, delta) => {
    const u = mat.current?.uniforms
    if (!u) return
    const dt = Math.min(delta, 0.05)
    u.uTime.value += dt
    u.uFormA.value = scene.layers.formA
    u.uFormB.value = scene.layers.formB
    u.uBlend.value = damp(u.uBlend.value, scene.blend, 7, dt)
    u.uAmt.value = damp(u.uAmt.value, scene.layers.amt, 5, dt)
    u.uOpacity.value = damp(u.uOpacity.value, scene.opacity, 4, dt)
    u.uPointer.value.set(pointer.ex, pointer.ey)
  })

  return (
    <instancedMesh args={[undefined, undefined, count]} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aIdx" args={[attrs.idx, 1]} />
        <instancedBufferAttribute attach="attributes-aSeed" args={[attrs.seed, 2]} />
      </planeGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </instancedMesh>
  )
}
