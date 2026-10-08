import type { CSSProperties } from 'react';
import { parametric, projector, toPath, type Vec2 } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

const W = 1160;
const H = 120;
const X0 = -Math.PI;
const X1 = 7 * Math.PI; // four full periods

const project = projector({ x: [X0, X1], y: [-1.3, 1.3], width: W, height: H, stretch: true });

/** Square-wave partial sum: (4/π) Σ sin(kx)/k over odd k ≤ n. */
const partial =
  (n: number) =>
  (x: number): Vec2 => {
    let s = 0;
    for (let k = 1; k <= n; k += 2) s += Math.sin(k * x) / k;
    return [x, (4 / Math.PI) * s];
  };

const ORDERS = [1, 3, 7, 25] as const;
const SUMS = ORDERS.map((n) => toPath(parametric(partial(n), X0, X1, 1600).map(project)));

// The target square wave itself, sign(sin x): jumps at every multiple of π.
const SQUARE = toPath(
  Array.from({ length: 8 }, (_, i): Vec2[] => {
    const a = X0 + i * Math.PI;
    const level = i % 2 === 0 ? -1 : 1;
    return [
      [a, level],
      [a + Math.PI, level],
    ];
  })
    .flat()
    .map(project),
);
// Peak of the n = 25 sum just after the jump at x = 0: near π/26.
const PEAK = project(partial(25)(Math.PI / 26));

export function FourierFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      align="center"
      label="Fourier partial sums converging to a square wave"
      caption={
        <>
          Fourier partial sums of a square wave, odd harmonics up to 1, 3, 7 and 25. The overshoot
          at each jump never vanishes: the Gibbs phenomenon.
        </>
      }
    >
      <line className={fig.guide} x1={0} y1={project([0, 0])[1]} x2={W} y2={project([0, 0])[1]} />
      <path className={fig.guideDashed} d={SQUARE} />
      {SUMS.map((d, i) => (
        <path
          key={i}
          className={`${i === SUMS.length - 1 ? fig.main : fig.trace} ${fig.draw ?? ''}`}
          d={d}
          pathLength={1}
          style={
            {
              '--delay': `${i * 0.5}s`,
              '--dur': '4s',
              strokeWidth: i === SUMS.length - 1 ? 0.9 : undefined,
              opacity: i === SUMS.length - 1 ? 0.7 : undefined,
            } as CSSProperties
          }
        />
      ))}
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
