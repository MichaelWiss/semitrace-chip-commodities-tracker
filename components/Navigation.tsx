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
        <a href="#materials" aria-label="Go to materials index" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">INDEX</a>
        <a href="#risk" aria-label="Go to risk map" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">RISK MAP</a>
        <a href="#energy" aria-label="Go to energy monitor" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">ENERGY</a>
        <a href="#tooling" aria-label="Go to industrial tooling" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">INDUSTRIAL</a>
        <a href="#analysis" aria-label="Go to analysis section" className="text-xs font-sans font-semibold tracking-[0.1em] hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">ANALYSIS</a>
      </div>

      <div>
        <div 
          className="group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" 
          role="button" 
          aria-label="Toggle menu" 
          tabIndex={0}
        >
          <div className="h-[2px] w-8 bg-text mb-1.5 transition-all group-hover:w-6 ml-auto"></div>
          <div className="h-[2px] w-8 bg-text transition-all group-hover:w-4 ml-auto"></div>
        </div>
      </div>
    </motion.nav>
  );
};
