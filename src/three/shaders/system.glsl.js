/**
 * Shared GLSL for the system vocabulary.
 *
 * Two things live here rather than in a single primitive's shader:
 *
 * 1. `nodePos()` — because the LINK shader has to resolve the same node
 *    positions the NODE shader does. If each computed its own, a link would
 *    drift off its endpoints the moment a formation changed. Sharing the
 *    function means a connection is a pure function of two node indices and
 *    the CPU never touches it.
 * 2. `sel()` — the selection helper. Every formation decides how many of its
 *    instances are actually visible, which is the mechanic the whole concept
 *    rests on: complexity is thousands of fragments, a system is a dozen
 *    deliberate parts. Resolving *reduces* the count.
 */

export const sysCommon = /* glsl */ `
  float hash11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }

  vec2 hash21(float p){
    vec3 p3 = fract(vec3(p) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy);
  }

  float ease(float x){ return x * x * (3.0 - 2.0 * x); }

  /**
   * Map a stable per-instance rank into a selected subset.
   * Returns -1.0 when the instance is not selected, else its 0..1 position
   * within the selection — so a formation can lay out "the surviving 20"
   * without the CPU knowing which 20 they are.
   */
  float sel(float rank, float frac){
    return rank < frac ? rank / frac : -1.0;
  }

  // Formation ids, shared across primitives.
  const float F_NONE     = 0.0;
  const float F_SCATTER  = 1.0;   // complexity: disordered fragments
  const float F_ALIGN    = 2.0;   // structure: material falls into columns
  const float F_DISTILL  = 3.0;   // synthesis: the few that matter survive
  const float F_BARS     = 4.0;   // measured: sorted, scored
  const float F_STRATA   = 5.0;   // architecture: stacked tiers
  const float F_PIPE     = 6.0;   // pipeline: left-to-right stages
  const float F_CLUSTER4 = 7.0;   // the four domains
  const float F_LATTICE  = 8.0;   // coordination grid
  const float F_RESOLVE  = 9.0;   // outcome: one clean structure

  /**
   * Node positions. Deliberate, never random — a node sits where something is
   * named. This is what separates an architecture diagram from a constellation.
   */
  vec3 nodePos(float id, float i, float t){
    float breathe = sin(t * 0.5 + i * 0.7) * 0.035;

    if (id < 0.5) return vec3(0.0, 0.0, -40.0);          // NONE: parked far behind

    if (id < F_SCATTER + 0.5 && id > F_SCATTER - 0.5){    // complexity: a few loose, unaligned
      if (i > 11.5) return vec3(0.0, 0.0, -40.0);          // sparse — entities not yet organised
      vec2 h = hash21(i * 4.13);
      vec3 p = vec3((h.x - 0.5) * 9.5, (h.y - 0.5) * 6.5, -3.0 - h.x * 8.0);
      p.x += sin(t * 0.08 + i * 1.7) * 0.5;
      p.y += cos(t * 0.06 + i * 2.3) * 0.35;
      return p + vec3(0.0, 0.0, breathe);
    }

    if (id < F_CLUSTER4 + 0.5 && id > F_CLUSTER4 - 0.5){ // four domains meeting
      float g = floor(i / 5.0);                          // 4 groups x 5 nodes
      float k = mod(i, 5.0);
      float ga = g * 1.5707963 + 0.7853982;
      vec2 c = vec2(cos(ga), sin(ga)) * 2.9;
      float ka = k * 1.2566371 + g * 0.6;
      vec2 o = vec2(cos(ka), sin(ka)) * (0.55 + hash11(i) * 0.35);
      // The 5th node of each group is the one that reaches toward the centre.
      float inward = step(4.5, k + 1.0) * 0.55;
      return vec3(mix(c + o, c * 0.34, inward), -2.0 + breathe);
    }

    if (id < F_STRATA + 0.5 && id > F_STRATA - 0.5){     // one row of nodes per tier
      float tier = floor(i / 4.0);                        // 4 tiers x 4 nodes
      float k = mod(i, 4.0);
      if (tier > 3.5) return vec3(0.0, 0.0, -40.0);
      return vec3(-3.3 + k * 2.2, 2.5 - tier * 1.7, -1.8 + breathe);
    }

    if (id < F_PIPE + 0.5 && id > F_PIPE - 0.5){         // stages left to right
      if (i > 4.5) return vec3(0.0, 0.0, -40.0);
      return vec3(-4.6 + i * 2.3, -0.4, -1.6 + breathe);
    }

    if (id < F_LATTICE + 0.5 && id > F_LATTICE - 0.5){
      // Coordination: three named sources (patient / doctor / clinic), each a
      // small cluster feeding one anchor, every anchor a spoke into one shared
      // hub, the hub extending into a short vertical spine — the appointment
      // schedule the whole thing coordinates around. Explicit topology, not a
      // grid: this is what MediSlot's node/link pair depicts.
      if (i > 12.5) return vec3(0.0, 0.0, -40.0);
      vec3 p;
      if      (i < 0.5)  p = vec3(-4.05,  2.0, 0.0);   // patient — feeder
      else if (i < 1.5)  p = vec3(-4.05,  1.4, 0.0);   // patient — feeder
      else if (i < 2.5)  p = vec3(-3.15,  1.7, 0.0);   // patient — anchor
      else if (i < 3.5)  p = vec3(-4.05,  0.3, 0.0);   // doctor — feeder
      else if (i < 4.5)  p = vec3(-4.05, -0.3, 0.0);   // doctor — feeder
      else if (i < 5.5)  p = vec3(-3.15,  0.0, 0.0);   // doctor — anchor
      else if (i < 6.5)  p = vec3(-4.05, -1.4, 0.0);   // clinic — feeder
      else if (i < 7.5)  p = vec3(-4.05, -2.0, 0.0);   // clinic — feeder
      else if (i < 8.5)  p = vec3(-3.15, -1.7, 0.0);   // clinic — anchor
      else if (i < 9.5)  p = vec3(-0.6,  0.0, 0.0);    // shared appointment hub
      else if (i < 10.5) p = vec3( 1.5,  1.1, 0.0);    // schedule spine
      else if (i < 11.5) p = vec3( 1.5,  0.0, 0.0);    // schedule spine
      else               p = vec3( 1.5, -1.1, 0.0);    // schedule spine
      p.z = -2.0 + breathe;
      return p;
    }

    if (id < F_RESOLVE + 0.5 && id > F_RESOLVE - 0.5){   // outcome: one spine
      if (i > 3.5) return vec3(0.0, 0.0, -40.0);
      return vec3(0.0, 2.0 - i * 1.35, -1.6 + breathe);
    }

    if (id < F_DISTILL + 0.5 && id > F_DISTILL - 0.5){   // gathered context
      if (i > 6.5) return vec3(0.0, 0.0, -40.0);
      float a = i * 0.8975979;
      return vec3(2.6 + cos(a) * 0.85, 0.1 + sin(a) * 0.85, -1.7 + breathe);
    }

    return vec3(0.0, 0.0, -40.0);
  }
`
