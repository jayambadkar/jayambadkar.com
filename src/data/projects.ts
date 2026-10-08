import type { Project } from './types';

/** Selected work. Sources: LinkedIn, GitHub READMEs, arXiv, Jay's blog and CV. */
export const projects: readonly Project[] = [
  {
    id: 'ph-llm',
    title: 'Tracking representation dynamics in LLMs with persistent homology',
    summary:
      'Uses topological data analysis to follow how the activation spaces of 1B–7B language models reorganise during alignment fine-tuning.',
    note: 'Accepted at TAG-DS · to appear in PMLR',
    kind: 'research',
    tags: ['Research', 'Topology', 'Machine learning', 'Python'],
    year: '2026',
    links: [
      { label: 'arXiv', href: 'https://arxiv.org/abs/2606.19542' },
      {
        label: 'Code',
        href: 'https://github.com/malhotranaman/tracking-representation-dynamics-with-persistent-homology',
      },
    ],
  },
  {
    id: 'small-business-connector',
    title: 'Small Business Connector',
    summary:
      'An AIP app on Palantir Foundry that matches UK businesses and founders with collaborators via semantic search, with map views and local funding guidance.',
    note: 'DevCon Fellowship winner, one of five globally · in Palantir’s AIP community registry',
    kind: 'project',
    tags: ['Foundry', 'AIP'],
    year: '2025',
    links: [
      { label: 'Repo', href: 'https://github.com/jayambadkar/SmallBusinessConnector' },
      { label: 'Demo', href: 'https://www.youtube.com/watch?v=8cXdBcJWSJg' },
    ],
  },
  {
    id: 'whatsapp-foundry',
    title: 'WhatsApp integration for Foundry',
    summary:
      'Brings WhatsApp Business messages into Foundry and sends replies out, with AI responses backed by operational data. Published as a Foundry marketplace package.',
    kind: 'project',
    tags: ['Foundry', 'TypeScript', 'Flask'],
    year: '2025',
    links: [
      { label: 'Repo', href: 'https://github.com/jayambadkar/WhatsApp-Foundry-Integration' },
      { label: 'Demo', href: 'https://youtu.be/Wob3POAS6ps' },
    ],
  },
  {
    id: 'family-os',
    title: 'FamilyOS',
    summary:
      'An end-to-end platform for the monotonous parts of family life: chores, purchases, rules and group chats, with automated approvals and Telegram bots.',
    note: 'Palantir Launch project',
    kind: 'project',
    tags: ['Foundry', 'OSDK', 'TypeScript'],
    year: '2025',
    links: [
      { label: 'Repo', href: 'https://github.com/jayambadkar/FamilyOS' },
      { label: 'Demo', href: 'https://youtu.be/fzl4UZeCq7M' },
    ],
  },
  {
    id: 'marathi-tutor',
    title: 'Marathi Tutor',
    summary:
      'An offline-first app for learning Marathi: graded reading sprints, stories with read-along, grammar drills and spaced-repetition vocabulary.',
    kind: 'project',
    tags: ['React', 'JavaScript'],
    year: '2026',
    links: [
      { label: 'Live', href: 'https://marathi-ms3xydrud-ambadkarj123-6605.vercel.app/' },
      { label: 'Repo', href: 'https://github.com/jayambadkar/MarathiApp' },
    ],
  },
  {
    id: 'armv8',
    title: 'ARMv8 emulator, assembler & smart mirror',
    summary:
      'An emulator and assembler for ARMv8 that passed every test, with assembled code running on a Raspberry Pi 3B, extended to turn any screen into a smart mirror.',
    kind: 'coursework',
    tags: ['Systems', 'C'],
    year: '2025',
    links: [],
  },
  {
    id: 'pintos-wacc',
    title: 'PintOS kernel & WACC compiler',
    summary:
      'Group projects at Imperial: sleeping threads, scheduling and user programs in the PintOS kernel, and a compiler for the WACC language built from scratch.',
    kind: 'coursework',
    tags: ['Systems', 'C', 'Scala'],
    year: '2025–26',
    links: [],
  },
];
