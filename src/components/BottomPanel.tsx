import React from 'react';
import { usePanelStore } from '../store/panelStore';
import { ResultsPanel } from './ResultsPanel';
import { SecurityPanel } from './SecurityPanel';
import { Console } from './Console';
import { ToolConfig } from './ToolConfig';
import { HeaderInspector } from './HeaderInspector';
import { Terminal } from './Terminal';

export const BottomPanel: React.FC = () => {
  const { activePanel, setActivePanel } = usePanelStore();

  const tabs = [
    { id: 'results', label: 'Results' },
    { id: 'security', label: 'Security' },
    { id: 'console', label: 'Console' },
    { id: 'config', label: 'Config' },
    { id: 'headers', label: 'Headers' },
    { id: 'terminal', label: 'Terminal' },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="flex space-x-1 px-4 py-2 bg-gray-900 border-b border-cyan-500">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`px-3 py-1 rounded transition-colors ${
              activePanel === tab.id
                ? 'bg-cyan-500 text-black'
                : 'text-cyan-500 hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {activePanel === 'results' && <ResultsPanel />}
        {activePanel === 'security' && (
          <SecurityPanel
            analysis={{
              headers: {},
              cookies: [],
              certificates: null,
            }}
          />
        )}
        {activePanel === 'console' && <Console />}
        {activePanel === 'config' && <ToolConfig />}
        {activePanel === 'headers' && (
          <HeaderInspector
            requestHeaders={{
              'User-Agent': 'WEBSec Browser',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'none',
              'Sec-Fetch-User': '?1',
            }}
            responseHeaders={{}}
          />
        )}
        {activePanel === 'terminal' && <Terminal />}
      </div>
    </div>
  );
};