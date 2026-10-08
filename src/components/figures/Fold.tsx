import type { CSSProperties } from 'react';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Computing Practical 1 (COMP40009, core Y1) — functional programming in Haskell.
 * Evaluation tree of foldr (+) 0 [1,2,3,4].
 *   foldr f z (x:xs) = f x (foldr f z xs)
 * so the tree is right-associated: 1 + (2 + (3 + (4 + 0))).
 */
const W = 240;
const H = 250;

interface Box {
  label: string;
  x: number;
  y: number;
  leaf?: boolean;
}

// Root at top; each + takes a leaf on the left and a sub-fold on the right.
const BOXES: readonly Box[] = [
  { label: '+', x: 120, y: 28 },
  { label: '1', x: 48, y: 78, leaf: true },
  { label: '+', x: 160, y: 78 },
  { label: '2', x: 100, y: 128, leaf: true },
  { label: '+', x: 190, y: 128 },
  { label: '3', x: 140, y: 178, leaf: true },
  { label: '+', x: 210, y: 178 },
  { label: '4', x: 170, y: 228, leaf: true },
  { label: '0', x: 220, y: 228, leaf: true },
];
const LINKS: readonly [number, number][] = [
  [0, 1],
  [0, 2],
  [2, 3],
  [2, 4],
  [4, 5],
  [4, 6],
  [6, 7],
  [6, 8],
];

const SEGMENTS = LINKS.flatMap(([a, b]) => {
  const p = BOXES[a];
  const q = BOXES[b];
  return p && q ? [{ p, q }] : [];
});
const ROOT = BOXES[0] ?? { label: '', x: 0, y: 0 };

export function FoldFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Evaluation tree of foldr (+) 0 over the list 1,2,3,4"
      caption={
        <>
          Computing Practical 1, Haskell. <span className={fig.nowrap}>foldr (+) 0 [1,2,3,4]</span>{' '}
          unfolds to <span className={fig.nowrap}>1 + (2 + (3 + (4 + 0)))</span>.
        </>
      }
    >
      {SEGMENTS.map(({ p, q }, i) => {
        return (
          <line
            key={i}
            className={`${fig.trace} ${fig.draw ?? ''}`}
            x1={p.x}
            y1={p.y + 10}
            x2={q.x}
            y2={q.y - 10}
            pathLength={1}
            style={{ '--delay': `${0.1 + i * 0.12}s`, '--dur': '1.4s' } as CSSProperties}
          />
        );
      })}
      {BOXES.map((b, i) => (
        <g key={i}>
          <circle
            cx={b.x}
            cy={b.y}
            r={b.leaf ? 11 : 13}
            fill="var(--bg)"
            stroke={b.leaf ? 'var(--fg-muted)' : 'var(--fg)'}
            strokeWidth={b.leaf ? 0.9 : 1.2}
            className={fig.draw ?? ''}
            pathLength={1}
            style={{ '--delay': `${0.8 + i * 0.1}s`, '--dur': '1.2s' } as CSSProperties}
          />
          <text
            className={fig.label}
            x={b.x}
            y={b.y + 4}
            textAnchor="middle"
            style={{ fill: 'var(--fg)', fontStyle: b.leaf ? 'normal' : 'italic', fontSize: 16 }}
          >
            {b.label}
          </text>
        </g>
      ))}
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={ROOT.x}
        cy={ROOT.y - 20}
        r={3}
        style={{ '--delay': '2.6s' } as CSSProperties}
      />
    </Figure>
  );
}
