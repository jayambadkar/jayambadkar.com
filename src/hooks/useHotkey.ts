import { useEffect, useRef } from 'react';

export interface HotkeyOptions {
  /** Require Cmd (macOS) or Ctrl (elsewhere). */
  mod?: boolean;
  /** Ignore the key while typing in inputs/textareas. Default true. */
  ignoreInInputs?: boolean;
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

export function useHotkey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  { mod = false, ignoreInInputs = true }: HotkeyOptions = {},
): void {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      const hasMod = event.metaKey || event.ctrlKey;
      if (mod !== hasMod) return;
      if (!mod && ignoreInInputs && isTypingTarget(event.target)) return;
      handlerRef.current(event);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [key, mod, ignoreInInputs]);
}
