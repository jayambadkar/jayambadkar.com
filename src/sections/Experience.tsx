import { experience } from '../data';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import shared from './section.module.css';
import styles from './Experience.module.css';

export function Experience() {
  return (
    <section
      id="experience"
      className={shared.section}
      aria-labelledby="experience-title"
      tabIndex={-1}
    >
      <div className="container">
        <SectionHeading id="experience-title" index="03 / experience" title="Where I've been." />
        <ol className={styles.timeline}>
          {experience.map((e, i) => (
            <Reveal as="li" key={e.id} delay={i * 80} className={styles.item}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.meta}>
                <span>
                  {e.start} – {e.end ?? 'present'}
                </span>
                {e.location ? <span>{e.location}</span> : null}
              </div>
              <div className={styles.body}>
                <h3 className={styles.title}>
                  {e.organisation}
                  {e.placeholder ? (
                    <span className={shared.placeholderBadge}>placeholder</span>
                  ) : null}
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
      </div>
    </section>
  );
}
