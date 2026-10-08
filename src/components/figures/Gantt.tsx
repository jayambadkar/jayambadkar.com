import type { CSSProperties } from 'react';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Operating Systems (COMP50004, compulsory Y2).
 * Round-robin scheduling, quantum 2, of four processes that all arrive at t = 0
 * (queue order P1..P4) with CPU bursts 5, 3, 4, 2. Hand-checked schedule:
 *   0–2 P1, 2–4 P2, 4–6 P3, 6–8 P4 (done), 8–10 P1, 10–11 P2 (done),
 *   11–13 P3 (done), 13–14 P1 (done).
 */
const W = 240;
const H = 170;
const LEFT = 30;
const RIGHT = 10;
const SLOTS = 14;
const SLOT_W = (W - LEFT - RIGHT) / SLOTS;
const ROW_H = 30;
const BAR_H = 14;
const TOP = 12;

interface Slice {
  p: number;
  start: number;
  end: number;
}

const SLICES: readonly Slice[] = [
  { p: 1, start: 0, end: 2 },
  { p: 2, start: 2, end: 4 },
  { p: 3, start: 4, end: 6 },
  { p: 4, start: 6, end: 8 },
  { p: 1, start: 8, end: 10 },
  { p: 2, start: 10, end: 11 },
  { p: 3, start: 11, end: 13 },
  { p: 1, start: 13, end: 14 },
];
const rowY = (p: number): number => TOP + (p - 1) * ROW_H;
const AXIS_Y = TOP + 4 * ROW_H - 4;

export function GanttFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Gantt chart of round-robin scheduling for four processes"
      caption={
        <>
          Operating Systems. Round-robin scheduling with quantum&nbsp;2: four processes, bursts 5,
          3, 4 and 2, all arriving at <i>t</i>&nbsp;=&nbsp;0.
        </>
      }
    >
      {[1, 2, 3, 4].map((p) => (
        <g key={p}>
          <line
            className={fig.guide}
            x1={LEFT}
            y1={rowY(p) + BAR_H / 2}
            x2={W - RIGHT}
            y2={rowY(p) + BAR_H / 2}
            style={{ strokeDasharray: '1 4' }}
          />
          <text className={fig.label} x={LEFT - 8} y={rowY(p) + BAR_H / 2 + 4} textAnchor="end">
            P{p}
          </text>
        </g>
      ))}
      <line className={fig.guide} x1={LEFT} y1={AXIS_Y} x2={W - RIGHT} y2={AXIS_Y} />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((t) => (
        <g key={t}>
          <line
            className={fig.guide}
            x1={LEFT + t * SLOT_W}
            y1={AXIS_Y}
            x2={LEFT + t * SLOT_W}
            y2={AXIS_Y + 4}
          />
          <text className={fig.label} x={LEFT + t * SLOT_W} y={AXIS_Y + 18} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {SLICES.map((s, i) => (
        <rect
          key={i}
          className={fig.draw ?? ''}
          x={LEFT + s.start * SLOT_W}
          y={rowY(s.p)}
          width={(s.end - s.start) * SLOT_W}
          height={BAR_H}
          fill="none"
          stroke="var(--fg)"
          strokeWidth={1.1}
          pathLength={1}
          style={{ '--delay': `${0.2 + s.start * 0.18}s`, '--dur': '0.9s' } as CSSProperties}
        />
      ))}
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={LEFT + 14 * SLOT_W}
        cy={rowY(1) + BAR_H / 2}
        r={3}
        style={{ '--delay': '3.2s' } as CSSProperties}
      />
    </Figure>
  );
}
