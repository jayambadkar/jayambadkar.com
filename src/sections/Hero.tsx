import { profile, socials } from '../data';
import { Ambient } from '../components/Ambient';
import { Icon } from '../components/Icon';
import { isMac, scrollToSection } from '../lib/scroll';
import styles from './Hero.module.css';

export interface HeroProps {
  onOpenPalette: () => void;
}

export function Hero({ onOpenPalette }: HeroProps) {
  const github = socials.find((s) => s.id === 'github');
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title" tabIndex={-1}>
      <Ambient />

      <div className={`container ${styles.content ?? ''}`}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line}>{first}</span>{' '}
          <span className={styles.line}>
            <em>{rest.join(' ')}</em>
          </span>
        </h1>

        <p className={styles.descriptor}>{profile.descriptor}.</p>

        <p className={styles.credentials}>
          {profile.credentials.map((c, i) => (
            <span key={c}>
              {i > 0 ? (
                <span className={styles.sep} aria-hidden="true">
                  ·
                </span>
              ) : null}
              {c}
            </span>
          ))}
        </p>

        <div className={styles.links}>
          <a
            href="#projects"
            className={styles.link}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('projects');
            }}
          >
            Projects
            <Icon name="arrow-right" size={14} />
          </a>
          {github ? (
            <a href={github.href} className={styles.link} target="_blank" rel="noopener noreferrer">
              GitHub
              <Icon name="arrow-up-right" size={14} />
            </a>
          ) : null}
        </div>
      </div>

      <div className={`container ${styles.foot ?? ''}`}>
        <span>Based in the {profile.location}</span>
        <button type="button" className={styles.hint} onClick={onOpenPalette}>
          Press <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd> <kbd>K</kbd> to navigate
        </button>
      </div>
    </section>
  );
}
