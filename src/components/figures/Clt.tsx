import type { CSSProperties } from 'react';
import { parametric, projector, toPath, type Vec2 } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Probability and Statistics for JMC (MATH50013, compulsory Y2).
 * Central limit theorem: the proportion of heads K/n in n fair coin flips,
 * K ~ Binomial(n, ½). On a lattice of spacing 1/n its density is n·P(K = k);
 * as n grows it approaches the Normal(½, 1/(4n)) density (dashed, n = 64).
 */
const W = 1160;
const H = 130;
const X0 = 0.08;
const X1 = 0.92;

function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  const m = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < m; i++) c = (c * (n - i)) / (i + 1);
  return c;
}
const density = (n: number, k: number): number => n * binom(n, k) * Math.pow(0.5, n);
const normal = (x: number, n: number): number => {
  const v = 0.25 / n;
  return Math.exp(-((x - 0.5) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
};

const MAX_Y = normal(0.5, 64) * 1.08;
const project = projector({ x: [X0, X1], y: [0, MAX_Y], width: W, height: H, stretch: true });

/** Frequency polygon through (k/n, n·P(K = k)). */
const polygon = (n: number): string =>
  toPath(
    Array.from({ length: n + 1 }, (_, k): Vec2 => [k / n, density(n, k)])
      .filter(([x]) => x >= X0 - 0.13 && x <= X1 + 0.13)
      .map(project),
  );

/** Histogram outline for n: bars of width 1/n centred on k/n. */
const histogram = (n: number): string => {
  const pts: Vec2[] = [];
  for (let k = 0; k <= n; k++) {
    const x = k / n;
    if (x < X0 || x > X1) continue;
    const y = density(n, k);
    pts.push([x - 0.5 / n, 0], [x - 0.5 / n, y], [x + 0.5 / n, y], [x + 0.5 / n, 0]);
  }
  return toPath(pts.map(project));
};

const TRACES = [polygon(4), polygon(16)];
const MAIN = histogram(64);
const NORMAL = toPath(parametric((x) => [x, normal(x, 64)], X0, X1, 300).map(project));
const BASE_Y = project([0, 0])[1];
const PEAK = project([0.5, normal(0.5, 64)]);

export function CltFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      align="center"
      label="Distribution of the proportion of heads for 4, 16 and 64 coin flips, approaching a normal curve"
      caption={
        <>
          Probability and Statistics. The proportion of heads in <i>n</i> fair coin flips, for{' '}
          <i>n</i>&nbsp;=&nbsp;4, 16 and 64, approaching a normal curve: the central limit theorem.
        </>
      }
    >
      <clipPath id="clt-clip">
        <rect x={0} y={-4} width={W} height={H + 8} />
      </clipPath>
      <line className={fig.guide} x1={0} y1={BASE_Y} x2={W} y2={BASE_Y} />
      <g clipPath="url(#clt-clip)">
        {TRACES.map((d, i) => (
          <path
            key={i}
            className={`${fig.trace} ${fig.draw ?? ''}`}
            d={d}
            pathLength={1}
            style={{ '--delay': `${0.2 + i * 0.5}s`, '--dur': '3s' } as CSSProperties}
          />
        ))}
        <path
          className={`${fig.main} ${fig.draw ?? ''}`}
          d={MAIN}
          pathLength={1}
          style={
            { '--delay': '1.2s', '--dur': '4s', strokeWidth: 0.8, opacity: 0.8 } as CSSProperties
          }
        />
        <path
          className={`${fig.guideDashed} ${fig.fade ?? ''}`}
          d={NORMAL}
          style={{ '--delay': '4.5s', stroke: 'var(--fg-muted)' } as CSSProperties}
        />
      </g>
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={PEAK[0]}
        cy={PEAK[1]}
        r={3}
        style={{ '--delay': '5s' } as CSSProperties}
      />
    </Figure>
  );
}
