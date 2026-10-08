import type { CSSProperties } from 'react';
import { Figure } from './Figure';
import fig from './Figure.module.css';

/**
 * Graphs and Algorithms (COMP40008, core Y1).
 * Dijkstra’s single-source shortest paths on a small weighted digraph.
 * Edge weights and the solid path are the unique shortest path from s to t.
 */
const W = 240;
const H = 220;

interface Node {
  id: string;
  x: number;
  y: number;
}
interface Edge {
  from: string;
  to: string;
  w: number;
  onPath?: boolean;
}

const NODES: readonly Node[] = [
  { id: 's', x: 28, y: 110 },
  { id: 'a', x: 100, y: 40 },
  { id: 'b', x: 100, y: 180 },
  { id: 'c', x: 168, y: 110 },
  { id: 't', x: 220, y: 110 },
];
const EDGES: readonly Edge[] = [
  { from: 's', to: 'a', w: 2, onPath: true },
  { from: 's', to: 'b', w: 5 },
  { from: 'a', to: 'b', w: 1 },
  { from: 'a', to: 'c', w: 3, onPath: true },
  { from: 'b', to: 'c', w: 3 },
  { from: 'b', to: 't', w: 6 },
  { from: 'c', to: 't', w: 2, onPath: true },
];
// Shortest s→t: s→a→c→t = 2+3+2 = 7. Others: s→a→b→c→t = 8, s→a→b→t = 9,
// s→b→c→t = 10, s→b→t = 11. So the shortest path is unique.

const byIdMap = new Map(NODES.map((n) => [n.id, n]));
function node(id: string): Node {
  const n = byIdMap.get(id);
  if (!n) throw new Error(`unknown node ${id}`);
  return n;
}
const TARGET = node('t');

function edgeGeom(e: Edge): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  mx: number;
  my: number;
} {
  const a = node(e.from);
  const b = node(e.to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // Leave room for the node discs.
  const x1 = a.x + ux * 14;
  const y1 = a.y + uy * 14;
  const x2 = b.x - ux * 14;
  const y2 = b.y - uy * 14;
  return { x1, y1, x2, y2, mx: (x1 + x2) / 2 - uy * 8, my: (y1 + y2) / 2 + ux * 8 };
}

export function DijkstraFigure({ n, className }: { n: number; className?: string | undefined }) {
  return (
    <Figure
      n={n}
      className={className}
      width={W}
      height={H}
      label="Dijkstra's algorithm: a weighted digraph with its unique shortest path from s to t highlighted"
      caption={
        <>
          Graphs and Algorithms. Dijkstra’s algorithm: the solid trail is the unique shortest path
          from <i>s</i> to <i>t</i> (length 7).
        </>
      }
    >
      {EDGES.map((e, i) => {
        const g = edgeGeom(e);
        return (
          <g key={`${e.from}-${e.to}`}>
            <line
              className={`${e.onPath ? fig.main : fig.trace} ${fig.draw ?? ''}`}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              pathLength={1}
              markerEnd={e.onPath ? 'url(#arrow-main)' : 'url(#arrow-trace)'}
              style={
                {
                  '--delay': `${0.15 + i * 0.18}s`,
                  '--dur': '1.6s',
                  strokeWidth: e.onPath ? 1.4 : 0.85,
                  opacity: e.onPath ? 1 : 0.45,
                } as CSSProperties
              }
            />
            <text className={fig.label} x={g.mx} y={g.my} textAnchor="middle">
              {e.w}
            </text>
          </g>
        );
      })}
      <defs>
        <marker
          id="arrow-main"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg)" />
        </marker>
        <marker
          id="arrow-trace"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-muted)" opacity="0.5" />
        </marker>
      </defs>
      {NODES.map((node, i) => (
        <g key={node.id}>
          <circle
            className={fig.draw}
            cx={node.x}
            cy={node.y}
            r={12}
            fill="var(--bg)"
            stroke="var(--fg)"
            strokeWidth={1.1}
            pathLength={1}
            style={{ '--delay': `${1.4 + i * 0.12}s`, '--dur': '1.2s' } as CSSProperties}
          />
          <text
            className={fig.label}
            x={node.x}
            y={node.y + 4}
            textAnchor="middle"
            style={{ fill: 'var(--fg)', fontStyle: 'italic', fontSize: 17 }}
          >
            {node.id}
          </text>
        </g>
      ))}
      <circle
        className={`${fig.dot ?? ''} ${fig.fade ?? ''}`}
        cx={TARGET.x}
        cy={TARGET.y - 19}
        r={3}
        style={{ '--delay': '2.8s' } as CSSProperties}
      />
    </Figure>
  );
}
