import { useEffect, useRef } from "react";
import { useDraggable } from "react-use-draggable-scroll";

const useScrollTabs = () => {
  // Used for make menu draggable
  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  // Drag by mouse wheel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let scrollAmount = 0;
    let isScrolling = false;

    const smoothScroll = () => {
      if (scrollAmount === 0) {
        isScrolling = false;
        return;
      }

      const step = scrollAmount * 0.05; // 5% each frame
      el.scrollLeft += step;
      scrollAmount -= step;

      requestAnimationFrame(smoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollAmount += e.deltaY;

        if (!isScrolling) {
          isScrolling = true;
          requestAnimationFrame(smoothScroll);
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Disable scrolling on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      // Restore scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);
  return { ref, events };
};

export default useScrollTabs;
