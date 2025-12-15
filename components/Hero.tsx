import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col justify-end bg-background pb-12 pt-32 px-6 md:px-12 overflow-hidden">
      
      {/* Content Container */}
      <div className="w-full max-w-[94vw] mx-auto z-10 flex flex-col">
        
        {/* Massive Headline */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[15vw] md:text-[16vw] tracking-tighter text-text leading-[0.8] mb-8 md:mb-12 origin-left"
        >
          Raw Material
        </motion.h1>

        {/* The 'Vent' Divider Block */}
        <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
            className="w-full origin-left"
        >
             {/* Text Row: Technical Header */}
             <div className="border-t border-b border-text py-1 mb-1.5 flex justify-between items-end">
                <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text">
                    SEMITRACE ANALYTICS
                </span>
                <div className="flex gap-4 md:gap-8">
                    <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text hidden md:inline-block">
                        REAL-TIME SUPPLY CHAIN INTELLIGENCE
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text">
                        © 2025
                    </span>
                </div>
             </div>
             
             {/* The 'Vent' Lines Style */}
             <div className="flex flex-col gap-[3px] pb-8 md:pb-12">
                <div className="h-[4px] md:h-[5px] w-full bg-text"></div>
                <div className="h-[4px] md:h-[5px] w-full bg-text"></div>
                <div className="h-[4px] md:h-[5px] w-full bg-text"></div>
                <div className="h-[4px] md:h-[5px] w-full bg-text"></div>
             </div>
        </motion.div>

        {/* Lower Info Blocks - 12 Column Grid */}
        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-start pt-6 border-t border-transparent">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="col-span-4 md:col-span-4"
          >
            <h3 className="font-mono font-bold text-xs mb-3 uppercase tracking-tight decoration-text underline underline-offset-4 decoration-2">Semiconductor Index</h3>
            <p className="font-sans text-sm font-medium leading-relaxed text-secondary max-w-xs">
              Tracking the 14 critical elements required to manufacture a 3nm silicon wafer.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="col-span-4 md:col-span-4"
          >
             <h3 className="font-mono font-bold text-xs mb-3 uppercase tracking-tight decoration-text underline underline-offset-4 decoration-2">Data Sources</h3>
             <p className="font-sans text-sm font-medium text-secondary leading-relaxed max-w-xs">
               Integrated live streams from LME, COMEX, and proprietary distinct mining output analysis.
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="col-span-4 md:col-span-4"
          >
             <h3 className="font-mono font-bold text-xs mb-3 uppercase tracking-tight decoration-text underline underline-offset-4 decoration-2">Market Coverage</h3>
             <p className="font-sans text-sm font-medium text-secondary leading-relaxed max-w-xs">
               Real-time arbitrage monitoring across Asian, European, and North American spot markets.
             </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};