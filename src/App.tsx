import React, { useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ToolPanel } from './components/ToolPanel';
import { WebView } from './components/WebView';
import { Tabs } from './components/Tabs';
import { ResizablePanel } from './components/ResizablePanel';
import { VPNManager } from './components/VPNManager';
import { ThemeToggle } from './components/ThemeToggle';
import { BottomPanel } from './components/BottomPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { useToolStore } from './store/toolStore';
import { useThemeStore } from './store/themeStore';

function App() {
  const { loadAllConfigs } = useToolStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    loadAllConfigs();
  }, [loadAllConfigs]);

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-cyan-500">
        <Tabs />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <VPNManager />
        </div>
      </div>
      <Navigation />
      <div className="flex-1 flex overflow-hidden">
        <ToolPanel />
        <div className="flex-1 flex flex-col">
          <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
            <WebView />
          </div>
          <ResizablePanel defaultHeight={256} minHeight={150} maxHeight={800}>
            <BottomPanel />
          </ResizablePanel>
        </div>
        <ResultsPanel />
      </div>
    </div>
  );
}

export default App;