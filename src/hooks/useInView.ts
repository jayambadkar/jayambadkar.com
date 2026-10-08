import { useEffect, useRef, useState, type RefObject } from 'react';

/** Becomes `true` (once) when the element first scrolls into view. */
export function useInView<T extends Element>(
  rootMargin = '0px 0px -10% 0px',
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return [ref, inView];
}
