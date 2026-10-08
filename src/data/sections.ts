import type { Section } from './types';

/** Page order. Only `nav: true` sections appear in the header; all are in ⌘K. */
export const sections: readonly Section[] = [
  { id: 'home', label: 'Home', shortcut: 'G H' },
  { id: 'work', label: 'Work', shortcut: 'G W', nav: true },
  { id: 'about', label: 'About', shortcut: 'G A' },
  { id: 'blog', label: 'Blog', shortcut: 'G B', nav: true },
  { id: 'contact', label: 'Contact', shortcut: 'G C', nav: true },
];
