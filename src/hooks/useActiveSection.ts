import { useEffect, useState } from 'react';
import type { SectionId } from '../data';

/** Tracks which section is currently most in view (for nav highlighting). */
export function useActiveSection(ids: readonly SectionId[]): SectionId | undefined {
  const [active, setActive] = useState<SectionId | undefined>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top) setActive(top.target.id as SectionId);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => {
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
    };
  }, [ids]);

  return active;
}
