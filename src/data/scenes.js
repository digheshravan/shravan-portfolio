/**
 * Scene choreography, as data.
 *
 * A "beat" names a formation and an amount per primitive (rows/nodes/links/
 * layers), plus how much of the field should read as resolved (`active`) and
 * how present the whole system should be (`opacity` — text-heavy sections
 * dim it, the way the old artifact stepped back and dimmed through the
 * reading-heavy middle of the page).
 *
 * SECTION_BEATS drives the page's own arc: COMPLEXITY → STRUCTURE →
 * SYSTEM → OUTCOME. PROJECT_SCENES drives the Work section, one array of
 * beats per project, positionally keyed to that project's `pipeline` array
 * in content.js — which stays the single source of truth for the *labels*.
 * assertScenesMatchContent() below throws in dev if the two ever diverge.
 */

import { FORM } from '../lib/sceneState'
import { PROJECTS } from './content'

export const SECTION_BEATS = {
  hero: {
    rows: { form: FORM.SCATTER, amt: 1 },
    nodes: { form: FORM.SCATTER, amt: 1 },
    links: { form: FORM.NONE, amt: 0 },
    layers: { form: FORM.SCATTER, amt: 1 },
    active: 0,
    opacity: 1,
  },
  about: {
    rows: { form: FORM.NONE, amt: 0 },
    nodes: { form: FORM.CLUSTER4, amt: 1 },
    links: { form: FORM.CLUSTER4, amt: 1 },
    layers: { form: FORM.CLUSTER4, amt: 1 },
    active: 0.6,
    opacity: 0.65,
  },
  skills: {
    rows: { form: FORM.STRATA, amt: 1 },
    nodes: { form: FORM.STRATA, amt: 1 },
    links: { form: FORM.STRATA, amt: 1 },
    layers: { form: FORM.STRATA, amt: 1 },
    active: 0.4,
    opacity: 0.4,
  },
  work: {
    // Fallback while a project isn't yet centred in the rail — see
    // PROJECT_SCENES for what actually shows once one is.
    rows: { form: FORM.SCATTER, amt: 1 },
    nodes: { form: FORM.NONE, amt: 0 },
    links: { form: FORM.NONE, amt: 0 },
    layers: { form: FORM.NONE, amt: 0 },
    active: 0.1,
    opacity: 0.5,
  },
  journey: {
    rows: { form: FORM.PIPE, amt: 1 },
    nodes: { form: FORM.PIPE, amt: 1 },
    links: { form: FORM.PIPE, amt: 1 },
    layers: { form: FORM.NONE, amt: 0 },
    active: 0.5,
    opacity: 0.5,
  },
  contact: {
    rows: { form: FORM.RESOLVE, amt: 1 },
    nodes: { form: FORM.RESOLVE, amt: 1 },
    links: { form: FORM.RESOLVE, amt: 1 },
    layers: { form: FORM.RESOLVE, amt: 1 },
    active: 1,
    opacity: 0.75,
  },
}

const NONE4 = {
  rows: { form: FORM.NONE, amt: 0 },
  nodes: { form: FORM.NONE, amt: 0 },
  links: { form: FORM.NONE, amt: 0 },
  layers: { form: FORM.NONE, amt: 0 },
}

export const PROJECT_SCENES = {
  // Document -> Retrieval -> Reasoning -> Analysis
  docmind: [
    { ...NONE4, layers: { form: FORM.SCATTER, amt: 1 }, active: 0, opacity: 0.7 },
    { ...NONE4, rows: { form: FORM.ALIGN, amt: 1 }, active: 0.25, opacity: 0.7 },
    {
      ...NONE4,
      nodes: { form: FORM.DISTILL, amt: 1 },
      links: { form: FORM.DISTILL, amt: 1 },
      active: 0.5,
      opacity: 0.7,
    },
    {
      rows: { form: FORM.RESOLVE, amt: 1 },
      nodes: { form: FORM.RESOLVE, amt: 1 },
      links: { form: FORM.RESOLVE, amt: 1 },
      layers: { form: FORM.RESOLVE, amt: 1 },
      active: 1,
      opacity: 0.75,
    },
  ],
  // DRHP -> Extraction -> Risk factors -> Scoring -> Benchmarking -> Insights
  'ipo-risk-decoder': [
    { ...NONE4, layers: { form: FORM.SCATTER, amt: 1 }, active: 0, opacity: 0.7 },
    { ...NONE4, rows: { form: FORM.ALIGN, amt: 1 }, active: 0.15, opacity: 0.7 },
    {
      ...NONE4,
      rows: { form: FORM.ALIGN, amt: 1 },
      nodes: { form: FORM.DISTILL, amt: 1 },
      active: 0.25,
      opacity: 0.7,
    },
    { ...NONE4, rows: { form: FORM.BARS, amt: 1 }, active: 0.5, opacity: 0.75 },
    {
      ...NONE4,
      rows: { form: FORM.BARS, amt: 1 },
      nodes: { form: FORM.DISTILL, amt: 1 },
      active: 0.75,
      opacity: 0.75,
    },
    {
      rows: { form: FORM.RESOLVE, amt: 1 },
      nodes: { form: FORM.RESOLVE, amt: 1 },
      links: { form: FORM.RESOLVE, amt: 1 },
      layers: { form: FORM.RESOLVE, amt: 1 },
      active: 1,
      opacity: 0.75,
    },
  ],
  // Patient -> Doctor -> Clinic -> Appointment
  //
  // Unlike DocMind/IPO, this stays on one formation throughout: the
  // coordination topology (patient/doctor/clinic feeding a shared
  // appointment hub) is one integrated structure, not a sequence of
  // different states, so the honest depiction is the same diagram settling
  // in further at each step rather than a different diagram per label.
  medislot: [
    { rows: { form: FORM.LATTICE, amt: 1 }, nodes: { form: FORM.LATTICE, amt: 0.4 }, links: { form: FORM.LATTICE, amt: 0.2 }, layers: { form: FORM.NONE, amt: 0 }, active: 0.15, opacity: 0.6 },
    { rows: { form: FORM.LATTICE, amt: 1 }, nodes: { form: FORM.LATTICE, amt: 0.7 }, links: { form: FORM.LATTICE, amt: 0.5 }, layers: { form: FORM.NONE, amt: 0 }, active: 0.3, opacity: 0.65 },
    { rows: { form: FORM.LATTICE, amt: 1 }, nodes: { form: FORM.LATTICE, amt: 1 }, links: { form: FORM.LATTICE, amt: 0.8 }, layers: { form: FORM.NONE, amt: 0 }, active: 0.45, opacity: 0.7 },
    { rows: { form: FORM.LATTICE, amt: 1 }, nodes: { form: FORM.LATTICE, amt: 1 }, links: { form: FORM.LATTICE, amt: 1 }, layers: { form: FORM.NONE, amt: 0 }, active: 0.6, opacity: 0.75 },
  ],
  // Frontend -> API -> Backend -> Database
  //
  // STRATA is exactly four tiers, so this one genuinely can step: `active`
  // rises each stage, reading as the request travelling further down the
  // stack and lighting more of it up.
  'car-rental': [
    { rows: { form: FORM.STRATA, amt: 1 }, nodes: { form: FORM.STRATA, amt: 1 }, links: { form: FORM.STRATA, amt: 1 }, layers: { form: FORM.STRATA, amt: 1 }, active: 0.22, opacity: 0.7 },
    { rows: { form: FORM.STRATA, amt: 1 }, nodes: { form: FORM.STRATA, amt: 1 }, links: { form: FORM.STRATA, amt: 1 }, layers: { form: FORM.STRATA, amt: 1 }, active: 0.44, opacity: 0.7 },
    { rows: { form: FORM.STRATA, amt: 1 }, nodes: { form: FORM.STRATA, amt: 1 }, links: { form: FORM.STRATA, amt: 1 }, layers: { form: FORM.STRATA, amt: 1 }, active: 0.68, opacity: 0.75 },
    { rows: { form: FORM.STRATA, amt: 1 }, nodes: { form: FORM.STRATA, amt: 1 }, links: { form: FORM.STRATA, amt: 1 }, layers: { form: FORM.STRATA, amt: 1 }, active: 0.9, opacity: 0.75 },
  ],
}

/** Dev-only: a beat array that has silently drifted from its labels is worse
 *  than one that fails loudly. */
export function assertScenesMatchContent() {
  if (!import.meta.env.DEV) return
  for (const project of PROJECTS) {
    if (!project.pipeline) continue
    const beats = PROJECT_SCENES[project.slug]
    if (!beats) {
      throw new Error(`[scenes] no PROJECT_SCENES entry for "${project.slug}"`)
    }
    if (beats.length !== project.pipeline.length) {
      throw new Error(
        `[scenes] "${project.slug}" has ${project.pipeline.length} pipeline labels but ${beats.length} beats`
      )
    }
  }
}
