import React, { useState, useEffect } from 'react';

export const GridOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Keyboard shortcut to toggle grid (Ctrl+G)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'g') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-[9999] pointer-events-none flex flex-col justify-start">
      <div className="w-[95%] mx-auto h-full">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className={`
                h-full border-x border-dotted border-blue-400/30 bg-blue-400/5
                ${i >= 4 ? 'hidden md:block' : ''} 
              `}
            >
              {/* Optional: Add column number for extra clarity */}
              <div className="w-full text-center text-[10px] font-mono text-blue-400 opacity-50 mt-2">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Helper Tag */}
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-auto cursor-pointer" onClick={() => setIsVisible(false)}>
        GRID ON (Ctrl+G to toggle)
      </div>
    </div>
  );
};
