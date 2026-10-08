import type { SocialLink } from './types';

export const socials: readonly SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jay-ambadkar/',
    handle: 'jay-ambadkar',
    icon: 'linkedin',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/jayambadkar',
    handle: 'jayambadkar',
    icon: 'github',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/JayAmbadkar',
    handle: '@JayAmbadkar',
    icon: 'x',
  },
  {
    id: 'blog',
    label: 'Blog',
    href: 'https://jayambadkar.github.io',
    handle: 'jayambadkar.github.io',
    icon: 'pen',
  },
];
