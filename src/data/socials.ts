import type { SocialLink } from './types';

export const socials: readonly SocialLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/jayambadkar',
    handle: 'jayambadkar',
    icon: 'github',
  },
  {
    id: 'x',
    label: 'X / Twitter',
    href: 'https://x.com/JayAmbadkar',
    handle: '@JayAmbadkar',
    icon: 'x',
  },
  // TODO(content): add LinkedIn / CV link if wanted, e.g.
  // { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/…', handle: '…', icon: 'linkedin' },
];
