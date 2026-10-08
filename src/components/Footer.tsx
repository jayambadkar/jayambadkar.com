import { profile } from '../data';
import styles from './Footer.module.css';

export interface FooterProps {
  onOpenTerminal: () => void;
}

export function Footer({ onOpenTerminal }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner ?? ''}`}>
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React + TypeScript.
        </p>
        <button type="button" className={styles.egg} onClick={onOpenTerminal}>
          <span aria-hidden="true">&gt;_</span> psst, press <kbd>`</kbd> for a terminal
        </button>
      </div>
    </footer>
  );
}
