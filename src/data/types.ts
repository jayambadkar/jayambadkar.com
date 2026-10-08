/**
 * Content model for the site. Everything rendered on the page comes from typed
 * data in `src/data`, so content can be updated without touching components.
 *
 * Sources: Jay's CV (Aug 2026), his GitHub, his blog (jayambadkar.github.io)
 * and arXiv. Only verifiable facts go here.
 */

export type SectionId = 'home' | 'work' | 'about' | 'blog' | 'contact';

export interface Section {
  id: SectionId;
  label: string;
  /** Keyboard hint shown in the command palette. */
  shortcut?: string;
  /** Show in the header nav (kept short on purpose). */
  nav?: boolean;
}

export type IconName = 'github' | 'x' | 'linkedin' | 'mail' | 'globe' | 'file' | 'pen';

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** Short display handle, e.g. "@JayAmbadkar". */
  handle: string;
  icon: IconName;
}

export interface Fact {
  /** Small label, e.g. "Previously". */
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  firstName: string;
  initials: string;
  location: string;
  /** The hero headline, set large in the serif. */
  tagline: string;
  /** One-line descriptor (eyebrow above the tagline). */
  descriptor: string;
  /** Rotating lines in the hero, taken from Jay's LinkedIn About. */
  outlook: OutlookLine[];
  /** Short credential line in the hero, joined with " · ". */
  credentials: string[];
  /** Bio paragraphs for the About section; the first is set as a large lead. */
  bio: string[];
  /** "At a glance" facts in the About section. */
  facts: Fact[];
  /** Honours, awards and certifications. */
  honours: Honour[];
  /** Closing line for the Contact section (Jay's own words). */
  contactLine: string;
}

export interface OutlookLine {
  /** Small lead-in, e.g. "Interested in". */
  lead: string;
  /** His phrase, e.g. "all things maths, tech and revolutionary". */
  phrase: string;
}

export interface Honour {
  title: string;
  detail: string;
  /** e.g. "2025" */
  year: string;
  href?: string;
}

export interface LinkRef {
  label: string;
  href: string;
}

export type ProjectKind = 'research' | 'project' | 'coursework';

export interface Project {
  id: string;
  title: string;
  summary: string;
  /** Short distinction, e.g. "DevCon2 Fellowship winner". */
  note?: string;
  kind: ProjectKind;
  tags: string[];
  /** Display period, e.g. "2025" or "2025–26". */
  year: string;
  links: LinkRef[];
}

export type ExperienceKind = 'work' | 'education' | 'volunteering';

export interface Experience {
  id: string;
  kind: ExperienceKind;
  organisation: string;
  role: string;
  /** Free-form display period, e.g. "Jul – Sep 2025". */
  period: string;
  location?: string;
  summary: string;
  highlights: string[];
  tech?: string[];
}

export interface Post {
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  url: string;
  categories: string[];
  excerpt: string;
}
