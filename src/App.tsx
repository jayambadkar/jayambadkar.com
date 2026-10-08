import { useCallback, useEffect, useMemo, useState } from 'react';
import { CommandPalette, type PaletteAction } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal';
import { sections, socials, type SectionId } from './data';
import { useActiveSection } from './hooks/useActiveSection';
import { useHotkey } from './hooks/useHotkey';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useTheme } from './hooks/useTheme';
import { openExternal, scrollToSection } from './lib/scroll';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';

const SECTION_IDS: readonly SectionId[] = sections.map((s) => s.id);

/** "g" then a letter jumps to a section, vim/GitHub style. */
const GOTO_KEYS: Record<string, SectionId> = {
  h: 'home',
  a: 'about',
  p: 'projects',
  e: 'experience',
  c: 'contact',
};

export function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
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
        keywords: s.id,
        ...(s.shortcut ? { hint: s.shortcut } : {}),
        perform: () => {
          scrollToSection(s.id);
        },
      })),
      ...socials.map((l): PaletteAction => ({
        id: `link-${l.id}`,
        label: `Open ${l.label}`,
        group: 'Links',
        icon: l.icon,
        keywords: l.handle,
        hint: l.handle,
        perform: () => {
          openExternal(l.href);
        },
      })),
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
        <Hero theme={theme} reducedMotion={reducedMotion} onOpenPalette={openPalette} />
        <About />
        <Projects />
        <Experience />
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
