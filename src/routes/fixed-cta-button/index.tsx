import { getLocalStorage, setLocalStorage } from '@/features/storage';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import styles from './fixed-cta-button.module.scss';

export const Route = createFileRoute('/fixed-cta-button/')({
  component: FixedCTAButton,
});

const LONG_CONTENT_KEY = 'cta-long-content';

function FixedCTAButton() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLongContent, setIsLongContent] = useState(getLocalStorage(LONG_CONTENT_KEY));
  /**
   * 키보드 높이에 따라 CTA 버튼을 배치합니다.
   */
  useEffect(() => {
    const ctaElement = ctaRef.current;

    if (!ctaElement) {
      return;
    }

    function placeCTA(keyboardHeight = 0) {
      document.documentElement.style.setProperty('--kb-offset', `${keyboardHeight}px`);
    }

    if (window.visualViewport) {
      const vv = window.visualViewport;

      const handler = () => {
        const kb = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));

        console.log(kb);

        placeCTA(kb);
      };

      ['resize', 'scroll'].forEach((e) => vv.addEventListener(e, handler, { passive: true }));

      handler();
    }

    // window.addEventListener('focusin', () => setTimeout(() => placeCTA(260), 0)); // 대략적인 평균 키보드 높이
    window.addEventListener('focusout', () => placeCTA(0));
  }, []);

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

      <div ref={ctaRef} className={styles.cta}>
        <button type="button" className={styles.button}>
          Submit
        </button>
      </div>
    </div>
  );
}
