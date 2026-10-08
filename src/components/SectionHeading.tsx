import { Reveal } from './Reveal';
import styles from './SectionHeading.module.css';

export interface SectionHeadingProps {
  index: string;
  title: string;
  kicker?: string;
  id: string;
}

export function SectionHeading({ index, title, kicker, id }: SectionHeadingProps) {
  return (
    <Reveal className={styles.root}>
      <span className={styles.index} aria-hidden="true">
        {index}
      </span>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
    </Reveal>
  );
}
