import type { Profile } from './types';

/**
 * Verified facts only. Anything not yet confirmed is marked TODO(content).
 */
export const profile: Profile = {
  name: 'Jay Ambadkar',
  firstName: 'Jay',
  initials: 'JA',
  location: 'United Kingdom',
  // TODO(content): refine this one-liner from the CV.
  headline: 'I like problems where rigorous maths meets real-world software.',
  roles: ['Maths × Computer Science @ Imperial', 'ex-Palantir', "Dean's List", 'builder of things'],
  bio: [
    "I'm Jay, a Joint Mathematics and Computer Science (JMC) student at Imperial College London, based in the UK.",
    "Previously at Palantir. I'm on the Dean's List, and I like problems that sit right where rigorous maths meets real software.",
    // TODO(content): replace/extend with a proper bio from the CV.
  ],
  education: {
    institution: 'Imperial College London',
    course: 'Joint Mathematics and Computer Science (JMC)',
    // TODO(content): add period, e.g. '2023 – 2027'.
    honours: ["Dean's List"],
  },
  highlights: [
    { title: 'Imperial', detail: 'Joint Maths & Computer Science' },
    { title: 'ex-Palantir', detail: 'Industry experience' },
    { title: "Dean's List", detail: 'Academic distinction' },
  ],
  // TODO(content): set `email` if it should be public.
};
