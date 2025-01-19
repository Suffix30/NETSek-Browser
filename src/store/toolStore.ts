import { create } from 'zustand';
import { ToolResult, ToolConfig } from '../types/tools';
import { runTool, tools } from '../utils/toolRunner';

interface ToolStore {
  results: ToolResult[];
  running: string[];
  showRawOutput: boolean;
  configs: Record<string, ToolConfig>;
  executeTool: (toolId: string, target: string) => Promise<void>;
  clearResults: () => void;
  toggleRawOutput: () => void;
  updateToolConfig: (toolId: string, config: Partial<ToolConfig>) => void;
  saveConfig: (toolId: string, config: ToolConfig) => void;
  loadConfig: (toolId: string) => ToolConfig | undefined;
  loadAllConfigs: () => void;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  results: [],
  running: [],
  showRawOutput: false,
  configs: {},

  executeTool: async (toolId: string, target: string) => {
    set(state => ({ running: [...state.running, toolId] }));

    try {
      const result = await runTool(toolId, target);
      set(state => ({
        results: [result, ...state.results],
        running: state.running.filter(id => id !== toolId)
      }));
    } catch (error) {
      set(state => ({
        results: [
          {
            id: Date.now().toString(),
            toolId,
            timestamp: Date.now(),
            target,
            output: String(error),
            status: 'error'
          },
          ...state.results
        ],
        running: state.running.filter(id => id !== toolId)
      }));
    }
  },

  clearResults: () => set({ results: [] }),
  
  toggleRawOutput: () => set(state => ({ showRawOutput: !state.showRawOutput })),
  
  updateToolConfig: (toolId: string, config: Partial<ToolConfig>) => {
    const currentConfig = tools[toolId];
    tools[toolId] = { ...currentConfig, ...config };
    
    try {
      const configs = JSON.parse(localStorage.getItem('toolConfigs') || '{}');
      configs[toolId] = tools[toolId];
      localStorage.setItem('toolConfigs', JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save tool config:', error);
    }
  },

  saveConfig: (toolId: string, config: ToolConfig) => {
    set(state => ({
      configs: {
        ...state.configs,
        [toolId]: config
      }
    }));

    try {
      const configs = JSON.parse(localStorage.getItem('toolConfigs') || '{}');
      configs[toolId] = config;
      localStorage.setItem('toolConfigs', JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save tool config:', error);
    }
  },

  loadConfig: (toolId: string) => {
    const { configs } = get();
    return configs[toolId];
  },

  loadAllConfigs: () => {
    try {
      const savedConfigs = JSON.parse(localStorage.getItem('toolConfigs') || '{}');
      set({ configs: savedConfigs });
      
      Object.entries(savedConfigs).forEach(([toolId, config]) => {
        if (tools[toolId]) {
          tools[toolId] = { ...tools[toolId], ...config };
        }
      });
    } catch (error) {
      console.error('Failed to load tool configs:', error);
    }
  }
}));