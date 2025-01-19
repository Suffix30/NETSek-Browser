import { create } from 'zustand';
import { BrowserState } from '../types/tools';
import { SecurityAnalysis } from '../types/browser';

interface BrowserStore extends BrowserState {
  navigate: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  addTab: () => void;
  closeTab: (id: number) => void;
  setActiveTab: (id: number) => void;
  updateSecurityAnalysis: (analysis: SecurityAnalysis) => void;
  securityAnalysis: SecurityAnalysis;
}

export const useBrowserStore = create<BrowserStore>((set) => ({
  url: '',
  history: [],
  currentIndex: -1,
  activeTab: 0,
  tabs: [{ id: 0, url: '', title: 'New Tab' }],
  securityAnalysis: {
    headers: {},
    cookies: [],
    certificates: null,
  },

  navigate: (url) =>
    set((state) => {
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), url];
      const newIndex = newHistory.length - 1;
      
      return {
        url,
        history: newHistory,
        currentIndex: newIndex,
        tabs: state.tabs.map((tab) =>
          tab.id === state.activeTab ? { ...tab, url, title: url } : tab
        ),
      };
    }),

  goBack: () =>
    set((state) => {
      if (state.currentIndex > 0) {
        const newIndex = state.currentIndex - 1;
        const previousUrl = state.history[newIndex];
        return {
          url: previousUrl,
          currentIndex: newIndex,
          tabs: state.tabs.map((tab) =>
            tab.id === state.activeTab ? { ...tab, url: previousUrl, title: previousUrl } : tab
          ),
        };
      }
      return state;
    }),

  goForward: () =>
    set((state) => {
      if (state.currentIndex < state.history.length - 1) {
        const newIndex = state.currentIndex + 1;
        const nextUrl = state.history[newIndex];
        return {
          url: nextUrl,
          currentIndex: newIndex,
          tabs: state.tabs.map((tab) =>
            tab.id === state.activeTab ? { ...tab, url: nextUrl, title: nextUrl } : tab
          ),
        };
      }
      return state;
    }),

  addTab: () =>
    set((state) => ({
      tabs: [...state.tabs, { id: Date.now(), url: '', title: 'New Tab' }],
      activeTab: Date.now(),
    })),

  closeTab: (id) =>
    set((state) => ({
      tabs: state.tabs.filter((tab) => tab.id !== id),
      activeTab:
        state.activeTab === id ? state.tabs[0]?.id : state.activeTab,
    })),

  setActiveTab: (id) =>
    set((state) => {
      const tab = state.tabs.find((t) => t.id === id);
      return {
        activeTab: id,
        url: tab?.url || '',
        currentIndex: tab?.url ? state.history.indexOf(tab.url) : state.currentIndex,
      };
    }),

  updateSecurityAnalysis: (analysis) =>
    set(() => ({
      securityAnalysis: analysis,
    })),
}));