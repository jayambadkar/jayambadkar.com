import { profile } from '../data';
import { CltFigure } from './figures';
import styles from './Footer.module.css';

export interface FooterProps {
  onOpenTerminal: () => void;
}

export function Footer({ onOpenTerminal }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <CltFigure n={6} className={styles.figure} />
        <div className={styles.inner}>
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <button type="button" className={styles.egg} onClick={onOpenTerminal}>
            Press <kbd>`</kbd> for a terminal
          </button>
        </div>
      </div>
    </footer>
  );
}
