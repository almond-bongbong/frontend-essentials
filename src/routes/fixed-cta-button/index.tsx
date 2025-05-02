import { createFileRoute } from '@tanstack/react-router';
import styles from './fixed-cta-button.module.scss';

export const Route = createFileRoute('/fixed-cta-button/')({
  component: FixedCTAButton,
});

function FixedCTAButton() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fixed CTA Button</h1>
      <p className={styles.description}>
        This is a simple example of a fixed CTA button that is positioned above the keyboard on
        mobile devices.
      </p>

      <input type="text" className={styles.input} />

      <button type="button" className={styles.button}>
        Submit
      </button>
    </div>
  );
}
