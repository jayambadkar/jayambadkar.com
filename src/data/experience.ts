import type { Experience } from './types';

/**
 * TODO(content): the Palantir entry is a known fact, but its role, dates and
 * highlights are placeholders. Fill in from the CV and add other roles.
 */
export const experience: readonly Experience[] = [
  {
    id: 'palantir',
    organisation: 'Palantir',
    role: 'TODO: role title',
    start: 'TODO',
    end: 'TODO',
    location: 'TODO',
    summary: 'TODO: one-line summary of the team and what you worked on.',
    highlights: ['TODO: impact bullet', 'TODO: impact bullet'],
    placeholder: true,
  },
  {
    id: 'imperial',
    organisation: 'Imperial College London',
    role: 'Student, Joint Mathematics and Computer Science (JMC)',
    start: 'TODO',
    location: 'London, UK',
    summary: "Joint Maths & Computer Science degree. Dean's List.",
    highlights: ['TODO: notable modules, projects or awards'],
    placeholder: true,
  },
];
