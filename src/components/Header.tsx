import { profile, sections, type SectionId } from '../data';
import type { Theme } from '../hooks/useTheme';
import { cx } from '../lib/cx';
import { isMac, scrollToSection } from '../lib/scroll';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

export interface HeaderProps {
  active: SectionId | undefined;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenPalette: () => void;
}

export function Header({ active, theme, onToggleTheme, onOpenPalette }: HeaderProps) {
  return (
    <header className={styles.header}>
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
          <span className={styles.logo} aria-hidden="true">
            {profile.initials}
          </span>
          <span className={styles.brandName}>{profile.name}</span>
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
            <Icon name="search" size={16} />
            <span className={styles.desktopLabel}>Search</span>
            <span className={styles.mobileLabel}>Menu</span>
            <kbd className={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
