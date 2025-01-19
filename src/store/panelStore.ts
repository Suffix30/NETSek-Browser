import { create } from 'zustand';

interface PanelStore {
  activePanel: 'results' | 'security' | 'console' | 'config' | 'headers' | 'terminal';
  setActivePanel: (panel: 'results' | 'security' | 'console' | 'config' | 'headers' | 'terminal') => void;
}

export const usePanelStore = create<PanelStore>((set) => ({
  activePanel: 'results',
  setActivePanel: (panel) => set({ activePanel: panel }),
}));