import { ReactNode } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import styles from './bottom-fixed-area.module.scss';

interface Props {
  children: ReactNode;
}

function BottomFixedArea({ children }: Props) {
  // CTA 영역 ref
  const ctaRef = useRef<HTMLDivElement>(null);

  // 스크롤시 영역 fade out을 위한 상태
  const [isHide, setIsHide] = useState(false);

  /**
   * 키보드 높이에 따라 CTA 버튼을 배치합니다.
   */
  useEffect(() => {
    const ctaElement = ctaRef.current;
    const { visualViewport } = window;

    if (!ctaElement || !visualViewport) {
      return;
    }

    let isKeyboardVisible = false;
    let isKeyboardVisibleWithDelay = false;
    let hasScroll = false;

    const placeCTA = (keyboardHeight = 0) => {
      document.documentElement.style.setProperty('--kb-offset', `-${keyboardHeight}px`);
    };

    /**
     * 키보드 높이 계산 및 CTA 위치 조정
     */
    const viewportChangeHandler = () => {
      if (!visualViewport) return;

      // 현재 스크롤 위치
      const scrollY = window.scrollY;

      // height gap (최소 0)
      const heightGap = Math.max(0, document.documentElement.clientHeight - window.innerHeight);

      // 영역 bottom 위치
      const bottomPosition = hasScroll
        ? window.innerHeight - (visualViewport.height + visualViewport.offsetTop - heightGap)
        : window.innerHeight - (visualViewport.height + visualViewport.offsetTop) + scrollY;

      if (!isKeyboardVisible) {
        return;
      }

      // 키보드 높이 조정 (키보드 높이가 0이면 스크롤 위치를 더하지 않음)
      placeCTA(bottomPosition);
    };

    visualViewport?.addEventListener('resize', viewportChangeHandler, { passive: true });
    visualViewport?.addEventListener('scroll', viewportChangeHandler, { passive: true });

    // 초기 키보드 높이 조정
    viewportChangeHandler();

    /**
     * 키보드 열림/닫힘 상태 관리 이벤트
     */
    let keyboardVisibleDelayTimer: number | null = null;

    const focusinHandler = () => {
      hasScroll = document.documentElement.scrollHeight > window.innerHeight;
      isKeyboardVisible = true;

      if (keyboardVisibleDelayTimer) clearTimeout(keyboardVisibleDelayTimer);

      keyboardVisibleDelayTimer = setTimeout(() => {
        isKeyboardVisibleWithDelay = true;
      }, 300);
    };
    const focusoutHandler = () => {
      // 즉시 높이가 조정되는 경우는 클릭,터치가 되지 않아 한프레임 뒤 높이 조정
      requestAnimationFrame(() => placeCTA(0));

      isKeyboardVisible = false;
      isKeyboardVisibleWithDelay = false;
      if (keyboardVisibleDelayTimer) clearTimeout(keyboardVisibleDelayTimer);
    };

    window.addEventListener('focusin', focusinHandler);
    window.addEventListener('focusout', focusoutHandler);

    /**
     * 터치, 스크롤시 영역 fade out
     */
    let timer: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      if (!isKeyboardVisibleWithDelay || !isKeyboardVisible) return;
      if (timer) clearTimeout(timer);

      // CTA 영역 내부 element 터치시 hide 처리하지 않음
      if (ctaRef.current?.contains(e.target as Node)) {
        return;
      }

      setIsHide(true);
    };
    const handleTouchEnd = () => {
      if (!isKeyboardVisibleWithDelay || !isKeyboardVisible) return;
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setIsHide(false);
      }, 300);
    };
    const handleScroll = () => {
      if (!isKeyboardVisibleWithDelay || !isKeyboardVisible) return;
      if (timer) clearTimeout(timer);

      setIsHide(true);

      timer = setTimeout(() => {
        setIsHide(false);
      }, 200);
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      visualViewport?.removeEventListener('resize', viewportChangeHandler);
      visualViewport?.removeEventListener('scroll', viewportChangeHandler);
      window.removeEventListener('focusin', focusinHandler);
      window.removeEventListener('focusout', focusoutHandler);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={ctaRef} className={[styles.bottom_fixed_area, isHide && styles.hide].join(' ')}>
      {children}
    </div>
  );
}

export default BottomFixedArea;
