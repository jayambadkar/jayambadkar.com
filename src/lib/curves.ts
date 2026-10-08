/**
 * Tiny typed helpers for generating hairline SVG line art from maths.
 * Everything is computed once at module load; nothing here touches the DOM.
 */

export type Vec2 = readonly [number, number];
export type VecN = readonly number[];

/** Classic fourth-order Runge–Kutta for an autonomous system ẋ = f(x). */
export function rk4(f: (p: VecN) => VecN, start: VecN, dt: number, steps: number): VecN[] {
  const out: VecN[] = [start];
  let p = start;
  const add = (a: VecN, b: VecN, s: number): VecN => a.map((v, i) => v + s * (b[i] ?? 0));
  for (let i = 0; i < steps; i++) {
    const k1 = f(p);
    const k2 = f(add(p, k1, dt / 2));
    const k3 = f(add(p, k2, dt / 2));
    const k4 = f(add(p, k3, dt));
    p = p.map(
      (v, j) => v + (dt / 6) * ((k1[j] ?? 0) + 2 * (k2[j] ?? 0) + 2 * (k3[j] ?? 0) + (k4[j] ?? 0)),
    );
    out.push(p);
  }
  return out;
}

/** Sample a parametric curve t ↦ (x, y) at n + 1 evenly spaced points. */
export function parametric(f: (t: number) => Vec2, t0: number, t1: number, n: number): Vec2[] {
  return Array.from({ length: n + 1 }, (_, i) => f(t0 + ((t1 - t0) * i) / n));
}

/** Sample a polar curve θ ↦ r(θ). */
export function polar(r: (theta: number) => number, t0: number, t1: number, n: number): Vec2[] {
  return parametric(
    (t) => {
      const rr = r(t);
      return [rr * Math.cos(t), rr * Math.sin(t)];
    },
    t0,
    t1,
    n,
  );
}

export interface Viewport {
  /** World bounds [xmin, xmax] × [ymin, ymax]. */
  x: Vec2;
  y: Vec2;
  /** Output size in px. */
  width: number;
  height: number;
  pad?: number;
  /** Scale x and y independently to fill the box (default: keep aspect ratio). */
  stretch?: boolean;
}

/** Map world coordinates into SVG pixels (y up), preserving aspect ratio. */
export function projector(v: Viewport): (p: Vec2) => Vec2 {
  const pad = v.pad ?? 0;
  const sx = (v.width - 2 * pad) / (v.x[1] - v.x[0]);
  const sy = (v.height - 2 * pad) / (v.y[1] - v.y[0]);
  const s = Math.min(sx, sy);
  const kx = v.stretch ? sx : s;
  const ky = v.stretch ? sy : s;
  const ox = (v.width - kx * (v.x[1] - v.x[0])) / 2;
  const oy = (v.height - ky * (v.y[1] - v.y[0])) / 2;
  return ([x, y]) => [ox + (x - v.x[0]) * kx, v.height - (oy + (y - v.y[0]) * ky)];
}

/** Bounding box of a point set. */
export function bounds(pts: readonly Vec2[]): { x: Vec2; y: Vec2 } {
  let [x0, x1, y0, y1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const [x, y] of pts) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  return { x: [x0, x1], y: [y0, y1] };
}

/** Polyline → SVG path data (1 decimal place keeps strings small). */
export function toPath(pts: readonly Vec2[], closed = false): string {
  const d = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join('');
  return closed ? `${d}Z` : d;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export const fmt = (n: number): string => n.toFixed(1);
