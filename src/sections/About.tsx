import { profile } from '../data';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import shared from './section.module.css';
import styles from './About.module.css';
import { cx } from '../lib/cx';

export function About() {
  const { education } = profile;
  return (
    <section id="about" className={shared.section} aria-labelledby="about-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading
          id="about-title"
          index="01 / about"
          title="Maths, code, and the bit in between."
        />
        <div className={styles.layout}>
          <Reveal className={styles.bio}>
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div className={cx(shared.card, styles.eduCard)}>
              <p className={styles.eduLabel}>Education</p>
              <h3 className={styles.eduTitle}>{education.institution}</h3>
              <p className={styles.eduCourse}>{education.course}</p>
              {education.period ? <p className={styles.eduPeriod}>{education.period}</p> : null}
              <ul className={styles.honours}>
                {education.honours.map((h) => (
                  <li key={h}>★ {h}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
