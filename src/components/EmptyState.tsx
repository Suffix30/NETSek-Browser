import React from 'react';
import { Shield } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* 3D Grid Background */}
      <div className="absolute inset-0 perspective-grid">
        <div className="grid-background" />
        <div className="grid-overlay" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center z-10">
        <div className="transform-gpu">
          <Shield 
            size={80} 
            className="text-cyan-500 mb-8"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 242, 0.5))',
              animation: 'float 3s ease-in-out infinite'
            }}
          />
        </div>
        <h1 className="text-5xl font-bold mb-6 glow-text bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-500">
          NETSek Browser
        </h1>
        <p className="text-xl text-gray-400 max-w-lg">
          Enter a URL above to begin your secure browsing experience
        </p>
        
        {/* 3D Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl" />
      </div>
    </div>
  );
}