import BottomFixedArea from '@/_essentials/bottom-fixed-area';
import { getLocalStorage, setLocalStorage } from '@/features/storage';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import styles from './fixed-cta-button.module.scss';

export const Route = createFileRoute('/fixed-cta-button/')({
  component: FixedCTAButton,
});

const LONG_CONTENT_KEY = 'cta-long-content';

function FixedCTAButton() {
  // For example
  const [isLongContent, setIsLongContent] = useState(getLocalStorage(LONG_CONTENT_KEY));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fixed CTA Button</h1>
      <p className={styles.description}>
        This is a simple example of a fixed CTA button that is positioned above the keyboard on
        mobile devices.
      </p>

      <button
        type="button"
        className={styles.link}
        onClick={() => {
          setLocalStorage(LONG_CONTENT_KEY, !isLongContent);
          setIsLongContent(!isLongContent);
        }}
      >
        Toggle long content
      </button>

      <input type="text" className={styles.input} />

      {isLongContent && (
        <div className={styles.long_content}>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
          </p>
        </div>
      )}

      <BottomFixedArea className={styles.cta}>
        <button type="button" className={styles.button} onClick={() => alert('submit')}>
          Submit
        </button>
      </BottomFixedArea>
    </div>
  );
}
