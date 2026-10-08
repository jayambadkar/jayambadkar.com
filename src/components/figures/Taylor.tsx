import type { CSSProperties } from 'react';
import { parametric, projector, toPath } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Calculus and Applications (MATH40004, core Y1).
 * Maclaurin (Taylor about 0) polynomials of sin x of odd degree 1…15.
 * Each higher degree agrees with sin x over a wider interval before peeling away.
 */
const W = 480;
const H = 320;
const X0 = -2 * Math.PI;
const X1 = 2 * Math.PI;
const YR = 1.9;

const project = projector({ x: [X0, X1], y: [-YR, YR], width: W, height: H, stretch: true });

/** Degree-(2n−1) Maclaurin polynomial of sin. */
function taylorSin(n: number, x: number): number {
  let s = 0;
  let term = x;
  for (let k = 0; k < n; k++) {
    s += term;
    term *= (-x * x) / ((2 * k + 2) * (2 * k + 3));
  }
  return s;
}

const DEGREES = [1, 3, 5, 7, 9, 11, 13, 15] as const;
const POLYS = DEGREES.map((d) =>
  toPath(
    parametric((x) => [x, taylorSin((d + 1) / 2, x)], X0, X1, 600)
      .filter(([, y]) => Math.abs(y) < YR * 3)
      .map(project),
  ),
);
const SINE = toPath(parametric((x) => [x, Math.sin(x)], X0, X1, 600).map(project));
const [, AXIS_Y] = project([0, 0]);
const [AXIS_X] = project([0, 0]);
const ORIGIN = project([0, 0]);
const TICKS = [-1, 1].map((k) => ({ k, x: project([k * Math.PI, 0])[0] }));

export function TaylorFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      align="center"
      label="Taylor polynomials of sine of increasing degree hugging the sine curve over wider and wider intervals"
      caption={
        <>
          Calculus and Applications. Taylor polynomials of sin&nbsp;<i>x</i> about 0, degrees 1 to
          15: each hugs the curve over a wider interval.
        </>
      }
    >
      <clipPath id="taylor-clip">
        <rect x={0} y={0} width={W} height={H} />
      </clipPath>
      <line className={fig.guide} x1={0} y1={AXIS_Y} x2={W} y2={AXIS_Y} />
      <line className={fig.guide} x1={AXIS_X} y1={0} x2={AXIS_X} y2={H} />
      {TICKS.map(({ k, x }) => (
        <g key={k}>
          <line className={fig.guide} x1={x} y1={AXIS_Y - 4} x2={x} y2={AXIS_Y + 4} />
          <text className={fig.label} x={x} y={AXIS_Y + 20} textAnchor="middle">
            {k === 1 ? 'π' : '−π'}
          </text>
        </g>
      ))}
      <g clipPath="url(#taylor-clip)">
        {POLYS.map((d, i) => (
          <path
            key={i}
            className={`${fig.trace} ${fig.draw ?? ''}`}
            d={d}
            pathLength={1}
            style={
              {
                '--delay': `${0.2 + i * 0.25}s`,
                '--dur': '3.2s',
                opacity: 0.25 + 0.06 * i,
              } as CSSProperties
            }
          />
        ))}
        <path
          className={`${fig.main} ${fig.draw ?? ''}`}
          d={SINE}
          pathLength={1}
          style={{ '--delay': '0.6s', '--dur': '4s', strokeWidth: 1.3 } as CSSProperties}
        />
      </g>
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={ORIGIN[0]}
        cy={ORIGIN[1]}
        r={3.5}
        style={{ '--delay': '4.4s' } as CSSProperties}
      />
    </Figure>
  );
}
