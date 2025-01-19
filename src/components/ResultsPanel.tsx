import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, Copy, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToolStore } from '../store/toolStore';

export const ResultsPanel: React.FC = () => {
  const { results } = useToolStore();
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});

  const toggleResult = (id: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'running':
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-64 neo-panel overflow-y-auto border-l border-cyan-500/30">
      <h2 className="text-cyan-500 text-xl font-bold p-4 border-b border-cyan-500/30">Tool Results</h2>
      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="p-4 text-gray-400 text-center">
            No results yet. Run a tool to see output here.
          </div>
        ) : (
          results.map((result) => (
            <div key={result.id} className="px-2">
              <button
                onClick={() => toggleResult(result.id)}
                className="w-full flex items-center justify-between p-2 text-sm font-medium text-gray-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 neo-button"
              >
                <div className="flex items-center space-x-2">
                  <Terminal size={16} className="text-cyan-500" />
                  <span>{result.toolId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  {expandedResults[result.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </button>
              {expandedResults[result.id] && (
                <div className="ml-2 mt-1 p-2 bg-gray-800/30 rounded-lg border border-cyan-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">
                      {new Date(result.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.output)}
                      className="text-gray-400 hover:text-cyan-500"
                      title="Copy output"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                    {result.output}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};