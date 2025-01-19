import React, { useState } from 'react';
import { Network, Power, Upload, X } from 'lucide-react';

interface VPNConfig {
  name: string;
  configPath: string;
  isActive: boolean;
}

export const VPNManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [vpnConfigs, setVPNConfigs] = useState<VPNConfig[]>([
    { name: 'HTB', configPath: '', isActive: false },
    { name: 'TryHackMe', configPath: '', isActive: false }
  ]);

  const handleFileUpload = (name: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVPNConfigs(configs => 
        configs.map(config => 
          config.name === name 
            ? { ...config, configPath: URL.createObjectURL(file) }
            : config
        )
      );
    }
  };

  const toggleVPN = (name: string) => {
    setVPNConfigs(configs =>
      configs.map(config =>
        config.name === name
          ? { ...config, isActive: !config.isActive }
          : config
      )
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-cyan-500"
      >
        <Network size={16} />
        <span>VPN</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 rounded-lg shadow-lg border border-cyan-500 z-50">
          <div className="flex items-center justify-between p-3 border-b border-cyan-500">
            <h3 className="text-white font-medium">VPN Connections</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-3 space-y-3">
            {vpnConfigs.map(config => (
              <div key={config.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white">{config.name}</span>
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".ovpn"
                        onChange={(e) => handleFileUpload(config.name, e)}
                        className="hidden"
                      />
                      <Upload
                        size={16}
                        className={`${
                          config.configPath
                            ? 'text-green-500'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      />
                    </label>
                    <button
                      onClick={() => toggleVPN(config.name)}
                      disabled={!config.configPath}
                      className={`${
                        config.isActive
                          ? 'text-green-500'
                          : 'text-gray-400 hover:text-white'
                      } ${!config.configPath && 'opacity-50 cursor-not-allowed'}`}
                    >
                      <Power size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {config.configPath
                    ? 'OVPN config loaded'
                    : 'Upload OVPN config file'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};