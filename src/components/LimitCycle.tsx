import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './LimitCycle.module.css';

/**
 * Hairline phase portrait of the Van der Pol oscillator (μ = 1):
 *   ẋ = y,  ẏ = μ(1 − x²)y − x.
 * Trajectories from inside and outside all settle onto the same limit cycle
 * (Poincaré–Bendixson). Paths are integrated once at module load (RK4) and
 * drawn in slowly with stroke-dashoffset; static under reduced motion.
 */

const MU = 1;
const SIZE = 480;
const SCALE = SIZE / 9; // world units → px (x, y ∈ [-4.5, 4.5])

type Vec = readonly [number, number];

const field = ([x, y]: Vec): Vec => [y, MU * (1 - x * x) * y - x];

function integrate(start: Vec, steps: number, dt = 0.02): Vec[] {
  const pts: Vec[] = [start];
  let p = start;
  for (let i = 0; i < steps; i++) {
    const k1 = field(p);
    const k2 = field([p[0] + (dt / 2) * k1[0], p[1] + (dt / 2) * k1[1]]);
    const k3 = field([p[0] + (dt / 2) * k2[0], p[1] + (dt / 2) * k2[1]]);
    const k4 = field([p[0] + dt * k3[0], p[1] + dt * k3[1]]);
    p = [
      p[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
      p[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    ];
    pts.push(p);
  }
  return pts;
}

const toPx = ([x, y]: Vec): Vec => [SIZE / 2 + x * SCALE, SIZE / 2 - y * SCALE * 0.8];

function toPath(pts: Vec[], every = 2): string {
  return pts
    .filter((_, i) => i % every === 0 || i === pts.length - 1)
    .map((p, i) => {
      const [x, y] = toPx(p);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join('');
}

// The limit cycle itself: integrate past the transient, keep ~one period (T ≈ 6.66).
const settled = integrate([2, 0], 1500).slice(1000);
const cyclePts = settled.slice(0, 340);
const CYCLE = `${toPath(cyclePts)}Z`;

const TRAJECTORIES: readonly string[] = [
  toPath(integrate([0.08, 0], 900)),
  toPath(integrate([-0.05, 0.12], 900)),
  toPath(integrate([-4.2, 4.4], 500)),
  toPath(integrate([4.2, -4.4], 500)),
  toPath(integrate([0.5, 4.5], 450)),
  toPath(integrate([-0.5, -4.5], 450)),
];

// Sparse direction field: short normalised strokes on a grid.
const TICKS: string = (() => {
  const segs: string[] = [];
  for (let gx = -4; gx <= 4; gx += 1) {
    for (let gy = -4.5; gy <= 4.5; gy += 1.125) {
      const [u, v] = field([gx, gy]);
      const len = Math.hypot(u, v) || 1;
      const [px, py] = toPx([gx, gy]);
      const dx = (u / len) * 5;
      const dy = (-v / len) * 5 * 0.8;
      segs.push(
        `M${(px - dx).toFixed(1)} ${(py - dy).toFixed(1)}L${(px + dx).toFixed(1)} ${(py + dy).toFixed(1)}`,
      );
    }
  }
  return segs.join('');
})();

export interface LimitCycleProps {
  className?: string | undefined;
}

export function LimitCycle({ className }: LimitCycleProps) {
  const reducedMotion = useReducedMotion();
  return (
    <figure className={className}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="Phase portrait of the Van der Pol oscillator: trajectories spiralling onto a single limit cycle"
      >
        <line className={styles.axis} x1={0} y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} />
        <line className={styles.axis} x1={SIZE / 2} y1={0} x2={SIZE / 2} y2={SIZE} />
        <path className={styles.ticks} d={TICKS} />
        {TRAJECTORIES.map((d, i) => (
          <path
            key={i}
            className={styles.trajectory}
            d={d}
            pathLength={1}
            style={{ animationDelay: `${0.3 + i * 0.35}s` }}
          />
        ))}
        <path id="limit-cycle" className={styles.cycle} d={CYCLE} pathLength={1} />
        {reducedMotion ? null : (
          <circle className={styles.dot} r={3.5}>
            <animateMotion dur="7s" repeatCount="indefinite" begin="3s" rotate="auto">
              <mpath href="#limit-cycle" />
            </animateMotion>
          </circle>
        )}
      </svg>
      <figcaption className={styles.caption}>
        <em>Fig. 1</em> Van der Pol, μ = 1. Wherever you start, you end up on the same cycle.
      </figcaption>
    </figure>
  );
}
