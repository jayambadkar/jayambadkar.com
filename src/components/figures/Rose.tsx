import type { CSSProperties } from 'react';
import { polar, projector, toPath } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

const W = 220;
const H = 220;
const K = 4;

const project = projector({ x: [-1, 1], y: [-1, 1], width: W, height: H, pad: 8 });
const ROSE = toPath(polar((t) => Math.cos(K * t), 0, 2 * Math.PI, 720).map(project), true);
const [cx, cy] = project([0, 0]);
const [rx] = project([1, 0]);
const R = rx - cx;
const TIP = project([1, 0]);

export function RoseFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Eight-petalled rose curve inside a unit circle"
      caption={
        <>
          Rose <i>r</i> = cos 4θ. An even <i>k</i> in cos <i>k</i>θ gives 2<i>k</i> petals, so
          eight.
        </>
      }
    >
      <circle className={fig.guideDashed} cx={cx} cy={cy} r={R} />
      <line className={fig.guide} x1={cx - R} y1={cy} x2={cx + R} y2={cy} />
      <line className={fig.guide} x1={cx} y1={cy - R} x2={cx} y2={cy + R} />
      <path
        className={`${fig.main ?? ''} ${fig.draw ?? ''}`}
        d={ROSE}
        pathLength={1}
        style={{ '--dur': '4.5s', '--delay': '0.2s' } as CSSProperties}
      />
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={TIP[0]}
        cy={TIP[1]}
        r={3}
        style={{ '--delay': '4.4s' } as CSSProperties}
      />
    </Figure>
  );
}
