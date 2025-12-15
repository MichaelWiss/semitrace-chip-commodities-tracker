import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ToolingEntity } from '../types';
import { getToolingEntities } from '../services/marketService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ToolingTrackerSkeleton, ErrorState } from './SkeletonLoader';

// Memoized tooling card to prevent unnecessary re-renders
interface ToolingCardProps {
  company: ToolingEntity;
  idx: number;
}

const ToolingCard = React.memo<ToolingCardProps>(({ company, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.1, duration: 0.6 }}
    viewport={{ once: true }}
    className="bg-surface border-[3px] border-text p-8 group hover:bg-[#EAEAEA] transition-colors relative overflow-hidden"
  >
    {/* Header */}
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-sans font-bold text-3xl text-text tracking-tight">{company.name}</h3>
          <span className="font-mono text-xs font-bold border-2 border-text px-1.5 py-0.5 text-text">
            {company.symbol}
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
          {company.role}
        </span>
      </div>
      <div className="text-right">
        <span className="font-mono text-xl font-bold block tracking-tight">{company.price.toFixed(2)}</span>
        <span className={`font-mono text-xs font-bold ${company.change >= 0 ? 'text-text' : 'text-accent'}`}>
          {company.change >= 0 ? '+' : ''}{company.change} ({company.percentChange}%)
        </span>
      </div>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8 relative z-10">
      <div>
        <span className="block font-mono text-[9px] uppercase tracking-widest text-secondary mb-1 font-bold">
          Tech Moat
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 border border-black ${company.moatRating === 'Wide' ? 'bg-text' : 'bg-transparent'}`}></div>
          <span className="font-sans font-bold text-lg">{company.moatRating}</span>
        </div>
      </div>
      <div>
        <span className="block font-mono text-[9px] uppercase tracking-widest text-secondary mb-1 font-bold">
          Order Backlog
        </span>
        <span className="font-mono text-sm font-bold border-b-2 border-text pb-0.5 inline-block">
          {company.backlog}
        </span>
      </div>
      <div className="col-span-2">
        <div className="flex justify-between mb-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-secondary font-bold">
            Market Dominance
          </span>
          <span className="font-mono text-xs font-bold">{company.dominanceScore}%</span>
        </div>
        <div className="w-full h-3 border-2 border-text p-0.5">
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
    <div className="flex justify-between items-center border-t-[3px] border-text pt-6 relative z-10">
      <div className="flex flex-col">
        <span className="font-mono text-[9px] uppercase tracking-widest text-secondary mb-1 font-bold">Focus Node</span>
        <span className="font-sans text-sm font-bold text-text">{company.techNode}</span>
      </div>
      
      {/* Mini Sparkline */}
      <div className="w-24 h-12 grayscale opacity-50 contrast-125">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={company.history}>
            <defs>
              <linearGradient id={`grad-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A1918" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#1A1918" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="#1A1918" strokeWidth={2} fill={`url(#grad-${company.id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
));

export const ToolingTracker: React.FC = () => {
  const [entities, setEntities] = useState<ToolingEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToolingData = async () => {
      try {
        setLoading(true);
        const data = await getToolingEntities();
        setEntities(data);
      } catch (err) {
        console.error("Failed to load tooling data:", err);
        setError("Failed to load tooling data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadToolingData();
  }, []);

  if (loading) {
    return <ToolingTrackerSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (entities.length === 0) return null;

  return (
    <div className="w-full py-24 bg-background border-t-[3px] border-text">
      <div className="w-full max-w-[94vw] mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-end mb-20 px-0 md:px-0">
          <div className="col-span-4 md:col-span-8 max-w-xl">
            <span className="font-mono text-sm font-bold text-accent tracking-widest block mb-6">04 — INDUSTRIAL BASE</span>
            <h2 className="font-sans font-extrabold text-5xl md:text-7xl leading-[0.9] text-text tracking-tighter">
              Lithography & <br />
              <span className="text-secondary">Logic</span>
            </h2>
            <p className="font-mono text-sm font-medium text-secondary mt-8 leading-relaxed">
               Monitoring the critical apparatus of the silicon supply chain. <br/>
               Tracking dominance, technological moats, and order backlogs.
            </p>
          </div>
          <div className="col-span-4 md:col-span-4 mt-8 md:mt-0 items-end justify-end text-right hidden md:flex">
             <div>
               <div className="w-32 h-[3px] bg-text mb-4 ml-auto"></div>
               <span className="font-mono text-xs font-bold">EQUIPMENT & FOUNDRY<br/><span className="text-accent text-lg">SECTOR MONITOR</span></span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 gap-y-8">
          {entities.map((company, idx) => (
            <div key={company.id} className="col-span-4 md:col-span-6 lg:col-span-4">
              <ToolingCard company={company} idx={idx} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
