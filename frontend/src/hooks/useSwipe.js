import { useEffect, useRef } from "react";

export default function useSwipe({ onSwipeRight, onSwipeLeft, threshold = 60 }) {
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const onTouchStart = (e) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      const dy = e.changedTouches[0].clientY - startY.current;

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx > 0 && onSwipeRight) onSwipeRight();
        if (dx < 0 && onSwipeLeft) onSwipeLeft();
      }
      startX.current = null;
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, threshold]);
}
