import type { Project } from './types';

/**
 * TODO(content): every entry below is PLACEHOLDER data and is rendered with a
 * "placeholder" badge. Replace with real projects from the CV / GitHub, and
 * drop the `placeholder: true` flag once an entry is real.
 */
export const projects: readonly Project[] = [
  {
    id: 'placeholder-1',
    title: 'Project One',
    summary: 'TODO: one or two sentences on what it is, why it matters and what you built.',
    tags: ['TypeScript', 'React'],
    status: 'in-progress',
    featured: true,
    placeholder: true,
  },
  {
    id: 'placeholder-2',
    title: 'Project Two',
    summary: 'TODO: a maths-heavy project, e.g. a solver, a simulation or a proof assistant tool.',
    tags: ['Maths', 'Python'],
    status: 'live',
    placeholder: true,
  },
  {
    id: 'placeholder-3',
    title: 'Project Three',
    summary: 'TODO: a systems or data project, e.g. something from a hackathon or a course.',
    tags: ['Systems', 'Data'],
    status: 'archived',
    placeholder: true,
  },
  {
    id: 'this-site',
    title: 'jayambadkar.com',
    summary:
      'This website: Vite + React + strict TypeScript, with an ambient colour-wash hero, a command palette and a hidden terminal.',
    tags: ['TypeScript', 'React', 'CSS'],
    status: 'live',
    repo: 'https://github.com/jayambadkar',
    year: 2026,
  },
];
