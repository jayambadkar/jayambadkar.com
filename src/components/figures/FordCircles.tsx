import type { CSSProperties } from 'react';
import { gcd } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

const W = 240;
const H = 262;
const PAD = 10;
const MAX_Q = 9;
const S = W - 2 * PAD; // px per unit
const BASE = H - 22; // y of the number line (circles for q = 1 reach S above it)

interface Circle {
  p: number;
  q: number;
  cx: number;
  cy: number;
  r: number;
}

/** One circle per reduced fraction p/q in [0, 1]: centre (p/q, 1/(2q²)), radius 1/(2q²). */
const CIRCLES: readonly Circle[] = (() => {
  const out: Circle[] = [];
  for (let q = 1; q <= MAX_Q; q++) {
    for (let p = 0; p <= q; p++) {
      if (gcd(p, q) !== 1) continue;
      const r = (1 / (2 * q * q)) * S;
      out.push({ p, q, cx: PAD + (p / q) * S, cy: BASE - r, r });
    }
  }
  return out;
})();

export function FordCirclesFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Ford circles: tangent circles sitting on the number line above each fraction"
      caption={
        <>
          Ford circles. Above each <i>p</i>/<i>q</i> in lowest terms sits a circle of radius 1/(2
          <i>q</i>²); they touch but never overlap.
        </>
      }
    >
      <line className={fig.guide} x1={0} y1={BASE} x2={W} y2={BASE} />
      {/* Show only 0 ≤ x ≤ 1: the q = 1 circles appear as two half-discs. */}
      <clipPath id="ford-clip">
        <rect x={PAD} y={0} width={S} height={BASE} />
      </clipPath>
      <g clipPath="url(#ford-clip)">
        {CIRCLES.map((c) => (
          <circle
            key={`${c.p}/${c.q}`}
            className={`${c.q <= 2 ? fig.main : fig.trace} ${fig.draw ?? ''}`}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            pathLength={1}
            style={{ '--delay': `${(c.q - 1) * 0.35}s`, '--dur': '2.4s' } as CSSProperties}
          />
        ))}
      </g>
      {(
        [
          ['0', 0],
          ['½', 0.5],
          ['1', 1],
        ] as const
      ).map(([t, v]) => (
        <text key={t} className={fig.label} x={PAD + v * S} y={BASE + 16} textAnchor="middle">
          {t}
        </text>
      ))}
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={PAD + S / 2}
        cy={BASE}
        r={3}
        style={{ '--delay': '3.2s' } as CSSProperties}
      />
    </Figure>
  );
}
