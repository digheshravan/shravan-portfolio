import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Rows } from './primitives/Rows'
import { Nodes } from './primitives/Nodes'
import { Links } from './primitives/Links'
import { Layers } from './primitives/Layers'
import { scene, FORM } from '../lib/sceneState'
import { pointer, damp } from '../lib/motionState'
import { gsap } from '../lib/gsap'

/**
 * Step 0 concept gate — throwaway. Not part of the shipped app.
 *
 * Renders all four primitives together and lets a set of named "beats" drive
 * them through the exact formA/formB/blend crossfade the production scene
 * will use, so what's being judged here is the real mechanism, not a mockup
 * of it. Reached at /?lab=1.
 */

const BEATS = {
  complexity: {
    label: 'COMPLEXITY',
    sub: 'unstructured — nothing connected yet',
    rows: { form: FORM.SCATTER, amt: 1 },
    nodes: { form: FORM.SCATTER, amt: 1 },
    links: { form: FORM.NONE, amt: 0 },
    layers: { form: FORM.SCATTER, amt: 1 },
    active: 0,
    opacity: 1,
  },
  structure: {
    label: 'STRUCTURE',
    sub: 'material falls into order',
    rows: { form: FORM.ALIGN, amt: 1 },
    nodes: { form: FORM.NONE, amt: 0 },
    links: { form: FORM.NONE, amt: 0 },
    layers: { form: FORM.ALIGN, amt: 1 },
    active: 0.05,
    opacity: 1,
  },
  intersection: {
    label: 'SYSTEM — INTERSECTION',
    sub: 'engineering × ai × data × management',
    rows: { form: FORM.NONE, amt: 0 },
    nodes: { form: FORM.CLUSTER4, amt: 1 },
    links: { form: FORM.CLUSTER4, amt: 1 },
    layers: { form: FORM.CLUSTER4, amt: 1 },
    active: 0.6,
    opacity: 1,
  },
  pipeline: {
    label: 'SYSTEM — PIPELINE',
    sub: 'e.g. DocMind: document → retrieval → context → answer',
    rows: { form: FORM.PIPE, amt: 1 },
    nodes: { form: FORM.PIPE, amt: 1 },
    links: { form: FORM.PIPE, amt: 1 },
    layers: { form: FORM.NONE, amt: 0 },
    active: 0.55,
    opacity: 1,
  },
  architecture: {
    label: 'SYSTEM — ARCHITECTURE',
    sub: 'e.g. Car Rental: UI / API / service / DB',
    rows: { form: FORM.STRATA, amt: 1 },
    nodes: { form: FORM.STRATA, amt: 1 },
    links: { form: FORM.STRATA, amt: 1 },
    layers: { form: FORM.STRATA, amt: 1 },
    active: 0.5,
    opacity: 1,
  },
  measured: {
    label: 'SYSTEM — MEASURED',
    sub: 'e.g. IPO Risk Decoder: extracted, scored, benchmarked',
    rows: { form: FORM.BARS, amt: 1 },
    nodes: { form: FORM.NONE, amt: 0 },
    links: { form: FORM.NONE, amt: 0 },
    layers: { form: FORM.NONE, amt: 0 },
    active: 0.7,
    opacity: 1,
  },
  coordination: {
    label: 'SYSTEM — COORDINATION',
    sub: 'e.g. MediSlot: patient · doctor · clinic · appointment',
    rows: { form: FORM.LATTICE, amt: 1 },
    nodes: { form: FORM.LATTICE, amt: 1 },
    links: { form: FORM.LATTICE, amt: 1 },
    layers: { form: FORM.NONE, amt: 0 },
    active: 0.4,
    opacity: 1,
  },
  outcome: {
    label: 'OUTCOME',
    sub: 'complexity, made usable',
    rows: { form: FORM.RESOLVE, amt: 1 },
    nodes: { form: FORM.RESOLVE, amt: 1 },
    links: { form: FORM.RESOLVE, amt: 1 },
    layers: { form: FORM.RESOLVE, amt: 1 },
    active: 1,
    opacity: 1,
  },
}

const ORDER = ['complexity', 'structure', 'intersection', 'pipeline', 'architecture', 'measured', 'coordination', 'outcome']

/**
 * Resolve `?beat=` and mutate `scene` at module-evaluation time — before
 * React has rendered a single component. Some automated capture contexts
 * report `document.visibilityState` as 'hidden' even for the fronted tab,
 * which can mean the frameloop never ticks even once; each primitive reads
 * its *initial* uniform values from `scene` at construction (see Rows.jsx
 * etc.), so whatever is true here is what the very first paint shows,
 * with no dependency on any effect or animation frame ever running.
 */
const initialKey = new URLSearchParams(window.location.search).get('beat')
const INITIAL_BEAT_KEY = BEATS[initialKey] ? initialKey : 'complexity'
;(function applyInitialBeat() {
  const beat = BEATS[INITIAL_BEAT_KEY]
  for (const k of ['rows', 'nodes', 'links', 'layers']) {
    scene[k].formA = scene[k].formB = beat[k].form
    scene[k].amt = beat[k].amt
  }
  scene.blend = 0
  scene.active = beat.active
  scene.opacity = beat.opacity
})()

/** Crossfades the live scene from wherever it is now to `beat`, over `dur`s. */
function goToBeat(beat, dur = 1.6) {
  for (const key of ['rows', 'nodes', 'links', 'layers']) {
    const cur = scene[key]
    const resolved = cur.formB // wherever the last tween landed
    cur.formA = resolved
    cur.formB = beat[key].form
    // amt is damped per-frame independently of blend — just move the target.
    cur.amt = beat[key].amt
  }
  scene.blend = 0
  scene.active = beat.active
  scene.opacity = beat.opacity

  gsap.to(scene, {
    blend: 1,
    duration: dur,
    ease: 'in-out-quint',
    onComplete: () => {
      for (const key of ['rows', 'nodes', 'links', 'layers']) {
        scene[key].formA = scene[key].formB
      }
      scene.blend = 0
    },
  })
}

function Rig() {
  const { camera } = useThree()
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    camera.position.x = damp(camera.position.x, pointer.ex * 0.6, 2, dt)
    camera.position.y = damp(camera.position.y, pointer.ey * 0.4, 2, dt)
    camera.lookAt(0, 0, -3)
  })
  return null
}

/**
 * Debug-only escape hatch: some automated/headless capture contexts report
 * `document.visibilityState === 'hidden'` even for the fronted tab, which
 * stalls every rAF-driven loop (r3f's frameloop AND gsap's ticker both use
 * it). This exposes a synchronous, rAF-independent render call so the scene
 * can still be advanced and screenshotted from outside the page. Not part of
 * the shipped app.
 */
function DevExposer() {
  const { gl, scene: threeScene, camera, advance } = useThree()
  useEffect(() => {
    window.__forceRender = () => {
      gl.render(threeScene, camera)
      advance?.(performance.now())
    }
  }, [gl, threeScene, camera, advance])
  return null
}

export function Lab() {
  const [active, setActive] = useState(INITIAL_BEAT_KEY)
  const [blendReadout, setBlendReadout] = useState(0)
  const rafRef = useRef()

  useEffect(() => {
    const tick = () => {
      setBlendReadout(scene.blend)
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const pick = (key) => {
    setActive(key)
    goToBeat(BEATS[key])
  }

  useEffect(() => {
    window.__scene = scene
    window.__goToBeat = goToBeat
    window.__gsap = gsap
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0B0B0D' }}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 11], fov: 44, near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <Suspense fallback={null}>
          <Rig />
          <DevExposer />
          <Rows count={2048} />
          <Nodes count={40} />
          <Links connections={16} />
          <Layers count={8} />
        </Suspense>
      </Canvas>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          color: '#F4F1EA',
        }}
      >
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.5 }}>
            STEP 0 — CONCEPT GATE · /?lab=1 · throwaway, not shipped
          </div>
          <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {BEATS[active].label}
          </div>
          <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{BEATS[active].sub}</div>
          <div style={{ fontSize: 10, opacity: 0.35, marginTop: 10 }}>
            blend {blendReadout.toFixed(2)} · active {BEATS[active].active.toFixed(2)}
          </div>
        </div>

        <div style={{ pointerEvents: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 720 }}>
          {ORDER.map((key) => (
            <button
              key={key}
              onClick={() => pick(key)}
              style={{
                fontFamily: 'inherit',
                fontSize: 11,
                letterSpacing: '0.08em',
                padding: '10px 14px',
                borderRadius: 100,
                border: `1px solid ${active === key ? '#E0472C' : 'rgba(244,241,234,0.18)'}`,
                background: active === key ? 'rgba(224,71,44,0.14)' : 'rgba(244,241,234,0.03)',
                color: active === key ? '#E9674B' : '#F4F1EA',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {BEATS[key].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
