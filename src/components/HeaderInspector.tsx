import React, { useState } from 'react';
import { ArrowDownUp, Copy } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface HeaderInspectorProps {
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
}

export const HeaderInspector: React.FC<HeaderInspectorProps> = ({
  requestHeaders,
  responseHeaders,
}) => {
  const [view, setView] = useState<'split' | 'diff'>('split');

  const copyHeaders = (headers: Record<string, string>) => {
    const text = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  const getDiff = () => {
    const allHeaders = new Set([
      ...Object.keys(requestHeaders),
      ...Object.keys(responseHeaders),
    ]);

    return Array.from(allHeaders).map((header) => {
      const req = requestHeaders[header];
      const res = responseHeaders[header];
      let status = '  ';
      if (!req) status = '+ ';
      if (!res) status = '- ';
      if (req !== res) status = '~ ';
      return `${status}${header}: ${res || req || ''}`;
    }).join('\n');
  };

  return (
    <div className="bg-gray-900 border-t border-cyan-500">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-cyan-500">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-medium">HTTP Headers</h3>
          <button
            onClick={() => setView(view === 'split' ? 'diff' : 'split')}
            className="flex items-center space-x-1 text-cyan-500 hover:text-cyan-400"
          >
            <ArrowDownUp size={16} />
            <span>{view === 'split' ? 'Show Diff' : 'Show Split'}</span>
          </button>
        </div>
      </div>

      {view === 'split' ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-cyan-500">Request Headers</h4>
              <button
                onClick={() => copyHeaders(requestHeaders)}
                className="text-gray-400 hover:text-white"
                title="Copy headers"
              >
                <Copy size={16} />
              </button>
            </div>
            <SyntaxHighlighter
              language="http"
              style={tomorrow}
              customStyle={{
                background: 'transparent',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #00fff2',
              }}
            >
              {formatHeaders(requestHeaders)}
            </SyntaxHighlighter>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-cyan-500">Response Headers</h4>
              <button
                onClick={() => copyHeaders(responseHeaders)}
                className="text-gray-400 hover:text-white"
                title="Copy headers"
              >
                <Copy size={16} />
              </button>
            </div>
            <SyntaxHighlighter
              language="http"
              style={tomorrow}
              customStyle={{
                background: 'transparent',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #00fff2',
              }}
            >
              {formatHeaders(responseHeaders)}
            </SyntaxHighlighter>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <SyntaxHighlighter
            language="diff"
            style={tomorrow}
            customStyle={{
              background: 'transparent',
              padding: '1rem',
              borderRadius: '0.375rem',
              border: '1px solid #00fff2',
            }}
          >
            {getDiff()}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};