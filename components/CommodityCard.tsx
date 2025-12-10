
import React, { useState } from 'react';
import { Commodity } from '../types';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, ComposedChart, Line, ReferenceArea, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  data: Commodity;
  index: number;
}

export const CommodityCard: React.FC<Props> = ({ data, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPositive = data.changePercentage >= 0;

  // Prepare data for the forecast chart including the range array
  const forecastData = data.forecast?.map(f => ({
      ...f,
      range: [f.lowerBound, f.upperBound]
  })) || [];

  const lastForecast = data.forecast?.[data.forecast.length - 1];
  const outlookStatus = lastForecast?.status || 'Unknown';
  const outlookColor = 
    outlookStatus === 'Shortage' ? 'text-[#D94E28]' : 
    outlookStatus === 'Tight' ? 'text-[#D94E28] opacity-80' : 
    'text-[#6B665F]';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-b border-subtle py-8 cursor-pointer transition-all duration-500 hover:bg-surface"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-0 relative z-10">
        
        {/* Index & Name */}
        <div className="flex items-center gap-8 w-full md:w-1/3">
          <span className="font-mono text-xs text-secondary border border-subtle rounded-full w-8 h-8 flex items-center justify-center">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
             <h3 className="font-serif text-3xl text-text group-hover:text-accent transition-colors duration-300">
                {data.name}
             </h3>
             <span className="font-sans text-[10px] tracking-widest uppercase text-secondary">
               {data.category}
             </span>
          </div>
        </div>

        {/* Price Data & Outlook */}
        <div className="flex items-center gap-8 md:gap-16 w-full md:w-1/3 justify-start md:justify-center">
          <div>
             <span className="font-mono text-xl text-text font-medium">{data.price.toLocaleString()}</span>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">{data.currency}</span>
          </div>
          <div className="text-right">
             <span className={`font-mono text-lg ${isPositive ? 'text-text' : 'text-accent'}`}>
               {isPositive ? '↑' : '↓'} {Math.abs(data.changePercentage)}%
             </span>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">24h Change</span>
          </div>
          {/* Outlook Indicator */}
          <div className="hidden lg:block text-right">
             <div className="flex items-center justify-end gap-2">
                {outlookStatus === 'Shortage' && <span className="w-2 h-2 rounded-full bg-[#D94E28] animate-pulse shadow-[0_0_8px_#D94E28]" />}
                <span className={`font-mono text-lg ${outlookColor}`}>{outlookStatus.toUpperCase()}</span>
             </div>
             <span className="block font-sans text-[10px] text-secondary uppercase tracking-wider">6M Supply Forecast</span>
          </div>
        </div>

        {/* Action / Symbol */}
        <div className="w-full md:w-1/3 flex justify-end items-center pr-4 md:pr-12">
            <motion.div 
               animate={{ rotate: isHovered ? 45 : 0 }}
               className="w-8 h-8 flex items-center justify-center rounded-full border border-text text-text"
            >
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
               </svg>
            </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full bg-surface"
          >
             <div className="flex flex-col md:flex-row gap-12 py-8 px-4 md:px-12 border-t border-subtle mt-8">
                {/* Left Col: Info */}
                <div className="w-full md:w-1/3">
                   <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-accent">Material Profile</h4>
                   <p className="font-serif text-lg text-secondary leading-relaxed mb-6">
                     {data.description}
                   </p>
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase">Volatility</span>
                        <span className="font-mono text-sm">{data.volatility}</span>
                      </div>
                      <div>
                        <span className="block font-sans text-[10px] text-secondary uppercase">Primary Source</span>
                        <span className="font-mono text-sm">{data.topProducer}</span>
                      </div>
                   </div>

                   {/* Semiconductor Application Details */}
                   <div className="mb-8">
                     <h5 className="font-sans text-[10px] uppercase tracking-widest text-secondary mb-3">Semiconductor Application</h5>
                     <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div>
                            <span className="font-serif text-xs italic text-secondary block mb-1">Key Processes</span>
                            <ul className="list-disc list-inside">
                                {data.usage.processes.map(p => (
                                    <li key={p} className="font-mono text-[10px] text-text mb-0.5">{p}</li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <span className="font-serif text-xs italic text-secondary block mb-1">Target Layers</span>
                            <ul className="list-disc list-inside">
                                {data.usage.layers.map(l => (
                                    <li key={l} className="font-mono text-[10px] text-text mb-0.5">{l}</li>
                                ))}
                            </ul>
                        </div>
                     </div>
                   </div>
                   
                   {/* Detailed Availability Forecast Chart */}
                   <div className="mt-8">
                     <div className="flex justify-between items-end mb-4">
                         <div>
                            <span className="font-sans font-bold text-[10px] uppercase tracking-widest text-text block">Supply Forecast (6MO)</span>
                            <span className="font-serif text-[10px] text-secondary italic">Confidence Interval ±{100 - data.forecastConfidence}%</span>
                         </div>
                         <div className="text-right">
                             <span className="block font-mono text-[10px] text-secondary px-2 py-0.5 border border-subtle rounded mb-1">
                                 CONF: {data.forecastConfidence}%
                             </span>
                             <span className={`font-mono text-[10px] font-bold ${outlookColor}`}>
                                 TARGET: {outlookStatus}
                             </span>
                         </div>
                     </div>
                     <div className="h-[120px] w-full bg-[#F4F1EA] border border-subtle p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData}>
                                <defs>
                                    <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                        <line x1="0" y1="0" x2="0" y2="4" style={{stroke:'#D94E28', strokeWidth:1, opacity:0.1}} />
                                    </pattern>
                                </defs>
                                {/* Risk Zones */}
                                <ReferenceArea y1={0} y2={30} fill="url(#diagonalHatch)" />
                                <ReferenceArea y1={30} y2={60} fill="#D94E28" fillOpacity={0.03} />
                                <ReferenceArea y1={60} y2={100} fill="#1A1918" fillOpacity={0.02} />
                                
                                <XAxis dataKey="month" hide />
                                <YAxis domain={[0, 100]} hide />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#F4F1EA', 
                                        borderColor: '#1A1918',
                                        fontSize: '10px',
                                        padding: '4px 8px'
                                    }}
                                    itemStyle={{ color: '#1A1918' }}
                                    formatter={(val: any, name: string, props: any) => {
                                        if (name === 'range') return [`${props.payload.lowerBound}-${props.payload.upperBound}`, 'Confidence'];
                                        return [val, name === 'score' ? 'Availability Score' : name];
                                    }}
                                    labelStyle={{ display: 'none' }}
                                />
                                
                                {/* Confidence Interval (Range Area) */}
                                <Area 
                                    type="monotone" 
                                    dataKey="range" 
                                    stroke="none" 
                                    fill="#1A1918" 
                                    fillOpacity={0.1} 
                                />
                                
                                {/* Score Line */}
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#1A1918" 
                                    strokeWidth={1.5} 
                                    dot={{ r: 2, fill: '#1A1918' }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="flex justify-between mt-1">
                         <span className="font-mono text-[8px] text-accent">CRITICAL (0-30)</span>
                         <span className="font-mono text-[8px] text-secondary">STABLE (60-100)</span>
                     </div>
                   </div>
                </div>
                
                {/* Right Col: Price Chart */}
                <div className="w-full md:w-2/3 h-[300px]">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-widest mb-4 text-text">Price Action (30D)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.history}>
                      <defs>
                        <linearGradient id={`gradient-${data.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1A1918" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1A1918" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" hide />
                      <Tooltip 
                        contentStyle={{
                            backgroundColor: '#F4F1EA',
                            borderColor: '#1A1918',
                            borderWidth: '1px',
                            borderRadius: '0px',
                            padding: '8px 12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}
                        itemStyle={{
                            color: '#1A1918',
                            fontFamily: 'Manrope, sans-serif',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                        labelStyle={{
                            color: '#6B665F',
                            fontFamily: 'Manrope, sans-serif',
                            fontSize: '10px',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                        formatter={(value: number) => [
                            `${data.currency.includes('USD') ? '$' : ''}${value.toLocaleString()}`, 
                            'Price'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1A1918" 
                        strokeWidth={1.5}
                        fill={`url(#gradient-${data.id})`} 
                        animationDuration={1000}
                        activeDot={{ r: 4, fill: '#D94E28', stroke: '#F4F1EA', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
