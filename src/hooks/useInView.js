import { useCallback, useRef, useState } from 'react';

export function useInView({ threshold = 0.1, triggerOnce = true } = {}) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (triggerOnce) observer.unobserve(node);
          } else if (!triggerOnce) {
            setInView(false);
          }
        },
        { threshold },
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold, triggerOnce],
  );

  return [ref, inView];
}
