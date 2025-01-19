import React, { useEffect, useRef } from 'react';
import { useBrowserStore } from '../store/browserStore';
import { analyzeRequest } from '../utils/securityAnalyzer';
import { EmptyState } from './EmptyState';

export const WebView: React.FC = () => {
  const { url, updateSecurityAnalysis, navigate } = useBrowserStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (url) {
      // Ensure URL has protocol
      let normalizedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        normalizedUrl = `https://${url}`;
        navigate(normalizedUrl);
      }

      // Update page title based on URL
      try {
        const urlObj = new URL(normalizedUrl);
        document.title = `${urlObj.hostname} - WEBSec Browser`;
      } catch (error) {
        console.error('Invalid URL:', error);
      }

      analyzeRequest(normalizedUrl).then(analysis => {
        updateSecurityAnalysis(analysis);
      });
    }
  }, [url, updateSecurityAnalysis, navigate]);

  const handleIframeLoad = () => {
    // We don't try to access iframe content directly to avoid security issues
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Update URL in address bar if it changed due to redirect
    if (iframe.src !== url) {
      navigate(iframe.src);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Handle clicks on links that might bubble up
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      const href = (target as HTMLAnchorElement).href;
      if (href) {
        navigate(href);
      }
    }
  };

  return (
    <div className="w-full h-full neo-brutalism" onClick={handleContainerClick}>
      {url ? (
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-popups allow-forms"
          onLoad={handleIframeLoad}
          title="Security Browser Viewport"
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};