import { profile } from '../data';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import styles from './About.module.css';

export function About() {
  const [lead, ...rest] = profile.bio;
  return (
    <Section id="about" index="01" label="About">
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
    </Section>
  );
}
