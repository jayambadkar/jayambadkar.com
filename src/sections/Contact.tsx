import { profile, socials, type SocialLink } from '../data';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { Section } from '../components/Section';
import styles from './Contact.module.css';

export function Contact() {
  const links: SocialLink[] = [
    ...(profile.email
      ? [
          {
            id: 'email',
            label: 'Email',
            href: `mailto:${profile.email}`,
            handle: profile.email,
            icon: 'mail' as const,
          },
        ]
      : []),
    ...socials,
  ];

  return (
    <Section id="contact" index="04" label="Contact" title="Get in touch">
      <Reveal>
        <p className={styles.intro}>
          For interesting problems, opportunities, or a conversation about maths and software,
          I&apos;m easiest to reach on the platforms below.
        </p>
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
