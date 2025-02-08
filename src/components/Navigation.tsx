import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Shield } from 'lucide-react';
import { useBrowserStore } from '../store/browserStore';

export const Navigation: React.FC = () => {
  const { url, navigate, goBack, goForward, history, currentIndex } = useBrowserStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      navigate(url);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
      e.target.value = `https://${newUrl}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      if (input.value) {
        navigate(input.value);
      }
    }
  };

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  return (
    <div className="flex items-center space-x-4 p-4 neo-panel">
      <div className="flex space-x-2">
        <button
          onClick={goBack}
          className={`neo-pill p-3 ${canGoBack ? 'text-cyan-500' : 'text-gray-500 cursor-not-allowed'}`}
          title="Go Back"
          disabled={!canGoBack}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={goForward}
          className={`neo-pill p-3 ${canGoForward ? 'text-cyan-500' : 'text-gray-500 cursor-not-allowed'}`}
          title="Go Forward"
          disabled={!canGoForward}
        >
          <ArrowRight size={20} />
        </button>
        <button
          onClick={() => url && navigate(url)}
          className="neo-pill p-3 text-cyan-500"
          title="Reload"
        >
          <RotateCw size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="flex items-center neo-border rounded-full px-4 py-2 bg-gray-900/50">
          <Shield size={20} className="text-cyan-500 mr-3" />
          <input
            type="text"
            name="url"
            defaultValue={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter URL (e.g., https://discord.gg/kirasec)"
            className="w-full bg-transparent text-white neo-text"
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </form>
    </div>
  );
};