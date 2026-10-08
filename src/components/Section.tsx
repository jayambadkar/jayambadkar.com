import type { ReactNode } from 'react';
import type { SectionId } from '../data';
import { useInView } from '../hooks/useInView';
import { Reveal } from './Reveal';
import styles from './Section.module.css';

export interface SectionProps {
  id: SectionId;
  index: string;
  label: string;
  /** Optional serif heading; when omitted the label is the accessible heading. */
  title?: string;
  /** Optional short line under the title. */
  kicker?: ReactNode;
  /** Optional maths figure shown in the left column on wide screens. */
  figure?: ReactNode;
  children: ReactNode;
}

/**
 * Editorial two-column section: small label on the left, content on the right.
 * The top hairline draws itself in when the section scrolls into view.
 */
export function Section({ id, index, label, title, kicker, figure, children }: SectionProps) {
  const headingId = `${id}-title`;
  const [ref, inView] = useInView<HTMLElement>('0px 0px -15% 0px');
  return (
    <section
      ref={ref}
      id={id}
      className={styles.section}
      aria-labelledby={headingId}
      tabIndex={-1}
      data-inview={inView}
    >
      <div className={`container ${styles.grid ?? ''}`}>
        <span className={styles.rule} aria-hidden="true" />
        <div className={styles.side}>
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
          {figure ? <div className={styles.figure}>{figure}</div> : null}
        </div>
        <div className={styles.body}>
          {title ? (
            <Reveal className={styles.head}>
              <h2 id={headingId} className={styles.title}>
                {title}
              </h2>
              {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
            </Reveal>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
