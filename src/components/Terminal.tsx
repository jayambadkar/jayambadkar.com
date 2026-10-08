import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { SectionId } from '../data';
import type { Theme } from '../hooks/useTheme';
import { openExternal } from '../lib/scroll';
import {
  WELCOME,
  complete,
  runCommand,
  type TerminalContext,
  type TerminalLine,
} from '../lib/terminal';
import styles from './Terminal.module.css';

export interface TerminalProps {
  open: boolean;
  onClose: () => void;
  goTo: (id: SectionId) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const PROMPT = 'guest@jayambadkar.com:~$';

/** Easter-egg terminal. Open with the backtick key or from the command palette. */
export function Terminal({ open, onClose, goTo, setTheme, toggleTheme }: TerminalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<TerminalLine[]>(WELCOME);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (e: FormEvent): void => {
    e.preventDefault();
    const input = value;
    setValue('');
    setHistoryIndex(null);
    if (input.trim()) setHistory((h) => [...h, input]);

    let cleared = false;
    const ctx: TerminalContext = {
      goTo,
      setTheme,
      toggleTheme,
      open: openExternal,
      close: onClose,
      clear: () => {
        cleared = true;
      },
    };
    const output = runCommand(input, ctx);
    setLines((prev) => (cleared ? [] : [...prev, { kind: 'input', text: input }, ...output]));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(next);
      setValue(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue('');
      } else {
        setHistoryIndex(next);
        setValue(history[next] ?? '');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setValue((v) => complete(v));
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Terminal"
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <button
            type="button"
            className={styles.dot}
            data-color="red"
            onClick={onClose}
            aria-label="Close terminal"
          />
          <span className={styles.dot} data-color="yellow" aria-hidden="true" />
          <span className={styles.dot} data-color="green" aria-hidden="true" />
          <span className={styles.title}>jay — zsh — 80×24</span>
        </div>
        <div
          ref={scrollRef}
          className={styles.body}
          onClick={() => inputRef.current?.focus()}
          role="log"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <div key={i} className={styles.line} data-kind={line.kind}>
              {line.kind === 'input' ? (
                <>
                  <span className={styles.prompt}>{PROMPT}</span> {line.text}
                </>
              ) : line.kind === 'link' ? (
                <a href={line.href} target="_blank" rel="noopener noreferrer">
                  {line.text}
                </a>
              ) : (
                line.text
              )}
            </div>
          ))}
          <form onSubmit={submit} className={styles.inputRow}>
            <label htmlFor="terminal-input" className={styles.prompt}>
              {PROMPT}
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              className={styles.input}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          </form>
        </div>
      </div>
    </dialog>
  );
}
