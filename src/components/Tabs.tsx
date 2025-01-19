import React from 'react';
import { X } from 'lucide-react';
import { useBrowserStore } from '../store/browserStore';

export const Tabs: React.FC = () => {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useBrowserStore();

  return (
    <div className="flex items-center bg-gray-900 border-b border-cyan-500">
      <div className="flex-1 flex">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group relative flex items-center space-x-2 px-4 py-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="truncate max-w-xs">{tab.title}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => addTab()}
        className="px-4 py-2 text-cyan-500 hover:bg-gray-800"
      >
        +
      </button>
    </div>
  );
};