import type { ReactNode } from 'react';
import styles from './Marquee.module.css';

export interface MarqueeProps {
  label: string;
  items: readonly { id: string; node: ReactNode }[];
}

/** Slow, pausable horizontal index. Static under reduced motion. */
export function Marquee({ label, items }: MarqueeProps) {
  const renderTrack = (hidden: boolean) => (
    <ul className={styles.track} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          {hidden ? <span>{item.node}</span> : item.node}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquee}>
      <span className={styles.label}>{label}</span>
      <div className={styles.viewport}>
        <div className={styles.rail}>
          {renderTrack(false)}
          {renderTrack(true)}
        </div>
      </div>
    </div>
  );
}
