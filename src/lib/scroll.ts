import type { SectionId } from '../data';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Smoothly scroll to a section (instantly if the user prefers reduced motion). */
export function scrollToSection(id: SectionId): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id === 'home' ? '/' : `#${id}`);
  // Move focus for keyboard and screen-reader users without re-scrolling.
  el.focus({ preventScroll: true });
}

export function openExternal(href: string): void {
  window.open(href, '_blank', 'noopener,noreferrer');
}

export const isMac: boolean =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

/** Smoothly scroll to any element id (e.g. a project row). */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
}
