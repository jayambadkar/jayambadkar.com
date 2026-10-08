import type { Experience } from './types';

/** Source: Jay's LinkedIn profile (pasted 2026-10-08). */
export const experience: readonly Experience[] = [
  {
    id: 'palantir-fde',
    kind: 'work',
    organisation: 'Palantir Technologies',
    role: 'Forward Deployed Engineer Intern',
    period: 'Jun – Sep 2026',
    location: 'London',
    summary: 'Worked on deployments, core product and surge efforts. Received a return offer.',
    highlights: [],
  },
  {
    id: 'stewardshipped',
    kind: 'work',
    organisation: 'Stewardshipped.ai',
    role: 'Engineering Intern (contract)',
    period: 'Jun 2025 – Jan 2026',
    location: 'Remote, US',
    summary:
      'Designed, built and deployed secure AI workflows for top firms at a legal AI startup.',
    highlights: [],
    tech: ['AI engineering'],
  },
  {
    id: 'angstrom',
    kind: 'work',
    organisation: 'Angstrom',
    role: 'Software Engineering Intern',
    period: 'Jul – Sep 2025',
    location: 'London',
    summary:
      'Modernised cross-codebase logging, improved multi-threaded simulation efficiency and wrote tests.',
    highlights: [],
  },
  {
    id: 'optiver',
    kind: 'work',
    organisation: 'Optiver × Imperial Trading Academy',
    role: 'Trading Academy',
    period: 'May 2025',
    location: 'London',
    summary: 'Algorithmic trading in Python.',
    highlights: [],
  },
  {
    id: 'palantir-devcon',
    kind: 'work',
    organisation: 'Palantir Technologies',
    role: 'DevCon Fellowship Winner & Launcher',
    period: 'Feb – Apr 2025',
    location: 'London',
    summary:
      'Won a DevCon Fellowship, attended DevCon2 and joined the Launch Spring Program in London.',
    highlights: [
      'DevCon2 build challenge: a personal health platform using AI agents, OSDK, phone-call integration and data pipelines',
    ],
  },
  {
    id: 'imperial',
    kind: 'education',
    organisation: 'Imperial College London',
    role: 'BEng Mathematics and Computer Science',
    period: '2024 – 2027',
    location: 'London',
    summary:
      "Year 1: 87.05%, #2 in cohort. Year 2: 83.15%, top 5 in cohort. Dean's List both years.",
    highlights: [
      'G-Research Prize, one of the top 10 non-final-year students',
      'Computing Entrance Scholarship, one of 12',
      '100% in the Haskell final test',
      'Academic rep for the year group',
    ],
  },
  {
    id: 'norwich-school',
    kind: 'education',
    organisation: 'Norwich School',
    role: 'A levels & GCSEs',
    period: '2018 – 2024',
    location: 'Norwich',
    summary:
      'A* in Maths, Further Maths, Physics and Chemistry; grade 9 in all 12 GCSEs; S, 1 in STEP. Academic scholar.',
    highlights: [
      'President of the Erpingham Society',
      'Mentored younger pupils in maths and the sciences',
    ],
  },
  {
    id: 'norfolk-library',
    kind: 'volunteering',
    organisation: 'Norfolk Library and Information Service',
    role: 'Digital Champion',
    period: 'Nov 2022 – Jan 2024',
    location: 'Norwich',
    summary:
      'Weekly digital skills help for the community, and a weekly code club for 9–13 year olds.',
    highlights: [],
  },
];
