import React, { useState, useMemo } from 'react';
import { Tool } from '../types/tools';
import { 
  Network, Shield, Globe,
  Wifi, Cloud, MonitorSmartphone, Terminal, Server, Code, ChevronDown, ChevronRight
} from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import { useBrowserStore } from '../store/browserStore';
import { tools } from '../utils/toolRunner';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'web':
      return <MonitorSmartphone className="text-blue-500" />;
    case 'network':
      return <Network className="text-green-500" />;
    case 'subdomain':
      return <Globe className="text-purple-500" />;
    case 'service':
      return <Server className="text-yellow-500" />;
    case 'cloud':
      return <Cloud className="text-cyan-500" />;
    case 'application':
      return <Code className="text-pink-500" />;
    case 'wireless':
      return <Wifi className="text-red-500" />;
    case 'misc':
      return <Terminal className="text-gray-500" />;
    default:
      return <Shield className="text-cyan-500" />;
  }
};

const categoryNames: Record<string, string> = {
  web: 'Web Enumeration',
  network: 'Network & Port',
  subdomain: 'Subdomain & DNS',
  service: 'Service Enumeration',
  cloud: 'Cloud & API',
  application: 'Application',
  wireless: 'Wireless & IoT',
  misc: 'Miscellaneous'
};

export const ToolPanel: React.FC = () => {
  const { executeTool } = useToolStore();
  const { url } = useBrowserStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const groupedTools = useMemo<Record<string, Tool[]>>(() => {
    return Object.entries(tools).reduce((acc, [, tool]) => {
      const category = tool.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
    }, {} as Record<string, Tool[]>);
  }, []);

  const handleToolClick = (toolId: string) => {
    if (!url) {
      alert('Please enter a URL first');
      return;
    }
    executeTool(toolId, url);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="w-64 neo-panel overflow-y-auto border-r border-cyan-500/30">
      <h2 className="text-cyan-500 text-xl font-bold p-4">Security Tools</h2>
      <div className="space-y-2">
        {Object.entries(groupedTools).map(([category, categoryTools]) => (
          <div key={category} className="px-2">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 neo-button"
            >
              <div className="flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span className="uppercase">{categoryNames[category] || category}</span>
              </div>
              {expandedCategories[category] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
            {expandedCategories[category] && (
              <div className="ml-2 space-y-1 mt-1">
                {categoryTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 text-left transition-all duration-200 group neo-button"
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium group-hover:text-cyan-500 transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-gray-400 text-sm">{tool.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};