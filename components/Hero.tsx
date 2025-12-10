import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Hero: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  return (
    <div ref={ref} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background pt-20">
      
      {/* Editorial Decorative Lines */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] bg-subtle"></div>
        <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] bg-subtle"></div>
        <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-subtle opacity-50 hidden md:block"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-[1px] bg-subtle opacity-50 hidden md:block"></div>
      </div>

      <motion.div style={{ y }} className="z-10 text-center flex flex-col items-center max-w-[90vw]">
        
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8"
        >
          <span className="inline-block border border-text px-4 py-1 rounded-full text-xs font-sans font-semibold tracking-widest uppercase">
            Global Supply Chain Monitor
          </span>
        </motion.div>

        <div className="relative">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[15vw] md:text-[12vw] tracking-tighter text-text leading-[0.85] relative z-10"
          >
            RAW<br/>
            <span className="italic text-secondary font-light">MATERIAL</span>
          </motion.h1>
          
          {/* Decorative Circle behind text */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-accent rounded-full opacity-20 -z-10"
          />
        </div>

        <div className="mt-12 md:mt-24 flex flex-col md:flex-row gap-8 md:gap-24 items-start md:items-end text-left px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-xs"
          >
            <h3 className="font-sans font-bold text-sm mb-2 uppercase tracking-wide">Semiconductor Index</h3>
            <p className="font-serif text-lg leading-snug text-secondary">
              Tracking the 14 critical elements required to manufacture a 3nm silicon wafer.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-xs"
          >
             <h3 className="font-sans font-bold text-sm mb-2 uppercase tracking-wide">Data Sources</h3>
             <p className="font-sans text-sm text-secondary">
               Integrated live streams from LME, COMEX, and proprietary distinct mining output analysis.
             </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};