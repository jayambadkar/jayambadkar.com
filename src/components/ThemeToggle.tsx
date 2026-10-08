import type { Theme } from '../hooks/useTheme';
import { Icon } from './Icon';
import styles from './ThemeToggle.module.css';

export interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className={styles.icon} data-active={theme === 'dark'}>
        <Icon name="moon" />
      </span>
      <span className={styles.icon} data-active={theme === 'light'}>
        <Icon name="sun" />
      </span>
    </button>
  );
}
