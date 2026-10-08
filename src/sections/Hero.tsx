import { profile, socials } from '../data';
import type { Theme } from '../hooks/useTheme';
import { Icon } from '../components/Icon';
import { ParticleField } from '../components/ParticleField';
import { RotatingText } from '../components/RotatingText';
import { isMac, scrollToSection } from '../lib/scroll';
import styles from './Hero.module.css';

export interface HeroProps {
  theme: Theme;
  reducedMotion: boolean;
  onOpenPalette: () => void;
}

export function Hero({ theme, reducedMotion, onOpenPalette }: HeroProps) {
  const github = socials.find((s) => s.id === 'github');

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title" tabIndex={-1}>
      <div className={styles.grid} aria-hidden="true" />
      <ParticleField theme={theme} reducedMotion={reducedMotion} />
      <div className={styles.glow} aria-hidden="true" />

      <div className={`container ${styles.content ?? ''}`}>
        <p className={styles.eyebrow}>
          <span className={styles.pulse} aria-hidden="true" />
          Based in the {profile.location}
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.hello}>Hi, I&apos;m</span>
          <span className="gradient-text">{profile.name}</span>
        </h1>

        <p className={styles.roles}>
          <span className={styles.chevron} aria-hidden="true">
            &gt;
          </span>{' '}
          <RotatingText phrases={profile.roles} reducedMotion={reducedMotion} />
        </p>

        <p className={styles.headline}>{profile.headline}</p>

        <ul className={styles.badges} aria-label="Highlights">
          {profile.highlights.map((h) => (
            <li key={h.title} className={styles.badge}>
              <strong>{h.title}</strong>
              <span>{h.detail}</span>
            </li>
          ))}
        </ul>

        <div className={styles.ctas}>
          <a
            href="#projects"
            className={styles.primary}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('projects');
            }}
          >
            See what I&apos;ve built <Icon name="arrow-right" size={16} />
          </a>
          {github ? (
            <a
              href={github.href}
              className={styles.secondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" size={16} /> GitHub
            </a>
          ) : null}
          <button type="button" className={styles.ghost} onClick={onOpenPalette}>
            <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd> <kbd>K</kbd>
            <span>to explore</span>
          </button>
        </div>
      </div>

      <p className={styles.formula} aria-hidden="true">
        θ(x, y, t) = π · (sin(kx + t) + cos(ky − 1.3t))
      </p>

      <a
        href="#about"
        className={styles.scrollCue}
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('about');
        }}
        aria-label="Scroll to About"
      >
        <Icon name="chevron-down" size={20} />
      </a>
    </section>
  );
}
