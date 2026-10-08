import type { CSSProperties } from 'react';
import { parametric, projector, toPath } from '../../lib/curves';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Linear Algebra and Groups for JMC (MATH40012, core Y1).
 * A symmetric positive-definite matrix maps the unit circle to an ellipse
 * whose principal axes are the eigenvectors of A.
 *
 *   A = [[ 2.2, 0.7 ], [ 0.7, 1.1 ]]
 * Eigenvalues λ₁ ≈ 2.52, λ₂ ≈ 0.78; the ellipse's semi-axes are λ₁v₁ and λ₂v₂.
 */
const W = 240;
const H = 240;
const A11 = 2.2;
const A12 = 0.7;
const A22 = 1.1;

const apply = ([x, y]: readonly [number, number]): [number, number] => [
  A11 * x + A12 * y,
  A12 * x + A22 * y,
];

// Eigenpairs of the symmetric matrix (closed form for 2×2).
const tr = A11 + A22;
const det = A11 * A22 - A12 * A12;
const disc = Math.sqrt(tr * tr - 4 * det);
const lam1 = (tr + disc) / 2;
const v1: [number, number] = (() => {
  const vx = A12;
  const vy = lam1 - A11;
  const n = Math.hypot(vx, vy) || 1;
  return [vx / n, vy / n];
})();
const v2: [number, number] = [-v1[1], v1[0]];

const project = projector({ x: [-2.8, 2.8], y: [-2.8, 2.8], width: W, height: H, pad: 8 });
const CIRCLE = toPath(
  parametric((t) => [Math.cos(t), Math.sin(t)], 0, 2 * Math.PI, 180).map(project),
  true,
);
const ELLIPSE = toPath(
  parametric((t) => apply([Math.cos(t), Math.sin(t)]), 0, 2 * Math.PI, 180).map(project),
  true,
);
const axis = (v: [number, number]): string => {
  const tip = apply([v[0], v[1]]); // A v = λ v, and ||v||=1 so tip is at distance λ
  // Draw ± tip (which equals ±λ v).
  const a = project([-tip[0], -tip[1]]);
  const b = project([tip[0], tip[1]]);
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
};
const AXIS1 = axis(v1);
const AXIS2 = axis(v2);
const TIP = project(apply([v1[0], v1[1]]));

export function LinearMapFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="A linear map sending the unit circle to an ellipse whose axes are the eigenvectors"
      caption={
        <>
          Linear Algebra and Groups. A symmetric <i>A</i> maps the unit circle to an ellipse whose
          axes are its eigenvectors, stretched by the eigenvalues.
        </>
      }
    >
      <path
        className={`${fig.guideDashed} ${fig.draw ?? ''}`}
        d={CIRCLE}
        pathLength={1}
        style={{ '--delay': '0.1s', '--dur': '2s' } as CSSProperties}
      />
      <path
        className={`${fig.trace} ${fig.draw ?? ''}`}
        d={AXIS1}
        pathLength={1}
        style={{ '--delay': '0.6s', '--dur': '1.8s' } as CSSProperties}
      />
      <path
        className={`${fig.trace} ${fig.draw ?? ''}`}
        d={AXIS2}
        pathLength={1}
        style={{ '--delay': '0.8s', '--dur': '1.8s' } as CSSProperties}
      />
      <path
        className={`${fig.main} ${fig.draw ?? ''}`}
        d={ELLIPSE}
        pathLength={1}
        style={{ '--delay': '1.2s', '--dur': '3s' } as CSSProperties}
      />
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={TIP[0]}
        cy={TIP[1]}
        r={3}
        style={{ '--delay': '3.6s' } as CSSProperties}
      />
    </Figure>
  );
}
