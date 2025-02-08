import { Terminal } from '@xterm/xterm';
import { commands } from './terminalCommands';

export const handleTerminalCommand = (
  term: Terminal,
  input: string,
  _history: string[]
) => {
  const [cmd, ...args] = input.trim().toLowerCase().split(' ');
  const command = commands[cmd];

  if (command) {
    command.execute(term, args);
  } else if (cmd) {
    term.writeln(`Command not found: ${cmd}`);
    term.writeln('Type "help" for available commands');
  }
};