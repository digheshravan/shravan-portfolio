import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sysCommon } from '../shaders/system.glsl.js'
import { scene } from '../../lib/sceneState'
import { damp } from '../../lib/motionState'

/**
 * ROWS — information. Records, lines, a corpus, raw material.
 *
 * Three things keep this out of barcode / loading-skeleton territory:
 *
 * - In SCATTER every row carries its own tilt. A field of parallel horizontal
 *   rules at uniform spacing IS a barcode; break the parallelism and it reads
 *   as scattered material instead.
 * - Rows are hairline-thin and never uniformly sized. Chunky equal-height
 *   rounded bars in a left-aligned block is precisely the visual language of a
 *   loading skeleton.
 * - Resolved formations show a *fraction* of the instances. Complexity is 2,048
 *   fragments; a system is twelve deliberate rows. The count dropping is the
 *   argument.
 */

const vert = /* glsl */ `
  ${sysCommon}

  attribute vec2 aCell;
  attribute vec2 aSeed;
  attribute float aRank;
  attribute float aIdx;

  uniform float uTime, uFormA, uFormB, uBlend, uActive, uAmt;

  varying float vActive;
  varying float vVis;
  varying vec2 vUv;

  struct Row { vec3 pos; float len; float rot; float vis; };

  Row rowForm(float id, float idx, vec2 cell, vec2 seed, float rank, float t){
    Row r;
    r.rot = 0.0;
    r.vis = 1.0;
    r.len = 1.0;
    r.pos = vec3(0.0, 0.0, -40.0);

    if (id < 0.5){                                  // NONE
      r.vis = 0.0;
      return r;
    }

    if (id < F_SCATTER + 0.5){                      // COMPLEXITY
      vec2 h  = hash21(idx * 1.37);
      vec2 h2 = hash21(idx * 2.71 + 5.0);
      r.len = 0.18 + h2.y * h2.y * 1.7;
      r.pos = vec3((h.x - 0.5) * 19.0, (h.y - 0.5) * 12.5, -1.0 - h2.x * 13.0);
      r.pos.x += sin(t * 0.15 + seed.y * 6.2831) * 0.7;
      r.pos.y += cos(t * 0.11 + seed.x * 6.2831) * 0.45;
      r.rot = (h2.x - 0.5) * 0.6;                   // the anti-barcode term
      r.vis = 0.26 + h.x * 0.34;
      return r;
    }

    if (id < F_ALIGN + 0.5){                        // STRUCTURE
      // sel(), not the raw grid: without it every one of 2048 instances
      // renders, ~26 stacked on each of only 78 visible positions — which
      // then makes the independent 5% active-hash read as "most positions
      // have an active row underneath" instead of a genuinely small subset.
      float s = sel(rank, 0.04);                    // ~82 of 2048, no overdraw
      if (s < 0.0){ r.vis = 0.0; return r; }
      float col = floor(s * 3.0);
      float row = fract(s * 3.0);
      r.len = 0.9 + seed.x * 2.1;                   // ragged right edge
      float left = -7.0 + col * 4.9;
      r.pos = vec3(left + r.len * 0.5, 4.3 - row * 8.6, -2.4);
      r.vis = 0.5;
      return r;
    }

    if (id < F_DISTILL + 0.5){                      // SYNTHESIS — few survive
      float s = sel(rank, 0.007);                   // ~14 of 2048
      if (s < 0.0){ r.vis = 0.0; return r; }
      r.len = 1.5 + hash11(idx) * 1.5;
      r.pos = vec3(-4.6 + r.len * 0.5, 2.3 - s * 4.6, -1.5);
      r.vis = 1.0;
      return r;
    }

    if (id < F_BARS + 0.5){                         // MEASURED — sorted, scored
      float s = sel(rank, 0.009);                   // ~18 bars
      if (s < 0.0){ r.vis = 0.0; return r; }
      float score = pow(1.0 - s, 1.35);             // descending: reads as a chart
      r.len = 0.35 + score * 5.4;
      r.pos = vec3(-4.4 + r.len * 0.5, 2.9 - s * 5.8, -1.5);
      r.vis = 1.0;
      return r;
    }

    if (id < F_STRATA + 0.5){                       // ARCHITECTURE — rows on tiers
      float s = sel(rank, 0.022);                   // ~45 across 4 tiers
      if (s < 0.0){ r.vis = 0.0; return r; }
      float tier = floor(s * 4.0);
      float k = fract(s * 4.0);
      r.len = 0.5 + hash11(idx) * 1.5;
      r.pos = vec3(-3.9 + k * 7.6, 2.5 - tier * 1.7 - 0.42, -1.75);
      r.vis = 0.7;
      return r;
    }

    if (id < F_PIPE + 0.5){                         // PIPELINE — material in transit
      float s = sel(rank, 0.03);
      if (s < 0.0){ r.vis = 0.0; return r; }
      float lane = floor(s * 5.0);
      float k = fract(s * 5.0);
      float flow = fract(k + t * 0.09);
      r.len = 0.3 + hash11(idx) * 0.7;
      r.pos = vec3(-5.4 + flow * 10.8, 1.5 - lane * 0.95, -2.2);
      r.vis = 0.34 * sin(flow * 3.14159);           // fades in and out of the lane
      return r;
    }

    if (id < F_LATTICE + 0.5){                      // COORDINATION
      // Footprint matched to the node topology's bounding box in
      // system.glsl.js (x -4.05..1.5, y -2.0..2.0) — schedule data sitting
      // behind the patient/doctor/clinic -> hub -> spine structure, not an
      // unrelated backdrop grid.
      float s = sel(rank, 0.012);
      if (s < 0.0){ r.vis = 0.0; return r; }
      float col = floor(s * 24.0);
      r.len = 0.75;
      r.pos = vec3(-4.0 + mod(col, 6.0) * 1.1, 1.85 - floor(col / 6.0) * 1.3 - 0.4, -2.05);
      r.vis = 0.42;
      return r;
    }

    if (id < F_RESOLVE + 0.5){                      // OUTCOME — one clean set
      float s = sel(rank, 0.0045);                  // ~9 rows
      if (s < 0.0){ r.vis = 0.0; return r; }
      r.len = 2.4;
      r.pos = vec3(0.0, 2.4 - s * 4.8, -2.2);
      r.vis = 0.55;
      return r;
    }

    r.vis = 0.0;
    return r;
  }

  void main(){
    Row a = rowForm(uFormA, aIdx, aCell, aSeed, aRank, uTime);
    Row b = rowForm(uFormB, aIdx, aCell, aSeed, aRank, uTime);

    vec3 p   = mix(a.pos, b.pos, uBlend);
    float len = mix(a.len, b.len, uBlend);
    float rot = mix(a.rot, b.rot, uBlend);
    float vis = mix(a.vis, b.vis, uBlend) * uAmt;

    // Deliberately NOT step(aRank, uActive): aRank also drives which
    // instances a formation selects (sel()) and, in several formations,
    // their position — so gating colour on the same field correlates the
    // accent with position and reads as a rhythmic stripe rather than a
    // small, meaningful selection. A hash on the instance id is an
    // independent draw, decoupled from both selection and placement.
    float isActive = step(hash11(aIdx * 7.13 + 91.7), uActive);
    vActive = isActive;
    vVis = vis;

    p.z += isActive * 0.3;

    // Hairline. Active rows are barely thicker — weight, not glow, is the tell.
    float thick = 0.016 + isActive * 0.01;

    vec2 q = position.xy;
    q.x *= len;
    q.y *= thick;
    float c = cos(rot), s = sin(rot);
    vec2 rq = vec2(q.x * c - q.y * s, q.x * s + q.y * c);

    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(p + vec3(rq, 0.0), 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

const frag = /* glsl */ `
  precision highp float;

  uniform vec3 uInk, uAccent;
  uniform float uOpacity;

  varying float vActive;
  varying float vVis;
  varying vec2 vUv;

  void main(){
    if (vVis <= 0.001) discard;

    // Analytic end caps — a row should taper, not stop dead like a UI bar.
    float cap = smoothstep(0.0, 0.035, vUv.x) * smoothstep(1.0, 0.965, vUv.x);

    vec3 col = mix(uInk, uAccent, vActive);
    float a = cap * vVis * uOpacity * mix(0.55, 1.0, vActive);

    gl_FragColor = vec4(col, a);
  }
`

export function Rows({ count = 2048 }) {
  const mat = useRef(null)

  const attrs = useMemo(() => {
    const cell = new Float32Array(count * 2)
    const seed = new Float32Array(count * 2)
    const rank = new Float32Array(count)
    const idx = new Float32Array(count)

    // A stable shuffled rank: which instances "survive" a resolved formation
    // must not correlate with grid position, or the survivors form a stripe.
    const order = Array.from({ length: count }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }

    const cols = 48
    for (let i = 0; i < count; i++) {
      cell[i * 2] = (i % cols) / cols
      cell[i * 2 + 1] = Math.floor(i / cols) / (count / cols)
      seed[i * 2] = ((Math.sin(i * 78.233) * 43758.5453) % 1 + 1) % 1
      seed[i * 2 + 1] = ((Math.sin(i * 39.425) * 24634.6345) % 1 + 1) % 1
      rank[order[i]] = i / count
      idx[i] = i
    }
    return { cell, seed, rank, idx }
  }, [count])

  // Initial values come from `scene`, not hardcoded literals — a component
  // whose frameloop hasn't ticked yet (e.g. document not yet visible) must
  // still paint correctly on its very first frame.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFormA: { value: scene.rows.formA },
      uFormB: { value: scene.rows.formB },
      uBlend: { value: scene.blend },
      uActive: { value: scene.active },
      uAmt: { value: scene.rows.amt },
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
    u.uFormA.value = scene.rows.formA
    u.uFormB.value = scene.rows.formB
    u.uBlend.value = damp(u.uBlend.value, scene.blend, 7, dt)
    u.uActive.value = damp(u.uActive.value, scene.active, 5, dt)
    u.uAmt.value = damp(u.uAmt.value, scene.rows.amt, 5, dt)
    u.uOpacity.value = damp(u.uOpacity.value, scene.opacity, 4, dt)
  })

  return (
    <instancedMesh args={[undefined, undefined, count]} frustumCulled={false}>
      {/* Geometry + attributes as r3f children so r3f owns and disposes them.
          Passing a hand-built BufferGeometry via the `geometry` prop is what
          leaked in the previous Particles implementation. */}
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aCell" args={[attrs.cell, 2]} />
        <instancedBufferAttribute attach="attributes-aSeed" args={[attrs.seed, 2]} />
        <instancedBufferAttribute attach="attributes-aRank" args={[attrs.rank, 1]} />
        <instancedBufferAttribute attach="attributes-aIdx" args={[attrs.idx, 1]} />
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
