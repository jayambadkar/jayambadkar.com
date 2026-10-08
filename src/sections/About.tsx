import { profile } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { LinearMapFigure } from '../components/figures';
import { PathSoFar } from './Experience';
import styles from './About.module.css';

export function About() {
  const [lead, ...rest] = profile.bio;
  return (
    <Section id="about" index="02" label="About" figure={<LinearMapFigure n={3} />}>
      <Reveal>
        <p className={styles.lead}>{lead}</p>
      </Reveal>
      <div className={styles.columns}>
        <Reveal className={styles.bio} delay={80}>
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <Reveal delay={160}>
          <dl className={styles.facts}>
            {profile.facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <PathSoFar />

      <Reveal className={styles.honoursBlock}>
        <h3 className={styles.subhead}>Honours &amp; certifications</h3>
        <ul className={styles.honours}>
          {profile.honours.map((h) => (
            <li key={h.title} className={styles.honour}>
              <span className={styles.honourYear}>{h.year}</span>
              <span className={styles.honourTitle}>
                {h.href ? (
                  <a href={h.href} target="_blank" rel="noopener noreferrer">
                    {h.title}
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                ) : (
                  h.title
                )}
              </span>
              <span className={styles.honourDetail}>{h.detail}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
