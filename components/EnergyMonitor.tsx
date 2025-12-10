
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PowerHub, GlobalEnergyMetrics } from '../types';
import { getPowerHubs, getEnergyMetrics } from '../services/marketService';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Line, ComposedChart } from 'recharts';

export const EnergyMonitor: React.FC = () => {
  const [hubs, setHubs] = useState<PowerHub[]>([]);
  const [metrics, setMetrics] = useState<GlobalEnergyMetrics | null>(null);
  const [selectedHub, setSelectedHub] = useState<PowerHub | null>(null);

  useEffect(() => {
    const load = async () => {
      const h = await getPowerHubs();
      const m = await getEnergyMetrics();
      setHubs(h);
      setMetrics(m);
      setSelectedHub(h[0]);
    };
    load();
  }, []);

  if (!metrics || !selectedHub) return null;

  const mixData = [
    { name: 'Nuclear', value: selectedHub.energyMix.nuclear, color: '#EAE7E0' },
    { name: 'Gas', value: selectedHub.energyMix.gas, color: '#1A1918' },
    { name: 'Renewable', value: selectedHub.energyMix.renewables, color: '#D94E28' },
    { name: 'Coal', value: selectedHub.energyMix.coal, color: '#6B665F' },
  ].filter(d => d.value > 0);

  // Analyze forecast to find peak renewable contribution
  const peakSolar = Math.max(...selectedHub.forecast.map(f => f.solar));
  const peakWind = Math.max(...selectedHub.forecast.map(f => f.wind));
  const renewableAnalysis = peakSolar > 60 
    ? "High solar availability forecasted to significantly reduce grid strain by mid-day." 
    : peakWind > 60 
    ? "Strong wind conditions stabilizing grid baseload throughout the evening."
    : "Low renewable output may increase reliance on gas/coal peaker plants.";

  return (
    <div className="w-full py-24 border-t border-text/10 bg-[#F4F1EA]">
      <div className="max-w-[90vw] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-accent tracking-widest block mb-6">03 — THERMODYNAMICS</span>
            <h2 className="font-serif text-5xl md:text-6xl leading-none text-text">
              Compute <br />
              <span className="italic text-secondary">Expenditure</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-12 mt-8 md:mt-0 text-right">
             <div>
                <span className="block font-mono text-xs text-secondary tracking-widest mb-1">GLOBAL PUE AVG</span>
                <span className="font-serif text-4xl text-text">{metrics.globalPUE}</span>
             </div>
             <div>
                <span className="block font-mono text-xs text-secondary tracking-widest mb-1">RENEWABLE MIX</span>
                <span className="font-serif text-4xl text-text">{Math.round(metrics.globalRenewableUsage)}%</span>
             </div>
             <div>
                <span className="block font-mono text-xs text-secondary tracking-widest mb-1">AI LOAD (GW)</span>
                <span className="font-serif text-4xl text-accent">{metrics.aiTrainingLoad}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-text/20">
            {/* Left Col: Hub Selector */}
            <div className="md:col-span-5 border-r border-text/20 bg-surface/50 max-h-[700px] overflow-y-auto">
                <div className="p-4 border-b border-text/20 sticky top-0 bg-[#F2EFE8] z-10">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Data Center Hubs</span>
                </div>
                {hubs.map((hub) => (
                    <div 
                        key={hub.id}
                        onClick={() => setSelectedHub(hub)}
                        className={`
                            group p-6 cursor-pointer border-b border-text/10 transition-colors
                            ${selectedHub.id === hub.id ? 'bg-[#1A1918] text-[#F4F1EA]' : 'hover:bg-white'}
                        `}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-sans font-bold text-sm tracking-wide uppercase">{hub.name}</span>
                            <span className={`font-mono text-xs px-2 py-0.5 border rounded-full ${
                                selectedHub.id === hub.id ? 'border-white/30' : 'border-black/20'
                            }`}>
                                ${hub.spotPrice} / MWh
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                             <div className="flex flex-col">
                                <span className={`font-serif text-xs italic ${
                                    selectedHub.id === hub.id ? 'text-white/60' : 'text-secondary'
                                }`}>
                                    {hub.region}
                                </span>
                                <span className={`font-mono text-[9px] mt-1 uppercase ${
                                    selectedHub.id === hub.id ? 'text-white/40' : 'text-secondary/60'
                                }`}>
                                    RE: {hub.renewables.currentSolarLoad}% S | {hub.renewables.currentWindLoad}% W
                                </span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <span className="font-mono text-[10px] uppercase">Strain:</span>
                                 <div className={`w-2 h-2 rounded-full ${
                                     hub.gridStrain === 'Critical' ? 'bg-accent animate-pulse' : 
                                     hub.gridStrain === 'High' ? 'bg-orange-400' : 'bg-green-500'
                                 }`}></div>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Col: Details */}
            <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-center">
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
                                    className="h-full bg-[#D94E28]"
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
                            <span className="flex items-center gap-1 font-mono text-[9px] text-secondary"><div className="w-2 h-2 bg-[#1A1918]"></div>NET STRAIN</span>
                            <span className="flex items-center gap-1 font-mono text-[9px] text-text/50"><div className="w-2 h-0.5 bg-text/50 border-t border-dashed border-text/50"></div>CARBON</span>
                            <span className="flex items-center gap-1 font-mono text-[9px] text-[#D94E28]"><div className="w-2 h-2 bg-[#D94E28]"></div>SOLAR</span>
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
