import { useEffect } from 'react';

export function useTerminalResize(handleResize: () => void) {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);
}