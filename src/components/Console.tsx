import React, { useState, useEffect } from 'react';
import { Terminal, Play, Save, Trash, Info } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useBrowserStore } from '../store/browserStore';
import { useScriptStore } from '../store/scriptStore';
import type { Script } from '../store/scriptStore';

export const Console: React.FC = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [scriptName, setScriptName] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { url } = useBrowserStore();
  const { scripts, addScript, deleteScript, loadScripts } = useScriptStore();

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  const executeCode = async () => {
    try {
      setError(null);
      setOutput('Executing script...');
      const iframe = document.querySelector('iframe');
      if (!iframe?.contentWindow) {
        throw new Error('Unable to access page context');
      }

      const safeEval = new Function('window', `
        try {
          with (window) {
            ${code}
          }
          return { success: true, result: undefined };
        } catch (error) {
          return { success: false, error: error.message };
        }
      `);

      const result = safeEval.call(iframe.contentWindow, iframe.contentWindow);
      
      if (result.success) {
        setOutput(`Success: Script executed successfully\nResult: ${JSON.stringify(result.result, null, 2)}`);
      } else {
        setError(result.error);
        setOutput(`Error: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setOutput(`Error: ${errorMessage}`);
    }
  };

  const saveScript = () => {
    if (!scriptName) {
      setError('Please enter a script name');
      return;
    }

    addScript({
      name: scriptName,
      code,
      description: scriptDescription,
    });

    setScriptName('');
    setScriptDescription('');
    setOutput('Script saved successfully');
    setError(null);
  };

  const loadScript = (script: Script) => {
    setCode(script.code);
    setOutput(`Loaded script: ${script.name}`);
    setError(null);
  };

  return (
    <div className="bg-gray-900 border-t border-cyan-500 h-full">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-cyan-500">
        <div className="flex items-center">
          <Terminal className="text-cyan-500 mr-2" />
          <h3 className="text-white font-medium">JavaScript Console</h3>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            placeholder="Script name"
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          />
          <input
            type="text"
            value={scriptDescription}
            onChange={(e) => setScriptDescription(e.target.value)}
            placeholder="Description (optional)"
            className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
          />
          <button
            onClick={saveScript}
            className="p-1 text-cyan-500 hover:bg-gray-700 rounded"
            title="Save Script"
          >
            <Save size={16} />
          </button>
          <button
            onClick={executeCode}
            className="p-1 text-green-500 hover:bg-gray-700 rounded"
            title="Execute"
            disabled={!url}
          >
            <Play size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 h-[calc(100%-2.5rem)]">
        <div className="col-span-1 bg-gray-800 p-2 border-r border-cyan-500 overflow-y-auto">
          <h4 className="text-cyan-500 text-sm font-medium mb-2">Saved Scripts</h4>
          <div className="space-y-1">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="flex items-center justify-between p-1 hover:bg-gray-700 rounded group"
              >
                <button
                  onClick={() => loadScript(script)}
                  className="text-sm text-gray-300 hover:text-white truncate flex-1 text-left"
                  title={script.description}
                >
                  <div className="flex items-center">
                    {script.name}
                    {script.description && (
                      <Info size={12} className="ml-1 text-gray-500" />
                    )}
                  </div>
                </button>
                <button
                  onClick={() => deleteScript(script.id)}
                  className="hidden group-hover:block text-red-500 p-1 hover:bg-gray-600 rounded"
                >
                  <Trash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 grid grid-rows-2">
          <div className="p-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-gray-800 text-white p-2 rounded border border-cyan-500 focus:outline-none focus:border-purple-500 text-sm font-mono"
              placeholder="Enter JavaScript code..."
            />
          </div>
          <div className="p-2 bg-gray-800">
            <SyntaxHighlighter
              language="javascript"
              style={tomorrow}
              customStyle={{
                background: 'transparent',
                height: '100%',
                margin: 0,
                fontSize: '12px',
                borderRadius: '0.375rem',
                border: error ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(0, 255, 242, 0.2)'
              }}
            >
              {output}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
};