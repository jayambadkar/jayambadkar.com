import { useEffect, useState } from 'react';
import styles from './RotatingText.module.css';

export interface RotatingTextProps {
  phrases: readonly string[];
  reducedMotion: boolean;
  /** ms to hold each fully-typed phrase */
  hold?: number;
}

/** Typewriter that cycles through phrases. Static (first phrase) under reduced motion. */
export function RotatingText({ phrases, reducedMotion, hold = 1800 }: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = phrases[index % Math.max(phrases.length, 1)] ?? '';

  useEffect(() => {
    if (reducedMotion || phrases.length === 0) return;
    let timeout: number;
    if (!deleting && length < phrase.length) {
      timeout = window.setTimeout(() => {
        setLength((l) => l + 1);
      }, 55);
    } else if (!deleting && length === phrase.length) {
      timeout = window.setTimeout(() => {
        setDeleting(true);
      }, hold);
    } else if (deleting && length > 0) {
      timeout = window.setTimeout(() => {
        setLength((l) => l - 1);
      }, 28);
    } else {
      timeout = window.setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      }, 250);
    }
    return () => {
      window.clearTimeout(timeout);
    };
  }, [deleting, length, phrase, phrases.length, hold, reducedMotion]);

  if (reducedMotion) {
    return <span className={styles.root}>{phrases.join(' · ')}</span>;
  }

  return (
    <span className={styles.root}>
      {/* Screen readers get the full list once rather than a stream of characters. */}
      <span className="visually-hidden">{phrases.join(', ')}</span>
      <span aria-hidden="true">
        {phrase.slice(0, length)}
        <span className={styles.caret} />
      </span>
    </span>
  );
}
