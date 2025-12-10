
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolingEntity } from '../types';
import { getToolingEntities } from '../services/marketService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const ToolingTracker: React.FC = () => {
  const [entities, setEntities] = useState<ToolingEntity[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getToolingEntities();
      setEntities(data);
    };
    fetch();
  }, []);

  if (entities.length === 0) return null;

  return (
    <div className="w-full py-24 bg-background border-t border-text/10">
      <div className="max-w-[90vw] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 px-6 md:px-0">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-accent tracking-widest block mb-6">04 — INDUSTRIAL BASE</span>
            <h2 className="font-serif text-5xl md:text-6xl leading-none text-text">
              Lithography & <br />
              <span className="italic text-secondary">Logic</span>
            </h2>
            <p className="font-serif text-lg text-secondary mt-6">
               Monitoring the critical apparatus of the silicon supply chain. <br/>
               Tracking dominance, technological moats, and order backlogs.
            </p>
          </div>
          <div className="mt-8 md:mt-0 text-right hidden md:block">
             <div className="w-32 h-[1px] bg-text mb-4 ml-auto"></div>
             <span className="font-mono text-xs">EQUIPMENT & FOUNDRY<br/><span className="text-accent">SECTOR MONITOR</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((company, idx) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-surface border border-text/10 p-8 group hover:border-text/30 transition-colors relative overflow-hidden"
            >
              {/* Moat Visualization Background */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-text/5 rounded-full blur-3xl group-hover:bg-accent/5 transition-colors"></div>

              {/* Header */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-2xl text-text">{company.name}</h3>
                    <span className="font-mono text-[9px] border border-text/20 px-1.5 py-0.5 rounded text-secondary">
                        {company.symbol}
                    </span>
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-accent font-bold">
                    {company.role}
                  </span>
                </div>
                <div className="text-right">
                   <span className="font-mono text-lg block">{company.price.toFixed(2)}</span>
                   <span className={`font-mono text-xs ${company.change >= 0 ? 'text-text' : 'text-accent'}`}>
                      {company.change >= 0 ? '+' : ''}{company.change} ({company.percentChange}%)
                   </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 relative z-10">
                 <div>
                    <span className="block font-sans text-[9px] uppercase tracking-widest text-secondary mb-1">
                        Tech Moat
                    </span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${company.moatRating === 'Wide' ? 'bg-text' : 'bg-secondary'}`}></div>
                        <span className="font-serif text-lg italic">{company.moatRating}</span>
                    </div>
                 </div>
                 <div>
                    <span className="block font-sans text-[9px] uppercase tracking-widest text-secondary mb-1">
                        Order Backlog
                    </span>
                    <span className="font-mono text-sm border-b border-text/20 pb-0.5">
                        {company.backlog}
                    </span>
                 </div>
                 <div className="col-span-2">
                    <div className="flex justify-between mb-1">
                         <span className="font-sans text-[9px] uppercase tracking-widest text-secondary">
                             Market Dominance
                         </span>
                         <span className="font-mono text-[9px]">{company.dominanceScore}%</span>
                    </div>
                    <div className="w-full h-1 bg-text/10 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: `${company.dominanceScore}%` }}
                           transition={{ duration: 1, ease: "easeOut" }}
                           className="h-full bg-text"
                        />
                    </div>
                 </div>
              </div>

              {/* Footer / Node */}
              <div className="flex justify-between items-center border-t border-text/10 pt-4 relative z-10">
                  <div className="flex flex-col">
                      <span className="font-sans text-[8px] uppercase tracking-widest text-secondary mb-0.5">Focus Node</span>
                      <span className="font-mono text-xs text-text">{company.techNode}</span>
                  </div>
                  
                  {/* Mini Sparkline */}
                  <div className="w-24 h-12">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={company.history}>
                            <defs>
                                <linearGradient id={`grad-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1A1918" stopOpacity={0.2}/>
                                    <stop offset="100%" stopColor="#1A1918" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#1A1918" strokeWidth={1} fill={`url(#grad-${company.id})`} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
