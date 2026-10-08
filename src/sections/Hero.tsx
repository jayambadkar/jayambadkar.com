import { profile, projects, socials } from '../data';
import { Ambient } from '../components/Ambient';
import { Icon } from '../components/Icon';
import { LimitCycle } from '../components/LimitCycle';
import { Marquee } from '../components/Marquee';
import { RotatingPhrase } from '../components/RotatingPhrase';
import { isMac, scrollToId, scrollToSection } from '../lib/scroll';
import styles from './Hero.module.css';

export interface HeroProps {
  onOpenPalette: () => void;
}

export function Hero({ onOpenPalette }: HeroProps) {
  const linkedin = socials.find((s) => s.id === 'linkedin');
  const github = socials.find((s) => s.id === 'github');

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title" tabIndex={-1}>
      <Ambient />

      <div className={`container ${styles.layout ?? ''}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            <span>{profile.descriptor}</span>
          </p>

          <h1 id="hero-title" className={styles.title}>
            {profile.tagline}
          </h1>

          <div className={styles.thinking}>
            <RotatingPhrase lines={profile.outlook} />
          </div>

          <p className={styles.credentials}>
            {profile.credentials.map((c, i) => (
              <span key={c} className={styles.credential}>
                {c}
                {i < profile.credentials.length - 1 ? (
                  <span className={styles.sep} aria-hidden="true">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </p>

          <div className={styles.links}>
            <a
              href="#work"
              className={`${styles.link ?? ''} ${styles.primary ?? ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('work');
              }}
            >
              Selected work
              <Icon name="arrow-right" size={14} />
            </a>
            {[linkedin, github].map((s) =>
              s ? (
                <a
                  key={s.id}
                  href={s.href}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                  <Icon name="arrow-up-right" size={14} />
                </a>
              ) : null,
            )}
          </div>
        </div>

        <LimitCycle className={styles.figure} />
      </div>

      <div className={`container ${styles.foot ?? ''}`}>
        <Marquee
          label="Index"
          items={projects.map((p) => ({
            id: p.id,
            node: (
              <a
                href={`#project-${p.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(`project-${p.id}`);
                }}
              >
                {p.title}
              </a>
            ),
          }))}
        />
        <button type="button" className={styles.hint} onClick={onOpenPalette}>
          <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd> <kbd>K</kbd>
        </button>
      </div>
    </section>
  );
}
