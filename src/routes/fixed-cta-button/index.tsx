import { getLocalStorage, setLocalStorage } from '@/features/storage';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import styles from './fixed-cta-button.module.scss';

export const Route = createFileRoute('/fixed-cta-button/')({
  component: FixedCTAButton,
});

const LONG_CONTENT_KEY = 'cta-long-content';

/**
 * 윈도우 뷰포트의 위쪽과 아래쪽 빈 공간의 차이를 반환합니다.
 * @returns 위쪽 빈 공간과 아래쪽 빈 공간의 차이
 */
function getSignedViewportGap(): {
  topGap: number;
  bottomGap: number;
} {
  const vv = window.visualViewport;
  if (!vv) return { topGap: 0, bottomGap: 0 };

  // const keyboardHeight = window.innerHeight - vv.height;

  const topGap = vv.offsetTop; // 위쪽 빈 공간

  const bottomGap = window.innerHeight - vv.height; // 아래쪽 빈 공간

  return {
    topGap,
    bottomGap,
  };
}

function FixedCTAButton() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLongContent, setIsLongContent] = useState(getLocalStorage(LONG_CONTENT_KEY));
  const [information, setKeyboardOffset] = useState('');

  /**
   * 키보드 높이에 따라 CTA 버튼을 배치합니다.
   */
  useEffect(() => {
    const ctaElement = ctaRef.current;

    if (!ctaElement) {
      return;
    }

    let isKeyboardVisible = false;
    let hasScroll = false;

    function placeCTA(keyboardHeight = 0) {
      document.documentElement.style.setProperty('--kb-offset', `-${keyboardHeight}px`);
    }

    const { visualViewport } = window;

    // 키보드 높이 계산 및 CTA 위치 조정
    const handler = () => {
      if (!visualViewport) return;

      // 현재 스크롤 위치
      const scrollY = window.scrollY;

      // 뷰포트 위쪽과 아래쪽 빈 공간의 차이 (하단 빈공간이 더 크면 양수, 위쪽 빈공간이 더 크면 음수)
      const { topGap, bottomGap } = getSignedViewportGap();

      // real offsetTop
      const realOffsetTop = topGap < bottomGap ? topGap : bottomGap;

      // 키보드 높이
      const kbHeight = window.innerHeight - (visualViewport.height + realOffsetTop);

      // 키보드 높이
      // const kbHeight =
      //   viewportGap > visualViewport.offsetTop && visualViewport.offsetTop > 0
      //     ? window.innerHeight - visualViewport.height
      //     : window.innerHeight - (visualViewport.height + visualViewport.offsetTop);

      // 1. 스크롤이 있는 경우 키보드 높이를 조정 + 최소 0
      // 2. 스크롤이 없는 경우 키보드 높이에 스크롤 위치를 더함
      const bottomPosition = hasScroll ? Math.max(0, kbHeight) : kbHeight + scrollY;

      // 디버깅용 키보드 높이 출력
      setKeyboardOffset(
        `
         bottom: ${window.innerHeight} - (${visualViewport.height} + ${realOffsetTop}) = ${bottomPosition}
         * clientHeight: ${document.documentElement.clientHeight}
         * window.innerHeight: ${window.innerHeight}
         window.outerHeight: ${window.outerHeight}
         visualViewport.height: ${visualViewport.height}
         visualViewport.offsetTop: ${visualViewport.offsetTop}
         * vv.height + vv.offsetTop: ${visualViewport.height + visualViewport.offsetTop}
         scrollY: ${scrollY}
         scrollHeight: ${document.documentElement.scrollHeight}
         clientHeight + scrollY: ${document.documentElement.clientHeight + scrollY} 
         innerHeight + scrollY: ${window.innerHeight + scrollY}
         vv.height + scrollY: ${visualViewport.height + scrollY}
         vv.top(offsetTop): ${topGap}
         vv.bottom(window.innerHeight - vv.height): ${bottomGap}
         viewportGap: ${topGap + bottomGap}
         scroll gap: ${document.documentElement.scrollHeight - (window.innerHeight + scrollY)}  
        `.trim(),
      );

      if (!isKeyboardVisible) {
        return;
      }

      // 키보드 높이 조정 (키보드 높이가 0이면 스크롤 위치를 더하지 않음)
      placeCTA(bottomPosition);
    };

    if (visualViewport) {
      // 키보드 높이 조정 이벤트 추가
      visualViewport.addEventListener('resize', handler, { passive: true });

      // 스크롤시 키보드가 열려있다면 blur 처리하며 닫기
      visualViewport.addEventListener('scroll', handler, { passive: true });

      // 초기 키보드 높이 조정
      handler();
    }

    window.addEventListener('focusin', () => {
      hasScroll = document.documentElement.scrollHeight > window.innerHeight;
      isKeyboardVisible = true;
    });
    window.addEventListener('focusout', () => {
      placeCTA(0);
      isKeyboardVisible = false;
    });
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
            <hr />
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
        {/* 수치 정보 */}
        <div className={styles.info}>{information}</div>

        <button type="button" className={styles.button}>
          Submit
        </button>
      </div>
    </div>
  );
}
