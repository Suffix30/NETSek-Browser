import { useRef } from 'react';

export function useTerminalState() {
  const commandRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);

  return {
    commandRef,
    historyRef
  };
}