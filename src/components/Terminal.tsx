import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { commands } from '../utils/terminalCommands';
import 'xterm/css/xterm.css';

export const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const inputRef = useRef<string>('');
  const cursorPosRef = useRef<number>(0);
  const historyRef = useRef<string[]>([]);
  const historyPosRef = useRef<number>(-1);

  const handleCommand = async (command: string) => {
    const term = xtermRef.current;
    if (!term) return;

    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
      term.write('\r\n$ ');
      return;
    }

    // Add command to history
    historyRef.current = [trimmedCommand, ...historyRef.current];
    historyPosRef.current = -1;

    const [cmd, ...args] = trimmedCommand.split(' ');
    const commandHandler = commands[cmd.toLowerCase()];

    if (commandHandler) {
      await commandHandler.execute(term, args);
    } else {
      term.writeln(`\r\nCommand not found: ${cmd}`);
      term.write('$ ');
    }
  };

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Wait for the container to be ready
    const initializeTerminal = async () => {
      const container = terminalRef.current;
      if (!container) return;

      // Ensure container has dimensions
      if (!container.offsetHeight || !container.offsetWidth) {
        await new Promise<void>((resolve) => {
          const observer = new ResizeObserver(() => {
            if (container.offsetHeight && container.offsetWidth) {
              observer.disconnect();
              resolve();
            }
          });
          observer.observe(container);
        });
      }

      const term = new XTerm({
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#00fff2',
          cursorAccent: '#00fff2',
          black: '#32344a',
          blue: '#7aa2f7',
          cyan: '#00fff2',
          green: '#9ece6a',
          magenta: '#ad8ee6',
          red: '#f7768e',
          white: '#787c99',
          yellow: '#e0af68',
        },
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        cursorBlink: true,
        allowTransparency: true,
        convertEol: true,
        rows: 24,
        cols: 80,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      // Clear container and open terminal
      container.innerHTML = '';
      term.open(container);

      // Ensure terminal is properly sized
      await new Promise(resolve => setTimeout(resolve, 0));
      fitAddon.fit();

      // Initial prompt
      term.write('Welcome to WEBSec Terminal\r\n$ ');

      const refreshLine = () => {
        term.write('\r\x1b[K$ ' + inputRef.current);
        if (cursorPosRef.current < inputRef.current.length) {
          term.write('\x1b[' + (inputRef.current.length - cursorPosRef.current) + 'D');
        }
      };

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) { // Enter
          term.write('\r\n');
          handleCommand(inputRef.current);
          inputRef.current = '';
          cursorPosRef.current = 0;
        } else if (ev.keyCode === 8) { // Backspace
          if (cursorPosRef.current > 0) {
            inputRef.current = 
              inputRef.current.slice(0, cursorPosRef.current - 1) + 
              inputRef.current.slice(cursorPosRef.current);
            cursorPosRef.current--;
            refreshLine();
          }
        } else if (ev.keyCode === 46) { // Delete
          if (cursorPosRef.current < inputRef.current.length) {
            inputRef.current = 
              inputRef.current.slice(0, cursorPosRef.current) + 
              inputRef.current.slice(cursorPosRef.current + 1);
            refreshLine();
          }
        } else if (ev.keyCode === 37) { // Left arrow
          if (cursorPosRef.current > 0) {
            cursorPosRef.current--;
            term.write('\x1b[D');
          }
        } else if (ev.keyCode === 39) { // Right arrow
          if (cursorPosRef.current < inputRef.current.length) {
            cursorPosRef.current++;
            term.write('\x1b[C');
          }
        } else if (ev.keyCode === 38) { // Up arrow
          if (historyRef.current.length > 0 && historyPosRef.current < historyRef.current.length - 1) {
            historyPosRef.current++;
            inputRef.current = historyRef.current[historyPosRef.current];
            cursorPosRef.current = inputRef.current.length;
            refreshLine();
          }
        } else if (ev.keyCode === 40) { // Down arrow
          if (historyPosRef.current > 0) {
            historyPosRef.current--;
            inputRef.current = historyRef.current[historyPosRef.current];
            cursorPosRef.current = inputRef.current.length;
            refreshLine();
          } else if (historyPosRef.current === 0) {
            historyPosRef.current = -1;
            inputRef.current = '';
            cursorPosRef.current = 0;
            refreshLine();
          }
        } else if (printable) {
          if (key.length === 1) {
            inputRef.current = 
              inputRef.current.slice(0, cursorPosRef.current) + 
              key + 
              inputRef.current.slice(cursorPosRef.current);
            cursorPosRef.current++;
            refreshLine();
          }
        }
      });

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Create ResizeObserver only if container exists
      if (container) {
        const resizeObserver = new ResizeObserver(() => {
          if (container.offsetHeight && container.offsetWidth) {
            try {
              fitAddon.fit();
            } catch (error) {
              console.error('Resize error:', error);
            }
          }
        });

        resizeObserver.observe(container);

        return () => {
          resizeObserver.disconnect();
          term.dispose();
          xtermRef.current = null;
          fitAddonRef.current = null;
        };
      }
    };

    initializeTerminal();
  }, []);

  return (
    <div className="h-full bg-gray-900 overflow-hidden flex flex-col neo-panel">
      <div className="flex items-center p-2 bg-gray-800 border-b border-cyan-500">
        <TerminalIcon className="text-cyan-500 mr-2" size={16} />
        <h3 className="text-white font-medium">Terminal</h3>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <div ref={terminalRef} className="h-full w-full" />
      </div>
    </div>
  );
};