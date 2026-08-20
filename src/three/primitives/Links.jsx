import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sysCommon } from '../shaders/system.glsl.js'
import { scene } from '../../lib/sceneState'
import { damp } from '../../lib/motionState'

/**
 * LINKS — relationships. A request, a retrieval hop, a dependency.
 *
 * This is the primitive most at risk of becoming the connected-dots cliché that
 * DESIGN.md rejected outright, so three rules are enforced *in the shader*, not
 * by discipline alone:
 *
 * 1. **Right-angle routing.** Every link is an elbow — one leg out of the
 *    source, one leg into the target. Straight diagonals between nearby points
 *    is what a particle network looks like; orthogonal connectors is what a
 *    system diagram looks like. This single choice does most of the work.
 * 2. **Declared pairs, never proximity.** `linkPair()` returns node indices
 *    from formation-specific index maths. A link exists because two named
 *    things are related, never because two points happened to be close.
 * 3. **Flow only while active.** The travelling pulse is gated on uActive, so
 *    an idle diagram is a still diagram.
 *
 * Endpoints come from the shared `nodePos()` in system.glsl.js — the same
 * function the NODE shader uses — so a link can never drift off its endpoints
 * and the CPU never computes a position.
 */

const vert = /* glsl */ `
  ${sysCommon}

  attribute float aLink;   // logical connection index
  attribute float aLeg;    // 0 = out of source, 1 = into target

  uniform float uTime, uFormA, uFormB, uBlend, uAmt;

  varying vec2 vUv;
  varying float vLive;
  varying float vLeg;

  /** Which two nodes this connection joins, per formation. Never proximity. */
  vec2 linkPair(float id, float i){
    if (id < F_STRATA + 0.5 && id > F_STRATA - 0.5){
      // Tier k node j -> tier k+1 node j. A layered call stack.
      float tier = floor(i / 4.0);
      float k = mod(i, 4.0);
      if (tier > 2.5) return vec2(-1.0);
      return vec2(tier * 4.0 + k, (tier + 1.0) * 4.0 + k);
    }
    if (id < F_CLUSTER4 + 0.5 && id > F_CLUSTER4 - 0.5){
      // Each domain's inward node joins the next domain's — the intersection.
      if (i > 3.5) return vec2(-1.0);
      return vec2(i * 5.0 + 4.0, mod(i + 1.0, 4.0) * 5.0 + 4.0);
    }
    if (id < F_PIPE + 0.5 && id > F_PIPE - 0.5){
      if (i > 3.5) return vec2(-1.0);
      return vec2(i, i + 1.0);
    }
    if (id < F_LATTICE + 0.5 && id > F_LATTICE - 0.5){
      // Explicit topology, matched to nodePos()'s node indices:
      // patient/doctor/clinic feeders -> their anchor, each anchor -> the
      // shared hub, the hub -> a short schedule spine. Twelve links total —
      // close to Architecture's density, never an all-to-all mesh.
      if      (i < 0.5)  return vec2(0.0, 2.0);    // patient feeder -> anchor
      else if (i < 1.5)  return vec2(1.0, 2.0);    // patient feeder -> anchor
      else if (i < 2.5)  return vec2(3.0, 5.0);    // doctor feeder -> anchor
      else if (i < 3.5)  return vec2(4.0, 5.0);    // doctor feeder -> anchor
      else if (i < 4.5)  return vec2(6.0, 8.0);    // clinic feeder -> anchor
      else if (i < 5.5)  return vec2(7.0, 8.0);    // clinic feeder -> anchor
      else if (i < 6.5)  return vec2(2.0, 9.0);    // patient anchor -> hub
      else if (i < 7.5)  return vec2(5.0, 9.0);    // doctor anchor -> hub
      else if (i < 8.5)  return vec2(8.0, 9.0);    // clinic anchor -> hub
      else if (i < 9.5)  return vec2(9.0, 10.0);   // hub -> spine
      else if (i < 10.5) return vec2(10.0, 11.0);  // spine
      else if (i < 11.5) return vec2(11.0, 12.0);  // spine
      return vec2(-1.0);
    }
    if (id < F_RESOLVE + 0.5 && id > F_RESOLVE - 0.5){
      if (i > 2.5) return vec2(-1.0);
      return vec2(i, i + 1.0);
    }
    if (id < F_DISTILL + 0.5 && id > F_DISTILL - 0.5){
      if (i > 5.5) return vec2(-1.0);
      return vec2(i, i + 1.0);
    }
    return vec2(-1.0);
  }

  void main(){
    float id = uBlend < 0.5 ? uFormA : uFormB;   // links snap; they do not smear
    vec2 pair = linkPair(id, aLink);

    if (pair.x < 0.0 || uAmt <= 0.001){
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);    // cull off-clip
      vLive = 0.0;
      return;
    }

    vec3 A = nodePos(id, pair.x, uTime);
    vec3 B = nodePos(id, pair.y, uTime);

    if (A.z < -30.0 || B.z < -30.0){
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      vLive = 0.0;
      return;
    }

    // The elbow: out of A vertically, into B horizontally.
    vec3 corner = vec3(A.x, B.y, mix(A.z, B.z, 0.5));
    vec3 p0 = aLeg < 0.5 ? A : corner;
    vec3 p1 = aLeg < 0.5 ? corner : B;

    vec3 d = p1 - p0;
    float len = length(d.xy);
    if (len < 0.001){
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      vLive = 0.0;
      return;
    }

    float ang = atan(d.y, d.x);
    vec2 q = position.xy;
    q.x *= len;
    q.y *= 0.012;                                 // hairline
    vec2 rq = vec2(q.x * cos(ang) - q.y * sin(ang), q.x * sin(ang) + q.y * cos(ang));

    vec3 mid = (p0 + p1) * 0.5;
    vUv = uv;
    vLeg = aLeg;
    vLive = 1.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(mid + vec3(rq, 0.0), 1.0);
  }
`

const frag = /* glsl */ `
  precision highp float;

  uniform vec3 uInk, uAccent;
  uniform float uOpacity, uAmt, uActive, uTime;

  varying vec2 vUv;
  varying float vLive;
  varying float vLeg;

  void main(){
    if (vLive < 0.5) discard;

    float base = 0.30;

    // Directional flow, gated on uActive. An idle system is a still diagram.
    float travel = fract(vUv.x * 0.5 + vLeg * 0.5 - uTime * 0.22);
    float pulse = smoothstep(0.86, 1.0, travel) * uActive;

    float a = (base + pulse * 0.9) * uOpacity * uAmt;
    vec3 col = mix(uInk, uAccent, pulse);

    gl_FragColor = vec4(col, a);
  }
`

const CONNECTIONS = 16

export function Links({ connections = CONNECTIONS }) {
  const count = connections * 2 // two legs per elbow

  const attrs = useMemo(() => {
    const link = new Float32Array(count)
    const leg = new Float32Array(count)
    for (let i = 0; i < connections; i++) {
      link[i * 2] = i
      leg[i * 2] = 0
      link[i * 2 + 1] = i
      leg[i * 2 + 1] = 1
    }
    return { link, leg }
  }, [connections, count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFormA: { value: scene.links.formA },
      uFormB: { value: scene.links.formB },
      uBlend: { value: scene.blend },
      uAmt: { value: scene.links.amt },
      uActive: { value: scene.active > 0 ? 1 : 0 },
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
    u.uFormA.value = scene.links.formA
    u.uFormB.value = scene.links.formB
    u.uBlend.value = damp(u.uBlend.value, scene.blend, 7, dt)
    u.uAmt.value = damp(u.uAmt.value, scene.links.amt, 5, dt)
    u.uActive.value = damp(u.uActive.value, scene.active > 0 ? 1 : 0, 3, dt)
    u.uOpacity.value = damp(u.uOpacity.value, scene.opacity, 4, dt)
  })

  return (
    <instancedMesh args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[1, 1]}>
        <instancedBufferAttribute attach="attributes-aLink" args={[attrs.link, 1]} />
        <instancedBufferAttribute attach="attributes-aLeg" args={[attrs.leg, 1]} />
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
