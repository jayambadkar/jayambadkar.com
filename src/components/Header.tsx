import { profile, sections, type SectionId } from '../data';
import type { Theme } from '../hooks/useTheme';
import { useScrolled } from '../hooks/useScrolled';
import { cx } from '../lib/cx';
import { isMac, scrollToSection } from '../lib/scroll';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export interface HeaderProps {
  active: SectionId | undefined;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}

export function Header({ active, theme, onToggleTheme, onOpenPalette }: HeaderProps) {
  const scrolled = useScrolled();

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <div className={cx('container', styles.inner)}>
        <a
          href="/"
          className={styles.brand}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          aria-label={`${profile.name}, back to top`}
        >
          {profile.name}
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          <ul>
            {sections
              .filter((s) => s.id !== 'home')
              .map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cx(styles.link, active === s.id && styles.active)}
                    aria-current={active === s.id ? 'true' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(s.id);
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.paletteButton}
            onClick={onOpenPalette}
            aria-label="Open command palette"
            aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
          >
            <span className={styles.desktopLabel}>{isMac ? '⌘K' : 'Ctrl K'}</span>
            <span className={styles.mobileLabel}>Menu</span>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
