import type { Profile } from './types';

/**
 * Source: Jay's LinkedIn profile (pasted 2026-10-08), plus his blog. The bio
 * lead and contact line are Jay's own words from LinkedIn. The "thinking about"
 * phrases come from his research and the "coolest topics" in his May 2026 post.
 */
export const profile: Profile = {
  name: 'Jay Ambadkar',
  firstName: 'Jay',
  initials: 'JA',
  location: 'United Kingdom',
  // After Jay's own sign-off: "Looking forward to what the future holds!"
  tagline: 'Looking forwards.',
  descriptor: 'Mathematics & Computer Science · Imperial College London',
  thinkingAbout: [
    'persistent homology inside language models',
    'multi-core scheduling and cache affinity',
    'memory in AI systems',
    'Picard–Lindelöf and local ODE theory',
    'the Euler–Lagrange equation',
    'going from zero to one',
  ],
  credentials: ['Imperial', 'ex-Palantir', "Dean's List", 'DevCon Fellow'],
  bio: [
    'Excited about educational, personal and industrial growth in an ever-changing world. Interested in all things maths, tech and revolutionary, while committed to upholding ethical standards.',
    "I'm in my final year of Mathematics and Computer Science at Imperial College London. This summer I was a Forward Deployed Engineer intern at Palantir, working on deployments, core product and surge efforts, and I've since received a return offer.",
    'Before that I built secure AI workflows at a stealth AI startup, improved multi-threaded simulations at Angstrom, and won one of five Palantir DevCon Fellowships worldwide.',
  ],
  facts: [
    { label: 'Studying', value: 'BEng Mathematics & Computer Science, Imperial (2024–27)' },
    { label: 'Most recently', value: 'Forward Deployed Engineer intern, Palantir' },
    { label: 'Results', value: "87.05% (Y1, #2 in cohort) · 83.15% (Y2, top 5) · Dean's List ×2" },
    { label: 'Research', value: 'Persistent homology in LLMs (TAG-DS)' },
    { label: 'Based in', value: 'United Kingdom' },
  ],
  honours: [
    {
      title: 'Palantir DevCon Fellowship',
      detail: 'One of five globally, for Small Business Connector',
      year: '2025',
    },
    {
      title: 'G-Research Prize',
      detail: 'Top 10 non-final-year students in the department',
      year: '2025',
    },
    { title: "Dean's List", detail: 'Imperial College London, Years 1 and 2', year: '2025–26' },
    {
      title: 'Imperial Computing Entrance Scholarship',
      detail: 'One of 12 awarded',
      year: '2024',
    },
    { title: 'Most Helpful Student', detail: 'Imperial, COMP40009', year: '2025' },
    {
      title: 'Foundry & AIP Builder Foundations',
      detail: 'Palantir certification',
      year: '2025',
      href: 'https://verify.skilljar.com/c/c87nxbsvt2ui',
    },
    { title: 'CREST Gold Award', detail: 'British Science Association', year: '2023' },
  ],
  contactLine: 'If you have any cool ideas or just want to chat, please do get in touch.',
};
