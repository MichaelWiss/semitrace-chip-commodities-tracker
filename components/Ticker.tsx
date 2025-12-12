import React from 'react';
import { motion } from 'framer-motion';
import { Commodity } from '../types';

interface TickerProps {
  commodities?: Commodity[];
}

// Fallback items when no commodities are loaded yet
const FALLBACK_ITEMS = [
  { name: "COPPER (HG)", change: 0.34 },
  { name: "GOLD (GC)", change: 0.14 },
  { name: "SILVER (SI)", change: -0.24 },
  { name: "PLATINUM (PL)", change: 0.44 },
  { name: "PALLADIUM (PA)", change: -0.54 },
  { name: "SILICON (SI)", change: 0.64 },
];

export const Ticker: React.FC<TickerProps> = ({ commodities = [] }) => {
  // Use live commodity data if available, otherwise use fallback
  const tickerItems = commodities.length > 0
    ? commodities.slice(0, 12).map(c => ({
        name: `${c.name.toUpperCase()} (${c.symbol})`,
        change: c.changePercentage
      }))
    : FALLBACK_ITEMS;

  // Duplicate items for seamless scrolling
  const displayItems = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

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
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center mx-8">
            <span className={`w-2 h-2 rounded-full mr-4 ${item.change >= 0 ? 'bg-accent' : 'bg-secondary'}`}></span>
            <span className="font-sans font-bold text-xl md:text-2xl tracking-tight text-text opacity-80">
              {item.name}
            </span>
            <span className={`ml-4 font-mono text-sm ${item.change >= 0 ? 'text-text' : 'text-accent'}`}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
