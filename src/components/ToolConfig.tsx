import React, { useState } from 'react';
import { Settings, Save, Plus, Trash } from 'lucide-react';
import { useToolStore } from '../store/toolStore';
import { tools } from '../utils/toolRunner';
import type { ToolConfig } from '../utils/toolRunner';

export const ToolConfigPanel: React.FC = () => {
  const { updateToolConfig, saveConfig } = useToolStore();
  const [selectedTool, setSelectedTool] = useState<string>(Object.keys(tools)[0]);
  const [newArg, setNewArg] = useState<Partial<NonNullable<ToolConfig['args']>[number]>>({});

  const handleSave = () => {
    try {
      const toolConfig = {
        ...tools[selectedTool]
      } as ToolConfig;
      saveConfig(selectedTool, toolConfig);
    } catch (error) {
      console.error('Invalid tool configuration:', error);
    }
  };

  const handleAddArgument = () => {
    if (!newArg.name || !newArg.type) return;

    const currentTool = tools[selectedTool];
    const currentArgs = currentTool.args || [];

    updateToolConfig(selectedTool, {
      args: [
        ...currentArgs,
        {
          name: newArg.name,
          description: newArg.description || '',
          type: newArg.type as 'string' | 'number' | 'boolean',
          default: newArg.default,
          required: newArg.required || false,
        },
      ],
    });

    setNewArg({});
  };

  const handleRemoveArgument = (name: string) => {
    const currentTool = tools[selectedTool];
    const currentArgs = currentTool.args || [];

    updateToolConfig(selectedTool, {
      args: currentArgs.filter(arg => arg.name !== name),
    });
  };

  return (
    <div className="bg-gray-900 border-t border-cyan-500 h-64 overflow-y-auto">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-cyan-500">
        <div className="flex items-center">
          <Settings className="text-cyan-500 mr-2" />
          <h3 className="text-white font-medium">Tool Configuration</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTool}
            onChange={(e) => setSelectedTool(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            {Object.entries(tools).map(([id, tool]) => (
              <option key={id} value={id}>
                {tool.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-3 py-1 bg-cyan-500 text-black rounded hover:bg-cyan-400"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Command Template
          </label>
          <input
            type="text"
            value={tools[selectedTool].command}
            onChange={(e) =>
              updateToolConfig(selectedTool, { command: e.target.value })
            }
            className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-cyan-500 focus:outline-none focus:border-purple-500"
          />
          <p className="text-gray-400 text-sm">
            Available variables: {'{target}'}, {'{port}'}, {'{protocol}'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Arguments</h4>
          <div className="space-y-2">
            {tools[selectedTool].args?.map((arg) => (
              <div
                key={arg.name}
                className="flex items-center space-x-2 bg-gray-800 p-2 rounded"
              >
                <div className="flex-1">
                  <div className="text-cyan-500">{arg.name}</div>
                  <div className="text-gray-400 text-sm">{arg.description}</div>
                </div>
                <div className="text-gray-400 text-sm">{arg.type}</div>
                <button
                  onClick={() => handleRemoveArgument(arg.name)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 p-4 rounded space-y-2">
            <h5 className="text-sm font-medium text-cyan-500">Add Argument</h5>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Name"
                value={newArg.name || ''}
                onChange={(e) => setNewArg({ ...newArg, name: e.target.value })}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              />
              <select
                value={newArg.type || ''}
                onChange={(e) =>
                  setNewArg({ ...newArg, type: e.target.value as any })
                }
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                <option value="">Select Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={newArg.description || ''}
                onChange={(e) =>
                  setNewArg({ ...newArg, description: e.target.value })
                }
                className="bg-gray-700 text-white px-3 py-1 rounded col-span-2"
              />
              <button
                onClick={handleAddArgument}
                className="col-span-2 flex items-center justify-center space-x-1 px-3 py-1 bg-cyan-500 text-black rounded hover:bg-cyan-400"
              >
                <Plus size={16} />
                <span>Add Argument</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};