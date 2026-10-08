/**
 * Content model for the site. Everything rendered on the page comes from typed
 * data in `src/data`, so content can be swapped (e.g. from Jay's CV) without
 * touching components.
 *
 * Convention: any entry with `placeholder: true` is NOT real content yet and is
 * rendered with a visible "placeholder" badge. Search the repo for `TODO(content)`
 * to find everything that still needs filling in.
 */

export type SectionId = 'home' | 'about' | 'projects' | 'experience' | 'contact';

export interface Section {
  id: SectionId;
  label: string;
  /** Keyboard hint shown in the command palette. */
  shortcut?: string;
}

export type IconName = 'github' | 'x' | 'linkedin' | 'mail' | 'globe' | 'file';

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  /** Short display handle, e.g. "@JayAmbadkar". */
  handle: string;
  icon: IconName;
}

export interface Education {
  institution: string;
  course: string;
  /** e.g. "2023 – 2027". TODO(content) where unknown. */
  period?: string;
  honours: string[];
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
  /** One-line descriptor under the name in the hero. */
  descriptor: string;
  /** Short credential line in the hero, joined with " · ". */
  credentials: string[];
  /** Short bio paragraphs for the About section. */
  bio: string[];
  education: Education;
  /** "At a glance" facts in the About section. */
  facts: Fact[];
  /** Set when an email address should be public. */
  email?: string;
}

export type ProjectStatus = 'live' | 'in-progress' | 'archived';

export interface Project {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  year?: number;
  status: ProjectStatus;
  href?: string;
  repo?: string;
  featured?: boolean;
  placeholder?: boolean;
}

export interface Experience {
  id: string;
  organisation: string;
  role: string;
  /** Free-form, e.g. "Jun 2024". */
  start: string;
  /** Omit for current roles. */
  end?: string;
  location?: string;
  summary: string;
  highlights: string[];
  tech?: string[];
  placeholder?: boolean;
}
