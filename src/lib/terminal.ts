import {
  BLOG_URL,
  experience,
  posts,
  profile,
  projects,
  sections,
  socials,
  type SectionId,
} from '../data';
import type { Theme } from '../hooks/useTheme';

/** A single rendered line in the terminal. */
export type TerminalLine =
  | { kind: 'input'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'muted'; text: string }
  | { kind: 'accent'; text: string }
  | { kind: 'art'; text: string }
  | { kind: 'error'; text: string }
  | { kind: 'link'; text: string; href: string };

export interface TerminalContext {
  goTo: (id: SectionId) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  open: (href: string) => void;
  close: () => void;
  clear: () => void;
}

interface Command {
  description: string;
  usage?: string;
  hidden?: boolean;
  run: (args: string[], ctx: TerminalContext) => TerminalLine[];
}

const text = (t: string): TerminalLine => ({ kind: 'text', text: t });
const muted = (t: string): TerminalLine => ({ kind: 'muted', text: t });
const accent = (t: string): TerminalLine => ({ kind: 'accent', text: t });
const error = (t: string): TerminalLine => ({ kind: 'error', text: t });

const sectionIds = sections.map((s) => s.id);
const isSectionId = (v: string): v is SectionId => (sectionIds as string[]).includes(v);
/** Old names still work in `goto`. */
const SECTION_ALIASES: Record<string, SectionId> = {
  experience: 'about',
  writing: 'blog',
  projects: 'work',
};

const FILES: Record<string, () => TerminalLine[]> = {
  'about.txt': () => profile.bio.map(text),
  'projects.md': () => commands.projects?.run([], noopCtx) ?? [],
  'experience.md': () => commands.experience?.run([], noopCtx) ?? [],
  'socials.json': () => [
    text(JSON.stringify(Object.fromEntries(socials.map((s) => [s.id, s.href])), null, 2)),
  ],
};

const noopCtx: TerminalContext = {
  goTo: () => undefined,
  setTheme: () => undefined,
  toggleTheme: () => undefined,
  open: () => undefined,
  close: () => undefined,
  clear: () => undefined,
};

const openSocial =
  (id: string): Command['run'] =>
  (_args, ctx) => {
    const link = socials.find((s) => s.id === id);
    if (!link) return [error(`no link configured for ${id}`)];
    ctx.open(link.href);
    return [muted(`opening ${link.href} …`)];
  };

export const commands: Record<string, Command> = {
  help: {
    description: 'list available commands',
    run: () => [
      accent('available commands:'),
      ...Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => text(`  ${(c.usage ?? name).padEnd(22)} ${c.description}`)),
      muted('tip: ↑/↓ for history, Tab to autocomplete, Esc to close.'),
    ],
  },
  whoami: {
    description: 'who is this guy?',
    run: () => [
      accent(profile.name),
      text(profile.descriptor),
      text(profile.credentials.join(' · ')),
      muted(profile.tagline),
      ...socials
        .filter((s) => s.id === 'email')
        .map((s): TerminalLine => ({ kind: 'link', text: s.handle, href: s.href })),
      muted(`📍 ${profile.location}`),
    ],
  },
  about: {
    description: 'a short bio',
    run: () => profile.bio.map(text),
  },
  projects: {
    description: 'list projects',
    run: () =>
      projects.flatMap((p) => [accent(`▸ ${p.title}  (${p.year})`), muted(`  ${p.summary}`)]),
  },
  experience: {
    description: 'work & education',
    run: () =>
      experience.flatMap((e) => [
        accent(`▸ ${e.organisation} — ${e.role}`),
        muted(`  ${e.period}`),
      ]),
  },
  honours: {
    description: 'prizes & certifications',
    run: () => profile.honours.map((h) => text(`  ${h.year.padEnd(8)} ${h.title}`)),
  },
  blog: {
    description: 'recent blog posts',
    run: () => [
      ...posts
        .slice(0, 5)
        .map((p): TerminalLine => ({ kind: 'link', text: `${p.date}  ${p.title}`, href: p.url })),
      { kind: 'link', text: `full blog → ${BLOG_URL.replace('https://', '')}`, href: BLOG_URL },
    ],
  },
  socials: {
    description: 'where to find me',
    run: () =>
      socials.map((s) => ({ kind: 'link', text: `${s.label}: ${s.handle}`, href: s.href })),
  },
  github: { description: 'open GitHub', run: openSocial('github') },
  linkedin: { description: 'open LinkedIn', run: openSocial('linkedin') },
  email: { description: 'send me an email', run: openSocial('email') },
  mail: { description: 'send me an email', hidden: true, run: openSocial('email') },
  x: { description: 'open X / Twitter', run: openSocial('x') },
  twitter: { description: 'open X / Twitter', hidden: true, run: openSocial('x') },
  goto: {
    description: 'jump to a section',
    usage: 'goto <section>',
    run: (args, ctx) => {
      const arg = args[0]?.toLowerCase();
      const target = arg ? (SECTION_ALIASES[arg] ?? arg) : undefined;
      if (!target || !isSectionId(target)) {
        return [error(`usage: goto <${sectionIds.join('|')}>`)];
      }
      ctx.close();
      ctx.goTo(target);
      return [muted(`→ ${target}`)];
    },
  },
  cd: {
    description: 'alias for goto',
    hidden: true,
    run: (args, ctx) => commands.goto?.run(args, ctx) ?? [],
  },
  theme: {
    description: 'switch colour theme',
    usage: 'theme [dark|light]',
    run: (args, ctx) => {
      const arg = args[0]?.toLowerCase();
      if (arg === 'dark' || arg === 'light') {
        ctx.setTheme(arg);
        return [muted(`theme set to ${arg}`)];
      }
      if (arg === undefined) {
        ctx.toggleTheme();
        return [muted('theme toggled')];
      }
      return [error('usage: theme [dark|light]')];
    },
  },
  ls: {
    description: 'list files',
    run: () => [text(Object.keys(FILES).join('    '))],
  },
  cat: {
    description: 'print a file',
    usage: 'cat <file>',
    run: (args) => {
      const name = args[0];
      if (!name) return [error('usage: cat <file>  (try `ls`)')];
      const file = FILES[name];
      return file ? file() : [error(`cat: ${name}: No such file or directory`)];
    },
  },
  echo: {
    description: 'print text',
    hidden: true,
    run: (args) => [text(args.join(' '))],
  },
  date: {
    description: 'current date/time',
    hidden: true,
    run: () => [text(new Date().toString())],
  },
  sudo: {
    description: 'nice try',
    hidden: true,
    run: () => [
      error(
        `${profile.firstName.toLowerCase()} is not in the sudoers file. This incident will be reported.`,
      ),
    ],
  },
  neofetch: {
    description: 'system info, but make it me',
    run: () => [
      ...[
        String.raw`     _   _    `,
        String.raw`    | | / \   `,
        String.raw` _  | |/ _ \  `,
        String.raw`| |_| / ___ \ `,
        String.raw` \___/_/   \_\ `,
        '',
      ].map((t): TerminalLine => ({ kind: 'art', text: t })),
      text(`user      ${profile.name}`),
      text('uni       Imperial College London'),
      text('course    JMC (Maths × CS)'),
      text('prev      Palantir (FDE intern)'),
      text("honours   DevCon Fellowship, G-Research Prize, Dean's List ×2"),
      text(`mood      ${profile.tagline}`),
      text('shell     react-tsx (strict mode)'),
    ],
  },
  clear: {
    description: 'clear the screen',
    run: (_args, ctx) => {
      ctx.clear();
      return [];
    },
  },
  exit: {
    description: 'close the terminal',
    run: (_args, ctx) => {
      ctx.close();
      return [];
    },
  },
};

export function runCommand(input: string, ctx: TerminalContext): TerminalLine[] {
  const [name, ...args] = input.trim().split(/\s+/);
  if (!name) return [];
  const command = commands[name.toLowerCase()];
  if (!command) {
    return [error(`command not found: ${name}`), muted('type `help` to see what you can do.')];
  }
  return command.run(args, ctx);
}

/** Tab-completion over command names, section ids (for goto/cd) and files (for cat). */
export function complete(input: string): string {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const prefix = parts[0] ?? '';
    const matches = Object.keys(commands).filter((c) => c.startsWith(prefix));
    return matches.length === 1 && matches[0] ? `${matches[0]} ` : input;
  }
  const [cmd, arg = ''] = parts;
  const pool =
    cmd === 'goto' || cmd === 'cd'
      ? sectionIds
      : cmd === 'cat'
        ? Object.keys(FILES)
        : cmd === 'theme'
          ? ['dark', 'light']
          : [];
  const matches = pool.filter((p) => p.startsWith(arg));
  return matches.length === 1 && matches[0] ? `${cmd ?? ''} ${matches[0]}` : input;
}

export const WELCOME: TerminalLine[] = [
  accent('jayambadkar.com — interactive shell (v0.1)'),
  muted('type `help` to get started.'),
];
