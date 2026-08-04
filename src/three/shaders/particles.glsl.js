import { simplex3d } from './noise.glsl.js'

/**
 * Volumetric dust. Drifts on the same noise field as the artifact, gets shoved
 * aside by the cursor, and stretches along Z with scroll velocity so fast
 * scrolling reads as motion through space rather than a jump cut.
 */
export const particlesVertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uEnergy;
uniform float uScrollY;
uniform vec3  uMouse;
uniform float uPixelRatio;

attribute float aScale;
attribute float aSeed;

varying float vAlpha;
varying float vSeed;
varying float vDepth;

${simplex3d}

void main(){
  vec3 pos = position;

  // Slow organic drift.
  float t = uTime * 0.08 + aSeed * 6.28;
  vec3 field = vec3(
    snoise(pos * 0.16 + vec3(t, 0.0, 0.0)),
    snoise(pos * 0.16 + vec3(0.0, t, 40.0)),
    snoise(pos * 0.16 + vec3(80.0, 0.0, t))
  );
  pos += field * 1.15;

  // Parallax: particles further back travel less as the page scrolls.
  float layer = 0.35 + aSeed * 0.65;
  pos.y += uScrollY * layer * 2.4;

  // Wrap vertically so the field is effectively infinite.
  float span = 26.0;
  pos.y = mod(pos.y + span * 0.5, span) - span * 0.5;

  // Cursor repulsion with a soft falloff.
  vec3 toMouse = pos - uMouse;
  float dist = length(toMouse);
  float push = smoothstep(4.2, 0.0, dist);
  pos += normalize(toMouse + 0.0001) * push * 1.8;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * aScale * uPixelRatio * (1.0 + uEnergy * 1.4);
  gl_PointSize *= (1.0 / -mvPosition.z);
  // Without a ceiling, anything drifting near the camera becomes a screen-wide
  // bokeh disc and eats the typography behind it.
  gl_PointSize = min(gl_PointSize, 30.0 * uPixelRatio);

  vDepth = -mvPosition.z;
  vSeed = aSeed;
  vAlpha = smoothstep(34.0, 8.0, vDepth) * (0.18 + aScale * 0.42);
  vAlpha *= 1.0 - push * 0.55;
}
`

export const particlesFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;

varying float vAlpha;
varying float vSeed;
varying float vDepth;

void main(){
  // Round, soft-edged sprite without needing a texture.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float mask = smoothstep(0.5, 0.06, d);
  if (mask <= 0.001) discard;

  // A few particles twinkle; most stay quiet.
  float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + vSeed * 40.0);

  vec3 color = mix(uColorA, uColorB, vSeed);
  float core = smoothstep(0.28, 0.0, d);
  color += vec3(1.0) * core * 0.5;

  gl_FragColor = vec4(color, mask * vAlpha * twinkle);

  #include <colorspace_fragment>
}
`
