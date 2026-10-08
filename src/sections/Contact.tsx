import { profile, socials } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { cx } from '../lib/cx';
import shared from './section.module.css';
import styles from './Contact.module.css';

export function Contact() {
  return (
    <section id="contact" className={shared.section} aria-labelledby="contact-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading
          id="contact-title"
          index="04 / contact"
          title="Say hello."
          kicker="Interesting problem, opportunity, or just want to chat maths and software? Reach out."
        />
        <div className={styles.grid}>
          {socials.map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(shared.card, styles.link)}
              >
                <span className={styles.icon}>
                  <Icon name={s.icon} size={22} />
                </span>
                <span className={styles.text}>
                  <span className={styles.label}>{s.label}</span>
                  <span className={styles.handle}>{s.handle}</span>
                </span>
                <Icon name="arrow-up-right" size={18} className={styles.arrow} />
              </a>
            </Reveal>
          ))}
          {profile.email ? (
            <Reveal delay={socials.length * 80}>
              <a href={`mailto:${profile.email}`} className={cx(shared.card, styles.link)}>
                <span className={styles.icon}>
                  <Icon name="mail" size={22} />
                </span>
                <span className={styles.text}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.handle}>{profile.email}</span>
                </span>
                <Icon name="arrow-up-right" size={18} className={styles.arrow} />
              </a>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
