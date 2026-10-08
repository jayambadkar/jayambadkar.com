import type { CSSProperties } from 'react';
import { parametric, projector, toPath } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

const W = 240;
const H = 240;
const A = 3;
const B = 2;

const project = projector({ x: [-1, 1], y: [-1, 1], width: W, height: H, pad: 10 });
const curve = (delta: number): string =>
  toPath(
    parametric((t) => [Math.sin(A * t + delta), Math.sin(B * t)], 0, 2 * Math.PI, 360).map(project),
    true,
  );

const MAIN = curve(Math.PI / 2);
const TRACES = [curve(0), curve(Math.PI / 4)];
const DOT = project([1, 0]); // t = 0 on the main curve
const [x0, y0] = project([-1, -1]);
const [x1, y1] = project([1, 1]);

export function LissajousFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Lissajous curves with a three-to-two frequency ratio"
      caption={
        <>
          Lissajous curves&nbsp;
          <span className={fig.nowrap}>
            <i>x</i> = sin(3<i>t</i> + δ),
          </span>{' '}
          <span className={fig.nowrap}>
            <i>y</i> = sin 2<i>t</i>
          </span>
          , for δ&nbsp;=&nbsp;0, π/4 and π/2.
        </>
      }
    >
      <rect className={fig.guideDashed} x={x0} y={y1} width={x1 - x0} height={y0 - y1} />
      {TRACES.map((d, i) => (
        <path
          key={i}
          className={`${fig.trace ?? ''} ${fig.draw ?? ''}`}
          d={d}
          pathLength={1}
          style={{ '--delay': `${0.2 + i * 0.4}s` } as CSSProperties}
        />
      ))}
      <path
        className={`${fig.main ?? ''} ${fig.draw ?? ''}`}
        d={MAIN}
        pathLength={1}
        style={{ '--delay': '0.9s' } as CSSProperties}
      />
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={DOT[0]}
        cy={DOT[1]}
        r={3}
        style={{ '--delay': '4s' } as CSSProperties}
      />
    </Figure>
  );
}
