import React, { useState, useEffect, useCallback } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  defaultHeight = 256,
  minHeight = 100,
  maxHeight = 800,
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const newHeight = windowHeight - mouseY;
      
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
        localStorage.setItem('panelHeight', newHeight.toString());
      }
    }
  }, [isDragging, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const savedHeight = localStorage.getItem('panelHeight');
    if (savedHeight) {
      const parsedHeight = parseInt(savedHeight, 10);
      if (parsedHeight >= minHeight && parsedHeight <= maxHeight) {
        setHeight(parsedHeight);
      }
    }
  }, [minHeight, maxHeight]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div style={{ height }} className="relative">
      <div
        className="absolute top-0 left-0 right-0 h-1 bg-cyan-500 cursor-ns-resize hover:bg-cyan-400 transition-colors"
        onMouseDown={handleMouseDown}
      />
      <div className="h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};