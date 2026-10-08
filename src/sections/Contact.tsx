import { profile, socials, type SocialLink } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import { RoseFigure } from '../components/figures';
import styles from './Contact.module.css';

export function Contact() {
  const links: readonly SocialLink[] = socials;

  return (
    <Section
      id="contact"
      index="04"
      label="Contact"
      title="Get in touch"
      figure={<RoseFigure n={5} />}
    >
      <Reveal>
        <p className={styles.intro}>{profile.contactLine}</p>
      </Reveal>
      <ul className={styles.list}>
        {links.map((s, i) => (
          <Reveal as="li" key={s.id} delay={i * 60}>
            <a
              href={s.href}
              className={styles.link}
              {...(s.href.startsWith('mailto:')
                ? {}
                : { target: '_blank', rel: 'noopener noreferrer' })}
            >
              <span className={styles.label}>{s.label}</span>
              <span className={styles.handle}>{s.handle}</span>
              <Icon name="arrow-up-right" size={16} className={styles.arrow} />
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
