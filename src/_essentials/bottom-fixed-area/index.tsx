/**
 * BottomFixedArea
 * ---------------
 * Keeps its children (typically a Call-To-Action button) visually pinned to the
 * bottom of the screen even while the on-screen keyboard is animating in or out.
 *
 * Rationale
 * ---------
 * Mobile browsers shrink the `visualViewport` when the virtual keyboard appears,
 * while `document.documentElement.clientHeight` stays constant. We listen to
 * `visualViewport.resize` / `scroll` and write the keyboard height into a CSS
 * custom property so the CTA can move with a cheap GPU transform.
 *
 * Edge cases covered
 * ------------------
 * • Page may or may not have a scrollbar before the keyboard.
 * • Safari URL-bar collapse introduces an extra “height gap”.
 * • Browsers fire `focusin` before the keyboard is fully visible, so some
 *   effects start after a 300 ms delay to avoid flicker.
 *
 * Written 2025-05-13 (KST) — keep for future maintainers 🙏
 */
import { ReactNode } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import styles from './bottom-fixed-area.module.scss';

interface Props {
  children: ReactNode;
  className?: string;
}

function BottomFixedArea({ children, className }: Props) {
  // DOM reference to the CTA container that we ultimately translate vertically
  const ctaRef = useRef<HTMLDivElement>(null);

  // Local UI state: hides the CTA briefly while the user scrolls or drags
  const [isHide, setIsHide] = useState(false);

  /**
   * Subscribe to viewport / keyboard / gesture events and keep the CTA
   * positioned exactly above the virtual keyboard.
   * Also adds a subtle fade-out while the user scrolls for better UX.
   */
  useEffect(() => {
    const ctaElement = ctaRef.current;
    const { visualViewport } = window;

    if (!ctaElement || !visualViewport) {
      return;
    }

    // Runtime flags --------------------------------------------------------------
    // * isKeyboardVisible — set to true on any focusin; resets on focusout.
    // * isKeyboardVisibleWithDelay — same, but only after a 300 ms delay so we
    //   know the keyboard finished its slide-in animation (prevents flicker).
    // * hasScroll — snapshot taken on focusin; tells us whether the document
    //   already had its own scrollbar *before* the keyboard showed up.
    let isKeyboardVisible = false;
    let isKeyboardVisibleWithDelay = false;
    let hasScroll = false;

    /**
     * placeCTA
     * --------
     * Writes the *negative* keyboard height into the `--kb-offset` custom
     * property so the CTA slides upward by exactly that amount.
     * Using `transform` offloads work to the GPU; 0 px restores original place.
     */
    const placeCTA = (keyboardHeight = 0) => {
      if (ctaRef.current) {
        ctaRef.current.style.transform = `translateY(calc(-${keyboardHeight || 0}px))`;
      }
    };

    /**
     * Recalculate the virtual-keyboard height and reposition the CTA.
     * Runs on every `visualViewport.resize` or `visualViewport.scroll`.
     */
    const viewportChangeHandler = () => {
      if (!visualViewport) return;

      // Current scrollY — relevant only when the page *was not* scrollable
      // before the keyboard; browsers then auto-pan the page upward.
      const scrollY = window.scrollY;

      // Gap caused by Safari URL-bar collapse; clamp to ≥ 0 to avoid negatives
      const heightGap = Math.max(0, document.documentElement.clientHeight - window.innerHeight);

      // Desired bottom position of the CTA ---------------------------------------
      // if hasScroll === true  → document was scrollable pre-keyboard
      //   visualViewport.offsetTop stays 0, but its height shrinks; subtract
      //   heightGap so URL-bar collapse isn’t counted twice.
      //
      // if hasScroll === false → document started *non-scrollable* and browser
      //   pans the page; visualViewport.offsetTop becomes positive, so we *add*
      //   scrollY to cancel out that pan.
      const bottomPosition = hasScroll
        ? window.innerHeight - (visualViewport.height + visualViewport.offsetTop - heightGap)
        : window.innerHeight - (visualViewport.height + visualViewport.offsetTop) + scrollY;

      // Don’t move CTA if keyboard isn’t visible yet
      if (!isKeyboardVisible) {
        return;
      }

      // Apply new offset (0 px means keyboard closed)
      placeCTA(bottomPosition);
    };

    // Subscribe with { passive:true } to avoid blocking scroll
    visualViewport?.addEventListener('resize', viewportChangeHandler, { passive: true });
    visualViewport?.addEventListener('scroll', viewportChangeHandler, { passive: true });

    // Initial placement
    viewportChangeHandler();

    // Delay timer — makes sure keyboard animation fully settles before we treat
    // it as “visible with delay”.
    let keyboardVisibleDelayTimer: number | null = null;

    // ────────────── Focus Handlers ──────────────
    // focusin = keyboard likely opening
    const focusinHandler = () => {
      hasScroll = document.documentElement.scrollHeight > window.innerHeight;
      isKeyboardVisible = true;

      if (keyboardVisibleDelayTimer) clearTimeout(keyboardVisibleDelayTimer);

      keyboardVisibleDelayTimer = setTimeout(() => {
        isKeyboardVisibleWithDelay = true;
      }, 500);

      // Re-position the CTA immediately after the keyboard is opened
      viewportChangeHandler();
    };

    // focusout = keyboard closing; restore CTA after one RAF to avoid racing
    // with the viewport resize event.
    const focusoutHandler = () => {
      // When the keyboard hides instantly (e.g. tapping non‑input areas) events can mix; defer the reset by one frame
      requestAnimationFrame(() => placeCTA(0));

      isKeyboardVisible = false;
      isKeyboardVisibleWithDelay = false;
      if (keyboardVisibleDelayTimer) clearTimeout(keyboardVisibleDelayTimer);
    };

    window.addEventListener('focusin', focusinHandler, { passive: true });
    window.addEventListener('focusout', focusoutHandler, { passive: true });

    // ────────────── Fade-out on gestures ──────────────
    // While typing, users often drag/scroll to peek at content obscured by the
    // keyboard.  We fade the CTA out during such gestures so it doesn’t block
    // what the user is actively looking at.
    let timer: number | null = null;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      isTouching = true;

      if (!isKeyboardVisibleWithDelay) return;
      if (timer) clearTimeout(timer);

      // Ignore taps *inside* the CTA → don’t hide when user wants to click it
      // Ignore taps on input elements → don’t hide when user wants to type
      if (ctaRef.current?.contains(e.target as Node) || e.target instanceof HTMLInputElement) {
        return;
      }

      // Start fade-out immediately on first movement frame
      setIsHide(true);
    };

    const handleTouchEnd = () => {
      isTouching = false;

      if (!isKeyboardVisibleWithDelay) return;
      if (timer) clearTimeout(timer);

      // Restore CTA after finger lifts (small delay prevents flicker)
      timer = setTimeout(() => setIsHide(false), 100);
    };

    const handleScroll = () => {
      if (!isKeyboardVisibleWithDelay) return;
      if (timer) clearTimeout(timer);

      // Continuous scroll → keep CTA hidden until scrolling pauses
      setIsHide(true);

      // Ignore scroll events while touching the screen
      if (isTouching) return;

      timer = setTimeout(() => setIsHide(false), 200);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ────────────── House-keeping ──────────────
    // Remove *all* listeners when component unmounts to prevent leaks.
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
    <div
      ref={ctaRef}
      className={[className, styles.bottom_fixed_area, isHide && styles.hide]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default BottomFixedArea;
