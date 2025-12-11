import React from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  "COPPER (HG)", "GOLD (GC)", "SILVER (SI)", "PLATINUM (PL)", 
  "PALLADIUM (PA)", "SILICON (SI)", "TUNGSTEN (W)", "TITANIUM (TI)",
  "HELIUM (HE)", "NEON (NE)", "COBALT (CO)", "LITHIUM (LI)"
];

export const Ticker: React.FC = () => {
  return (
    <div className="w-full py-6 border-y border-text border-opacity-10 bg-surface relative z-10 overflow-hidden">
      <motion.div 
        className="flex whitespace-nowrap items-center"
        animate={{ x: "-30%" }}
        transition={{ 
          repeat: Infinity, 
          ease: "linear", 
          duration: 40 
        }}
      >
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center mx-8">
            <span className="w-2 h-2 bg-accent rounded-full mr-4"></span>
            <span className="font-sans font-bold text-xl md:text-2xl tracking-tight text-text opacity-80">
              {item}
            </span>
            <span className="ml-4 font-mono text-sm text-secondary">+0.{idx}4%</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
