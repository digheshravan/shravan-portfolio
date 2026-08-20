/**
 * The reduced-motion fallback for the 3D system (ADR-0016, closing the gap
 * ADR-0003 recorded: "the guideline is to reduce motion, not remove
 * content" — a plain gradient behind the page reads as empty, not calm).
 *
 * This is a plain, static <svg> — no WebGL, no JS-driven position updates,
 * no CSS animation. It is drawn once and never touched again, using the
 * same vocabulary as the live system (rows / nodes / links / layers) in the
 * same composition the "about" section's beat uses: four clusters reaching
 * toward a shared centre. That formation carries the site's whole thesis —
 * Engineering × AI × Data × Management meeting in the middle — which is why
 * it, rather than any single section's beat, is the one true for the whole
 * page a reduced-motion visitor sees behind everything.
 *
 * Coordinates are hand-placed in a 0–100 viewBox, not computed from the
 * shader's formation math — a one-time static image doesn't need the GLSL
 * ported to JS, it needs to look like it belongs to the same family.
 */

const CLUSTERS = [
  { cx: 68, cy: 30, nodes: [[-4, -3], [3, -2.5], [-1, 4]] },
  { cx: 68, cy: 68, nodes: [[-4, 3], [3, 2.5], [-1, -4]] },
  { cx: 32, cy: 68, nodes: [[4, 3], [-3, 2.5], [1, -4]] },
  { cx: 32, cy: 30, nodes: [[4, -3], [-3, -2.5], [1, 4]] },
]

// The one node per cluster reaching toward the centre, and the elbow link
// that carries it there — the accent-coloured, "resolved" part of the image.
const INWARD = [
  { x: 61, y: 38 },
  { x: 61, y: 62 },
  { x: 39, y: 62 },
  { x: 39, y: 38 },
]

const CENTRE = { x: 50, y: 50 }

// Scattered hairline rows at the edges — raw, unorganised material framing
// the resolved centre. Two carry the accent, echoing the Structure beat's
// rule: a genuinely small, meaningful selection, not a rhythmic pattern.
const ROWS = [
  { x: 6, y: 10, w: 9, accent: false },
  { x: 18, y: 7, w: 5, accent: false },
  { x: 44, y: 9, w: 7, accent: true },
  { x: 60, y: 6, w: 6, accent: false },
  { x: 78, y: 11, w: 10, accent: false },
  { x: 88, y: 8, w: 5, accent: false },
  { x: 8, y: 91, w: 7, accent: false },
  { x: 22, y: 93, w: 9, accent: false },
  { x: 47, y: 90, w: 5, accent: false },
  { x: 66, y: 92, w: 8, accent: true },
  { x: 82, y: 89, w: 6, accent: false },
]

function elbowPath(from) {
  // Out vertically, in horizontally — the same routing rule the live
  // Links primitive uses, so the static image reads as the same system.
  return `M ${from.x} ${from.y} L ${from.x} ${CENTRE.y} L ${CENTRE.x} ${CENTRE.y}`
}

export function StaticField() {
  return (
    <svg
      className="staticField"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Layer: one large, faint, slightly rotated panel for depth. */}
      <rect
        className="staticField__layer"
        x="20"
        y="15"
        width="60"
        height="70"
        transform="rotate(-4 50 50)"
      />

      {/* Rows: unorganised material at the edges. */}
      {ROWS.map((r, i) => (
        <line
          key={i}
          className={r.accent ? 'staticField__row staticField__row--accent' : 'staticField__row'}
          x1={r.x}
          y1={r.y}
          x2={r.x + r.w}
          y2={r.y + (i % 2 === 0 ? 0.6 : -0.5)}
        />
      ))}

      {/* Links: each cluster's inward node, resolving to the shared centre. */}
      {INWARD.map((p, i) => (
        <path key={i} className="staticField__link" d={elbowPath(p)} fill="none" />
      ))}

      {/* Nodes: the outer members of each cluster, hairline squares. */}
      {CLUSTERS.map((c, ci) =>
        c.nodes.map(([dx, dy], ni) => (
          <rect
            key={`${ci}-${ni}`}
            className="staticField__node"
            x={c.cx + dx - 1.1}
            y={c.cy + dy - 1.1}
            width="2.2"
            height="2.2"
          />
        ))
      )}

      {/* Nodes: the inward, resolved member of each cluster — filled, accent. */}
      {INWARD.map((p, i) => (
        <rect
          key={i}
          className="staticField__node staticField__node--accent"
          x={p.x - 1.3}
          y={p.y - 1.3}
          width="2.6"
          height="2.6"
        />
      ))}

      {/* The centre itself — where all four resolve. */}
      <rect
        className="staticField__node staticField__node--accent"
        x={CENTRE.x - 1.5}
        y={CENTRE.y - 1.5}
        width="3"
        height="3"
      />
    </svg>
  )
}
