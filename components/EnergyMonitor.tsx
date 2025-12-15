import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PowerHub, GlobalEnergyMetrics } from '../types';
import { getPowerHubs, getEnergyMetrics } from '../services/marketService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { PowerHubSkeleton, ErrorState } from './SkeletonLoader';

// Memoized hub selector item to prevent unnecessary re-renders
interface HubSelectorItemProps {
  hub: PowerHub;
  isSelected: boolean;
  onSelect: (hub: PowerHub) => void;
}

const HubSelectorItem = React.memo<HubSelectorItemProps>(({ hub, isSelected, onSelect }) => (
  <div 
    onClick={() => onSelect(hub)}
    className={`
      group p-6 cursor-pointer border-b-2 border-text transition-colors
      ${isSelected ? 'bg-text text-background' : 'hover:bg-surface'}
    `}
  >
    <div className="flex justify-between items-center mb-2">
      <span className="font-sans font-bold text-sm tracking-wide uppercase">{hub.name}</span>
      <span className={`font-mono text-xs px-2 py-0.5 border-2 rounded-full font-bold ${
        isSelected ? 'border-white/30' : 'border-text'
      }`}>
        ${hub.spotPrice} / MWh
      </span>
    </div>
    <div className="flex justify-between items-end">
      <div className="flex flex-col">
        <span className={`font-mono text-xs font-bold ${
          isSelected ? 'text-white/60' : 'text-secondary'
        }`}>
          {hub.region}
        </span>
        <span className={`font-mono text-[9px] mt-1 uppercase font-bold ${
          isSelected ? 'text-white/40' : 'text-secondary/60'
        }`}>
          RE: {hub.renewables.currentSolarLoad}% S | {hub.renewables.currentWindLoad}% W
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase font-bold">Strain:</span>
        <div className={`w-3 h-3 border border-black rounded-full ${
          hub.gridStrain === 'Critical' ? 'bg-accent animate-pulse' : 
          hub.gridStrain === 'High' ? 'bg-orange-400' : 'bg-green-500'
        }`}></div>
      </div>
    </div>
  </div>
));

export const EnergyMonitor: React.FC = () => {
  const [hubs, setHubs] = useState<PowerHub[]>([]);
  const [metrics, setMetrics] = useState<GlobalEnergyMetrics | null>(null);
  const [selectedHub, setSelectedHub] = useState<PowerHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleHubSelect = useCallback((hub: PowerHub) => {
    setSelectedHub(hub);
  }, []);

  // Memoize mixData - must be before any conditional returns
  const mixData = useMemo(() => {
    if (!selectedHub) return [];
    return [
      { name: 'Nuclear', value: selectedHub.energyMix.nuclear, color: '#EAE7E0' },
      { name: 'Gas', value: selectedHub.energyMix.gas, color: '#1A1918' },
      { name: 'Renewable', value: selectedHub.energyMix.renewables, color: '#D94E28' },
      { name: 'Coal', value: selectedHub.energyMix.coal, color: '#6B665F' },
    ].filter(d => d.value > 0);
  }, [selectedHub]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const h = await getPowerHubs();
        const m = await getEnergyMetrics();
        setHubs(h);
        setMetrics(m);
        setSelectedHub(h[0]);
      } catch (err) {
        console.error("Failed to load energy data:", err);
        setError("Failed to load energy data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <PowerHubSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!metrics || !selectedHub) return null;

  // Analyze forecast to find peak renewable contribution
  const peakSolar = Math.max(...selectedHub.forecast.map(f => f.solar));
  const peakWind = Math.max(...selectedHub.forecast.map(f => f.wind));
  const renewableAnalysis = peakSolar > 60 
    ? "High solar availability forecasted to significantly reduce grid strain by mid-day." 
    : peakWind > 60 
    ? "Strong wind conditions stabilizing grid baseload throughout the evening."
    : "Low renewable output may increase reliance on gas/coal peaker plants.";

  return (
    <div className="w-full py-24 border-t-[3px] border-text bg-background">
      <div className="w-[95%] mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 items-end mb-16">
          <div className="col-span-4 md:col-span-5 max-w-xl">
            <span className="font-mono text-sm font-bold text-accent tracking-widest block mb-6">03 — THERMODYNAMICS</span>
            <h2 className="font-sans font-extrabold text-5xl md:text-7xl leading-[0.9] text-text tracking-tighter">
              Compute <br />
              <span className="text-secondary">Expenditure</span>
            </h2>
          </div>
          <div className="col-span-4 md:col-span-7 flex flex-wrap gap-8 md:gap-12 mt-8 md:mt-0 justify-end text-right">
             <div>
                <span className="block font-mono text-xs font-bold text-secondary tracking-widest mb-1">GLOBAL PUE AVG</span>
                <span className="font-mono text-4xl font-bold text-text tracking-tighter">{metrics.globalPUE}</span>
             </div>
             <div>
                <span className="block font-mono text-xs font-bold text-secondary tracking-widest mb-1">RENEWABLE MIX</span>
                <span className="font-mono text-4xl font-bold text-text tracking-tighter">{Math.round(metrics.globalRenewableUsage)}%</span>
             </div>
             <div>
                <span className="block font-mono text-xs font-bold text-secondary tracking-widest mb-1">AI LOAD (GW)</span>
                <span className="font-mono text-4xl font-bold text-text tracking-tighter">{metrics.aiTrainingLoad}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 gap-x-4 md:gap-x-6 border-t-[3px] border-b-[3px] border-text">
            {/* Left Col: Hub Selector - Spans 4 cols */}
            <div className="col-span-4 md:col-span-4 bg-surface/30 max-h-[700px] overflow-y-auto">
                <div className="p-4 border-b-[3px] border-text sticky top-0 bg-[#E1DED8] z-10">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-secondary">Data Center Hubs</span>
                </div>
                {hubs.map((hub) => (
                    <HubSelectorItem
                        key={hub.id}
                        hub={hub}
                        isSelected={selectedHub.id === hub.id}
                        onSelect={handleHubSelect}
                    />
                ))}
            </div>

            {/* Right Col: Details - Spans 8 cols */}
            <div className="col-span-4 md:col-span-8 p-8 md:p-12 flex flex-col justify-center">
                 <div className="flex justify-between items-start mb-8">
                     <div className="font-mono text-[10px] text-accent border border-accent px-2 py-1 rounded inline-block">
                        LIVE METRICS
                     </div>
                     <div className="text-right">
                         <span className="font-mono text-[10px] text-secondary uppercase block">Forecasting Engine</span>
                         <span className="font-sans text-xs font-bold">OPEN-METEO V1</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-12 mb-10">
                     <div>
                         <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block mb-2">Carbon Intensity</span>
                         <div className="flex items-baseline gap-2">
                            <span className="font-serif text-5xl text-text">{selectedHub.carbonIntensity}</span>
                            <span className="font-mono text-xs text-secondary">gCO₂/kWh</span>
                         </div>
                     </div>
                     <div>
                         <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block mb-2">Primary Power</span>
                         <div className="flex items-baseline gap-2">
                            <span className="font-serif text-5xl text-text">
                                {Object.entries(selectedHub.energyMix).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
                            </span>
                         </div>
                     </div>
                 </div>

                 {/* Real-Time Renewables */}
                 <div className="mb-10 p-6 bg-surface/50 border border-text/10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block">Real-Time Renewable Generation</span>
                        <span className="font-serif text-xs italic text-text max-w-[50%] text-right">{renewableAnalysis}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                             <div className="flex justify-between mb-2">
                                 <span className="font-mono text-xs">Solar Potential</span>
                                 <span className="font-mono text-xs font-bold">{selectedHub.renewables.currentSolarLoad}%</span>
                             </div>
                             <div className="w-full h-1 bg-text/10">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedHub.renewables.currentSolarLoad}%` }}
                                    className="h-full bg-accent"
                                 />
                             </div>
                        </div>
                        <div>
                             <div className="flex justify-between mb-2">
                                 <span className="font-mono text-xs">Wind Potential</span>
                                 <span className="font-mono text-xs font-bold">{selectedHub.renewables.currentWindLoad}%</span>
                             </div>
                             <div className="w-full h-1 bg-text/10">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedHub.renewables.currentWindLoad}%` }}
                                    className="h-full bg-secondary"
                                 />
                             </div>
                        </div>
                    </div>
                 </div>

                 {/* Energy Mix Bar */}
                 <div className="mb-10">
                     <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block mb-4">Energy Source Mix</span>
                     <div className="w-full h-[60px] flex rounded-sm overflow-hidden border border-text/10">
                         {mixData.map((item) => (
                             <motion.div 
                                key={item.name}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="h-full relative group"
                                style={{ backgroundColor: item.color }}
                             >
                                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-0 whitespace-nowrap bg-text text-background text-[10px] font-mono px-2 py-1 z-10">
                                     {item.name}: {item.value}%
                                 </div>
                             </motion.div>
                         ))}
                     </div>
                     <div className="flex gap-6 mt-4">
                         {mixData.map(item => (
                             <div key={item.name} className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                 <span className="font-mono text-xs text-secondary">{item.name}</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Forecast Chart */}
                 <div className="h-[250px] w-full mt-4">
                     <div className="flex justify-between items-end mb-4">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-secondary block">24H Forecast: Strain, Carbon & Renewables</span>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1 font-mono text-[9px] text-secondary"><div className="w-2 h-2 bg-text"></div>NET STRAIN</span>
                            <span className="flex items-center gap-1 font-mono text-[9px] text-text/50"><div className="w-2 h-0.5 bg-text/50 border-t border-dashed border-text/50"></div>CARBON</span>
                            <span className="flex items-center gap-1 font-mono text-[9px] text-accent"><div className="w-2 h-2 bg-accent"></div>SOLAR</span>
                            <span className="flex items-center gap-1 font-mono text-[9px] text-secondary/60"><div className="w-2 h-0.5 bg-secondary/60"></div>WIND</span>
                        </div>
                     </div>
                     <ResponsiveContainer width="100%" height="100%">
                         <ComposedChart data={selectedHub.forecast}>
                             <defs>
                                <linearGradient id="colorStrain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1A1918" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#1A1918" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#F4F1EA', borderColor: '#1A1918', fontSize: '12px' }}
                                itemStyle={{ color: '#1A1918' }}
                                formatter={(value: number, name: string) => [
                                    value, 
                                    name === 'carbon' ? 'Carbon (gCO₂)' : 
                                    name === 'strain' ? 'Grid Strain' : 
                                    name.charAt(0).toUpperCase() + name.slice(1)
                                ]}
                             />
                             <XAxis dataKey="hour" hide />
                             <YAxis hide domain={[0, 100]} />
                             
                             {/* Solar Line */}
                             <Line
                                type="monotone"
                                dataKey="solar"
                                stroke="#D94E28"
                                strokeWidth={2}
                                dot={false}
                             />
                             {/* Wind Line */}
                             <Line
                                type="monotone"
                                dataKey="wind"
                                stroke="#6B665F"
                                strokeWidth={1}
                                strokeDasharray="3 3"
                                dot={false}
                             />
                             {/* Carbon Line - Visualized as a secondary faint dashed line to show correlation */}
                             <Line
                                type="monotone"
                                dataKey="carbon"
                                stroke="#1A1918"
                                strokeWidth={1}
                                strokeOpacity={0.3}
                                strokeDasharray="5 5"
                                dot={false}
                             />

                             {/* Net Strain Area */}
                             <Area 
                                type="monotone" 
                                dataKey="strain" 
                                stroke="#1A1918" 
                                strokeWidth={1}
                                fillOpacity={1} 
                                fill="url(#colorStrain)" 
                             />
                         </ComposedChart>
                     </ResponsiveContainer>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
