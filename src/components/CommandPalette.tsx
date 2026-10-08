import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { Icon, type UiIconName } from './Icon';
import styles from './CommandPalette.module.css';

export type PaletteGroup = 'Navigate' | 'Links' | 'Actions';

export interface PaletteAction {
  id: string;
  label: string;
  group: PaletteGroup;
  icon: UiIconName;
  /** Extra search terms. */
  keywords?: string;
  hint?: string;
  perform: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  actions: readonly PaletteAction[];
}

const GROUP_ORDER: readonly PaletteGroup[] = ['Navigate', 'Links', 'Actions'];

/** Subsequence fuzzy match. Returns a score (higher is better) or -1 for no match. */
function fuzzyScore(query: string, target: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let score = 0;
  let ti = 0;
  let streak = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    streak = found === ti ? streak + 1 : 0;
    score += 1 + streak;
    ti = found + 1;
  }
  return score;
}

export function CommandPalette({ open, onClose, actions }: CommandPaletteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  // Sync the native <dialog> with `open` (gives us focus trapping + Esc for free).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setActiveIndex(0);
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const results = useMemo(() => {
    const scored = actions
      .map((a) => ({
        action: a,
        score: Math.max(
          fuzzyScore(query, a.label),
          fuzzyScore(query, `${a.group} ${a.keywords ?? ''}`) - 10,
        ),
      }))
      .filter((r) => r.score >= 0);
    if (query) scored.sort((a, b) => b.score - a.score);
    else
      scored.sort(
        (a, b) => GROUP_ORDER.indexOf(a.action.group) - GROUP_ORDER.indexOf(b.action.group),
      );
    return scored.map((r) => r.action);
  }, [actions, query]);

  const clampedIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
  const activeAction = results[clampedIndex];

  useEffect(() => {
    if (!activeAction) return;
    const el = listRef.current?.querySelector(`[data-id="${activeAction.id}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeAction]);

  const run = (action: PaletteAction): void => {
    onClose();
    // Let the dialog close (and restore focus) before acting, e.g. scrolling.
    requestAnimationFrame(() => {
      action.perform();
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((clampedIndex + 1) % Math.max(results.length, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((clampedIndex - 1 + results.length) % Math.max(results.length, 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(Math.max(results.length - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeAction) run(activeAction);
        break;
    }
  };

  let lastGroup: PaletteGroup | undefined;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label="Command palette"
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.searchRow}>
          <Icon name="search" size={18} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeAction ? `${listId}-${activeAction.id}` : undefined}
            placeholder="Jump to a section, open a link, run an action…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </div>

        <ul ref={listRef} id={listId} role="listbox" className={styles.list} aria-label="Results">
          {results.length === 0 ? (
            <li className={styles.empty} role="presentation">
              No results for “{query}”
            </li>
          ) : (
            results.map((action, i) => {
              const showGroup = !query && action.group !== lastGroup;
              lastGroup = action.group;
              return (
                <li key={action.id} role="presentation">
                  {showGroup ? (
                    <div className={styles.group} aria-hidden="true">
                      {action.group}
                    </div>
                  ) : null}
                  <div
                    id={`${listId}-${action.id}`}
                    data-id={action.id}
                    role="option"
                    aria-selected={i === clampedIndex}
                    className={cx(styles.item, i === clampedIndex && styles.itemActive)}
                    onMouseMove={() => {
                      if (i !== clampedIndex) setActiveIndex(i);
                    }}
                    onClick={() => {
                      run(action);
                    }}
                  >
                    <span className={styles.itemIcon}>
                      <Icon name={action.icon} size={16} />
                    </span>
                    <span className={styles.itemLabel}>{action.label}</span>
                    {action.hint ? <span className={styles.hint}>{action.hint}</span> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div className={styles.footer} aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>↵</kbd> select
          </span>
          <span>
            <kbd>`</kbd> terminal
          </span>
        </div>
      </div>
    </dialog>
  );
}
