import type { ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { cx } from '../../lib/cx';
import styles from './Figure.module.css';

export interface FigureProps {
  /** Figure number shown in the caption ("Fig. n"). */
  n: number;
  /** Accessible description of the drawing. */
  label: string;
  /** One-line, mathematically accurate caption. */
  caption: ReactNode;
  width: number;
  height: number;
  className?: string | undefined;
  /** Caption alignment. */
  align?: 'start' | 'center';
  children: ReactNode;
}

/**
 * Shared frame for the hairline maths figures: draws its strokes in once it
 * scrolls into view (CSS transitions, so reduced motion shows them instantly).
 */
export function Figure({
  n,
  label,
  caption,
  width,
  height,
  className,
  align = 'start',
  children,
}: FigureProps) {
  const [ref, inView] = useInView<HTMLElement>('0px 0px -10% 0px');
  return (
    <figure ref={ref} className={cx(styles.figure, className)} data-inview={inView}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        preserveAspectRatio="xMidYMid meet"
      >
        {children}
      </svg>
      <figcaption className={styles.caption} data-align={align}>
        <em>Fig. {n}</em> {caption}
      </figcaption>
    </figure>
  );
}
