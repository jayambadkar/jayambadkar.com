import type { Profile } from './types';

/**
 * Verified facts only. Anything not yet confirmed is marked TODO(content).
 */
export const profile: Profile = {
  name: 'Jay Ambadkar',
  firstName: 'Jay',
  initials: 'JA',
  location: 'United Kingdom',
  descriptor: 'Maths & Computer Science at Imperial College London',
  credentials: ['Imperial', 'ex-Palantir', "Dean's List"],
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
  facts: [
    { label: 'Studying', value: 'Joint Maths & Computer Science, Imperial College London' },
    { label: 'Previously', value: 'Palantir' },
    { label: 'Honours', value: "Dean's List" },
    { label: 'Based in', value: 'United Kingdom' },
  ],
  // TODO(content): set `email` if it should be public.
};
