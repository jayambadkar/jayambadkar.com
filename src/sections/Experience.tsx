import { experience, type ExperienceKind } from '../data';
import { Reveal } from '../components/Reveal';
import styles from './Experience.module.css';

const GROUPS: readonly { kind: ExperienceKind; label: string }[] = [
  { kind: 'work', label: 'Work' },
  { kind: 'education', label: 'Education' },
  { kind: 'volunteering', label: 'Volunteering' },
];

/** "Path so far": work, education and volunteering, rendered inside About. */
export function PathSoFar() {
  return (
    <div className={styles.path}>
      <Reveal>
        <h3 className={styles.heading}>Path so far</h3>
      </Reveal>
      {GROUPS.map(({ kind, label }) => {
        const items = experience.filter((e) => e.kind === kind);
        if (items.length === 0) return null;
        return (
          <div key={kind} className={styles.group}>
            <Reveal>
              <p className={styles.groupLabel}>{label}</p>
            </Reveal>
            <ol className={styles.list}>
              {items.map((e, i) => (
                <Reveal as="li" key={e.id} delay={i * 50} className={styles.item}>
                  <div className={styles.when}>
                    <span>{e.period}</span>
                    {e.location ? <span>{e.location}</span> : null}
                  </div>
                  <div>
                    <h4 className={styles.org}>{e.organisation}</h4>
                    <p className={styles.role}>{e.role}</p>
                    <p className={styles.summary}>{e.summary}</p>
                    {e.highlights.length > 0 ? (
                      <ul className={styles.highlights}>
                        {e.highlights.map((h) => (
                          <li key={h}>{h}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
