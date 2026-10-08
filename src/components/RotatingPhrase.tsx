import { useEffect, useState } from 'react';
import type { OutlookLine } from '../data';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './RotatingPhrase.module.css';

export interface RotatingPhraseProps {
  lines: readonly OutlookLine[];
  interval?: number;
}

/** "<lead> <phrase>" lines that slowly cross-fade. Static (first line) under reduced motion. */
export function RotatingPhrase({ lines, interval = 4200 }: RotatingPhraseProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || lines.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, interval);
    return () => {
      window.clearInterval(id);
    };
  }, [reducedMotion, lines.length, interval]);

  return (
    <div className={styles.root}>
      <p className="visually-hidden">{lines.map((l) => `${l.lead} ${l.phrase}.`).join(' ')}</p>
      <div className={styles.stage} aria-hidden="true">
        {lines.map((l, i) => (
          <p key={l.phrase} className={styles.line} data-active={i === index}>
            <span className={styles.lead}>{l.lead}</span>
            <span className={styles.phrase}>{l.phrase}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
