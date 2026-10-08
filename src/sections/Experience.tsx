import { experience } from '../data';
import { PlaceholderBadge } from '../components/Badge';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <Section id="experience" index="03" label="Experience" title="Path so far">
      <ol className={styles.list}>
        {experience.map((e, i) => (
          <Reveal as="li" key={e.id} delay={i * 80} className={styles.item}>
            <div className={styles.when}>
              <span>
                {e.start} – {e.end ?? 'Present'}
              </span>
              {e.location ? <span>{e.location}</span> : null}
            </div>
            <div>
              <h3 className={styles.org}>
                {e.organisation}
                {e.placeholder ? <PlaceholderBadge /> : null}
              </h3>
              <p className={styles.role}>{e.role}</p>
              <p className={styles.summary}>{e.summary}</p>
              {e.highlights.length > 0 ? (
                <ul className={styles.highlights}>
                  {e.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
