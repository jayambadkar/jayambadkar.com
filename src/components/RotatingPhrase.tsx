import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './RotatingPhrase.module.css';

export interface RotatingPhraseProps {
  label: string;
  phrases: readonly string[];
  interval?: number;
}

/** "Thinking about <phrase>" with a slow cross-fade between phrases. */
export function RotatingPhrase({ label, phrases, interval = 3600 }: RotatingPhraseProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || phrases.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => {
      window.clearInterval(id);
    };
  }, [reducedMotion, phrases.length, interval]);

  return (
    <p className={styles.root}>
      <span className={styles.label}>{label}</span>
      <span className="visually-hidden">{phrases.join('; ')}</span>
      <span className={styles.stage} aria-hidden="true">
        {phrases.map((p, i) => (
          <span key={p} className={styles.phrase} data-active={i === index}>
            {p}
          </span>
        ))}
      </span>
    </p>
  );
}
