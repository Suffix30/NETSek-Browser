import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { terminalOptions } from './terminalConfig';
import { handleTerminalCommand } from './terminalHandler';
import { MutableRefObject } from 'react';

export const initializeTerminal = async (
  container: HTMLDivElement,
  commandRef: MutableRefObject<string>,
  historyRef: MutableRefObject<string[]>
) => {
  if (!container.offsetHeight || !container.offsetWidth) {
    await new Promise<void>((resolve) => {
      const observer = new ResizeObserver(() => {
        if (container.offsetHeight > 0 && container.offsetWidth > 0) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(container);
    });
  }

  const term = new XTerm({
    ...terminalOptions,
    allowTransparency: true,
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    theme: terminalOptions.theme,
    rendererType: 'canvas'
  });

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon());

  container.innerHTML = '';
  term.open(container);

  await new Promise(resolve => setTimeout(resolve, 0));
  fitAddon.fit();

  term.reset();
  term.write('\r\n$ ');

  const resizeObserver = new ResizeObserver(() => {
    if (container.offsetHeight > 0 && container.offsetWidth > 0) {
      try {
        fitAddon.fit();
      } catch (error) {
        console.error('Fit error:', error);
      }
    }
  });

  resizeObserver.observe(container);

  term.onData((data: string) => {
    switch (data) {
      case '\r':
        if (commandRef.current.trim()) {
          term.write('\r\n');
          handleTerminalCommand(term, commandRef.current.trim(), historyRef.current);
          historyRef.current = [commandRef.current.trim(), ...historyRef.current];
          commandRef.current = '';
          term.write('\r\n$ ');
        } else {
          term.write('\r\n$ ');
        }
        break;

      case '\u0003':
        term.write('^C\r\n$ ');
        commandRef.current = '';
        break;

      case '\u007F':
        if (commandRef.current.length > 0) {
          term.write('\b \b');
          commandRef.current = commandRef.current.slice(0, -1);
        }
        break;

      default:
        if (data >= String.fromCharCode(0x20) && data <= String.fromCharCode(0x7E)) {
          term.write(data);
          commandRef.current += data;
        }
    }
  });

  const cleanup = () => {
    resizeObserver.disconnect();
    term.dispose();
  };

  return { term, fitAddon, cleanup };
};