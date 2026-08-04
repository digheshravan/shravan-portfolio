import { simplex3d } from './noise.glsl.js'

/**
 * The hero object: a sphere pushed around by fbm noise, shaded as an
 * iridescent chrome. Normals are rebuilt from finite differences after
 * displacement, otherwise the lighting slides off the geometry and the whole
 * thing reads as plastic.
 */
export const artifactVertex = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uEnergy;
uniform float uMorph;
uniform float uPointer;
uniform vec2  uMouse;

varying vec3  vNormal;
varying vec3  vWorldPos;
varying vec3  vViewPos;
varying float vDisplace;
varying float vRidge;

${simplex3d}

/** Signed displacement at a point on the unit sphere. */
float displace(vec3 p){
  vec3 sp = p * uFrequency;
  float t = uTime * 0.22;

  // Two counter-drifting fields keep the surface from looking like it loops.
  float base = fbm(sp + vec3(0.0, t, 0.0));
  float swirl = snoise(sp * 1.7 - vec3(t * 0.8, 0.0, t * 0.4));

  // uMorph slides the object from a soft blob toward tight, faceted ridges.
  float ridged = 1.0 - abs(swirl);
  ridged = pow(ridged, 3.0);

  float shaped = mix(base, ridged * 1.2 - 0.4, uMorph);

  // Scroll energy inflates the surface — the object reacts to being moved past.
  return shaped * uAmplitude * (1.0 + uEnergy * 0.9);
}

void main(){
  vec3 nrm = normalize(position);

  // Build a stable tangent basis so the finite differences don't degenerate
  // at the poles.
  vec3 up = abs(nrm.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(up, nrm));
  vec3 t2 = normalize(cross(nrm, t1));

  float eps = 0.035;
  vec3 pA = normalize(nrm + t1 * eps);
  vec3 pB = normalize(nrm + t2 * eps);

  float dC = displace(nrm);
  float dA = displace(pA);
  float dB = displace(pB);

  vec3 posC = nrm * (1.0 + dC);
  vec3 posA = pA  * (1.0 + dA);
  vec3 posB = pB  * (1.0 + dB);

  vec3 newNormal = normalize(cross(posA - posC, posB - posC));
  // cross() order can flip the normal inward on some tessellations.
  if (dot(newNormal, nrm) < 0.0) newNormal = -newNormal;

  // A gentle pull toward the cursor, strongest on the facing hemisphere.
  vec3 pull = vec3(uMouse * 0.14, 0.0);
  float facing = smoothstep(0.0, 1.0, nrm.z);
  vec3 finalPos = posC + pull * facing * uPointer;

  vec4 worldPos = modelMatrix * vec4(finalPos, 1.0);
  vec4 viewPos = viewMatrix * worldPos;

  vNormal    = normalize(mat3(modelMatrix) * newNormal);
  vWorldPos  = worldPos.xyz;
  vViewPos   = viewPos.xyz;
  vDisplace  = dC;
  vRidge     = smoothstep(0.02, 0.16, abs(dC));

  gl_Position = projectionMatrix * viewPos;
}
`

export const artifactFragment = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform float uMorph;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform vec3  uBackground;
uniform float uOpacity;

varying vec3  vNormal;
varying vec3  vWorldPos;
varying vec3  vViewPos;
varying float vDisplace;
varying float vRidge;

${simplex3d}

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);

  // Fresnel drives everything: rim brightness, hue shift, and opacity.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.6);

  // Thin-film style hue cycling keyed to view angle and surface height.
  float band = fres * 1.6 + vDisplace * 3.2 + uTime * 0.04;
  vec3 iri = palette(
    band,
    vec3(0.52, 0.48, 0.58),
    vec3(0.46, 0.42, 0.50),
    vec3(1.00, 0.98, 1.04),
    vec3(0.00, 0.22, 0.48)
  );

  // Tint the palette toward the brand triad instead of a generic rainbow.
  vec3 brand = mix(uColorA, uColorB, smoothstep(-0.35, 0.35, vDisplace));
  brand = mix(brand, uColorC, fres * 0.65);
  vec3 base = mix(brand, iri, 0.45);

  // Two hard-ish key lights read as studio chrome.
  vec3 L1 = normalize(vec3(-0.6, 0.9, 0.7));
  vec3 L2 = normalize(vec3(0.8, -0.35, 0.5));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);

  vec3 H1 = normalize(L1 + V);
  float spec = pow(max(dot(N, H1), 0.0), 84.0);
  float spec2 = pow(max(dot(N, normalize(L2 + V)), 0.0), 32.0);

  vec3 color = base * (0.16 + d1 * 0.72 + d2 * 0.30);
  color += vec3(1.0) * spec * 1.25;
  color += uColorB * spec2 * 0.45;
  color += uColorC * fres * (0.75 + uEnergy * 0.8);

  // Ridge highlight — the faceted state should catch light on its creases.
  color += mix(uColorA, vec3(1.0), 0.4) * vRidge * uMorph * 0.35;

  // Dither with a touch of noise so gradients never band on wide displays.
  float grain = snoise(vec3(gl_FragCoord.xy * 0.9, uTime * 4.0)) * 0.012;
  color += grain;

  // Fade the far side into the page background so the object sits in the room.
  float depthFade = smoothstep(-9.0, 1.5, vViewPos.z);
  color = mix(uBackground, color, clamp(depthFade, 0.35, 1.0));

  gl_FragColor = vec4(color, uOpacity);

  #include <colorspace_fragment>
}
`
