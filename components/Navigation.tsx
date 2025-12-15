import React from 'react';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 left-0 right-0 z-50 flex justify-center text-text bg-background border-b-[3px] border-text"
    >
      <div className="w-[95%] mx-auto grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-center py-5">
        <div className="col-span-2 md:col-span-4 flex flex-col">
          <span className="font-sans text-xl font-extrabold tracking-tighter text-text uppercase">SEMI_TRACE</span>
        </div>
        
        <div className="col-span-2 md:col-span-8 flex items-center justify-end gap-6 md:gap-8">
          <a href="#materials" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Materials</a>
          <a href="#risk" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Geo-Risk</a>
          <a href="#energy" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Energy</a>
          <a href="#tooling" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Foundry</a>
        </div>
      </div>
    </motion.nav>
  );
};
