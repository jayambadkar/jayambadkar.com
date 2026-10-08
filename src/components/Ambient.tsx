import styles from './Ambient.module.css';

/**
 * Soft, slow-moving blurred colour washes (sage, dusty blue, apricot, rose)
 * behind the hero. Pure CSS; motion is disabled under prefers-reduced-motion.
 */
export function Ambient() {
  return (
    <div className={styles.ambient} aria-hidden="true">
      <span className={styles.sage} />
      <span className={styles.blue} />
      <span className={styles.apricot} />
      <span className={styles.rose} />
    </div>
  );
}
