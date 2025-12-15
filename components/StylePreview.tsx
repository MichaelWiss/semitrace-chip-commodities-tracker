import React from 'react';
import { Commodity, CommodityCategory } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts';

// Mock Data
const mockCommodity: Commodity = {
  id: 'preview-1',
  symbol: 'Si',
  name: 'Silicon Metal',
  category: CommodityCategory.RawSilicon,
  price: 2450.50,
  currency: 'USD/MT',
  change24h: 12.50,
  changePercentage: 0.51,
  volatility: 'Medium',
  riskLevel: 'Stable',
  description: 'High-purity silicon metal is the foundational material.',
  topProducer: 'China',
  history: Array.from({ length: 30 }, (_, i) => ({ date: `2024-01-${i + 1}`, value: 2400 + Math.random() * 100 })),
  forecast: [],
  forecastConfidence: 85,
  usage: { processes: [], layers: [] },
  supplyChainRisk: { primaryProducerShare: 65, top3ProducerShare: 80, exportControlled: false, substitutability: 'None', recyclingRate: 15, stockpileDays: 45 }
};

// Divider Component (The "Triple Line" look from Screenshot 1)
// Divider Component (Matched to ODIN'S CROW Header)
const MultiLineDivider = ({ label = "SEMITRACE MARKET REPORT" }: { label?: string }) => (
  <div className="w-full my-12">
     {/* Text Row: Bordered Top and Bottom */}
     <div className="flex justify-between items-center border-t border-b border-[#1A1918] py-1 mb-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#1A1918]">{label}</span>
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#1A1918]">© 2025</span>
     </div>
     
     {/* The Stack: 4 Uniform Heavy Lines */}
     <div className="flex flex-col gap-1">
        <div className="h-1.5 w-full bg-[#1A1918]"></div>
        <div className="h-1.5 w-full bg-[#1A1918]"></div>
        <div className="h-1.5 w-full bg-[#1A1918]"></div>
        <div className="h-1.5 w-full bg-[#1A1918]"></div>
     </div>
  </div>
);

// New Listing Row (The "(A) Title ... Description" look from Screenshot 3)
const ListingRow = ({ index, label, value, desc }: { index: string, label: string, value: string, desc: string }) => (
  <div className="grid grid-cols-12 gap-4 py-6 border-b border-black items-start hover:bg-black/5 transition-colors">
      <div className="col-span-1 border-b border-transparent">
          <span className="font-bold text-xs">({index})</span>
      </div>
      <div className="col-span-3">
          <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      <div className="col-span-4">
           {/* Value Column (added for commodity context) */}
           <span className="font-mono text-sm">{value}</span>
      </div>
      <div className="col-span-4 pl-4 border-l border-black/20">
          <p className="text-sm font-medium leading-normal opacity-80">{desc}</p>
      </div>
  </div>
);

// Big Hero Text Section (From Screenshot 2 "We buy...")
const BigStatement = () => (
    <div className="py-24 text-center">
        <h1 className="text-6xl md:text-8xl font-sans font-bold text-[#1A1918] tracking-tighter leading-[0.9] max-w-5xl mx-auto">
            We track, <span className="underline decoration-4 underline-offset-8">monitor</span>, and forecast critical materials.
        </h1>
    </div>
);

// Dark Bar Header (From Screenshot 1 "We generally stay away...")
const SectionHeaderBar = ({ title }: { title: string }) => (
    <div className="bg-[#1A1918] text-[#F4F1EA] py-4 px-6 flex justify-between items-center mb-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" />
        </svg>
    </div>
);

// Color Block Grid (From Screenshot 1 layout)
const StatsGrid = () => (
    <div className="flex flex-col md:flex-row min-h-[400px]">
        {/* Left: Beige Block */}
        <div className="flex-1 bg-[#EAE7E0] p-8 border-r border-[#1A1918] flex flex-col justify-between">
             <h3 className="text-4xl font-bold tracking-tighter leading-none mb-8">
                 Resource or<br/>commodity based
             </h3>
             <div className="mt-auto">
                 <div className="text-6xl font-bold tracking-tighter mb-2">14</div>
                 <p className="text-sm font-bold uppercase tracking-widest opacity-60">Critical Minerals Tracked</p>
             </div>
        </div>
        
        {/* Right: Sage Green Block (From Screenshot 1) */}
        <div className="flex-1 bg-[#7C8879] p-8 text-[#1A1918] flex flex-col justify-between">
             <h3 className="text-4xl font-bold tracking-tighter leading-none mb-8 opacity-90">
                 Turnaround<br/>opportunities
             </h3>
             <div className="mt-auto">
                 <div className="text-6xl font-bold tracking-tighter mb-2">98%</div>
                 <p className="text-sm font-bold uppercase tracking-widest opacity-60">Data Accuracy</p>
             </div>
        </div>
    </div>
);

export const StylePreview = () => {
  return (
    <div className="bg-[#E1DED8] min-h-screen text-[#1A1918] font-sans selection:bg-[#D94E28] selection:text-white pb-32">
        
        {/* TOP NAVIGATION (Matched to Odin's Crow: Minimal & Small) */}
        <div className="px-6 md:px-12 pt-6 pb-24 flex justify-between items-start">
            <h1 className="text-lg font-bold tracking-tight text-[#1A1918]">
                Semi_trace
            </h1>
            
            <div className="flex gap-8 text-sm font-medium text-[#1A1918]">
                <span>About</span>
                <span>Market Partners</span>
                <span className="opacity-50">Get in touch</span>
            </div>
        </div>

        {/* HERO STATEMENT (SemiTrace Content) */}
        <div className="px-6 md:px-12 pt-12 md:pt-24 pb-12">
            <h1 className="text-[15vw] leading-[0.8] font-bold tracking-tighter text-[#1A1918]">
                Raw Material
            </h1>
        </div>

        {/* DIVIDER & LINES SECTION (Aesthetic Inspiration) */}
        <div className="px-6 md:px-12">
             <div className="w-full mb-0">
                 {/* Text Row: Technical Header */}
                 <div className="border-t border-b border-[#1A1918] py-1 mb-1.5 flex justify-between items-end">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#1A1918]">
                        SEMITRACE ANALYTICS
                    </span>
                    <div className="flex gap-4">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#1A1918] hidden md:inline-block">
                            REAL-TIME SUPPLY CHAIN INTELLIGENCE
                        </span>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#1A1918]">
                            © 2025
                        </span>
                    </div>
                 </div>
                 
                 {/* The 'Vent' Lines Style */}
                 <div className="flex flex-col gap-[3px] pb-5">
                    <div className="h-[5px] w-full bg-[#1A1918]"></div>
                    <div className="h-[5px] w-full bg-[#1A1918]"></div>
                    <div className="h-[5px] w-full bg-[#1A1918]"></div>
                    <div className="h-[5px] w-full bg-[#1A1918]"></div>
                 </div>
             </div>
        </div>

        {/* BLACK BAR & COLOR BLOCKS */}
        <div className="max-w-[95vw] mx-auto mb-24 border-x-2 border-b-2 border-[#1A1918]">
            {/* The Black Header Bar */}
            <div className="bg-[#1A1918] text-[#E1DED8] py-6 px-6 flex justify-between items-center">
                <h2 className="text-xl md:text-3xl font-bold tracking-tight">Critical Supply Chain Monitor</h2>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5V19M12 19L19 12M12 19L5 12" />
                </svg>
            </div>
            <StatsGrid />
        </div>

        {/* INDEX LIST (Style from Screenshot 3) */}
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
             <div className="flex items-end justify-between mb-12 border-b-2 border-[#1A1918] pb-4">
                 <h2 className="text-5xl md:text-6xl font-bold tracking-tighter">
                     Market Index
                 </h2>
                 <span className="text-6xl font-bold tracking-tighter opacity-30">1.6</span>
             </div>

             <div className="border-t border-black">
                 <ListingRow 
                    index="A" 
                    label="Silicon Metal (Si)" 
                    value="$2,450 / MT" 
                    desc="High purity silicon metal prices have stabilized following a surplus in production capacity from Asian markets." 
                 />
                 <ListingRow 
                    index="B" 
                    label="Gallium (Ga)" 
                    value="$420 / KG" 
                    desc="Export restrictions continue to apply upward pressure on global spot prices for raw Gallium." 
                 />
                 <ListingRow 
                    index="C" 
                    label="Palladium (Pd)" 
                    value="$1,105 / OZ" 
                    desc="Used heavily in catalytic converters and multi-layer ceramic capacitors (MLCCs)." 
                 />
                 <ListingRow 
                    index="D" 
                    label="Rare Earths" 
                    value="INDEX: 72.4" 
                    desc="Composite index of Neodymium, Praseodymium, and Dysprosium oxide prices." 
                 />
             </div>
        </div>

    </div>
  );
};
