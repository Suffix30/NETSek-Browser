import { create } from 'zustand';

export interface Script {
  id: string;
  name: string;
  code: string;
  description?: string;
  created: number;
  lastModified: number;
}

interface ScriptStore {
  scripts: Script[];
  addScript: (script: Omit<Script, 'id' | 'created' | 'lastModified'>) => void;
  updateScript: (id: string, updates: Partial<Omit<Script, 'id'>>) => void;
  deleteScript: (id: string) => void;
  loadScripts: () => void;
}

export const useScriptStore = create<ScriptStore>((set, get) => ({
  scripts: [],

  addScript: (script) => {
    const newScript: Script = {
      ...script,
      id: Date.now().toString(),
      created: Date.now(),
      lastModified: Date.now(),
    };

    set(state => {
      const newScripts = [...state.scripts, newScript];
      localStorage.setItem('savedScripts', JSON.stringify(newScripts));
      return { scripts: newScripts };
    });
  },

  updateScript: (id, updates) => {
    set(state => {
      const newScripts = state.scripts.map(script =>
        script.id === id
          ? { ...script, ...updates, lastModified: Date.now() }
          : script
      );
      localStorage.setItem('savedScripts', JSON.stringify(newScripts));
      return { scripts: newScripts };
    });
  },

  deleteScript: (id) => {
    set(state => {
      const newScripts = state.scripts.filter(script => script.id !== id);
      localStorage.setItem('savedScripts', JSON.stringify(newScripts));
      return { scripts: newScripts };
    });
  },

  loadScripts: () => {
    try {
      const savedScripts = JSON.parse(localStorage.getItem('savedScripts') || '[]');
      set({ scripts: savedScripts });
    } catch (error) {
      console.error('Failed to load saved scripts:', error);
      set({ scripts: [] });
    }
  },
}));