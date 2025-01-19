import { Terminal } from 'xterm';

export interface TerminalCommand {
  execute: (term: Terminal, args: string[]) => Promise<void>;
  description: string;
}

interface FileSystem {
  currentDir: string;
  files: Record<string, string[]>;
  fileContents: Record<string, string>;
  openFiles: Record<string, { content: string; cursorPos: number }>;
}

// Simulated file system state
const fileSystem: FileSystem = {
  currentDir: '/home/user',
  files: {
    '/': ['home', 'usr', 'etc', 'var'],
    '/home': ['user'],
    '/home/user': ['Documents', 'Downloads', 'Pictures', 'projects'],
    '/home/user/Documents': ['notes.txt', 'report.pdf'],
    '/home/user/Downloads': ['image.jpg', 'file.zip'],
    '/home/user/Pictures': ['screenshot.png', 'avatar.jpg'],
    '/home/user/projects': ['websec-browser', 'test-project'],
    '/usr': ['bin', 'local', 'share'],
    '/etc': ['passwd', 'hosts', 'resolv.conf'],
    '/var': ['log', 'www', 'cache']
  },
  fileContents: {
    '/home/user/Documents/notes.txt': 'Some notes about cybersecurity...',
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash',
    '/etc/hosts': '127.0.0.1 localhost\n::1 localhost ip6-localhost ip6-loopback'
  },
  openFiles: {}
};

const resolvePath = (path: string): string => {
  if (path.startsWith('/')) return path;
  if (path === '..') {
    const parts = fileSystem.currentDir.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : '/';
  }
  if (path === '.') return fileSystem.currentDir;
  return `${fileSystem.currentDir}/${path}`;
};

const formatPermissions = (isDir: boolean): string => {
  return isDir ? 'drwxr-xr-x' : '-rw-r--r--';
};

const formatSize = (path: string): number => {
  if (fileSystem.fileContents[path]) {
    return fileSystem.fileContents[path].length;
  }
  return 4096; // Default size for directories
};

const formatDate = (): string => {
  const date = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2)} ${date.getHours()}:${date.getMinutes()}`;
};

const renderNanoEditor = (term: Terminal, filename: string, content: string, cursorPos: number) => {
  term.clear();
  term.write('\x1b[H'); // Move cursor to home position

  // Header
  term.writeln(`  GNU nano                    ${filename}                    `);
  term.writeln('─'.repeat(term.cols));

  // Content area
  const lines = content.split('\n');
  lines.forEach(line => {
    term.writeln(line);
  });

  // Fill remaining space
  const contentHeight = lines.length;
  const remainingLines = term.rows - contentHeight - 6; // Account for header and footer
  if (remainingLines > 0) {
    term.writeln('\n'.repeat(remainingLines));
  }

  // Footer
  term.writeln('─'.repeat(term.cols));
  term.writeln('^G Get Help  ^O Write Out  ^W Where Is  ^K Cut Text  ^J Justify   ^C Cancel');
  term.writeln('^X Exit      ^R Read File  ^\ Replace   ^U Paste     ^T To Spell');

  // Restore cursor position
  const line = Math.floor(cursorPos / term.cols);
  const col = cursorPos % term.cols;
  term.write(`\x1b[${line + 3};${col + 1}H`);
};

export const commands: Record<string, TerminalCommand> = {
  pwd: {
    execute: async (term) => {
      term.writeln(fileSystem.currentDir);
      term.write('$ ');
    },
    description: 'Print working directory'
  },

  ls: {
    execute: async (term, args) => {
      const path = args.length > 0 ? resolvePath(args[0]) : fileSystem.currentDir;
      const files = fileSystem.files[path];

      if (!files) {
        term.writeln(`ls: cannot access '${path}': No such file or directory`);
        term.write('$ ');
        return;
      }

      if (args.includes('-l')) {
        // Long format
        const total = files.length * 4; // Simulated block count
        term.writeln(`total ${total}`);
        files.forEach(file => {
          const isDir = fileSystem.files[`${path}/${file}`] !== undefined;
          const perms = formatPermissions(isDir);
          const size = formatSize(`${path}/${file}`);
          const date = formatDate();
          term.writeln(`${perms} user user ${size.toString().padStart(8)} ${date} ${file}`);
        });
      } else {
        // Simple format
        term.writeln(files.join('  '));
      }
      term.write('$ ');
    },
    description: 'List directory contents'
  },

  cd: {
    execute: async (term, args) => {
      if (args.length === 0) {
        fileSystem.currentDir = '/home/user';
      } else {
        const newPath = resolvePath(args[0]);
        if (fileSystem.files[newPath]) {
          fileSystem.currentDir = newPath;
        } else {
          term.writeln(`cd: ${args[0]}: No such file or directory`);
        }
      }
      term.write('$ ');
    },
    description: 'Change directory'
  },

  cat: {
    execute: async (term, args) => {
      if (args.length === 0) {
        term.writeln('cat: missing operand');
        term.write('$ ');
        return;
      }

      const path = resolvePath(args[0]);
      const content = fileSystem.fileContents[path];

      if (content === undefined) {
        term.writeln(`cat: ${args[0]}: No such file or directory`);
      } else {
        term.writeln(content);
      }
      term.write('$ ');
    },
    description: 'Concatenate and print files'
  },

  clear: {
    execute: async (term) => {
      term.clear();
      term.write('$ ');
    },
    description: 'Clear terminal screen'
  },

  mkdir: {
    execute: async (term, args) => {
      if (args.length === 0) {
        term.writeln('mkdir: missing operand');
        term.write('$ ');
        return;
      }

      const newPath = resolvePath(args[0]);
      const parentPath = newPath.substring(0, newPath.lastIndexOf('/'));
      const dirName = newPath.substring(newPath.lastIndexOf('/') + 1);

      if (!fileSystem.files[parentPath]) {
        term.writeln(`mkdir: cannot create directory '${args[0]}': No such file or directory`);
      } else if (fileSystem.files[newPath]) {
        term.writeln(`mkdir: cannot create directory '${args[0]}': File exists`);
      } else {
        fileSystem.files[parentPath].push(dirName);
        fileSystem.files[newPath] = [];
      }
      term.write('$ ');
    },
    description: 'Make directories'
  },

  touch: {
    execute: async (term, args) => {
      if (args.length === 0) {
        term.writeln('touch: missing file operand');
        term.write('$ ');
        return;
      }

      const path = resolvePath(args[0]);
      const parentPath = path.substring(0, path.lastIndexOf('/'));
      const fileName = path.substring(path.lastIndexOf('/') + 1);

      if (!fileSystem.files[parentPath]) {
        term.writeln(`touch: cannot touch '${args[0]}': No such file or directory`);
      } else {
        if (!fileSystem.files[parentPath].includes(fileName)) {
          fileSystem.files[parentPath].push(fileName);
        }
        if (!fileSystem.fileContents[path]) {
          fileSystem.fileContents[path] = '';
        }
      }
      term.write('$ ');
    },
    description: 'Change file timestamps'
  },

  rm: {
    execute: async (term, args) => {
      if (args.length === 0) {
        term.writeln('rm: missing operand');
        term.write('$ ');
        return;
      }

      const path = resolvePath(args[0]);
      const parentPath = path.substring(0, path.lastIndexOf('/'));
      const fileName = path.substring(path.lastIndexOf('/') + 1);

      if (!fileSystem.files[parentPath]?.includes(fileName)) {
        term.writeln(`rm: cannot remove '${args[0]}': No such file or directory`);
      } else {
        fileSystem.files[parentPath] = fileSystem.files[parentPath].filter(f => f !== fileName);
        delete fileSystem.fileContents[path];
      }
      term.write('$ ');
    },
    description: 'Remove files or directories'
  },

  help: {
    execute: async (term) => {
      term.writeln('Available commands:');
      Object.entries(commands).forEach(([name, cmd]) => {
        term.writeln(`  ${name.padEnd(12)}${cmd.description}`);
      });
      term.write('$ ');
    },
    description: 'Show this help message'
  },

  nano: {
    execute: async (term, args) => {
      if (args.length === 0) {
        term.writeln('nano: missing filename');
        term.write('$ ');
        return;
      }

      const filename = args[0];
      const path = resolvePath(filename);

      // Initialize or get existing file content
      if (!fileSystem.openFiles[path]) {
        const initialContent = fileSystem.fileContents[path] || '';
        fileSystem.openFiles[path] = {
          content: initialContent,
          cursorPos: 0
        };
      }

      const fileState = fileSystem.openFiles[path];
      renderNanoEditor(term, filename, fileState.content, fileState.cursorPos);

      // Handle keyboard input
      const disposable = term.onKey(({ domEvent }) => {
        const ev = domEvent;
        
        // Handle control keys
        if (ev.ctrlKey) {
          switch (ev.key.toLowerCase()) {
            case 'x': // Exit
              disposable.dispose();
              term.clear();
              term.write('$ ');
              delete fileSystem.openFiles[path];
              return;
            case 'o': // Save
              fileSystem.fileContents[path] = fileState.content;
              term.writeln('\r\nFile saved');
              return;
          }
          return;
        }

        // Handle regular input
        if (ev.key === 'Enter') {
          const content = fileState.content;
          const pos = fileState.cursorPos;
          fileState.content = content.slice(0, pos) + '\n' + content.slice(pos);
          fileState.cursorPos = pos + 1;
        } else if (ev.key === 'Backspace') {
          if (fileState.cursorPos > 0) {
            const content = fileState.content;
            fileState.content = content.slice(0, fileState.cursorPos - 1) + content.slice(fileState.cursorPos);
            fileState.cursorPos--;
          }
        } else if (ev.key.length === 1) { // Regular character
          const content = fileState.content;
          fileState.content = content.slice(0, fileState.cursorPos) + ev.key + content.slice(fileState.cursorPos);
          fileState.cursorPos++;
        }

        // Re-render editor
        renderNanoEditor(term, filename, fileState.content, fileState.cursorPos);
      });
    },
    description: 'Text editor'
  }
};