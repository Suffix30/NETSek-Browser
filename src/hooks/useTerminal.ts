import { useEffect, useRef, useState, useCallback } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { initializeTerminal } from '../utils/terminalInitializer';
import { useTerminalState } from './useTerminalState';
import { useTerminalResize } from './useTerminalResize';

export function useTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(false);
  const { commandRef, historyRef } = useTerminalState();
  const [isReady, setIsReady] = useState(false);

  const handleResize = useCallback(() => {
    if (fitAddonRef.current && terminalRef.current?.offsetHeight > 0) {
      try {
        fitAddonRef.current.fit();
      } catch (error) {
        console.error('Resize error:', error);
      }
    }
  }, []);

  useTerminalResize(handleResize);

  useEffect(() => {
    mountedRef.current = true;

    const initTimer = setTimeout(async () => {
      if (!terminalRef.current || !mountedRef.current) return;

      try {
        if (xtermRef.current) {
          cleanupRef.current?.();
          xtermRef.current = null;
          fitAddonRef.current = null;
        }

        const { term, fitAddon, cleanup } = await initializeTerminal(
          terminalRef.current,
          commandRef,
          historyRef
        );

        if (mountedRef.current) {
          xtermRef.current = term;
          fitAddonRef.current = fitAddon;
          cleanupRef.current = cleanup;
          setIsReady(true);
          handleResize();
        } else {
          cleanup();
        }
      } catch (error) {
        console.error('Terminal setup error:', error);
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearTimeout(initTimer);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      xtermRef.current = null;
      fitAddonRef.current = null;
      setIsReady(false);
    };
  }, [handleResize]);

  return {
    terminalRef,
    isReady,
    focusTerminal: useCallback(() => {
      if (xtermRef.current) {
        xtermRef.current.focus();
      }
    }, [])
  };
}