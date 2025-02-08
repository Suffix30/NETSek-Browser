import { ITerminalOptions } from '@xterm/xterm';

export const terminalOptions: ITerminalOptions = {
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
  cursorStyle: 'block',
  convertEol: true,
  scrollback: 1000
};
