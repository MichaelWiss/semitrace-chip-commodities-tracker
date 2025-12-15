import React from 'react';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 text-text bg-background border-b-[3px] border-text"
    >
      <div className="flex flex-col">
        <span className="font-sans text-xl font-extrabold tracking-tighter text-text uppercase">SEMI_TRACE</span>
      </div>
      
      <div className="flex items-center gap-6 md:gap-8">
        <a href="#materials" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Materials</a>
        <a href="#risk" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Geo-Risk</a>
        <a href="#energy" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Energy</a>
        <a href="#tooling" className="hidden md:inline-block font-mono text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">Foundry</a>
      </div>
    </motion.nav>
  );
};
