import type { ReactNode } from 'react';
import type { SectionId } from '../data';
import { Reveal } from './Reveal';
import styles from './Section.module.css';

export interface SectionProps {
  id: SectionId;
  index: string;
  label: string;
  /** Optional serif heading; when omitted the label is the accessible heading. */
  title?: string;
  children: ReactNode;
}

/** Editorial two-column section: small label on the left, content on the right. */
export function Section({ id, index, label, title, children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} className={styles.section} aria-labelledby={headingId} tabIndex={-1}>
      <div className={`container ${styles.grid ?? ''}`}>
        <Reveal className={styles.aside}>
          <span className={styles.index}>{index}</span>
          {title ? (
            <span className={styles.label}>{label}</span>
          ) : (
            <h2 id={headingId} className={styles.label}>
              {label}
            </h2>
          )}
        </Reveal>
        <div className={styles.body}>
          {title ? (
            <Reveal>
              <h2 id={headingId} className={styles.title}>
                {title}
              </h2>
            </Reveal>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
