import { Terminal } from 'xterm';
import { commands } from './terminalCommands';

export const handleTerminalCommand = (
  term: Terminal,
  input: string,
  history: string[]
) => {
  const [cmd, ...args] = input.trim().toLowerCase().split(' ');
  const command = commands[cmd];

  if (command) {
    command.execute(term, args, history);
  } else if (cmd) {
    term.writeln(`Command not found: ${cmd}`);
    term.writeln('Type "help" for available commands');
  }
};