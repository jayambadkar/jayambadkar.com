import { useCallback, useEffect, useMemo, useState } from 'react';
import { CommandPalette, type PaletteAction } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal';
import { BLOG_URL, sections, socials, type SectionId } from './data';
import { useActiveSection } from './hooks/useActiveSection';
import { useHotkey } from './hooks/useHotkey';
import { useTheme } from './hooks/useTheme';
import { openExternal, scrollToSection } from './lib/scroll';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Hero } from './sections/Hero';
import { Blog } from './sections/Blog';
import { Work } from './sections/Work';

const SECTION_IDS: readonly SectionId[] = sections.map((s) => s.id);

/** "g" then a letter jumps to a section, vim/GitHub style. */
const GOTO_KEYS: Record<string, SectionId> = {
  h: 'home',
  w: 'work',
  p: 'work',
  a: 'about',
  e: 'about',
  b: 'blog',
  c: 'contact',
};

export function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const active = useActiveSection(SECTION_IDS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const openPalette = useCallback(() => {
    setTerminalOpen(false);
    setPaletteOpen(true);
  }, []);
  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);
  const openTerminal = useCallback(() => {
    setPaletteOpen(false);
    setTerminalOpen(true);
  }, []);
  const closeTerminal = useCallback(() => {
    setTerminalOpen(false);
  }, []);

  useHotkey(
    'k',
    (e) => {
      e.preventDefault();
      if (paletteOpen) closePalette();
      else openPalette();
    },
    { mod: true },
  );
  useHotkey('`', (e) => {
    if (terminalOpen) return;
    e.preventDefault();
    openTerminal();
  });

  // "g" + key navigation.
  useEffect(() => {
    let pending = false;
    let timer = 0;
    const onKeyDown = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        paletteOpen ||
        terminalOpen ||
        target?.closest('input, textarea, [contenteditable="true"]')
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (pending) {
        pending = false;
        window.clearTimeout(timer);
        const id = GOTO_KEYS[key];
        if (id) scrollToSection(id);
        return;
      }
      if (key === 'g') {
        pending = true;
        timer = window.setTimeout(() => {
          pending = false;
        }, 900);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timer);
    };
  }, [paletteOpen, terminalOpen]);

  const actions = useMemo<PaletteAction[]>(
    () => [
      ...sections.map((s): PaletteAction => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        group: 'Navigate',
        icon: 'hash',
        keywords: s.id === 'about' ? 'about experience path education honours' : s.id,
        ...(s.shortcut ? { hint: s.shortcut } : {}),
        perform: () => {
          scrollToSection(s.id);
        },
      })),
      ...socials.map((l): PaletteAction => ({
        id: `link-${l.id}`,
        label: l.id === 'email' ? 'Email Jay' : `Open ${l.label}`,
        group: 'Links',
        icon: l.icon,
        keywords: l.id === 'email' ? `${l.handle} mail contact` : l.handle,
        hint: l.handle,
        perform: () => {
          openExternal(l.href);
        },
      })),
      {
        id: 'open-blog',
        label: 'Read the full blog',
        group: 'Links',
        icon: 'pen',
        keywords: 'blog posts jayambadkar.github.io',
        hint: 'jayambadkar.github.io',
        perform: () => {
          openExternal(BLOG_URL);
        },
      },
      {
        id: 'toggle-theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`,
        group: 'Actions',
        icon: theme === 'dark' ? 'sun' : 'moon',
        keywords: 'theme dark light mode colour color',
        perform: toggleTheme,
      },
      {
        id: 'open-terminal',
        label: 'Open terminal',
        group: 'Actions',
        icon: 'terminal',
        keywords: 'shell console easter egg cli',
        hint: '`',
        perform: openTerminal,
      },
    ],
    [theme, toggleTheme, openTerminal],
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header
        active={active}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={openPalette}
      />
      <main id="main">
        <Hero onOpenPalette={openPalette} />
        <Work />
        <About />
        <Blog />
        <Contact />
      </main>
      <Footer onOpenTerminal={openTerminal} />
      <CommandPalette open={paletteOpen} onClose={closePalette} actions={actions} />
      <Terminal
        open={terminalOpen}
        onClose={closeTerminal}
        goTo={scrollToSection}
        setTheme={setTheme}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
