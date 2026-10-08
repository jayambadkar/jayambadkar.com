import styles from './Badge.module.css';

/** Small, muted pill used to flag placeholder content. */
export function PlaceholderBadge() {
  return (
    <span className={styles.badge} title="Placeholder content, to be replaced">
      Placeholder
    </span>
  );
}
