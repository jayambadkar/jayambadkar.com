import type { CSSProperties } from 'react';
import { bounds, projector, rk4, toPath, type Vec2, type VecN } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/** Lorenz system with the classic parameters σ = 10, ρ = 28, β = 8/3. */
const SIGMA = 10;
const RHO = 28;
const BETA = 8 / 3;

const lorenz = ([x = 0, y = 0, z = 0]: VecN): VecN => [
  SIGMA * (y - x),
  x * (RHO - z) - y,
  x * y - BETA * z,
];

const W = 240;
const H = 300;

// Integrate, drop the initial transient, project onto the x–z plane.
const raw: Vec2[] = rk4(lorenz, [1, 1, 1], 0.008, 5200)
  .slice(250)
  .filter((_, i) => i % 2 === 0)
  .map(([x = 0, , z = 0]) => [x, z]);
const box = bounds(raw);
const project = projector({ ...box, width: W, height: H, pad: 6 });
const pts = raw.map(project);
const PATH = toPath(pts);
const END = pts[pts.length - 1] ?? [0, 0];

// The two non-trivial equilibria C± = (±√(β(ρ−1)), ·, ρ − 1).
const c = Math.sqrt(BETA * (RHO - 1));
const EQ: readonly Vec2[] = [project([c, RHO - 1]), project([-c, RHO - 1])];

export function LorenzFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Lorenz attractor: a single trajectory looping around two lobes without ever repeating"
      caption={
        <>
          Lorenz attractor, σ&nbsp;=&nbsp;10, ρ&nbsp;=&nbsp;28, β&nbsp;=&nbsp;8/3, in the <i>x</i>–
          <i>z</i> plane. Deterministic, yet it never repeats.
        </>
      }
    >
      {EQ.map(([x, y]) => (
        <circle key={x} className={fig.guide} cx={x} cy={y} r={2.5} />
      ))}
      <path
        className={`${fig.main ?? ''} ${fig.draw ?? ''}`}
        d={PATH}
        pathLength={1}
        style={{ '--dur': '7s', strokeWidth: 0.55, opacity: 0.75 } as CSSProperties}
      />
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={END[0]}
        cy={END[1]}
        r={3}
        style={{ '--delay': '6.5s' } as CSSProperties}
      />
    </Figure>
  );
}
