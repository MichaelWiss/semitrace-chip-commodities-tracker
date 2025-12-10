
import React from 'react';
import { motion } from 'framer-motion';

export const Navigation: React.FC = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8 text-text"
    >
      <div className="flex flex-col">
        <span className="font-serif text-2xl font-bold tracking-tighter leading-none">SEMI</span>
        <span className="font-serif text-2xl font-bold tracking-tighter leading-none ml-2">TRACE</span>
      </div>
      
      <div className="hidden md:flex items-center gap-12">
        <a href="#materials" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors">INDEX</a>
        <a href="#risk" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors">RISK MAP</a>
        <a href="#energy" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors">ENERGY</a>
        <a href="#tooling" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors">INDUSTRIAL</a>
        <a href="#analysis" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors">ANALYSIS</a>
      </div>

      <div>
        <div className="group cursor-pointer">
          <div className="h-[2px] w-8 bg-text mb-1.5 transition-all group-hover:w-6 ml-auto"></div>
          <div className="h-[2px] w-8 bg-text transition-all group-hover:w-4 ml-auto"></div>
        </div>
      </div>
    </motion.nav>
  );
};
